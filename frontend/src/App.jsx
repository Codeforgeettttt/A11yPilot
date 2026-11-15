import {isDemoMode} from './services/demoApi.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Activity, Accessibility, ArrowRight, BarChart3, CheckCircle2, ChevronRight, ClipboardList, Download, FileText, Folder, Globe, History, LayoutDashboard, Menu, Plus, ScanSearch, Search, ShieldCheck, X } from 'lucide-react';
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
import { api, downloadReport } from './services/api.js';
import { submitAndRefresh } from './services/submitAndRefresh.js';
import { formatDate } from './utils/format.js';
import { Banner, Empty, IMPACTS, Loading, SectionTitle, StateTag, STATUSES, impactKind } from './components/Ui.jsx';

const NAV=[{id:'dashboard',name:'Resumen',icon:LayoutDashboard},{id:'projects',name:'Proyectos',icon:Folder},{id:'sites',name:'Sitios web',icon:Globe},{id:'analysis',name:'Nuevo análisis',icon:ScanSearch},{id:'findings',name:'Hallazgos',icon:ClipboardList},{id:'history',name:'Historial',icon:History},{id:'reports',name:'Reportes',icon:FileText},{id:'profile',name:'Mi cuenta',icon:ShieldCheck}];
function getIds(){const p=new URLSearchParams(location.search);return {page:NAV.some(x=>x.id===p.get('page'))?p.get('page'):'dashboard'}}
export function DashboardApp({user,onLogout,onUserUpdate}){
 const [page,setPage]=useState(getIds().page),[menuOpen,setMenuOpen]=useState(false),[accessOpen,setAccessOpen]=useState(false);
 const [data,setData]=useState({projects:[],sites:[],analyses:[],findings:[],summary:null}),[busy,setBusy]=useState(true);
 const [error,setError]=useState(''),[notice,setNotice]=useState('');
 const mainRef=useRef(null),menuRef=useRef(null),accessRef=useRef(null),previousFocus=useRef(null);
 const navigate=useCallback(id=>{setPage(id);setMenuOpen(false);const p=new URLSearchParams(location.search);p.set('page',id);history.pushState(null,'',`?${p.toString()}`);requestAnimationFrame(()=>mainRef.current?.focus());},[]);
 useEffect(()=>{const fn=()=>{setPage(getIds().page);requestAnimationFrame(()=>mainRef.current?.focus())};window.addEventListener('popstate',fn);return()=>window.removeEventListener('popstate',fn)},[]);
 const refresh=useCallback(async()=>{
   const results=await Promise.allSettled([api('/dashboard/summary'),api('/projects'),api('/sites'),api('/analyses'),api('/findings')]);
   if(results.some(r=>r.status==='rejected'))throw new Error(results.find(r=>r.status==='rejected').reason.message);
   const [summary,projects,sites,analyses,findings]=results.map(r=>r.value);
   setData({summary,projects,sites,analyses,findings});
 },[]);
 useEffect(()=>{let live=true;setBusy(true);refresh().catch(e=>{if(live)setError(e.message)}).finally(()=>{if(live)setBusy(false)});return()=>{live=false}},[refresh]);
 async function run(action,success){setError('');setNotice('');return submitAndRefresh(action,refresh,setNotice,setError,success)}
 function openAccess(){previousFocus.current=document.activeElement;setAccessOpen(true)}
 function closeAccess(){setAccessOpen(false);requestAnimationFrame(()=>previousFocus.current?.focus())}
 function selectPage(id){navigate(id)}
 useEffect(()=>{if(!menuOpen)return;function onKey(e){if(e.key==='Escape'){setMenuOpen(false);menuRef.current?.focus()}}window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[menuOpen]);
 const selected=NAV.find(n=>n.id===page)||NAV[0];
  useEffect(()=>{document.title=`${selected.name} · A11yPilot`},[selected]);
  const closeMenu=()=>{setMenuOpen(false);menuRef.current?.focus()};
 return <Layout
   menuOpen={menuOpen}
   onCloseMenu={closeMenu}
   overlay={accessOpen&&<AccessibilityPanel onClose={closeAccess}/>}
   sidebar={<Sidebar items={NAV} page={page} open={menuOpen} onClose={closeMenu} onSelect={selectPage}/>}
   topbar={<Topbar title={selected.name} user={user} menuOpen={menuOpen} menuButtonRef={menuRef} accessButtonRef={accessRef} onToggleMenu={()=>setMenuOpen(x=>!x)} onOpenAccess={openAccess} onLogout={onLogout}/>}
 >
   <main id="main" tabIndex={-1} ref={mainRef} className="main-content"><div className="page-head"><p className="eyebrow">GESTIÓN DE ACCESIBILIDAD WEB</p><h1>{selected.name}</h1><p className="lede">{page==='dashboard'?'Consulta el estado de tus proyectos y los análisis registrados.':page==='analysis'?'Prueba el proceso de evaluación con hallazgos de demostración.':page==='projects'?'Organiza los sitios que necesitas revisar.':page==='sites'?'Administra las direcciones autorizadas para evaluar.':page==='findings'?'Revisa los problemas detectados y registra el avance de su corrección.':page==='history'?'Consulta las ejecuciones guardadas en el sistema.':page==='profile'?'Consulta y actualiza tu perfil y contraseña.':'Descarga los resultados de tus análisis de demostración.'}</p></div>
    <div className="demo-strip"><ShieldCheck size={18} aria-hidden="true"/><span><strong>{isDemoMode()?'Modo de prueba local: los proyectos y seguimientos se guardan en este navegador. No utiliza SQL Server. Ningún sitio se analiza realmente.':'Entorno de desarrollo: los proyectos se guardan en SQL Server, pero los hallazgos son ejemplos. Ningún sitio se analiza realmente.'}</strong></span></div>
    {error&&<Banner kind="error" onClose={()=>setError('')}>{error} <button className="inline-link" onClick={()=>run(async()=>{},'Datos actualizados correctamente.')}>Reintentar conexión</button></Banner>}
    {notice&&<Banner kind="success" onClose={()=>setNotice('')}>{notice}</Banner>}
    {busy?<Loading/>:page==='dashboard'?<Dashboard data={data} go={navigate}/>:page==='projects'?<Projects data={data} run={run}/>:page==='sites'?<Sites data={data} run={run}/>:page==='analysis'?<NewAnalysis data={data} run={run} navigate={navigate}/>:page==='findings'?<Findings data={data} run={run}/>:page==='history'?<HistoryPage data={data} navigate={navigate}/>:page==='profile'?<Profile user={user} onUserUpdate={onUserUpdate} onLogout={onLogout}/>:<Reports data={data} run={run}/>}
      </main> 
       </Layout>
}
function Profile({user,onUserUpdate,onLogout}){
 const [name,setName]=useState(user.name),[current,setCurrent]=useState(''),[next,setNext]=useState(''),[confirm,setConfirm]=useState(''),[error,setError]=useState(''),[success,setSuccess]=useState(''),[saving,setSaving]=useState(false);
 async function update(event){event.preventDefault();setSaving(true);setError('');setSuccess('');try{const r=await api('/auth/me',{method:'PATCH',body:{name}});onUserUpdate(r.user);setSuccess('Perfil actualizado.')}catch(e){setError(e.message)}finally{setSaving(false)}}
 async function change(event){event.preventDefault();setSaving(true);setError('');setSuccess('');try{if(next!==confirm)throw Error('Las contraseñas no coinciden.');await api('/auth/change-password',{method:'POST',body:{currentPassword:current,newPassword:next}});setCurrent('');setNext('');setConfirm('');setSuccess('Contraseña actualizada. Las otras sesiones quedaron cerradas.')}catch(e){setError(e.message)}finally{setSaving(false)}}
 return <div className="two-col layout-form"><section className="card"><SectionTitle title="Datos de tu cuenta" description="En modo de prueba, los datos solo se guardan en este navegador. No es una cuenta real."/>{error&&<p role="alert" className="field-error">{error}</p>}{success&&<p role="status" className="notice-text">{success}</p>}<form className="form-stack" onSubmit={update}><label htmlFor="profile-name">Nombre</label><input id="profile-name" autoComplete="name" value={name} onChange={e=>setName(e.target.value)} required minLength={2} maxLength={120}/><label htmlFor="profile-email">Correo registrado</label><input id="profile-email" type="email" value={user.email} disabled aria-describedby="fixed-email"/><small id="fixed-email">En esta fase el correo no puede cambiarse.</small><button className="btn primary" disabled={saving}>Guardar cambios</button></form></section><section className="card"><SectionTitle title="Seguridad" description="Actualiza tu contraseña. Debe tener al menos 12 caracteres."/><form className="form-stack" onSubmit={change}><label htmlFor="profile-current">Contraseña actual</label><input id="profile-current" type="password" autoComplete="current-password" required value={current} onChange={e=>setCurrent(e.target.value)}/><label htmlFor="profile-next">Nueva contraseña</label><input id="profile-next" type="password" autoComplete="new-password" required minLength={12} value={next} onChange={e=>setNext(e.target.value)}/><label htmlFor="profile-confirm">Confirmar nueva contraseña</label><input id="profile-confirm" type="password" autoComplete="new-password" required minLength={12} value={confirm} onChange={e=>setConfirm(e.target.value)}/><button className="btn secondary" disabled={saving}>Cambiar contraseña</button></form><button className="inline-link profile-logout" onClick={onLogout}>Cerrar sesión en este dispositivo</button></section></div>
}
