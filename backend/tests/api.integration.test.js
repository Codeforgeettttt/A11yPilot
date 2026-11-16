// Pruebas de integración: llaman a la API como lo haría el navegador,
// con una base de datos SQLite en memoria que se crea vacía para cada ejecución.
import './helpers/test-db.js';
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../src/app.js';
import { sequelize } from '../src/config/database.js';
import '../src/models/index.js';

const PASSWORD = 'Clave-de-prueba-2026';

/** Registra un usuario nuevo y devuelve un "agente" que conserva su sesión (cookie). */
async function newUser(email, name = 'Usuario de prueba') {
  const agent = request.agent(app);
  const response = await agent.post('/api/auth/register').send({ name, email, password: PASSWORD });
  assert.equal(response.status, 201, JSON.stringify(response.body));
  return agent;
}

/** Crea un proyecto con un sitio y devuelve los dos. */
async function projectWithSite(agent, url = 'https://example.com') {
  const project = (await agent.post('/api/projects').send({ name: 'Proyecto de prueba' })).body;
  const site = (
    await agent.post(`/api/projects/${project.id}/sites`).send({ name: 'Sitio', url, authorizationConfirmed: true })
  ).body;
  return { project, site };
}

before(async () => {
  await sequelize.sync({ force: true });
});

after(async () => {
  await sequelize.close();
});

test('registro, sesión, cierre de sesión e inicio de sesión', async () => {
  const agent = await newUser('ana@a11ypilot.test', 'Ana');
  assert.equal((await agent.get('/api/auth/me')).body.user.name, 'Ana');

  assert.equal((await agent.post('/api/auth/logout')).status, 204);
  assert.equal((await agent.get('/api/auth/me')).status, 401);

  const wrong = await agent.post('/api/auth/login').send({ email: 'ana@a11ypilot.test', password: 'otra-clave-incorrecta' });
  assert.equal(wrong.status, 401);
  const login = await agent.post('/api/auth/login').send({ email: 'ana@a11ypilot.test', password: PASSWORD });
  assert.equal(login.status, 200);
  assert.equal((await agent.get('/api/auth/me')).status, 200);
});

test('no permite registrar dos veces el mismo correo', async () => {
  await newUser('repetido@a11ypilot.test');
  const again = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Otro', email: 'repetido@a11ypilot.test', password: PASSWORD });
  assert.equal(again.status, 409);
});

test('CRUD de proyectos y sitios con validaciones', async () => {
  const agent = await newUser('crud@a11ypilot.test');

  assert.equal((await agent.post('/api/projects').send({ name: 'ab' })).status, 400);
  const project = await agent.post('/api/projects').send({ name: 'Portal', description: 'Sitio principal' });
  assert.equal(project.status, 201);
  const renamed = await agent.patch(`/api/projects/${project.body.id}`).send({ name: 'Portal renovado' });
  assert.equal(renamed.body.name, 'Portal renovado');

  const sitesUrl = `/api/projects/${project.body.id}/sites`;
  assert.equal((await agent.post(sitesUrl).send({ name: 'Sitio', url: 'https://example.com' })).status, 400, 'sin autorización');
  assert.equal(
    (await agent.post(sitesUrl).send({ name: 'Sitio', url: 'ftp://x.com', authorizationConfirmed: true })).status,
    400,
  );
  const site = await agent.post(sitesUrl).send({ name: 'Sitio', url: 'https://example.com', authorizationConfirmed: true });
  assert.equal(site.status, 201);

  assert.equal((await agent.patch(`/api/sites/${site.body.id}`).send({ url: 'https://example.org' })).status, 400);
  const edited = await agent
    .patch(`/api/sites/${site.body.id}`)
    .send({ url: 'https://example.org', authorizationConfirmed: true });
  assert.equal(edited.body.url, 'https://example.org');

  assert.equal((await agent.delete(`/api/sites/${site.body.id}`)).status, 204);
  assert.equal((await agent.delete(`/api/projects/${project.body.id}`)).status, 204);
  assert.deepEqual((await agent.get('/api/projects')).body, []);
});

test('un usuario no puede ver ni modificar los datos de otro', async () => {
  const owner = await newUser('duena@a11ypilot.test');
  const intruder = await newUser('intruso@a11ypilot.test');
  const { project, site } = await projectWithSite(owner);
  const analysis = (await owner.post('/api/analyses/demo').send({ siteId: site.id, authorizationConfirmed: true })).body;
  const [finding] = (await owner.get('/api/findings')).body;

  // El intruso no ve nada en sus listas…
  assert.deepEqual((await intruder.get('/api/projects')).body, []);
  assert.deepEqual((await intruder.get('/api/sites')).body, []);
  assert.deepEqual((await intruder.get('/api/findings')).body, []);

  // …y cualquier acceso directo por número responde "no encontrado".
  const attempts = [
    ['GET proyecto', intruder.get(`/api/projects/${project.id}`)],
    ['PATCH proyecto', intruder.patch(`/api/projects/${project.id}`).send({ name: 'Hackeado' })],
    ['DELETE proyecto', intruder.delete(`/api/projects/${project.id}`)],
    ['PATCH sitio', intruder.patch(`/api/sites/${site.id}`).send({ name: 'Hackeado' })],
    ['DELETE sitio', intruder.delete(`/api/sites/${site.id}`)],
    ['POST análisis', intruder.post('/api/analyses').send({ siteId: site.id, authorizationConfirmed: true })],
    ['GET análisis', intruder.get(`/api/analyses/${analysis.id}`)],
    ['GET estado', intruder.get(`/api/analyses/${analysis.id}/status`)],
    ['PATCH hallazgo', intruder.patch(`/api/findings/${finding.id}/status`).send({ status: 'Verificado' })],
    ['GET informe', intruder.get(`/api/reports/${analysis.id}`)],
  ];
  for (const [label, pending] of attempts) {
    assert.equal((await pending).status, 404, label);
  }

  // Los datos de la dueña siguen intactos.
  assert.equal((await owner.get(`/api/projects/${project.id}`)).body.name, 'Proyecto de prueba');
});

test('seguimiento de hallazgos: cambiar estado y guardar observaciones', async () => {
  const agent = await newUser('seguimiento@a11ypilot.test');
  const { site } = await projectWithSite(agent);
  await agent.post('/api/analyses/demo').send({ siteId: site.id, authorizationConfirmed: true });
  const [finding] = (await agent.get('/api/findings')).body;

  assert.equal((await agent.patch(`/api/findings/${finding.id}/status`).send({ status: 'Inventado' })).status, 400);
  const updated = await agent
    .patch(`/api/findings/${finding.id}/status`)
    .send({ status: 'En revisión', note: 'Revisado' });
  assert.equal(updated.body.status, 'En revisión');
  const [update] = (await agent.get(`/api/findings/${finding.id}/updates`)).body;
  assert.deepEqual([update.previousStatus, update.newStatus, update.note], ['Pendiente', 'En revisión', 'Revisado']);
});

test('un análisis real de una dirección privada termina "Fallido" con un mensaje claro', async () => {
  const agent = await newUser('ssrf@a11ypilot.test');
  const { site } = await projectWithSite(agent, 'http://127.0.0.1:3001/api/health');
  const started = await agent.post('/api/analyses').send({ siteId: site.id, authorizationConfirmed: true });
  assert.equal(started.status, 202);

  let status;
  for (let i = 0; i < 40; i++) {
    status = (await agent.get(`/api/analyses/${started.body.id}/status`)).body;
    if (!['En cola', 'Ejecutándose'].includes(status.status)) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.equal(status.status, 'Fallido');
  assert.match(status.events.at(-1).note, /privadas, locales o reservadas/);
  assert.equal(status.findingCount, 0);
});
