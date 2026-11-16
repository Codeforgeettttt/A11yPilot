import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { demoApi } from './demoApi.js';

/** Almacenamiento falso del navegador (las pruebas corren en Node, sin navegador). */
function fakeStorage() {
  const data = {};
  return {
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => {
      data[key] = String(value);
    },
    removeItem: (key) => {
      delete data[key];
    },
  };
}

/** Crea un proyecto con un sitio y devuelve el sitio. */
async function createSite(url = 'https://example.com/') {
  const project = await demoApi('/projects', { method: 'POST', body: { name: 'Proyecto de prueba' } });
  return demoApi(`/projects/${project.id}/sites`, {
    method: 'POST',
    body: { name: 'Sitio', url, authorizationConfirmed: true },
  });
}

beforeEach(() => {
  vi.stubGlobal('localStorage', fakeStorage());
  vi.stubGlobal('sessionStorage', fakeStorage());
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('modo de prueba: análisis por fases', () => {
  it('avanza de "En cola" a "Ejecutándose" y a "Completado" con 4 hallazgos', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-16T10:00:00Z'));
    const site = await createSite();
    const { id } = await demoApi('/analyses', { method: 'POST', body: { siteId: site.id, authorizationConfirmed: true } });

    expect((await demoApi(`/analyses/${id}/status`)).status).toBe('En cola');

    vi.setSystemTime(new Date('2026-11-16T10:00:01.500Z'));
    expect((await demoApi(`/analyses/${id}/status`)).status).toBe('Ejecutándose');

    vi.setSystemTime(new Date('2026-11-16T10:00:05Z'));
    const final = await demoApi(`/analyses/${id}/status`);
    expect(final.status).toBe('Completado');
    expect(final.findingCount).toBe(4);
    expect(final.events.map((event) => event.state)).toEqual(['En cola', 'Ejecutándose', 'Completado']);
  });

  it('exige confirmar la autorización para analizar', async () => {
    const site = await createSite();
    await expect(demoApi('/analyses', { method: 'POST', body: { siteId: site.id } })).rejects.toThrow(/autorización/);
  });
});

describe('modo de prueba: editar sitios', () => {
  it('permite cambiar solo el nombre sin volver a confirmar', async () => {
    const site = await createSite();
    const edited = await demoApi(`/sites/${site.id}`, { method: 'PATCH', body: { name: 'Nombre nuevo', url: site.url } });
    expect(edited.name).toBe('Nombre nuevo');
  });

  it('exige confirmar la autorización si cambia la URL', async () => {
    const site = await createSite();
    await expect(
      demoApi(`/sites/${site.id}`, { method: 'PATCH', body: { name: 'Sitio', url: 'https://example.org/' } }),
    ).rejects.toThrow(/autorización/);
    const edited = await demoApi(`/sites/${site.id}`, {
      method: 'PATCH',
      body: { name: 'Sitio', url: 'https://example.org/', authorizationConfirmed: true },
    });
    expect(edited.url).toBe('https://example.org/');
  });

  it('rechaza direcciones que no son http ni https', async () => {
    const site = await createSite();
    await expect(
      demoApi(`/sites/${site.id}`, { method: 'PATCH', body: { name: 'Sitio', url: 'ftp://x.org', authorizationConfirmed: true } }),
    ).rejects.toThrow(/HTTP o HTTPS/);
  });
});
