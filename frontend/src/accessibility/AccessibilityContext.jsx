import { createContext, useContext, useEffect, useState } from 'react';
const KEY='a11ypilot-accessibility-v1';
const defaults={contrast:false,font:100,spacing:false,reducedMotion:false};
const Context=createContext(null);
function initial(){try{const stored=JSON.parse(localStorage.getItem(KEY));return {...defaults,...stored,font:[100,115,130].includes(stored?.font)?stored.font:100}}catch{return defaults}}
export function AccessibilityProvider({children}){
 const [settings,setSettings]=useState(initial);
 useEffect(()=>{
   const root=document.documentElement;
   root.dataset.contrast=settings.contrast?'high':'normal';
   root.dataset.spacing=settings.spacing?'wide':'normal';
   root.dataset.motion=settings.reducedMotion?'reduce':'normal';
   root.style.setProperty('--font-multiplier',String(settings.font/100));
   localStorage.setItem(KEY,JSON.stringify(settings));
 },[settings]);
 return <Context.Provider value={{settings,set:(patch)=>setSettings(s=>({...s,...patch})),reset:()=>setSettings(defaults)}}>{children}</Context.Provider>;
}
export function useAccessibility(){const c=useContext(Context);if(!c)throw new Error('Falta AccessibilityProvider');return c}
