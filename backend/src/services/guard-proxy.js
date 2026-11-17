// "Portero" de red del scanner: el navegador de Playwright sale a Internet SOLO a través
// de este proxy local. Cada conexión (la página, sus imágenes, scripts y también las
// redirecciones) pasa por aquí, y el proxy se conecta únicamente a IPs públicas.
import http from 'node:http';
import net from 'node:net';
import { resolvePublicHost } from './url-guard.js';

/** Separa "ejemplo.com:443" o "[::1]:443" en nombre y puerto. */
function splitHostPort(value, defaultPort) {
  const match = /^\[?([^\]]+?)\]?(?::(\d+))?$/.exec(value);
  return { hostname: match?.[1] ?? value, port: Number(match?.[2] ?? defaultPort) };
}

/**
 * Arranca el proxy en un puerto libre de 127.0.0.1 y devuelve el servidor.
 * `resolve` se puede sustituir en los tests.
 */
export function startGuardProxy({ resolve = resolvePublicHost } = {}) {
  const server = http.createServer(async (req, res) => {
    // Peticiones http://: el navegador envía la URL completa.
    let target;
    let address;
    try {
      target = new URL(req.url);
      address = await resolve(target.hostname);
    } catch {
      res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Bloqueado por A11yPilot: dirección privada, local o no encontrada.');
      return;
    }
    const headers = { ...req.headers, host: target.host };
    delete headers['proxy-connection'];
    const upstream = http.request({
      host: address,
      port: Number(target.port || 80),
      method: req.method,
      path: target.pathname + target.search,
      headers,
      setHost: false,
    });
    upstream.on('response', (response) => {
      res.writeHead(response.statusCode, response.headers);
      response.pipe(res);
    });
    upstream.on('error', () => {
      if (!res.headersSent) res.writeHead(502);
      res.end();
    });
    req.pipe(upstream);
  });

  // Conexiones https://: el navegador pide "CONNECT ejemplo.com:443" y luego cifra todo.
  server.on('connect', async (req, clientSocket, head) => {
    clientSocket.on('error', () => {});
    let address;
    const { hostname, port } = splitHostPort(req.url, 443);
    try {
      address = await resolve(hostname);
    } catch {
      clientSocket.end('HTTP/1.1 403 Forbidden\r\n\r\n');
      return;
    }
    const upstream = net.connect(port, address, () => {
      clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
      upstream.write(head);
      upstream.pipe(clientSocket);
      clientSocket.pipe(upstream);
    });
    upstream.on('error', () => clientSocket.destroy());
    clientSocket.on('close', () => upstream.destroy());
  });

  return new Promise((resolveServer) => server.listen(0, '127.0.0.1', () => resolveServer(server)));
}
