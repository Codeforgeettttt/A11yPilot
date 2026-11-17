import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { startGuardProxy } from './guard-proxy.js';
import { assertPublicUrl, UrlNotAllowedError } from './url-guard.js';

// axe-core en español: cargamos su código y le decimos que use el idioma "es".
const require = createRequire(import.meta.url);
const axeScript = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const spanish = JSON.parse(readFileSync(require.resolve('axe-core/locales/es.json'), 'utf8'));
const AXE_SOURCE = `${axeScript};axe.configure({ locale: ${JSON.stringify(spanish)} });`;

// Criterios que revisamos: WCAG 2.0, 2.1 y 2.2, niveles A y AA.
export const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const DEFAULT_TIMEOUT_MS = 30000;

/**
 * Abre la página en un navegador sin ventana y la revisa con axe-core.
 * Devuelve la URL final, el código HTTP, el título y los problemas encontrados.
 */
export async function scanPage(url, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  // 1. Antes de abrir nada, comprobamos que la dirección es pública.
  await assertPublicUrl(url);

  // 2. Arrancamos el "portero" y obligamos al navegador a salir a Internet a través de él.
  //    "<-loopback>" hace que incluso localhost pase por el portero (y quede bloqueado).
  const proxy = await startGuardProxy();
  let browser;
  try {
    browser = await chromium.launch({
      proxy: { server: `http://127.0.0.1:${proxy.address().port}`, bypass: '<-loopback>' },
    });
    const context = await browser.newContext({
      userAgent: 'A11yPilot/1.0 (evaluación de accesibilidad autorizada)',
    });
    const page = await context.newPage();
    page.setDefaultTimeout(timeoutMs);

    const response = await page.goto(url, { waitUntil: 'load', timeout: timeoutMs });

    // 3. Si la página nos redirigió a una dirección privada, el portero la bloqueó: no analizamos nada.
    try {
      await assertPublicUrl(page.url());
    } catch {
      throw new UrlNotAllowedError('La página redirige a una dirección privada o local.');
    }

    const results = await new AxeBuilder({ page, axeSource: AXE_SOURCE })
      .withTags(WCAG_TAGS)
      .analyze();

    return {
      requestedUrl: url,
      finalUrl: page.url(),
      status: response?.status() ?? null,
      title: await page.title(),
      violations: results.violations,
    };
  } finally {
    // Pase lo que pase, cerramos el navegador y el portero para no dejar procesos abiertos.
    await browser?.close();
    proxy.close();
  }
}
