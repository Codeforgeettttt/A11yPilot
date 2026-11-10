export function Banner({children,kind='info',onClose}){return <div className={`banner ${kind}`} role={kind==='error'?'alert':'status'}><div>{children}</div>{onClose&&<button className="icon-button" onClick={onClose} aria-label="Cerrar aviso">×</button>}</div>}
export function Loading({label='Cargando información…'}){return <div className="loading" role="status"><span className="spinner" aria-hidden="true"/>{label}</div>}
export function Empty({children}){return <div className="empty">{children}</div>}
export function StateTag({children,kind='info'}){return <span className={`state-tag ${kind}`}>{children}</span>}
export function SectionTitle({title,description,action}){return <div className="section-head"><div><h2>{title}</h2>{description&&<p>{description}</p>}</div>{action}</div>}
export const IMPACTS=['Crítico','Serio','Moderado','Menor'];
export const STATUSES=['Pendiente','En revisión','Corregido por verificar','Verificado','No aplicable'];
export function impactKind(v){return v==='Crítico'?'error':v==='Serio'?'warning':v==='Moderado'?'info':'muted'}
