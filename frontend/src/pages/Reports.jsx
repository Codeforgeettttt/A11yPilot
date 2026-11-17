import { useState } from 'react';
import { Download } from 'lucide-react';
import { Empty, SectionTitle } from '../components/Ui.jsx';
import { downloadReport } from '../services/api.js';
import { formatDate } from '../utils/format.js';

/**
 * Página de Reportes: descargar el informe PDF de cada análisis.
 * - data: datos de la app (aquí se usa data.analyses).
 * - run: ejecuta una acción y muestra el mensaje de éxito o de error.
 */
export default function Reports({ data, run }) {
  // Guarda qué informe se está descargando, para desactivar solo ese botón.
  const [downloading, setDownloading] = useState(null);

  async function download(id) {
    setDownloading(id);
    try {
      await run(() => downloadReport(id), 'Informe descargado.');
    } finally {
      setDownloading(null);
    }
  }

  return (
    <section className="card">
      <SectionTitle title="Informes" description="Descarga el informe PDF de cada análisis." />
      {data.analyses.length === 0 ? (
        <Empty>Los informes estarán disponibles después de ejecutar un análisis.</Empty>
      ) : (
        <div className="record-list">
          {data.analyses.map((analysis) => (
            <div className="record" key={analysis.id}>
              <div>
                <strong>
                  Análisis #{analysis.id} · {analysis.Site?.name || 'Sitio'}
                </strong>
                <p>
                  {formatDate(analysis.createdAt)} · {analysis.findingCount ?? 0} hallazgos
                </p>
              </div>
              <button
                className="btn secondary mini"
                disabled={downloading === analysis.id}
                onClick={() => download(analysis.id)}
              >
                <Download size={16} aria-hidden="true" /> Descargar PDF
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="note">
        Los informes de análisis simulados lo indican expresamente. Ningún informe certifica
        conformidad WCAG.
      </p>
    </section>
  );
}
