// Protección SSRF: el scanner solo puede visitar direcciones públicas de Internet.
// Sin esto, alguien podría registrar "http://localhost" o "http://192.168.1.1" y usar
// nuestro servidor para entrar a redes internas o a servicios privados.
import { lookup as dnsLookup } from 'node:dns/promises';
import { BlockList, isIP } from 'node:net';

// Rangos de IP privados, locales o reservados que nunca se deben visitar.
const blocked = new BlockList();
for (const [network, prefix] of [
  ['0.0.0.0', 8], // "esta red"
  ['10.0.0.0', 8], // red privada
  ['100.64.0.0', 10], // red compartida de operadores
  ['127.0.0.0', 8], // el propio equipo (localhost)
  ['169.254.0.0', 16], // enlace local y metadatos de la nube (169.254.169.254)
  ['172.16.0.0', 12], // red privada
  ['192.0.0.0', 24], // reservado
  ['192.168.0.0', 16], // red privada (routers de casa)
  ['198.18.0.0', 15], // pruebas de red
  ['224.0.0.0', 4], // multidifusión
  ['240.0.0.0', 4], // reservado
]) {
  blocked.addSubnet(network, prefix, 'ipv4');
}
for (const [network, prefix] of [
  ['::', 128], // dirección vacía
  ['::1', 128], // localhost en IPv6
  ['fc00::', 7], // red privada IPv6
  ['fe80::', 10], // enlace local IPv6
  ['ff00::', 8], // multidifusión IPv6
]) {
  blocked.addSubnet(network, prefix, 'ipv6');
}

/** Error con un mensaje pensado para mostrarlo al usuario. */
export class UrlNotAllowedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UrlNotAllowedError';
    this.status = 400;
  }
}

/** Devuelve true si la IP es privada, local o reservada. */
export function isBlockedAddress(address) {
  const version = isIP(address);
  if (version === 4) return blocked.check(address, 'ipv4');
  if (version === 6) {
    // IPv4 escrita como IPv6 (por ejemplo ::ffff:127.0.0.1): se revisa la IPv4 de dentro.
    const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i.exec(address);
    if (mapped) return blocked.check(mapped[1], 'ipv4');
    return blocked.check(address, 'ipv6');
  }
  return true; // si no es una IP válida, no nos arriesgamos
}

/**
 * Averigua a qué IP apunta un nombre (o revisa la IP si ya lo es) y la devuelve
 * solo si es pública. Si no, lanza UrlNotAllowedError.
 */
export async function resolvePublicHost(hostname, { lookup = dnsLookup } = {}) {
  const host = hostname.replace(/^\[|\]$/g, '').toLowerCase();
  if (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host.endsWith('.internal')
  ) {
    throw new UrlNotAllowedError('No se pueden analizar direcciones locales o internas.');
  }
  let addresses;
  if (isIP(host)) {
    addresses = [host];
  } else {
    try {
      addresses = (await lookup(host, { all: true })).map((entry) => entry.address);
    } catch {
      throw new UrlNotAllowedError(
        'No se encontró el sitio. Revisa que la dirección esté bien escrita.',
      );
    }
  }
  if (addresses.length === 0 || addresses.some(isBlockedAddress)) {
    throw new UrlNotAllowedError(
      'No se pueden analizar direcciones privadas, locales o reservadas.',
    );
  }
  return addresses[0];
}

/**
 * Comprueba que la URL se puede analizar. Si no, lanza UrlNotAllowedError.
 * `lookup` se puede sustituir en los tests para no depender de Internet.
 */
export async function assertPublicUrl(rawUrl, { lookup = dnsLookup } = {}) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new UrlNotAllowedError('La dirección no es una URL válida.');
  }
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new UrlNotAllowedError('Solo se pueden analizar direcciones http:// o https://.');
  }
  if (url.username || url.password) {
    throw new UrlNotAllowedError('La URL no puede incluir usuario ni contraseña.');
  }

  await resolvePublicHost(url.hostname, { lookup });
  return url;
}
