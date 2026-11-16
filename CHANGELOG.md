# Historial de cambios · A11yPilot

Este documento resume los avances **verificables en GitHub** y distingue las funcionalidades del MVP de los trabajos previstos. El historial completo permanece disponible en [GitHub Commits](https://github.com/Codeforgeettttt/A11yPilot/commits/main/). Para la estrategia de versionamiento consulta [Control de versiones](docs/control-versiones/README.md).

> **Versión de aplicación actual:** `0.6.2`, según el `package.json` raíz y el frontend. El backend declara `0.6.0`. No se afirma que exista una etiqueta Git o Release oficial para esta versión.

## [Preparación de v1.0.0 — sin publicar] — 16/11/2026

**No es un lanzamiento oficial.** Se conservan las versiones declaradas en los `package.json` y no se ha creado etiqueta `v1.0.0`.

- Integración en `Docker` de las funcionalidades recientes de `main`, incluido análisis real de sitios públicos autorizados con Playwright y axe-core. El modo demo continúa siendo simulado.
- Dockerfiles para frontend/backend, instalación de Chromium, Compose con SQL Server y preparación de tablas.
- Variables de entorno de ejemplo, archivos ignorados y configuración básica de ESLint y Prettier.
- GitHub Actions para instalación, análisis estático, pruebas automatizadas, compilación, construcción Docker y prueba HTTP del demo.
- Manual de instalación, manual de usuario, arquitectura, matriz de pruebas y lista de aprobación de release.
- CI de Node (ESLint, pruebas y build) aprobado en la [ejecución 43935071262](https://github.com/Codeforgeettttt/A11yPilot/actions/runs/43935071262); Docker build y demo aprobados en [43934019852](https://github.com/Codeforgeettttt/A11yPilot/actions/runs/43934019852). El formato Prettier completo detectó 66 archivos pendientes y no se reformatearon.

**Pendiente:** comprobar SQL Server y el escáner real dentro de Compose; revisar resultados de CI del último commit y vulnerabilidades de dependencias; definir licencia; aprobar Pull Request y publicación.

El histórico anterior describe los estados de las entregas previas y no debe interpretarse como el estado más reciente del desarrollo.

## [En desarrollo] — mejoras posteriores al MVP · 10/11/2026

### Correcciones de formularios y conexión

- Si una operación falla por conexión, permisos o validación, los formularios de proyectos y sitios **conservan el contenido** para permitir corregir o reintentar.
- El análisis de demostración **no navega al historial si falla su registro**.
- El botón de reconexión realiza una actualización de los datos y deja de indicar que la conexión se restableció sin comprobarla.
- Si una operación se guardó pero la actualización de la vista falló, se muestra un mensaje que distingue ambos resultados para evitar duplicar registros.
- Se añadieron pruebas unitarias para éxito, error de guardado y error de actualización de la vista.

**Verificación:** las pruebas están incluidas en GitHub Actions; confirmar el resultado del workflow correspondiente antes de considerar completada la validación de este cambio.

## [Sin publicar] — próximas mejoras

*Son tareas previstas, no funcionalidades terminadas.*

- Integrar el análisis automatizado real mediante Playwright y axe-core.
- Reforzar el aislamiento del motor, la protección contra SSRF y los límites de ejecución.
- Revisar la navegación con teclado, el contraste, la visualización responsive y lectores de pantalla.
- Mejorar los mensajes de validación, la presentación de reportes y la experiencia de uso.
- Incorporar migraciones versionadas y pruebas adicionales.

## [0.6.2 — MVP académico] — estado documentado al 10/11/2026

### Funcionalidades incluidas

- Frontend con React, Vite, HTML5, CSS3 y JavaScript.
- Dashboard y módulos para proyectos, sitios, análisis demostrativos, hallazgos, historial y reportes.
- Panel de preferencias de accesibilidad: alto contraste, tamaño de texto, espaciado y reducción de movimiento.
- API REST con Express; autenticación y almacenamiento local en SQL Server mediante Sequelize y Tedious.
- Modo de prueba sin SQL Server con datos almacenados en el navegador.
- Exportación de PDF de demostración desde frontend o backend, según el modo.

**Límite del MVP:** los análisis y hallazgos son simulados y no representan una evaluación automatizada real.

### Evidencia de desarrollo en Git

| Fecha | Cambio destacado | Referencia |
| --- | --- | --- |
| 03/11/2026 | Creación del repositorio | [`ac4c9c9`](https://github.com/Codeforgeettttt/A11yPilot/commit/ac4c9c9b68) |
| 10/11/2026 | Incorporación del MVP | [`26fc3ce`](https://github.com/Codeforgeettttt/A11yPilot/commit/26fc3ce81e) |
| 10/11/2026 | Configuración inicial del CI | [`807bc93`](https://github.com/Codeforgeettttt/A11yPilot/commit/807bc93b99) |
| 10/11/2026 | Ampliación del README técnico | [`96e4b35`](https://github.com/Codeforgeettttt/A11yPilot/commit/96e4b357a4) |
| 10/11/2026 | Corrección de CI (dependencias del frontend/backend) | [`2062ce7`](https://github.com/Codeforgeettttt/A11yPilot/commit/2062ce7138) |
| 10/11/2026 | Incorporación de capturas y registro de evidencias | [`fd06ced`](https://github.com/Codeforgeettttt/A11yPilot/commit/fd06cedc50) |
| 10/11/2026 | Documentación de identidad visual y manual PDF | [`f883603`](https://github.com/Codeforgeettttt/A11yPilot/commit/f883603215) |

### Verificación

- GitHub Actions ejecuta instalación, compilación y pruebas en Node.js 20, 22 y 24.
- [Consultar las ejecuciones](https://github.com/Codeforgeettttt/A11yPilot/actions).
- [Capturas y registro de pruebas](docs/evidencias/README.md).
- [Manual de identidad visual](docs/diseno/LOGO%20A11YPILOT.pdf).

## Cómo actualizar el historial

Al completar un cambio relevante, registrar debajo del encabezado de su versión:

1. Fecha y versión efectivamente publicada.
2. Nueva función, corrección o modificación de documentación.
3. Enlace a commits o Pull Request.
4. Pruebas y evidencias realizadas.
5. Limitaciones conocidas.

Evitar registrar características futuras como realizadas y no modificar retroactivamente las fechas de commits existentes.
