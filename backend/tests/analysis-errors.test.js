import test from 'node:test';
import assert from 'node:assert/strict';
import { AnalysisError, assertPageLoaded, friendlyError } from '../src/services/analysis-errors.js';
import { UrlNotAllowedError } from '../src/services/url-guard.js';

test('traduce los errores de red de Chromium a mensajes claros', () => {
  assert.match(friendlyError(new Error('page.goto: net::ERR_CONNECTION_REFUSED at https://x.com')), /No se pudo conectar/);
  assert.match(friendlyError(new Error('page.goto: net::ERR_CERT_DATE_INVALID')), /certificado/);
  assert.match(friendlyError(new Error('page.goto: net::ERR_NAME_NOT_RESOLVED')), /No se encontró el sitio/);
  assert.match(friendlyError(Object.assign(new Error('page.goto: Timeout 30000ms exceeded.'), { name: 'TimeoutError' })), /tardó demasiado/);
});

test('conserva los mensajes que ya son claros', () => {
  assert.equal(friendlyError(new UrlNotAllowedError('Bloqueado.')), 'Bloqueado.');
  assert.equal(friendlyError(new AnalysisError('La página no existe.')), 'La página no existe.');
});

test('usa un mensaje genérico para errores desconocidos (sin mostrar detalles técnicos)', () => {
  const message = friendlyError(new Error('TypeError: cannot read properties of undefined (secret path C:/server)'));
  assert.match(message, /error inesperado/);
  assert.doesNotMatch(message, /C:\//);
});

test('detecta las respuestas HTTP de error', () => {
  assert.doesNotThrow(() => assertPageLoaded(200));
  assert.doesNotThrow(() => assertPageLoaded(null));
  assert.throws(() => assertPageLoaded(404), /404/);
  assert.throws(() => assertPageLoaded(403), /no permite el acceso/);
  assert.throws(() => assertPageLoaded(503), /problema interno/);
});