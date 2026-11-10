export function validUrl(value){
 if(typeof value!=='string'||value.length>500||value.trim()!==value)return false;
 try{const url=new URL(value);return ['http:','https:'].includes(url.protocol)&&Boolean(url.hostname)&&!url.username&&!url.password}catch{return false}
}
export function textField(value,min,max){return typeof value==='string'&&value.trim().length>=min&&value.trim().length<=max}
export function intId(value){const n=Number(value);return Number.isSafeInteger(n)&&n>0?n:null}
export const allowedStatuses=['Pendiente','En revisión','Corregido por verificar','Verificado','No aplicable'];
export function bad(message,status=400){const e=new Error(message);e.status=status;return e}
