import test from 'node:test';
import assert from 'node:assert/strict';
import { PassThrough } from 'node:stream';
import { sendPdf } from '../src/services/reports.js';

/** Imita la respuesta de Express: guarda las cabeceras y recibe el PDF. */
function fakeResponse() {
  const res = new PassThrough();
  res.headers = {};
  res.setHeader = (name, value) => {
    res.headers[name.toLowerCase()] = value;
  };
  res.on('data', () => {});
  return res;
}

const analysis = (demo) => ({
  id: 8,
  demo,
  status: 'Completado',
  createdAt: new Date(),
  Site: {
    name: 'CityLights',
    url: 'https://www.w3.org/WAI/demos/bad/before/home.html',
    Project: { name: 'Portal' },
  },
  Findings: [
    {
      title: 'Imagen sin texto alternativo',
      impact: 'Crítico',
      rule: 'image-alt',
      wcag: '1.1.1',
      selector: 'img.logo',
      status: 'Pendiente',
      recommendation: 'Añadir alt.',
    },
  ],
});

test('el PDF de un análisis real no se marca como demostración', async () => {
  const res = fakeResponse();
  sendPdf(res, analysis(false));
  await new Promise((resolve) => res.on('end', resolve));
  assert.equal(res.headers['content-type'], 'application/pdf');
  assert.match(res.headers['content-disposition'], /a11ypilot-analisis-8\.pdf/);
});

test('el PDF de un análisis simulado lo indica en el nombre del archivo', async () => {
  const res = fakeResponse();
  sendPdf(res, analysis(true));
  await new Promise((resolve) => res.on('end', resolve));
  assert.match(res.headers['content-disposition'], /a11ypilot-analisis-8-demo\.pdf/);
});
