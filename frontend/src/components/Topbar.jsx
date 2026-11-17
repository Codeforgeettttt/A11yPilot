import { Accessibility, ChevronRight, Menu } from 'lucide-react';

/**
 * Barra superior del panel.
 * - title: nombre de la sección actual.
 * - user: usuario conectado (nombre y correo).
 * - menuOpen: si el menú lateral está abierto (en móvil).
 * - menuButtonRef / accessButtonRef: referencias a los botones, para devolverles
 *   el foco del teclado al cerrar el menú o el panel de accesibilidad.
 * - onToggleMenu, onOpenAccess, onLogout: qué hacer al pulsar cada botón.
 */
export default function Topbar({
  title,
  user,
  menuOpen,
  menuButtonRef,
  accessButtonRef,
  onToggleMenu,
  onOpenAccess,
  onLogout,
}) {
  return (
    <header className="topbar">
      <button
        ref={menuButtonRef}
        className="icon-button menu-toggle"
        onClick={onToggleMenu}
        aria-controls="primary-sidebar"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        <Menu />
      </button>

      <div className="breadcrumb">
        A11yPilot <ChevronRight size={15} aria-hidden="true" />
        <strong>{title}</strong>
      </div>

      <span className="topbar-user" title={user.email}>
        Cuenta: {user.name}
      </span>

      {/* aria-label: en móviles el texto se oculta y solo queda el icono; así el botón conserva su nombre. */}
      <button
        ref={accessButtonRef}
        className="btn access-button"
        onClick={onOpenAccess}
        aria-label="Preferencias de accesibilidad"
        aria-haspopup="dialog"
      >
        <Accessibility size={19} aria-hidden="true" />
        <span>Accesibilidad</span>
      </button>

      <button className="btn secondary logout-button" onClick={onLogout}>
        Salir
      </button>
    </header>
  );
}
