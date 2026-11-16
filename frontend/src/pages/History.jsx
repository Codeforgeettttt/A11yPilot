import { ArrowRight } from 'lucide-react';
import { Empty, SectionTitle, StateTag } from '../components/Ui.jsx';
import { formatDate } from '../utils/format.js';

/**
 * Página de Historial: lista de todos los análisis guardados.
 * - data: datos de la app (aquí se usa data.analyses).
 * - navigate: función para ir a otra sección.
 */
export default function History({ data, navigate }) {
  return (
    <section className="card">
      <SectionTitle title="Historial de análisis" description="Cada ejecución queda guardada con fecha, sitio y estado." />
      {data.analyses.length === 0 ? (
        <Empty>Aún no hay análisis. Registra un sitio y ejecuta tu primer análisis.</Empty>
      ) : (
        <div className="record-list">
          {data.analyses.map((analysis) => (
            <div className="record" key={analysis.id}>
              <div>
                <strong>
                  #{analysis.id} · {analysis.Site?.name || analysis.Site?.url}
                </strong>
                <p>
                  {formatDate(analysis.createdAt)} · {analysis.findingCount ?? 0} hallazgos · {analysis.demo ? 'Datos simulados' : 'Análisis real'}
                </p>
              </div>
              <StateTag kind={analysis.status === 'Completado' ? 'success' : 'warning'}>{analysis.status}</StateTag>
            </div>
          ))}
        </div>
      )}
      <button className="btn secondary" onClick={() => navigate('analysis')}>
        Nuevo análisis <ArrowRight size={16} />
      </button>
    </section>
  );
}