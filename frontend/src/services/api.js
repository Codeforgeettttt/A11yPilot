import {isDemoMode,demoApi,demoReport} from './demoApi.js';
const BASE = import.meta.env.VITE_API_URL || '/api';
export async function api(path, {method='GET', body, ...options}={}) {
  if(isDemoMode())return demoApi(path,{method,body});
  let response;
  try {
    response=await fetch(BASE+path, {method, credentials:'include', headers:{...(body?{'Content-Type':'application/json'}:{}), ...options.headers}, ...(body?{body:JSON.stringify(body)}:{}), signal:options.signal});
  } catch {throw new Error('No se pudo conectar con la API. Verifica que el backend y SQL Server estén iniciados.');}
  const contentType=response.headers.get('content-type')||'';
  const result=contentType.includes('json') ? await response.json() : await response.text();
  if(response.status===401)window.dispatchEvent(new Event('a11y-session-ended'));
  if(!response.ok) throw new Error(result?.error?.message || result?.message || `Error HTTP ${response.status}`);
  return result;
}
export async function downloadReport(id) {
  if(isDemoMode()){
    const {site,findings,createdAt}=demoReport(id);
    // Generar el PDF localmente: este modo nunca llama a la API ni a SQL Server.
    const {jsPDF}=await import('jspdf');
    const pdf=new jsPDF({unit:'mm',format:'a4'});
    const pageWidth=210, margin=18, usable=pageWidth-margin*2;
    let y=20;
    function nextPage(required=9){
      if(y+required>277){pdf.addPage();y=20;}
    }
    function paragraph(label,value){
      nextPage(18);
      pdf.setFont('helvetica','bold');pdf.setFontSize(10);pdf.setTextColor(11,31,58);
      pdf.text(label,margin,y);y+=6;
      pdf.setFont('helvetica','normal');pdf.setFontSize(10);pdf.setTextColor(38,55,73);
      const lines=pdf.splitTextToSize(String(value??'No disponible'),usable);
      for(const line of lines){nextPage();pdf.text(line,margin,y);y+=5;}
      y+=4;
    }
    pdf.setFillColor(11,31,58);pdf.rect(0,0,pageWidth,43,'F');
    pdf.setTextColor(255,255,255);pdf.setFont('helvetica','bold');pdf.setFontSize(19);
    pdf.text('A11yPilot',margin,23);
    pdf.setFont('helvetica','normal');pdf.setFontSize(10);
    pdf.text('Informe de demostracion - datos simulados',margin,33);
    y=54;
    paragraph('Sitio',site?.name||'No disponible');
    paragraph('URL',site?.url||'Sin URL');
    paragraph('Fecha del analisis',new Date(createdAt).toLocaleString('es-CO'));
    nextPage(18);
    pdf.setDrawColor(67,198,200);pdf.setLineWidth(.6);pdf.line(margin,y,pageWidth-margin,y);y+=8;
    pdf.setTextColor(11,31,58);pdf.setFont('helvetica','bold');pdf.setFontSize(13);
    pdf.text(`Hallazgos de ejemplo (${findings.length})`,margin,y);y+=9;
    if(findings.length===0){
      paragraph('Sin hallazgos','No se registraron hallazgos en esta demostracion.');
    }
    for(const [index, finding] of findings.entries()){
      paragraph(`${index+1}. ${finding.title}`,`Impacto: ${finding.impact}  |  Estado: ${finding.status}`);
      paragraph('Regla o criterio',finding.wcag||finding.rule||'No indicado');
      paragraph('Recomendacion',finding.recommendation||'Sin recomendacion');
      y+=2;
    }
    nextPage(22);
    pdf.setFillColor(232,246,247);pdf.rect(margin,y,usable,18,'F');
    pdf.setTextColor(11,31,58);pdf.setFont('helvetica','bold');pdf.setFontSize(9);
    pdf.text('AVISO: ESTE INFORME ES UNA DEMOSTRACION',margin+3,y+7);
    pdf.setFont('helvetica','normal');pdf.setFontSize(8.5);
    pdf.text('No se visito la URL ni se certifica conformidad WCAG.',margin+3,y+13);
    const count=pdf.getNumberOfPages();
    for(let page=1;page<=count;page++){
      pdf.setPage(page);pdf.setTextColor(95,113,128);pdf.setFontSize(8);
      pdf.text(`A11yPilot  |  Pagina ${page} de ${count}`,pageWidth-margin,289,{align:'right'});
    }
    pdf.save(`a11ypilot-analisis-${id}-demo.pdf`);
    return;
  }

  const response=await fetch(`${BASE}/reports/${encodeURIComponent(id)}`,{credentials:'include'});
  if(response.status===401)window.dispatchEvent(new Event('a11y-session-ended'));
  if(!response.ok){let message='No se pudo generar el PDF.';try{message=(await response.json()).error?.message||message}catch{}throw new Error(message)}
  const blob=await response.blob();const url=URL.createObjectURL(blob);
  const link=document.createElement('a');link.href=url;link.download=`a11ypilot-analisis-${id}-demo.pdf`;document.body.append(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
