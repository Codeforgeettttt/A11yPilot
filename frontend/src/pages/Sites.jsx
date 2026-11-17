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
 * Página de Sitios: registrar, editar y eliminar las URL que se van a evaluar.
 * Al editar, si cambia la URL hay que volver a confirmar la autorización.
 * - data: datos de la app (aquí se usan data.projects y data.sites).
 * - run: ejecuta una acción y luego actualiza los datos.
 */
export default function Sites({ data, run }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('https://');
  const [projectId, setProjectId] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // sitio que se está editando, o null si se crea uno nuevo

  const urlChanged = editing && url.trim() !== editing.url;
  // Al crear siempre se pide la autorización; al editar, solo si cambia la URL.
  const needsAuthorization = !editing || urlChanged;

  function resetForm() {
    setEditing(null);
    setName('');
    setUrl('https://');
    setProjectId('');
    setAuthorized(false);
    setError('');
  }

  function startEditing(site) {
    setEditing(site);
    setName(site.name);
    setUrl(site.url);
    setProjectId(String(site.projectId));
    setAuthorized(false);
    setError('');
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    if (!editing && !projectId) {
      setError('Selecciona un proyecto.');
      return;
    }
    if (name.trim().length < 2) {
      setError('El nombre del sitio debe tener al menos 2 caracteres.');
      return;
    }
    if (!isHttpUrl(url.trim())) {
      setError('Ingresa una URL HTTP o HTTPS válida.');
      return;
    }
    if (needsAuthorization && !authorized) {
      setError(
        editing
          ? 'Cambiaste la URL: confirma que tienes autorización para evaluar la nueva dirección.'
          : 'Confirma la autorización antes de registrar el sitio.',
      );
      return;
    }

    const body = { name: name.trim(), url: url.trim() };
    if (needsAuthorization) body.authorizationConfirmed = true;
    const saved = await run(
      () =>
        editing
          ? api(`/sites/${editing.id}`, { method: 'PATCH', body })
          : api(`/projects/${projectId}/sites`, { method: 'POST', body }),
      editing ? 'Sitio actualizado.' : 'Sitio registrado.',
    );
    if (saved) resetForm();
  }

  function remove(site) {
    if (window.confirm(`¿Eliminar «${site.name}» y su historial asociado?`)) {
      run(() => api(`/sites/${site.id}`, { method: 'DELETE' }), 'Sitio eliminado.');
      if (editing?.id === site.id) resetForm();
    }
  }

  return (
    <div className="two-col layout-form">
      <section className="card">
        <SectionTitle
          title={editing ? `Editar sitio «${editing.name}»` : 'Registrar sitio'}
          description={
            editing
              ? 'Cambia el nombre o la dirección del sitio.'
              : 'Registrar una URL no ejecuta ningún análisis.'
          }
        />
        <form className="form-stack" onSubmit={submit} noValidate>
          <label htmlFor="site-project">Proyecto</label>
          <select
            id="site-project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
            disabled={!!editing}
            aria-describedby={editing ? 'site-project-help' : undefined}
          >
            <option value="">Seleccionar proyecto</option>
            {data.projects.map((project) => (
              <option value={project.id} key={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {editing && (
            <small id="site-project-help">El proyecto de un sitio no se puede cambiar.</small>
          )}

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
            aria-describedby={error ? 'site-help site-form-error' : 'site-help'}
          />
          <small id="site-help">
            Usa http:// o https://. Solo se pueden analizar direcciones públicas.
          </small>

          {needsAuthorization && (
            <label className="checkline">
              <input
                type="checkbox"
                checked={authorized}
                onChange={(e) => setAuthorized(e.target.checked)}
              />
              <span>
                {editing
                  ? 'Confirmo que cuento con autorización para evaluar la nueva dirección.'
                  : 'Confirmo que cuento con autorización para evaluar este sitio.'}
              </span>
            </label>
          )}

          {error && (
            <div className="field-error" role="alert" id="site-form-error">
              {error}
            </div>
          )}
          <div className="button-row">
            <button type="submit" className="btn primary">
              {editing ? 'Guardar cambios' : 'Registrar sitio'}
            </button>
            {editing && (
              <button type="button" className="btn secondary" onClick={resetForm}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <SectionTitle
          title={`Sitios registrados (${data.sites.length})`}
          description="Asociados a los proyectos guardados."
        />
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
                <div className="button-row">
                  <button
                    className="btn mini secondary"
                    onClick={() => startEditing(site)}
                    aria-label={`Editar el sitio ${site.name}`}
                  >
                    Editar
                  </button>
                  <button
                    className="btn mini danger"
                    onClick={() => remove(site)}
                    aria-label={`Eliminar el sitio ${site.name}`}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
