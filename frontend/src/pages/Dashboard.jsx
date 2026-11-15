import { Activity, ArrowRight, ClipboardList, Folder, Globe, ShieldCheck } from 'lucide-react';
import { Empty, IMPACTS, SectionTitle, StateTag } from '../components/Ui.jsx';
import { formatDate } from '../utils/format.js';

/**
 * Página de Resumen: indicadores, actividad reciente y distribución por impacto.
 * - data: proyectos, sitios, análisis, hallazgos y resumen.
 * - go: función para ir a otra sección.
 */
export default function Dashboard({ data, go }) {
  const summary = data.summary || {};
  const cards = [
    ['Proyectos', summary.projects ?? 0, Folder],
    ['Sitios', summary.sites ?? 0, Globe],
    ['Análisis', summary.analyses ?? 0, Activity],
    ['Pendientes', summary.pendingFindings ?? 0, ClipboardList],
  ];

  return (
    <>
      <div className="stat-grid">
        {cards.map(([name, value, Icon]) => (
          <div className="stat" key={name}>
            <div className="stat-head">
              <span>{name}</span>
              <Icon size={21} aria-hidden="true" />
            </div>
            <strong>{value}</strong>
            <p>Registros del entorno de desarrollo</p>
          </div>
        ))}
      </div>

      <div className="two-col">
        <section className="card">
          <SectionTitle title="Comienza una evaluación" description="Registra un sitio y genera un análisis de ejemplo." />
          <div className="illustration" aria-hidden="true">
            <span className="window-dots">● ● ●</span>
            <div className="illustration-line" />
            <div className="illustration-line short" />
            <ShieldCheck size={35} />
          </div>
          <p>Los resultados permiten probar el seguimiento sin visitar la página indicada.</p>
          <button className="btn primary" onClick={() => go('analysis')}>
            Nuevo análisis <ArrowRight size={17} />
          </button>
        </section>

        <section className="card">
          <SectionTitle title="Actividad reciente" description="Últimos análisis guardados." />
          {data.analyses.length === 0 ? (
            <Empty>Aún no se han ejecutado análisis. Puedes comenzar con un sitio de prueba.</Empty>
          ) : (
            <div className="record-list">
              {data.analyses.slice(0, 5).map((analysis) => (
                <div className="record" key={analysis.id}>
                  <div>
                    <strong>{analysis.Site?.name || analysis.Site?.url || 'Sitio'}</strong>
                    <p>
                      {formatDate(analysis.createdAt)} · {analysis.demo ? 'Demostración' : 'Análisis'}
                    </p>
                  </div>
                  <StateTag kind={analysis.status === 'Completado' ? 'success' : 'info'}>{analysis.status}</StateTag>
                </div>
              ))}
            </div>
          )}
          <button className="btn secondary" onClick={() => go('history')}>
            Consultar historial <ArrowRight size={17} />
          </button>
        </section>
      </div>

      <section className="card">
        <SectionTitle title="Distribución por impacto" description="Datos de los hallazgos guardados." />
        <div className="impact-grid">
          {IMPACTS.map((impact) => (
            <div className="impact-count" key={impact}>
              <strong>{data.findings.filter((finding) => finding.impact === impact).length}</strong>
              <span>{impact}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}