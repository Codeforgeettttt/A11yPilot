import {useEffect,useState} from 'react';
import {LockKeyhole,Mail,UserRound,ArrowLeft,ShieldCheck} from 'lucide-react';
import {api} from './services/api.js';
export default function Auth({onAuthenticated,onDemo}){
 const token=new URLSearchParams(window.location.search).get('reset');
 const [mode,setMode]=useState(token?'reset':'login');
 const [name,setName]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[confirm,setConfirm]=useState(''),[error,setError]=useState(''),[notice,setNotice]=useState(''),[devLink,setDevLink]=useState(''),[busy,setBusy]=useState(false);
 useEffect(()=>{if(token)setMode('reset')},[token]);
 const change=next=>{setMode(next);setError('');setNotice('');setDevLink('');setPassword('');setConfirm('')};
 async function submit(event){event.preventDefault();setError('');setNotice('');setBusy(true);
  try{
   if(mode==='register'){
    if(password!==confirm)throw Error('Las contraseñas no coinciden.');
    const response=await api('/auth/register',{method:'POST',body:{name,email,password}});onAuthenticated(response.user);return;
   }
   if(mode==='login'){const response=await api('/auth/login',{method:'POST',body:{email,password}});onAuthenticated(response.user);return;}
   if(mode==='forgot'){
    const response=await api('/auth/forgot-password',{method:'POST',body:{email}});setNotice(response.message);setDevLink(response.devResetLink||'');return;
   }
   if(mode==='reset'){
    if(password!==confirm)throw Error('Las contraseñas no coinciden.');
    const response=await api('/auth/reset-password',{method:'POST',body:{token,password}});window.history.replaceState(null,'','/');setNotice(response.message);setMode('login');setPassword('');setConfirm('');return;
   }
  }catch(e){setError(e.message)}finally{setBusy(false)}
 }
 return <div className="auth-layout"><a className="skip-link" href="#auth-main">Saltar al formulario</a><div className="auth-side"><img alt="A11yPilot" src="/assets/logos/a11ypilot-logo.webp" width="110" height="110"/><h1>A11yPilot</h1><p>Organiza tus proyectos, revisa hallazgos y conserva tus informes de demostración en tu propia cuenta.</p><p className="auth-side-note"><ShieldCheck aria-hidden="true"/> Primera fase académica. Los análisis son simulados.</p></div><main id="auth-main" className="auth-content"><div className="auth-card"><h2>{mode==='login'?'Iniciar sesión':mode==='register'?'Crear cuenta':mode==='forgot'?'Recuperar acceso':'Nueva contraseña'}</h2><p>{mode==='login'?'Accede a tus proyectos y reportes.':mode==='register'?'Crea tu espacio de trabajo.':mode==='forgot'?'Te enviaremos instrucciones si el correo está registrado.':'El enlace solo se puede utilizar una vez y vence en 15 minutos.'}</p>
 {error&&<p role="alert" className="field-error">{error}</p>}{notice&&<p role="status" className="notice-text">{notice}</p>}
 {devLink&&<p className="notice-text"><strong>Solo desarrollo local:</strong> <a href={devLink}>Abrir enlace de recuperación</a>. No habilitar esta opción en producción.</p>}
 <form className="form-stack" onSubmit={submit}>
 {mode==='register'&&<><label htmlFor="auth-name">Nombre</label><input id="auth-name" autoComplete="name" required minLength={2} maxLength={120} value={name} onChange={e=>setName(e.target.value)}/></>}
 {mode!=='reset'&&<><label htmlFor="auth-email">Correo electrónico</label><input id="auth-email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)}/></>}
 {mode!=='forgot'&&<><label htmlFor="auth-password">{mode==='reset'?'Nueva contraseña':'Contraseña'}</label><input id="auth-password" type="password" required minLength={mode==='login'?1:12} maxLength={128} autoComplete={mode==='login'?'current-password':'new-password'} value={password} onChange={e=>setPassword(e.target.value)}/>{mode!=='login'&&<><small>Utiliza al menos 12 caracteres.</small><label htmlFor="auth-confirm">Confirmar contraseña</label><input id="auth-confirm" type="password" autoComplete="new-password" required minLength={12} value={confirm} onChange={e=>setConfirm(e.target.value)}/></>}</>}
 <button className="btn primary" type="submit" disabled={busy}>{busy?'Procesando…':mode==='register'?'Crear cuenta':mode==='forgot'?'Solicitar recuperación':mode==='reset'?'Cambiar contraseña':'Entrar'}</button></form>
 <div className="auth-switch">{mode==='login'&&<button type="button" className="btn secondary" onClick={onDemo}>Entrar en modo de prueba (sin SQL Server)</button>}{mode==='login'?<><button className="inline-link" onClick={()=>change('register')}>Crear una cuenta</button><button className="inline-link" onClick={()=>change('forgot')}>Olvidé mi contraseña</button></>:<button className="inline-link" onClick={()=>change('login')}><ArrowLeft size={16} aria-hidden="true"/> Volver a iniciar sesión</button>}</div>
 </div></main></div>
}
