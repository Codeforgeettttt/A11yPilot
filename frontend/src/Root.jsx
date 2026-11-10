import {useEffect,useState} from 'react';
import Auth from './Auth.jsx';
import {DashboardApp} from './App.jsx';
import {api} from './services/api.js';
import {isDemoMode,enableDemoMode,disableDemoMode} from './services/demoApi.js';
export default function Root(){
 const [user,setUser]=useState(null),[loading,setLoading]=useState(!isDemoMode());
 useEffect(()=>{if(isDemoMode()){setUser({id:'demo',name:'Visitante de prueba',email:'demo@local.invalid'});setLoading(false);return;}let mounted=true;api('/auth/me').then(r=>{if(mounted)setUser(r.user)}).catch(()=>{}).finally(()=>{if(mounted)setLoading(false)});const ended=()=>setUser(null);window.addEventListener('a11y-session-ended',ended);return()=>{mounted=false;window.removeEventListener('a11y-session-ended',ended)}},[]);
 async function logout(){try{await api('/auth/logout',{method:'POST'})}finally{disableDemoMode();setUser(null);window.history.replaceState(null,'','/')}}
 function enterDemo(){enableDemoMode();setUser({id:'demo',name:'Visitante de prueba',email:'demo@local.invalid'});setLoading(false)}
 if(loading)return <div className="auth-loading" role="status">Comprobando sesión…</div>;
 return user?<DashboardApp key={user.id} user={user} onUserUpdate={setUser} onLogout={logout}/>:<Auth onAuthenticated={setUser} onDemo={enterDemo}/>;
}
