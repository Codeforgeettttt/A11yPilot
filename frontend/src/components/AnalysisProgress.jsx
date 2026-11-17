import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { api } from '../services/api.js';

const STEPS = ['En cola', 'Ejecutándose', 'Completado'];
const FINAL_STATES = ['Completado', 'Fallido'];
const CHECK_EVERY_MS = 1500;

/**
 * Muestra el progreso de un análisis. Pregunta su estado cada 1,5 segundos
 * hasta que termina (Completado o Fallido) y entonces llama a onFinished.
 * - analysisId: número del análisis.
 * - onFinished: función que recibe el estado final.
 */
export default function AnalysisProgress({ analysisId, onFinished }) {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true; // pasa a false si el usuario se va de la página
    let timer;

    async function check() {
      try {
        const result = await api(`/analyses/${analysisId}/status`);
        if (!active) return;
        setStatus(result);
        if (FINAL_STATES.includes(result.status)) onFinished?.(result);
        else timer = setTimeout(check, CHECK_EVERY_MS);
      } catch (e) {
        if (active) setError(e.message);
      }
    }

    check();
    // Limpieza: si se cierra el componente, dejamos de preguntar.
    return () => {
      active = false;
      clearTimeout(timer);
    };
    // Solo debe reiniciarse si cambia el análisis.
  }, [analysisId]);

  const current = status?.status ?? 'En cola';
  const failed = current === 'Fallido';
  const finished = current === 'Completado';
  const lastNote = status?.events?.at(-1)?.note;
  // Hasta qué paso llegó (si falló, hasta "Ejecutándose" si llegó a empezar).
  const reached = failed ? (status?.startedAt ? 1 : 0) : STEPS.indexOf(current);

  let message = `${current}…`;
  if (error) message = error;
  else if (failed) message = `No se pudo completar el análisis: ${lastNote}`;
  else if (finished) message = `Análisis completado: ${status.findingCount} hallazgos encontrados.`;

  return (
    <section className="card analysis-progress" aria-labelledby="analysis-progress-title">
      <h2 id="analysis-progress-title">Análisis #{analysisId}</h2>
      <p
        role="status"
        aria-live="polite"
        className={failed || error ? 'field-error' : 'notice-text'}
      >
        {message}
      </p>
      <ol className="steps">
        {STEPS.map((step, index) => {
          const done = finished || index < reached;
          const isCurrent = !finished && !failed && index === reached;
          return (
            <li
              key={step}
              className={`step ${done ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span className="step-mark" aria-hidden="true">
                {done ? <CheckCircle2 size={20} /> : index + 1}
              </span>
              <div>
                <strong>{step}</strong>
                {done && <span className="sr-only"> (completado)</span>}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
