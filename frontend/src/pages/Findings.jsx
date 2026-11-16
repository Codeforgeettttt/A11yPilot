import { useState } from 'react';
import { Empty, IMPACTS, SectionTitle, StateTag, STATUSES, impactKind } from '../components/Ui.jsx';
import { api } from '../services/api.js';

/**
 * Página de Hallazgos: buscar, filtrar por impacto y estado, ver el detalle
 * de cada problema y registrar su seguimiento.
 * - data: datos de la app (aquí se usa data.findings).
 * - run: ejecuta una acción y luego actualiza los datos.
 */
export default function Findings({ data, run }) {
  const [search, setSearch] = useState('');
  const [impact, setImpact] = useState('Todos');
  const [status, setStatus] = useState('Todos');
    // Si la URL trae ?analysis=8, empezamos mostrando solo ese análisis.
  const [analysisFilter, setAnalysisFilter] = useState(
    () => new URLSearchParams(window.location.search).get('analysis') ?? 'Todos',
  );
  const [expanded, setExpanded] = useState({});
  const [draftNotes, setDraftNotes] = useState({});

  // Hallazgos que cumplen los tres filtros a la vez.
  const filtered = data.findings.filter(
    (finding) =>
      (impact === 'Todos' || finding.impact === impact) &&
      (status === 'Todos' || finding.status === status) &&
      (analysisFilter === 'Todos' || String(finding.analysisId) === analysisFilter) &&
      `${finding.title} ${finding.rule} ${finding.wcag || ''} ${finding.site?.name || ''}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  function toggle(id) {
    setExpanded((current) => ({ ...current, [id]: !current[id] }));
  }

  function updateStatus(finding, newStatus, note = '') {
    return run(
      () => api(`/findings/${finding.id}/status`, { method: 'PATCH', body: { status: newStatus, note } }),
      note ? 'Observación guardada.' : 'Seguimiento actualizado.',
    );
  }

  return (
    <section className="card">
      <SectionTitle
        title={`Hallazgos (${filtered.length})`}
        description="Filtra los hallazgos y registra el avance de su corrección."
      />

      <div className="filters">
                <label className="filter">
          <span>Análisis</span>
          <select value={analysisFilter} onChange={(e) => setAnalysisFilter(e.target.value)}>
            <option value="Todos">Todos</option>
            {data.analyses.map((analysis) => (
              <option key={analysis.id} value={String(analysis.id)}>
                #{analysis.id} · {analysis.Site?.name || 'Sitio'}
              </option>
            ))}
          </select>
        </label>
        <label className="filter">
          <span>Buscar</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Regla, descripción o sitio"
          />
        </label>
        <label className="filter">
          <span>Impacto</span>
          <select value={impact} onChange={(e) => setImpact(e.target.value)}>
            <option>Todos</option>
            {IMPACTS.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label className="filter">
          <span>Estado</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Todos</option>
            {STATUSES.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <Empty>No hay hallazgos con esos filtros. Prueba otra búsqueda.</Empty>
      ) : (
        <div className="findings">
          {filtered.map((finding) => (
            <article key={finding.id} className="finding">
              <div className="finding-top">
                <div>
                  <span className="eyebrow">
                    {finding.rule} · {finding.wcag || 'Sin criterio asignado'}
                  </span>
                  <h3>{finding.title}</h3>
                  <p>{finding.description}</p>
                </div>
                <StateTag kind={impactKind(finding.impact)}>{finding.impact}</StateTag>
              </div>
              <p className="muted">
                {finding.Analysis?.Site?.name || 'Sitio'} · Análisis #{finding.analysisId}
              </p>

              <button
                className="inline-link"
                aria-expanded={!!expanded[finding.id]}
                aria-controls={`finding-extra-${finding.id}`}
                onClick={() => toggle(finding.id)}
              >
                {expanded[finding.id] ? 'Ocultar detalles' : 'Ver detalle y seguimiento'}
              </button>

              {expanded[finding.id] && (
                <div id={`finding-extra-${finding.id}`} className="finding-extra">
                  <p>
                    <strong>Recomendación:</strong> {finding.recommendation}
                  </p>
                  <p>
                    <strong>Elemento afectado:</strong> <code>{finding.selector || 'No disponible'}</code>
                  </p>
                  <div className="finding-editor">
                    <label htmlFor={`finding-state-${finding.id}`}>Estado</label>
                    <select
                      id={`finding-state-${finding.id}`}
                      value={finding.status}
                      onChange={(e) => updateStatus(finding, e.target.value)}
                    >
                      {STATUSES.map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                    <label htmlFor={`finding-note-${finding.id}`}>Observación (opcional)</label>
                    <textarea
                      id={`finding-note-${finding.id}`}
                      maxLength="500"
                      rows="2"
                      value={draftNotes[finding.id] ?? ''}
                      onChange={(e) => setDraftNotes((current) => ({ ...current, [finding.id]: e.target.value }))}
                      placeholder="Ej. Se revisó el componente de navegación"
                    />
                    <button
                      className="btn mini secondary"
                      onClick={() => updateStatus(finding, finding.status, draftNotes[finding.id] || '')}
                    >
                      Guardar observación
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}