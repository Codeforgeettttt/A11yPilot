<img width="1912" height="1071" alt="image" src="https://github.com/user-attachments/assets/7f28ae25-e313-44fb-998b-a264789884b6" /># Evidencias de funcionamiento — Entrega 1

Estas evidencias deben obtenerse de una ejecución real de A11yPilot. No utilizar capturas ficticias ni declarar pruebas que no se hayan realizado.

## Capturas hechas

| Archivo sugerido | Qué debe mostrar |
| --- | --- |
| `<img width="1917" height="1078" alt="image" src="https://github.com/user-attachments/assets/91e8ff3a-8e10-4bba-b06d-ee57fd4617a8" />` | Vista principal completa en un navegador de escritorio |
| `<img width="1911" height="1078" alt="image" src="https://github.com/user-attachments/assets/18c373a2-b809-441d-9df4-d81641a47592" />` | Listado y creación de un proyecto de prueba |
| `<img width="1917" height="1078" alt="image" src="https://github.com/user-attachments/assets/5092044f-7eb9-40ff-88ef-71134b6a5bd2" />` | Formulario y confirmación de autorización |
| `<img width="1912" height="1071" alt="image" src="https://github.com/user-attachments/assets/a8167188-51b0-4ecb-b658-945822241e9b" />` | Flujo de análisis marcado como simulado |
| `<img width="1917" height="1037" alt="image" src="https://github.com/user-attachments/assets/afbb58c2-4179-4cca-bff0-3dad1c24395c" />` | Filtros y actualización de un estado |
| `<img width="1917" height="1078" alt="image" src="https://github.com/user-attachments/assets/af3612ad-d7e1-46ae-b22a-930f83d4976b" />` | PDF descargado con aviso de datos simulados |
| `<img width="1917" height="1078" alt="image" src="https://github.com/user-attachments/assets/c9e8c469-30b7-467a-b7d2-d6d04ecf71c2" />` | La interfaz con modo de alto contraste activado |
| `<img width="947" height="918" alt="image" src="https://github.com/user-attachments/assets/833e577c-f083-40d6-951e-7d333a996aa0" />` | Vista con ancho aproximado de 768 px |
| `<img width="731" height="802" alt="image" src="https://github.com/user-attachments/assets/f7b33c68-1709-4d60-b0c9-9cfe68b4cb9c" />` | Vista con ancho aproximado de 375 px |

No subir contraseñas, cookies, tokens, credenciales de SQL Server ni datos privados de cuentas en las capturas de anexo  (al equipo)

## Registro de pruebas

## Registro de pruebas y observaciones — A11yPilot

**Proyecto:** A11yPilot  
**Versión:** 0.6.2 — MVP demostrativo  
**Fecha de revisión:** 10/11/2026  
**Asignatura:** Ingeniería Web II

| Comprobación | Resultado | Fecha | Observaciones y mejoras |
|---|---|---|---|
| Abrir frontend en navegador actualizado | Aprobado | 10/11/2026 | La aplicación se ejecuta correctamente en el entorno local. Se recomienda continuar revisando la compatibilidad con otros navegadores. |
| Navegar entre módulos | Aprobado parcialmente | 10/11/2026 | La navegación principal funciona. Se deben mejorar algunos detalles de experiencia de usuario, consistencia visual y estados de navegación. |
| Crear proyecto y comprobar persistencia tras recargar | Pendiente de verificación completa | 10/11/2026 | La conexión con SQL Server funciona. Falta documentar una prueba específica de creación, actualización de página y recuperación de datos. |
| Registrar sitio autorizado | Pendiente de verificación | 10/11/2026 | El formulario está implementado. Se recomienda mejorar la validación de URLs, los mensajes de error y la retroalimentación visual. |
| Ejecutar análisis de demostración | Implementado — demostrativo | 10/11/2026 | El análisis utiliza datos simulados. En futuras versiones se integrará Playwright y axe-core para realizar evaluaciones reales. |
| Filtrar y actualizar hallazgo | Pendiente de verificación | 10/11/2026 | Se dispone de la funcionalidad en el prototipo. Se deben revisar los filtros, la actualización de estados y los mensajes de confirmación. |
| Descargar y abrir PDF | Pendiente de verificación documentada | 10/11/2026 | La generación de informes está implementada. Se recomienda mejorar su presentación, jerarquía visual y claridad de resultados. |
| Contraste alto y preferencias guardadas | Pendiente de verificación | 10/11/2026 | El panel de accesibilidad está implementado. Se deben validar los contrastes, la legibilidad y la persistencia de las preferencias. |
| Uso con teclado y foco visible | Requiere mejoras y pruebas | 10/11/2026 | Es necesario revisar el orden de tabulación, la visibilidad del foco, las etiquetas accesibles y la interacción sin ratón. |
| Vista móvil, tableta y escritorio | Pendiente de validación completa | 10/11/2026 | La interfaz contempla un diseño adaptable. Se recomienda revisar desbordamientos, distribución de tarjetas, menús y formularios en pantallas pequeñas. |
| \`npm.cmd run build\` | Pendiente de resultado final | 10/11/2026 | Se identificó un problema de instalación de dependencias en GitHub Actions y se corrigió el workflow. Falta registrar una compilación exitosa. |
| \`npm.cmd run test\` | Pendiente de resultado final | 10/11/2026 | Existen pruebas automatizadas en el repositorio. Se requiere confirmar sus resultados y ampliar la cobertura funcional. |

### Observaciones generales

La primera versión de A11yPilot cuenta con una estructura organizada, interfaz web, API REST y conexión funcional a Microsoft SQL Server. Durante el desarrollo local se logró iniciar la aplicación y acceder al sistema.

**Aspectos prioritarios para próximas versiones:**

1. Mejorar la consistencia visual y la experiencia de navegación.
2. Revisar la adaptación de los componentes a dispositivos móviles y tabletas.
3. Fortalecer las validaciones de formularios y los mensajes de retroalimentación.
4. Realizar pruebas de accesibilidad con teclado y tecnologías de asistencia.
5. Implementar el análisis automatizado real mediante Playwright y axe-core.
6. Ampliar las pruebas automatizadas y registrar evidencias de su ejecución.
7. Mejorar la presentación de los informes PDF y el seguimiento de hallazgos.


**Estado general:** Prototipo demostrativo funcional en desarrollo, con mejoras identificadas y pruebas pendientes de documentación.

## Límite de la entrega

La interfaz y el seguimiento pueden utilizar datos demostrativos. Los análisis automáticos de sitios con Playwright + axe-core no forman parte de este MVP. Las pruebas pendientes no equivalen a una certificación de accesibilidad WCAG.
