// Prueba manual del scanner: npm --prefix backend run scan -- https://ejemplo.com
import { scanPage } from '../src/services/scanner.js';
import { violationsToFindings } from '../src/services/findings-mapper.js';

const url = process.argv[2];
if (!url) {
  console.error('Uso: npm --prefix backend run scan -- https://ejemplo.com');
  process.exit(1);
}

console.log(`Analizando ${url} …`);
try {
  const result = await scanPage(url);
  console.log(`Página: ${result.title} (${result.finalUrl}) · HTTP ${result.status}`);
  console.log(`Problemas encontrados: ${result.violations.length}`);
    console.log(`Hallazgos que se guardarían: ${violationsToFindings(result.violations).length}`);
  for (const v of result.violations) {
    console.log(`- [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} elemento(s))`);
  }
} catch (error) {
  console.error('No se pudo analizar la página:', error.message);
  process.exitCode = 1;
}