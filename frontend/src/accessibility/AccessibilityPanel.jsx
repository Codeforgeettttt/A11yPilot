import { useEffect, useRef } from 'react';
import { Accessibility, RotateCcw, X } from 'lucide-react';
import { useAccessibility } from './AccessibilityContext.jsx';
export default function AccessibilityPanel({onClose}){
 const {settings,set,reset}=useAccessibility();const ref=useRef(null);const closeRef=useRef(null);
 useEffect(()=>{closeRef.current?.focus();function keys(event){if(event.key==='Escape')onClose();if(event.key==='Tab'){
   const all=[...ref.current.querySelectorAll('button,input,select,[tabindex]:not([tabindex="-1"])')].filter(x=>!x.disabled);
   const first=all[0],last=all.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
 }}document.addEventListener('keydown',keys);return()=>document.removeEventListener('keydown',keys)},[onClose]);
 return <div className="dialog-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <section className="access-dialog" role="dialog" aria-modal="true" aria-labelledby="access-heading" ref={ref}>
   <div className="dialog-head"><h2 id="access-heading"><Accessibility aria-hidden="true"/> Preferencias de accesibilidad</h2><button ref={closeRef} className="icon-button" aria-label="Cerrar preferencias" onClick={onClose}><X/></button></div>
   <p>Estos ajustes se aplican a toda la interfaz y se guardan en este navegador.</p>
   <label className="toggle"><input type="checkbox" checked={settings.contrast} onChange={e=>set({contrast:e.target.checked})}/><span><strong>Alto contraste</strong><small>Colores y bordes más definidos</small></span></label>
   <label className="control-stack" htmlFor="font-size">Tamaño del texto<select id="font-size" value={settings.font} onChange={e=>set({font:Number(e.target.value)})}><option value="100">Normal (100%)</option><option value="115">Grande (115%)</option><option value="130">Muy grande (130%)</option></select></label>
   <label className="toggle"><input type="checkbox" checked={settings.spacing} onChange={e=>set({spacing:e.target.checked})}/><span><strong>Espaciado de lectura</strong><small>Más espacio entre líneas y letras</small></span></label>
   <label className="toggle"><input type="checkbox" checked={settings.reducedMotion} onChange={e=>set({reducedMotion:e.target.checked})}/><span><strong>Reducir movimiento</strong><small>Evita animaciones no esenciales</small></span></label>
   <div className="dialog-actions"><button className="btn secondary" onClick={reset}><RotateCcw size={17} aria-hidden="true"/> Restablecer</button><button className="btn primary" onClick={onClose}>Listo</button></div>
  </section>
 </div>;
}
