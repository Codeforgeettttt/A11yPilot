// Convierte los resultados de axe-core en hallazgos con el formato de la tabla Findings.

// axe usa impactos en inglés; la aplicación los muestra en español.
const IMPACTS = { critical: 'Crítico', serious: 'Serio', moderate: 'Moderado', minor: 'Menor' };

// Para no llenar la base de datos, guardamos como máximo estos elementos por regla y en total.
export const MAX_NODES_PER_RULE = 10;
export const MAX_FINDINGS = 200;

/** Recorta un texto para que quepa en la columna de la base de datos. */
function fit(text, max) {
  if (text === undefined || text === null) return null;
  const value = String(text).trim();
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

/** Traduce las etiquetas de axe (por ejemplo "wcag143") a criterios WCAG ("1.4.3"). */
export function wcagCriteria(tags = []) {
  const criteria = tags
    .map((tag) => /^wcag(\d)(\d)(\d+)$/.exec(tag))
    .filter(Boolean)
    .map(([, principle, guideline, criterion]) => `${principle}.${guideline}.${criterion}`);
  return criteria.length ? criteria.join(', ') : null;
}

/** Devuelve un hallazgo por cada elemento afectado (con los límites de arriba). */
export function violationsToFindings(violations = []) {
  const findings = [];
  for (const violation of violations) {
    for (const node of violation.nodes.slice(0, MAX_NODES_PER_RULE)) {
      if (findings.length >= MAX_FINDINGS) return findings;
      const steps = node.failureSummary || 'Revisar el elemento señalado.';
      findings.push({
        rule: fit(violation.id, 100),
        wcag: fit(wcagCriteria(violation.tags), 80),
        title: fit(violation.help, 200),
        description: fit(violation.description, 1500),
        recommendation: fit(`${steps}\nMás información: ${violation.helpUrl}`, 1500),
        selector: fit(node.target?.flat().join(' '), 300),
        impact: IMPACTS[violation.impact] || 'Menor',
      });
    }
  }
  return findings;
}