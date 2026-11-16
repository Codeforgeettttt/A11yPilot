
export default function Layout({ sidebar, topbar, menuOpen, onCloseMenu, overlay, children }) {
  return (
    <div className="shell">
      <a href="#main" className="skip-link">
        Saltar al contenido principal
      </a>
      {menuOpen && (
        <button className="sidebar-backdrop" onClick={onCloseMenu} aria-label="Cerrar menú" tabIndex={-1} />
      )}
      {sidebar}
      <div className="main-column">
        {topbar}
        {children}
        <footer className="footer">
          A11yPilot · Ingeniería Web II · Universidad Manuela Beltrán <span>Los resultados no certifican conformidad WCAG</span>
        </footer>
      </div>
      {overlay}
    </div>
  );
}