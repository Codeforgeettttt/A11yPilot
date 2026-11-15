import { X } from 'lucide-react';

/**
 * Menú lateral del panel.
 * - items: lista de secciones (id, nombre e icono).
 * - page: sección que está abierta ahora.
 * - open: si el menú está abierto (en móvil).
 * - onClose: qué hacer al cerrar el menú.
 * - onSelect: qué hacer al elegir una sección.
 */
export default function Sidebar({ items, page, open, onClose, onSelect }) {
  return (
    <aside id="primary-sidebar" className={`sidebar ${open ? 'open' : ''}`} aria-label="Menú lateral">
      <div className="brand">
        <img src="/assets/logos/a11ypilot-logo.webp" alt="" width="52" height="52" />
        <span>
          <strong>A11yPilot</strong>
          <small>Panel de accesibilidad</small>
        </span>
        <button className="icon-button mobile-close" aria-label="Cerrar menú" onClick={onClose}>
          <X />
        </button>
      </div>

      <nav aria-label="Navegación principal">
        {items.map(({ id, name, icon: Icon }) => (
          <a
            key={id}
            href={`?page=${id}`}
            className={`nav-link ${page === id ? 'active' : ''}`}
            aria-current={page === id ? 'page' : undefined}
            onClick={(event) => {
              // Con Ctrl, Cmd o Shift + clic, o con clic central: dejar que el navegador abra otra pestaña.
              if (event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
              event.preventDefault();
              onSelect(id);
            }}
          >
            <Icon size={19} aria-hidden="true" />
            <span>{name}</span>
          </a>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <span className="demo-label">
          <span className="dot" /> MVP académico · 0.6.2
        </span>
        <p>Los análisis de esta versión son simulados.</p>
      </div>
    </aside>
  );
}