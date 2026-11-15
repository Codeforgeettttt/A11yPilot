import test from 'node:test';
import assert from 'node:assert/strict';
import { assertPublicUrl, isBlockedAddress, UrlNotAllowedError } from '../src/services/url-guard.js';

// DNS falso para no depender de Internet en las pruebas.
const fakeDns = (records) => async (host) => {
  if (!(host in records)) throw new Error('ENOTFOUND');
  return records[host].map((address) => ({ address }));
};

test('reconoce IPs privadas, locales y de metadatos de la nube', () => {
  for (const ip of ['127.0.0.1', '10.1.2.3', '172.16.5.4', '192.168.1.1', '169.254.169.254', '0.0.0.0', '::1', 'fe80::1', 'fd00::1', '::ffff:127.0.0.1']) {
    assert.equal(isBlockedAddress(ip), true, ip);
  }
  for (const ip of ['93.184.215.14', '8.8.8.8', '2606:4700:4700::1111']) {
    assert.equal(isBlockedAddress(ip), false, ip);
  }
});

test('rechaza protocolos, credenciales y nombres locales', async () => {
  for (const url of ['ftp://example.com', 'file:///etc/passwd', 'https://u:p@example.com', 'http://localhost:3001', 'http://router.local', 'no-es-una-url']) {
    await assert.rejects(assertPublicUrl(url, { lookup: fakeDns({}) }), UrlNotAllowedError, url);
  }
});

test('rechaza IPs privadas escritas directamente', async () => {
  for (const url of ['http://127.0.0.1:3001/api', 'http://192.168.0.1', 'http://169.254.169.254/latest/meta-data', 'http://[::1]/']) {
    await assert.rejects(assertPublicUrl(url, { lookup: fakeDns({}) }), UrlNotAllowedError, url);
  }
});

test('rechaza dominios que apuntan a una IP privada', async () => {
  const dns = fakeDns({ 'trampa.example': ['10.0.0.8'] });
  await assert.rejects(assertPublicUrl('https://trampa.example', { lookup: dns }), UrlNotAllowedError);
});

test('acepta dominios públicos', async () => {
  const dns = fakeDns({ 'example.com': ['93.184.215.14'] });
  const url = await assertPublicUrl('https://example.com/inicio', { lookup: dns });
  assert.equal(url.hostname, 'example.com');
});

test('explica cuando el dominio no existe', async () => {
  await assert.rejects(assertPublicUrl('https://no-existe.example', { lookup: fakeDns({}) }), /No se encontró el sitio/);
});