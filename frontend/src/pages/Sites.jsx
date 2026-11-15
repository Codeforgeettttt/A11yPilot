import { useState } from 'react';
import { Empty, SectionTitle } from '../components/Ui.jsx';
import { api } from '../services/api.js';

/** Devuelve true si el texto es una dirección web válida que empieza por http:// o https://. */
function isHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol) && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

/**
 * Página de Sitios: registrar las URL que se van a evaluar y eliminarlas.
 * - data: datos de la app (aquí se usan data.projects y data.sites).
 * - run: ejecuta una acción y luego actualiza los datos.
 */
export default function Sites({ data, run }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('https://');
  const [projectId, setProjectId] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');
    if (!isHttpUrl(url)) {
      setError('Ingresa una URL HTTP o HTTPS válida.');
      return;
    }
    if (!authorized) {
      setError('Confirma la autorización antes de registrar el sitio.');
      return;
    }
    if (!projectId) {
      setError('Selecciona un proyecto.');
      return;
    }
    const saved = await run(
      () =>
        api(`/projects/${projectId}/sites`, {
          method: 'POST',
          body: { name: name.trim(), url: url.trim(), authorizationConfirmed: true },
        }),
      'Sitio registrado.',
    );
    if (saved) {
      setName('');
      setUrl('https://');
      setAuthorized(false);
    }
  }

  function remove(site) {
    if (window.confirm(`¿Eliminar «${site.name}» y su historial asociado?`)) {
      run(() => api(`/sites/${site.id}`, { method: 'DELETE' }), 'Sitio eliminado.');
    }
  }

  return (
    <div className="two-col layout-form">
      <section className="card">
        <SectionTitle title="Registrar sitio" description="Registrar una URL no ejecuta ningún escaneo." />
        <form className="form-stack" onSubmit={submit} noValidate>
          <label htmlFor="site-project">Proyecto</label>
          <select id="site-project" value={projectId} onChange={(e) => setProjectId(e.target.value)} required>
            <option value="">Seleccionar proyecto</option>
            {data.projects.map((project) => (
              <option value={project.id} key={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <label htmlFor="site-name">Nombre del sitio</label>
          <input
            id="site-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength="2"
            maxLength="120"
            placeholder="Portal principal"
          />

          <label htmlFor="site-url">URL pública</label>
          <input
            id="site-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            type="url"
            aria-invalid={!!error}
            aria-describedby={error ? 'site-form-error' : 'site-help'}
          />
          <small id="site-help">Usa http:// o https://. La conexión real se implementará en otra fase.</small>

          <label className="checkline">
            <input type="checkbox" checked={authorized} onChange={(e) => setAuthorized(e.target.checked)} />
            <span>Confirmo que cuento con autorización para evaluar este sitio.</span>
          </label>

          {error && (
            <div className="field-error" role="alert" id="site-form-error">
              {error}
            </div>
          )}
          <button type="submit" className="btn primary">
            Registrar sitio
          </button>
        </form>
      </section>

      <section className="card">
        <SectionTitle title={`Sitios registrados (${data.sites.length})`} description="Asociados a los proyectos guardados." />
        {data.sites.length === 0 ? (
          <Empty>Agrega un proyecto y registra su primer sitio.</Empty>
        ) : (
          <div className="record-list">
            {data.sites.map((site) => (
              <div className="record record-stack" key={site.id}>
                <div>
                  <strong>{site.name}</strong>
                  <p className="break-word">{site.url}</p>
                  <small>{site.Project?.name || 'Proyecto'} · Autorización declarada</small>
                </div>
                <button className="btn mini danger" onClick={() => remove(site)}>
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}