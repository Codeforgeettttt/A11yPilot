import PDFDocument from 'pdfkit';

/**
 * Genera el informe PDF de un análisis y lo envía como descarga.
 * Si el análisis es simulado (demo), el informe lo indica claramente.
 */
export function sendPdf(res, analysis) {
  const demo = analysis.demo !== false;
  const fileName = `a11ypilot-analisis-${analysis.id}${demo ? '-demo' : ''}.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

  const doc = new PDFDocument({ size: 'A4', margin: 48 });
  doc.pipe(res);

  // Cabecera
  doc.fontSize(22).fillColor('#0B1F3A').text('A11yPilot');
  doc.fontSize(13).fillColor('#087A80').text(demo ? 'Informe de demostración' : 'Informe de accesibilidad');
  doc.moveDown(0.5).fontSize(10);
  if (demo) {
    doc.fillColor('#922626').text('NO CORRESPONDE A UNA EVALUACIÓN REAL. NO CERTIFICA CONFORMIDAD WCAG.', { underline: true });
  } else {
    doc
      .fillColor('#162C40')
      .text(
        'Análisis automático con axe-core (WCAG 2.2, niveles A y AA). No certifica conformidad WCAG: ' +
          'algunas barreras solo se detectan con revisión manual.',
      );
  }

  // Datos del análisis
  doc.moveDown().fillColor('#162C40').text(`Análisis #${analysis.id}`);
  doc.text(`Proyecto: ${analysis.Site?.Project?.name || 'Sin proyecto'}`);
  doc.text(`Sitio: ${analysis.Site?.name || 'No disponible'}`);
  doc.text(`URL: ${analysis.Site?.url || 'No disponible'}`);
  doc.text(`Fecha: ${new Date(analysis.createdAt).toLocaleDateString('es-CO')}`);
  doc.text(`Estado: ${analysis.status}`);
  doc.moveDown();

  // Hallazgos
  const findings = analysis.Findings || [];
  doc.fontSize(15).text(`${demo ? 'Hallazgos simulados' : 'Hallazgos'} (${findings.length})`);
  doc.moveDown(0.4);
  if (findings.length === 0) {
    doc.fontSize(10).text(demo ? 'No hay hallazgos de ejemplo.' : 'axe-core no encontró problemas automáticos en esta página.');
  }
  for (const finding of findings) {
    if (doc.y > 680) doc.addPage();
    doc.fontSize(11).fillColor('#0B1F3A').text(`${finding.title} · ${finding.impact}`);
    doc.fontSize(9).fillColor('#162C40').text(`Regla: ${finding.rule} · ${finding.wcag || 'Sin criterio'}`);
    if (finding.selector) doc.text(`Elemento afectado: ${finding.selector}`);
    doc.text(`Estado: ${finding.status}`);
    doc.text(`Cómo corregirlo: ${finding.recommendation}`);
    doc.moveDown(0.7);
  }

  // Pie
  doc.moveDown().fontSize(9).fillColor('#526477');
  doc.text(
    demo
      ? 'Resultados de ejemplo para probar el seguimiento. No se visitó el sitio.'
      : 'Revisa también la página manualmente con teclado y lector de pantalla para completar la evaluación.',
  );
  doc.end();
}