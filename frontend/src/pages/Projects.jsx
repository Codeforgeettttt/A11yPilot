import { useState } from 'react';
import { Empty, SectionTitle } from '../components/Ui.jsx';
import { api } from '../services/api.js';

/**
 * Página de Proyectos: crear, editar, buscar y eliminar proyectos.
 * - data: datos de la app (aquí se usa data.projects).
 * - run: ejecuta una acción (guardar, borrar) y luego actualiza los datos.
 */
export default function Projects({ data, run }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);

  // Proyectos que coinciden con el texto del buscador.
  const shown = data.projects.filter((project) =>
    `${project.name} ${project.description || ''}`.toLowerCase().includes(query.toLowerCase()),
  );

  function resetForm() {
    setEditing(null);
    setName('');
    setDescription('');
  }

  function startEditing(project) {
    setEditing(project.id);
    setName(project.name);
    setDescription(project.description || '');
  }

  async function submit(event) {
    event.preventDefault();
    const saved = await run(
      () =>
        api(editing ? `/projects/${editing}` : '/projects', {
          method: editing ? 'PATCH' : 'POST',
          body: { name: name.trim(), description: description.trim() },
        }),
      editing ? 'Proyecto actualizado.' : 'Proyecto creado.',
    );
    if (saved) resetForm();
  }

  function remove(project) {
    const confirmed = window.confirm(
      `¿Eliminar «${project.name}»? También se eliminarán sus sitios y análisis asociados.`,
    );
    if (confirmed) run(() => api(`/projects/${project.id}`, { method: 'DELETE' }), 'Proyecto eliminado.');
  }

  return (
    <div className="two-col layout-form">
      <section className="card">
        <SectionTitle
          title={editing ? 'Editar proyecto' : 'Nuevo proyecto'}
          description="La información se guarda en el navegador en modo de prueba; con backend, en SQL Server."
        />
        <form onSubmit={submit} className="form-stack">
          <label htmlFor="project-name">Nombre del proyecto</label>
          <input
            id="project-name"
            required
            minLength="3"
            maxLength="120"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Portal de servicios"
          />
          <label htmlFor="project-desc">Descripción (opcional)</label>
          <textarea
            id="project-desc"
            maxLength="700"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Qué sitio o producto se revisará"
          />
          <div className="button-row">
            <button className="btn primary" type="submit">
              {editing ? 'Guardar cambios' : 'Crear proyecto'}
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
        <SectionTitle title={`Proyectos (${shown.length})`} description="Selecciona editar o elimina con confirmación." />
        <label htmlFor="project-search">Buscar proyectos</label>
        <input
          id="project-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nombre del proyecto"
        />
        {shown.length === 0 ? (
          <Empty>No hay proyectos que coincidan con la búsqueda.</Empty>
        ) : (
          <div className="record-list">
            {shown.map((project) => (
              <div className="record record-stack" key={project.id}>
                <div>
                  <strong>{project.name}</strong>
                  <p>{project.description || 'Sin descripción'}</p>
                </div>
                <div className="button-row">
                  <button className="btn mini secondary" onClick={() => startEditing(project)}>
                    Editar
                  </button>
                  <button className="btn mini danger" onClick={() => remove(project)}>
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