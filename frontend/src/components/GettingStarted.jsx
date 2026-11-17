import { ArrowRight, CheckCircle2 } from 'lucide-react';

/**
 * Guía de "Primeros pasos" para usuarios nuevos.
 * Marca los pasos completados y ofrece un botón solo para el siguiente.
 * Cuando ya se hicieron los tres pasos, no muestra nada.
 * - data: datos de la app (proyectos, sitios y análisis).
 * - go: función para ir a otra sección.
 */
export default function GettingStarted({ data, go }) {
  const steps = [
    {
      done: data.projects.length > 0,
      title: 'Crea un proyecto',
      text: 'Agrupa los sitios web que vas a revisar.',
      page: 'projects',
      action: 'Crear proyecto',
    },
    {
      done: data.sites.length > 0,
      title: 'Registra un sitio',
      text: 'Indica la dirección que tienes autorización para evaluar.',
      page: 'sites',
      action: 'Registrar sitio',
    },
    {
      done: data.analyses.length > 0,
      title: 'Ejecuta un análisis',
      text: 'Revisa la página y obtén la lista de problemas de accesibilidad.',
      page: 'analysis',
      action: 'Nuevo análisis',
    },
  ];

  // El siguiente paso es el primero que todavía no está hecho.
  const next = steps.findIndex((step) => !step.done);
  if (next === -1) return null;

  return (
    <section className="card getting-started" aria-labelledby="getting-started-title">
      <h2 id="getting-started-title">Primeros pasos</h2>
      <p>Sigue estos pasos para hacer tu primer análisis de accesibilidad.</p>
      <ol className="steps">
        {steps.map((step, index) => (
          <li
            key={step.page}
            className={`step ${step.done ? 'done' : ''} ${index === next ? 'current' : ''}`}
            aria-current={index === next ? 'step' : undefined}
          >
            <span className="step-mark" aria-hidden="true">
              {step.done ? <CheckCircle2 size={20} /> : index + 1}
            </span>
            <div>
              <strong>{step.title}</strong>
              {step.done && <span className="sr-only"> (completado)</span>}
              <p>{step.text}</p>
            </div>
            {index === next && (
              <button className="btn primary mini" onClick={() => go(step.page)}>
                {step.action} <ArrowRight size={16} aria-hidden="true" />
              </button>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
