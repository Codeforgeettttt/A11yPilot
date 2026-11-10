# Historial de cambios · A11yPilot

Este documento resume los avances **verificables en GitHub** y distingue las funcionalidades del MVP de los trabajos previstos. El historial completo permanece disponible en [GitHub Commits](https://github.com/Codeforgeettttt/A11yPilot/commits/main/). Para la estrategia de versionamiento consulta [Control de versiones](docs/control-versiones/README.md).

> **Versión de aplicación actual:** `0.6.2`, según el `package.json` raíz y el frontend. El backend declara `0.6.0`. No se afirma que exista una etiqueta Git o Release oficial para esta versión.

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
