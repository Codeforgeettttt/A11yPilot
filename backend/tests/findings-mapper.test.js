import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_NODES_PER_RULE, violationsToFindings, wcagCriteria } from '../src/services/findings-mapper.js';

// Ejemplo de violación con el mismo formato que devuelve axe.
const imageAlt = {
  id: 'image-alt',
  impact: 'critical',
  tags: ['cat.text-alternatives', 'wcag2a', 'wcag111', 'section508'],
  help: 'Las imágenes deben tener texto alternativo',
  description: 'Garantiza que los elementos <img> tienen texto alternativo',
  helpUrl: 'https://dequeuniversity.com/rules/axe/4.10/image-alt',
  nodes: [{ target: ['img.logo'], failureSummary: 'El elemento no tiene un atributo alt' }],
};

test('traduce las etiquetas de axe a criterios WCAG', () => {
  assert.equal(wcagCriteria(['wcag2a', 'wcag111']), '1.1.1');
  assert.equal(wcagCriteria(['wcag244', 'wcag412']), '2.4.4, 4.1.2');
  assert.equal(wcagCriteria(['best-practice']), null);
});

test('convierte una violación en un hallazgo con los campos de la base de datos', () => {
  const [finding] = violationsToFindings([imageAlt]);
  assert.equal(finding.rule, 'image-alt');
  assert.equal(finding.wcag, '1.1.1');
  assert.equal(finding.impact, 'Crítico');
  assert.equal(finding.selector, 'img.logo');
  assert.match(finding.recommendation, /atributo alt/);
  assert.match(finding.recommendation, /Más información: https:/);
});

test('limita cuántos elementos se guardan por regla', () => {
  const many = { ...imageAlt, nodes: Array.from({ length: 30 }, (_, i) => ({ target: [`img:nth-child(${i})`] })) };
  assert.equal(violationsToFindings([many]).length, MAX_NODES_PER_RULE);
});

test('recorta los textos demasiado largos', () => {
  const long = { ...imageAlt, help: 'x'.repeat(500) };
  assert.equal(violationsToFindings([long])[0].title.length, 200);
});