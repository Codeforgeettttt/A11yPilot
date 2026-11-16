import { useState } from 'react';
import { ArrowRight, RotateCcw, ScanSearch } from 'lucide-react';
import AnalysisProgress from '../components/AnalysisProgress.jsx';
import { Empty, SectionTitle } from '../components/Ui.jsx';
import { api } from '../services/api.js';
import { isDemoMode } from '../services/demoApi.js';

/**
 * Página de Nuevo análisis: elegir un sitio, lanzar el análisis y seguir su progreso.
 * - data: datos de la app (aquí se usa data.sites).
 * - run: actualiza los datos de la app y muestra un aviso.
 * - navigate: función para ir a otra sección.
 */
export default function NewAnalysis({ data, run, navigate }) {
  const [siteId, setSiteId] = useState('');
  const [authorization, setAuthorization] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [analysisId, setAnalysisId] = useState(null); // análisis que se está siguiendo
  const [result, setResult] = useState(null); // estado final (Completado o Fallido)

  const demo = isDemoMode();
  const noSites = data.sites.length === 0;

  async function submit(event) {
    event.preventDefault();
    setError('');
    if (!siteId) {
      setError('Selecciona un sitio.');
      return;
    }
    if (!authorization) {
      setError('Confirma la autorización para continuar.');
      return;
    }
    setSending(true);
    try {
      const created = await api('/analyses', {
        method: 'POST',
        body: { siteId: Number(siteId), authorizationConfirmed: true },
      });
      setResult(null);
      setAnalysisId(created.id);
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  /** Cuando el análisis termina: guardamos el resultado y actualizamos los datos de la app. */
  function handleFinished(final) {
    setResult(final);
    run(async () => {}, final.status === 'Completado' ? 'Análisis guardado en el historial.' : '');
  }

  function startAgain() {
    setAnalysisId(null);
    setResult(null);
    setAuthorization(false);
  }

  // Mientras hay un análisis: mostramos su progreso en lugar del formulario.
  if (analysisId) {
    return (
      <div className="narrow">
        <AnalysisProgress analysisId={analysisId} onFinished={handleFinished} />
        {result && (
          <div className="button-row">
            {result.status === 'Completado' && (
              <button className="btn primary" onClick={() => navigate('findings')}>
                Ver hallazgos <ArrowRight size={16} aria-hidden="true" />
              </button>
            )}
            <button className="btn secondary" onClick={startAgain}>
              <RotateCcw size={16} aria-hidden="true" /> Analizar otro sitio
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="card narrow">
      <SectionTitle
        title="Analizar un sitio"
        description="Elige un sitio registrado y confirma que tienes autorización para evaluarlo."
      />
      <form className="form-stack" onSubmit={submit} noValidate>
        <label htmlFor="analysis-site">Sitio web</label>
        <select id="analysis-site" value={siteId} onChange={(e) => setSiteId(e.target.value)} required>
          <option value="">Seleccionar sitio registrado</option>
          {data.sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.name} — {site.url}
            </option>
          ))}
        </select>

        <label className="checkline">
          <input type="checkbox" checked={authorization} onChange={(e) => setAuthorization(e.target.checked)} />
          <span>Confirmo que tengo autorización para evaluar este sitio.</span>
        </label>

        {error && (
          <div className="field-error" role="alert">
            {error}
          </div>
        )}
        <button className="btn primary" type="submit" disabled={sending || noSites}>
          <ScanSearch size={18} aria-hidden="true" />
          {sending ? 'Enviando…' : 'Analizar sitio'}
        </button>
      </form>
      <div className="note">
        {demo
          ? 'Modo de prueba: no se visita el sitio. El análisis se simula con hallazgos de ejemplo.'
          : 'Se abrirá la página en un navegador sin ventana y se revisará con axe-core (WCAG 2.2, niveles A y AA). Puede tardar hasta un minuto.'}
      </div>
      {noSites && <Empty>Primero crea un proyecto y registra un sitio en el menú.</Empty>}
    </section>
  );
}