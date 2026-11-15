import { useState } from 'react';
import { ScanSearch } from 'lucide-react';
import { Empty, SectionTitle } from '../components/Ui.jsx';
import { api } from '../services/api.js';

/**
 * Página de Nuevo análisis: elegir un sitio registrado y lanzar el análisis.
 * - data: datos de la app (aquí se usa data.sites).
 * - run: ejecuta una acción y luego actualiza los datos.
 * - navigate: función para ir a otra sección al terminar.
 */
export default function NewAnalysis({ data, run, navigate }) {
  const [siteId, setSiteId] = useState('');
  const [authorization, setAuthorization] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

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
      const saved = await run(
        () =>
          api('/analyses/demo', {
            method: 'POST',
            body: { siteId: Number(siteId), authorizationConfirmed: true },
          }),
        'Análisis de demostración guardado correctamente.',
      );
      if (saved) navigate('history');
    } finally {
      setSending(false);
    }
  }

  const noSites = data.sites.length === 0;

  return (
    <section className="card narrow">
      <SectionTitle
        title="Ejecutar demostración"
        description="Se guardan hallazgos simulados en el navegador o en SQL Server según el modo."
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
          {sending ? 'Guardando…' : 'Ejecutar simulación'}
        </button>
      </form>
      <div className="note">
        No se conecta al sitio ingresado. El sistema utiliza casos predefinidos para demostrar el seguimiento.
      </div>
      {noSites && <Empty>Primero crea un proyecto y registra un sitio en el menú.</Empty>}
    </section>
  );
}