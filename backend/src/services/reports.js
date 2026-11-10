import PDFDocument from 'pdfkit';
export function sendPdf(res,analysis){
 res.setHeader('Content-Type','application/pdf');res.setHeader('Content-Disposition',`attachment; filename="a11ypilot-analisis-${analysis.id}-demo.pdf"`);
 const doc=new PDFDocument({size:'A4',margin:48});doc.pipe(res);
 doc.fontSize(22).fillColor('#0B1F3A').text('A11yPilot');
 doc.fontSize(13).fillColor('#087A80').text('Informe de demostración');
 doc.moveDown(.5).fontSize(10).fillColor('#922626').text('NO CORRESPONDE A UNA EVALUACIÓN REAL. NO CERTIFICA CONFORMIDAD WCAG.',{underline:true});
 doc.moveDown().fillColor('#162C40').text(`Análisis #${analysis.id}`);
 doc.text(`Proyecto: ${analysis.Site?.Project?.name||'Sin proyecto'}`);
 doc.text(`Sitio: ${analysis.Site?.name||'No disponible'}`);
 doc.text(`URL registrada: ${analysis.Site?.url||'No disponible'}`);
 doc.text(`Fecha: ${new Date(analysis.createdAt).toLocaleDateString('es-CO')}`);
 doc.text(`Estado: ${analysis.status}`);doc.moveDown();
 const findings=analysis.Findings||[];doc.fontSize(15).text(`Hallazgos simulados (${findings.length})`);doc.moveDown(.4);
 for(const f of findings){
  if(doc.y>680)doc.addPage();
  doc.fontSize(11).fillColor('#0B1F3A').text(`${f.title} · ${f.impact}`,{continued:false});
  doc.fontSize(9).fillColor('#162C40').text(`Regla: ${f.rule} · ${f.wcag||'Sin criterio'}`);
  doc.text(`Estado: ${f.status}`);doc.text(`Recomendación: ${f.recommendation}`);doc.moveDown(.7)
 }
 doc.moveDown().fontSize(9).fillColor('#526477').text('El motor Playwright + axe-core se integrará en una fase posterior. Los resultados anteriores son ejemplos de diseño y seguimiento.');
 doc.end();
}
