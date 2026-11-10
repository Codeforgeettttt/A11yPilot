# Evidencias de funcionamiento — Entrega 1

Estas evidencias deben obtenerse de una ejecución real de A11yPilot. No utilizar capturas ficticias ni declarar pruebas que no se hayan realizado.

## Capturas pendientes

| Archivo sugerido | Qué debe mostrar |
| --- | --- |
| `01-dashboard-escritorio.png` | Vista principal completa en un navegador de escritorio |
| `02-proyectos.png` | Listado y creación de un proyecto de prueba |
| `03-registro-sitio.png` | Formulario y confirmación de autorización |
| `04-analisis-demo.png` | Flujo de análisis marcado como simulado |
| `05-hallazgos.png` | Filtros y actualización de un estado |
| `06-reporte-pdf.png` | PDF descargado con aviso de datos simulados |
| `07-alto-contraste.png` | La interfaz con modo de alto contraste activado |
| `08-tableta.png` | Vista con ancho aproximado de 768 px |
| `09-movil.png` | Vista con ancho aproximado de 375 px |

No subir contraseñas, cookies, tokens, credenciales de SQL Server ni datos privados de cuentas en las capturas.

## Registro de pruebas

Completar con **resultados observados**, no supuestos.

| Comprobación | Resultado (aprobado / falló / pendiente) | Fecha | Observaciones |
| --- | --- | --- | --- |
| Abrir frontend en navegador actualizado | Pendiente | — | |
| Navegar entre módulos | Pendiente | — | |
| Crear proyecto y comprobar persistencia tras recargar | Pendiente | — | |
| Registrar sitio autorizado | Pendiente | — | |
| Ejecutar análisis de demostración | Pendiente | — | |
| Filtrar y actualizar hallazgo | Pendiente | — | |
| Descargar y abrir PDF | Pendiente | — | |
| Contraste alto y preferencias guardadas | Pendiente | — | |
| Uso con teclado y foco visible | Pendiente | — | |
| Vista móvil, tableta y escritorio | Pendiente | — | |
| `npm.cmd run build` | Pendiente | — | |
| `npm.cmd run test` | Pendiente | — | |

## Cómo preparar las capturas

Usar las herramientas para desarrolladores del navegador (F12) para comprobar anchuras de pantalla; guardar las capturas en esta carpeta. Registrar el resultado real de cada prueba y cualquier error detectado. La base SQL Server es local: las evidencias deben mostrar el funcionamiento de la aplicación, sin publicar su archivo `.env`.

## Límite de la entrega

La interfaz y el seguimiento pueden utilizar datos demostrativos. Los análisis automáticos de sitios con Playwright + axe-core no forman parte de este MVP. Las pruebas pendientes no equivalen a una certificación de accesibilidad WCAG.
