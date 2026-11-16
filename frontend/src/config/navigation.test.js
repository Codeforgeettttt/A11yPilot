import { afterEach, describe, expect, it, vi } from 'vitest';
import { NAV, getPageFromUrl } from './navigation.js';

/** Simula la dirección del navegador (las pruebas corren en Node, sin navegador). */
function visit(search) {
  vi.stubGlobal('window', { location: { search } });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('navegación', () => {
  it('abre la sección indicada en la URL', () => {
    visit('?page=reports');
    expect(getPageFromUrl()).toBe('reports');
  });

  it('abre el Resumen si la sección no existe o no se indica', () => {
    visit('?page=inventada');
    expect(getPageFromUrl()).toBe('dashboard');
    visit('');
    expect(getPageFromUrl()).toBe('dashboard');
  });

  it('cada sección tiene nombre, icono y descripción', () => {
    for (const item of NAV) {
      expect(item.name, item.id).toBeTruthy();
      expect(item.icon, item.id).toBeTruthy();
      expect(item.lede, item.id).toBeTruthy();
    }
  });
});
