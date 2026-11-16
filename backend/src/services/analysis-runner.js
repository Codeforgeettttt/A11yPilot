// Ejecuta los análisis reales en segundo plano y va guardando su progreso.
import { Op } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Analysis, AnalysisEvent, Finding, Project, Site } from '../models/index.js';
import { violationsToFindings } from './findings-mapper.js';
import { scanPage } from './scanner.js';
import { assertPageLoaded, friendlyError } from './analysis-errors.js';
import { bad } from '../utils/validate.js';

const IN_PROGRESS = ['En cola', 'Ejecutándose'];

// Cola sencilla: los análisis se ejecutan de uno en uno, porque cada uno abre un navegador.
let queue = Promise.resolve();
function enqueue(task) {
  const run = queue.then(task, task);
  queue = run.catch(() => {});
  return run;
}

/** Guarda un paso del análisis (lo que luego se ve en el endpoint de estado). */
function addEvent(analysisId, state, note, transaction) {
  return AnalysisEvent.create({ analysisId, state, note }, { transaction });
}

/** Ejecuta el scanner sobre la URL y guarda el resultado (hallazgos o error). */
async function runAnalysis(analysisId, url) {
  const analysis = await Analysis.findByPk(analysisId);
  await analysis.update({ status: 'Ejecutándose', startedAt: new Date() });
  await addEvent(analysisId, 'Ejecutándose', 'Abriendo la página y revisándola con axe-core');
  try {
    const result = await scanPage(url);
        assertPageLoaded(result.status);
    const findings = violationsToFindings(result.violations);
    await sequelize.transaction(async (transaction) => {
      await Finding.bulkCreate(
        findings.map((finding) => ({ ...finding, analysisId, status: 'Pendiente' })),
        { transaction },
      );
      await analysis.update({ status: 'Completado', finishedAt: new Date() }, { transaction });
      await addEvent(analysisId, 'Completado', `${findings.length} hallazgos guardados`, transaction);
    });
  } catch (error) {
    await analysis.update({ status: 'Fallido', finishedAt: new Date() });
        // En la consola del servidor queda el error técnico; al usuario le mostramos uno claro.
    console.error(`[Análisis ${analysisId}]`, error.message);
    await addEvent(analysisId, 'Fallido', friendlyError(error));
  }
}

/**
 * Crea un análisis real "En cola" y lo pone a ejecutar en segundo plano.
 * Devuelve enseguida, sin esperar a que termine el análisis.
 */
export async function startRealAnalysis(site, userId) {
  // Un análisis a la vez por usuario, para que nadie sature el servidor.
  const running = await Analysis.count({
    where: { status: { [Op.in]: IN_PROGRESS } },
    include: [{ model: Site, required: true, include: [{ model: Project, where: { userId }, required: true }] }],
  });
  if (running > 0) throw bad('Ya tienes un análisis en curso. Espera a que termine.', 409);

  const analysis = await Analysis.create({ siteId: site.id, demo: false, status: 'En cola' });
  await addEvent(analysis.id, 'En cola', 'Solicitud recibida');
  enqueue(() => runAnalysis(analysis.id, site.url));
  return analysis;
}