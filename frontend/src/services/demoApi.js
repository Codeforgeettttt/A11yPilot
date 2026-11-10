// Datos locales para recorrer el MVP sin SQL Server. Nunca representan un análisis real.
const KEY='a11ypilot-demo-browser-v1';
const now=()=>new Date().toISOString();
const samples=[
 {rule:'color-contrast',wcag:'1.4.3 Contraste (mínimo)',title:'Contraste insuficiente',description:'Ejemplo de texto con contraste insuficiente.',recommendation:'Revisar combinaciones de primer plano y fondo.',selector:'.hero__description',impact:'Serio'},
 {rule:'image-alt',wcag:'1.1.1 Contenido no textual',title:'Imagen sin texto alternativo',description:'Ejemplo de imagen informativa sin descripción.',recommendation:'Proporcionar un texto alternativo que transmita su función.',selector:'img.feature-image',impact:'Crítico'},
 {rule:'label',wcag:'1.3.1 Información y relaciones',title:'Campo sin etiqueta asociada',description:'Ejemplo de control sin nombre accesible.',recommendation:'Asociar una etiqueta visible al campo.',selector:'input#email',impact:'Serio'},
 {rule:'link-name',wcag:'2.4.4 Propósito de los enlaces',title:'Enlace ambiguo',description:'Ejemplo de enlace cuyo destino no resulta claro.',recommendation:'Utilizar un texto de enlace descriptivo.',selector:'a.read-more',impact:'Moderado'}
];
function fresh(){return {nextId:1,projects:[],sites:[],analyses:[],findings:[],updates:[]}}
function load(){try{const parsed=JSON.parse(localStorage.getItem(KEY));if(parsed&&Array.isArray(parsed.projects))return parsed}catch{}return fresh()}
function save(db){localStorage.setItem(KEY,JSON.stringify(db))}
function error(message){throw new Error(message)}
const id=()=>Number.parseInt(String(Math.random()*1e8),10);
function publicProjects(db){return [...db.projects].reverse()}
function getSite(db,siteId){return db.sites.find(s=>s.id===Number(siteId))}
function reportRows(db,analysis){const site=getSite(db,analysis.siteId);return {site,findings:db.findings.filter(f=>f.analysisId===analysis.id)}}
export function isDemoMode(){return sessionStorage.getItem('a11ypilot-demo-mode')==='yes'}
export function enableDemoMode(){sessionStorage.setItem('a11ypilot-demo-mode','yes')}
export function disableDemoMode(){sessionStorage.removeItem('a11ypilot-demo-mode')}
export async function demoApi(path,{method='GET',body={}}={}){
 const db=load(),chunks=path.split('/').filter(Boolean),saveAnd=(value)=>{save(db);return value};
 if(path==='/auth/me'&&method==='GET')return {user:{id:'demo',name:'Visitante de prueba',email:'demo@local.invalid'}};
 if(path==='/auth/me'&&method==='PATCH')return {user:{id:'demo',name:body.name||'Visitante de prueba',email:'demo@local.invalid'}};
 if(path==='/auth/logout'&&method==='POST'){disableDemoMode();return {message:'Sesión de demostración finalizada.'}}
 if(path==='/auth/change-password')error('La cuenta de demostración no tiene contraseña. Para probar esa función, conecta SQL Server y crea una cuenta real.');
 if(path==='/dashboard/summary')return {projects:db.projects.length,sites:db.sites.length,analyses:db.analyses.length,pendingFindings:db.findings.filter(f=>f.status==='Pendiente').length,demo:true};
 if(path==='/projects'&&method==='GET')return publicProjects(db);
 if(path==='/projects'&&method==='POST'){
  if(!body.name?.trim()||body.name.trim().length<3)error('El nombre del proyecto debe tener al menos tres caracteres.');
  return saveAnd(db.projects.push({id:++db.nextId,name:body.name.trim(),description:body.description||'',createdAt:now()})&&db.projects.at(-1));
 }
 if(chunks[0]==='projects'&&chunks[1]&&chunks.length===2){
  const project=db.projects.find(p=>p.id===Number(chunks[1]));if(!project)error('Proyecto no encontrado.');
  if(method==='GET')return {...project,Sites:db.sites.filter(s=>s.projectId===project.id)};
  if(method==='PATCH'){Object.assign(project,{name:body.name.trim(),description:body.description||''});return saveAnd(project)}
  if(method==='DELETE'){
   const siteIds=db.sites.filter(s=>s.projectId===project.id).map(s=>s.id);
   const analysisIds=db.analyses.filter(a=>siteIds.includes(a.siteId)).map(a=>a.id);
   db.projects=db.projects.filter(p=>p.id!==project.id);db.sites=db.sites.filter(s=>!siteIds.includes(s.id));db.analyses=db.analyses.filter(a=>!analysisIds.includes(a.id));db.findings=db.findings.filter(f=>!analysisIds.includes(f.analysisId));save(db);return null;
  }
 }
 if(chunks[0]==='projects'&&chunks[2]==='sites'){
  const project=db.projects.find(p=>p.id===Number(chunks[1]));if(!project)error('Proyecto no encontrado.');
  if(method==='GET')return db.sites.filter(s=>s.projectId===project.id);
  if(method==='POST'){
   if(body.authorizationConfirmed!==true)error('Confirma que tienes autorización.');
   let u;try{u=new URL(body.url)}catch{error('Ingresa una URL válida.')}if(!['http:','https:'].includes(u.protocol)||u.username||u.password)error('La URL debe utilizar HTTP o HTTPS y no contener credenciales.');
   const s={id:++db.nextId,projectId:project.id,name:body.name?.trim()||u.hostname,url:u.toString(),authorizationConfirmed:true,createdAt:now()};db.sites.push(s);return saveAnd(s);
  }
 }
 if(path==='/sites'&&method==='GET')return [...db.sites].reverse().map(s=>({...s,Project:db.projects.find(p=>p.id===s.projectId)}));
 if(chunks[0]==='sites'&&method==='DELETE'){
  const siteId=Number(chunks[1]),analyses=db.analyses.filter(a=>a.siteId===siteId).map(a=>a.id);
  db.sites=db.sites.filter(s=>s.id!==siteId);db.analyses=db.analyses.filter(a=>a.siteId!==siteId);db.findings=db.findings.filter(f=>!analyses.includes(f.analysisId));return saveAnd(null);
 }
 if(path==='/analyses/demo'&&method==='POST'){
  const site=getSite(db,body.siteId);if(!site)error('Selecciona un sitio válido.');if(body.authorizationConfirmed!==true)error('Debes confirmar la autorización.');
  const analysis={id:++db.nextId,siteId:site.id,status:'Completado',demo:true,createdAt:now()};db.analyses.push(analysis);
  for(const sample of samples)db.findings.push({...sample,id:++db.nextId,analysisId:analysis.id,status:'Pendiente',createdAt:now()});
  return saveAnd({id:analysis.id,status:analysis.status,demo:true,message:'Resultados locales simulados; no se visitó el sitio.'});
 }
 if(path==='/analyses'&&method==='GET')return [...db.analyses].reverse().map(a=>({...a,Site:getSite(db,a.siteId),findingCount:db.findings.filter(f=>f.analysisId===a.id).length}));
 if(chunks[0]==='analyses'&&chunks[1]){const a=db.analyses.find(a=>a.id===Number(chunks[1]));if(!a)error('Análisis no encontrado.');return {...a,Site:getSite(db,a.siteId),Findings:db.findings.filter(f=>f.analysisId===a.id)}}
 if(path==='/findings'&&method==='GET')return [...db.findings].reverse().map(f=>({...f,Analysis:{id:f.analysisId,siteId:db.analyses.find(a=>a.id===f.analysisId)?.siteId,Site:getSite(db,db.analyses.find(a=>a.id===f.analysisId)?.siteId)}}));
 if(chunks[0]==='findings'&&chunks[2]==='status'&&method==='PATCH'){
  const finding=db.findings.find(f=>f.id===Number(chunks[1]));if(!finding)error('Hallazgo no encontrado.');
  if(!['Pendiente','En revisión','Corregido por verificar','Verificado','No aplicable'].includes(body.status))error('Estado no válido.');
  const prev=finding.status;finding.status=body.status;db.updates.push({id:++db.nextId,findingId:finding.id,previousStatus:prev,newStatus:body.status,note:body.note||'',createdAt:now()});return saveAnd(finding);
 }
 if(chunks[0]==='findings'&&chunks[2]==='updates')return [...db.updates.filter(u=>u.findingId===Number(chunks[1]))].reverse();
 error('Esta operación no está disponible en el modo de demostración.');
}
export function demoReport(id){const db=load(),analysis=db.analyses.find(a=>a.id===Number(id));if(!analysis)error('No se encontró el análisis.');return {...analysis,...reportRows(db,analysis)}}
