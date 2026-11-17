import { isDemoMode } from './services/demoApi.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { NAV, getPageFromUrl } from './config/navigation.js';
import AccessibilityPanel from './accessibility/AccessibilityPanel.jsx';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Projects from './pages/Projects.jsx';
import Sites from './pages/Sites.jsx';
import NewAnalysis from './pages/NewAnalysis.jsx';
import Findings from './pages/Findings.jsx';
import HistoryPage from './pages/History.jsx';
import Reports from './pages/Reports.jsx';
import Profile from './pages/Profile.jsx';
import { api } from './services/api.js';
import { submitAndRefresh } from './services/submitAndRefresh.js';
import { Banner, Loading } from './components/Ui.jsx';

export function DashboardApp({ user, onLogout, onUserUpdate }) {
  const [page, setPage] = useState(getPageFromUrl()),
    [menuOpen, setMenuOpen] = useState(false),
    [accessOpen, setAccessOpen] = useState(false);
  const [data, setData] = useState({
      projects: [],
      sites: [],
      analyses: [],
      findings: [],
      summary: null,
    }),
    [busy, setBusy] = useState(true);
  const [error, setError] = useState(''),
    [notice, setNotice] = useState('');
  const mainRef = useRef(null),
    menuRef = useRef(null),
    accessRef = useRef(null),
    previousFocus = useRef(null);
  const navigate = useCallback((id, params = {}) => {
    setPage(id);
    setMenuOpen(false);
    const p = new URLSearchParams({ page: id, ...params });
    history.pushState(null, '', `?${p.toString()}`);
    requestAnimationFrame(() => mainRef.current?.focus());
  }, []);
  useEffect(() => {
    const fn = () => {
      setPage(getPageFromUrl());
      requestAnimationFrame(() => mainRef.current?.focus());
    };
    window.addEventListener('popstate', fn);
    return () => window.removeEventListener('popstate', fn);
  }, []);
  const refresh = useCallback(async () => {
    const results = await Promise.allSettled([
      api('/dashboard/summary'),
      api('/projects'),
      api('/sites'),
      api('/analyses'),
      api('/findings'),
    ]);
    if (results.some((r) => r.status === 'rejected'))
      throw new Error(results.find((r) => r.status === 'rejected').reason.message);
    const [summary, projects, sites, analyses, findings] = results.map((r) => r.value);
    setData({ summary, projects, sites, analyses, findings });
  }, []);
  useEffect(() => {
    let live = true;
    setBusy(true);
    refresh()
      .catch((e) => {
        if (live) setError(e.message);
      })
      .finally(() => {
        if (live) setBusy(false);
      });
    return () => {
      live = false;
    };
  }, [refresh]);
  async function run(action, success) {
    setError('');
    setNotice('');
    return submitAndRefresh(action, refresh, setNotice, setError, success);
  }
  function openAccess() {
    previousFocus.current = document.activeElement;
    setAccessOpen(true);
  }
  function closeAccess() {
    setAccessOpen(false);
    requestAnimationFrame(() => previousFocus.current?.focus());
  }
  function selectPage(id) {
    navigate(id);
  }
  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);
  const selected = NAV.find((n) => n.id === page) || NAV[0];
  useEffect(() => {
    document.title = `${selected.name} · A11yPilot`;
  }, [selected]);
  const closeMenu = () => {
    setMenuOpen(false);
    menuRef.current?.focus();
  };
  return (
    <Layout
      menuOpen={menuOpen}
      onCloseMenu={closeMenu}
      overlay={accessOpen && <AccessibilityPanel onClose={closeAccess} />}
      sidebar={
        <Sidebar
          items={NAV}
          page={page}
          open={menuOpen}
          demo={isDemoMode()}
          onClose={closeMenu}
          onSelect={selectPage}
        />
      }
      topbar={
        <Topbar
          title={selected.name}
          user={user}
          menuOpen={menuOpen}
          menuButtonRef={menuRef}
          accessButtonRef={accessRef}
          onToggleMenu={() => setMenuOpen((x) => !x)}
          onOpenAccess={openAccess}
          onLogout={onLogout}
        />
      }
    >
      <main id="main" tabIndex={-1} ref={mainRef} className="main-content">
        <div className="page-head">
          <p className="eyebrow">GESTIÓN DE ACCESIBILIDAD WEB</p>
          <h1>{selected.name}</h1>
          <p className="lede">{selected.lede}</p>
        </div>
        <div className="demo-strip">
          <ShieldCheck size={18} aria-hidden="true" />
          <span>
            <strong>
              {isDemoMode()
                ? 'Modo de prueba local: los proyectos y seguimientos se guardan en este navegador. No utiliza SQL Server. Ningún sitio se analiza realmente.'
                : 'Modo completo: los análisis visitan el sitio y lo revisan con axe-core. Los resultados no certifican conformidad WCAG.'}
            </strong>
          </span>
        </div>
        {error && (
          <Banner kind="error" onClose={() => setError('')}>
            {error}{' '}
            <button
              className="inline-link"
              onClick={() => run(async () => {}, 'Datos actualizados correctamente.')}
            >
              Reintentar conexión
            </button>
          </Banner>
        )}
        {notice && (
          <Banner kind="success" onClose={() => setNotice('')}>
            {notice}
          </Banner>
        )}
        {busy ? (
          <Loading />
        ) : page === 'dashboard' ? (
          <Dashboard data={data} go={navigate} />
        ) : page === 'projects' ? (
          <Projects data={data} run={run} />
        ) : page === 'sites' ? (
          <Sites data={data} run={run} />
        ) : page === 'analysis' ? (
          <NewAnalysis data={data} run={run} navigate={navigate} />
        ) : page === 'findings' ? (
          <Findings data={data} run={run} />
        ) : page === 'history' ? (
          <HistoryPage data={data} navigate={navigate} />
        ) : page === 'profile' ? (
          <Profile user={user} onUserUpdate={onUserUpdate} onLogout={onLogout} />
        ) : (
          <Reports data={data} run={run} />
        )}
      </main>
    </Layout>
  );
}
