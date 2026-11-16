# Preparación de entrega v1.0.0 — A11yPilot

**Estado: candidata, NO publicada.** La versión de los `package.json` continúa siendo 0.6.2 en raíz/frontend y 0.6.0 en backend. No se crea etiqueta Git `v1.0.0` ni una Release de GitHub en esta preparación.

## Alcance documentado

- Interfaz React/Vite, API Express, persistencia SQL Server y gestión de cuentas.
- Proyectos, sitios autorizados, análisis reales con Playwright/Chromium/axe-core, hallazgos, seguimiento e informes PDF.
- Modo demostración independiente con datos simulados.
- Dockerfiles y Compose para uso local; scripts para inicializar base de datos.
- Pruebas de código, compilación y construcción Docker mediante GitHub Actions.

## Condiciones antes de publicar

- [ ] Resolver o aceptar explícitamente los 66 archivos fuera del formato Prettier, sin modificar el código de otros integrantes sin coordinación.
- [ ] CI del último commit revisado; sin errores bloqueantes.
- [ ] Ejecutar y documentar la matriz de pruebas manuales de [PLAN_PRUEBAS.md](../pruebas/PLAN_PRUEBAS.md), especialmente SQL Server y escáner real.
- [ ] Revisar los avisos de `npm audit` del frontend y backend; acordar mitigación.
- [ ] Elegir licencia, titular de derechos y añadir `LICENSE` con aprobación del equipo.
- [ ] Confirmar alcance y versión final con todos los integrantes.
- [ ] Actualizar versiones de los paquetes y CHANGELOG con los resultados efectivos.
- [ ] Crear Pull Request `Docker` → `main`; obtener revisión y fusionar tras aprobar.
- [ ] Solo entonces crear etiqueta `v1.0.0` y Release desde el commit aprobado.

## Material para evaluación

- [Manual de instalación](../manuales/INSTALACION.md)
- [Manual de usuario](../manuales/USUARIO.md)
- [Arquitectura](../arquitectura/DESPLIEGUE_DOCKER.md)
- [Pruebas](../pruebas/PLAN_PRUEBAS.md)
- [Evidencias anteriores del MVP](../evidencias/README.md)

No afirmar que el escáner certifica WCAG ni que la aplicación está lista para producción. El despliegue preparado es local y exige protecciones adicionales para uso público.
