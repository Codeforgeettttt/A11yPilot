# Plan y registro de verificación — A11yPilot

**Rama:** `Docker` · **Fecha de preparación:** 16/11/2026 · **Release:** v1.0.0 **no publicada**.

Este registro distingue las evidencias automáticas disponibles de las verificaciones manuales aún pendientes. No se deben marcar pruebas como aprobadas sin evidencia.

## Evidencia automática disponible

| Caso                                        | Resultado observado                                                        | Evidencia                                                                                                       |
| ------------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Instalación de dependencias Node            | Aprobada                                                                   | [GitHub Actions — ejecución 43935071262](https://github.com/Codeforgeettttt/A11yPilot/actions/runs/43935071262) |
| ESLint                                      | Aprobada tras corregir la configuración                                    | Misma ejecución                                                                                                 |
| Pruebas automatizadas backend y frontend    | Aprobadas                                                                  | Misma ejecución                                                                                                 |
| Build del frontend                          | Aprobado                                                                   | Misma ejecución                                                                                                 |
| Validación de Docker Compose                | Aprobada                                                                   | [Ejecución 43934019852](https://github.com/Codeforgeettttt/A11yPilot/actions/runs/43934019852)                  |
| Construcción de imágenes backend y frontend | Aprobada                                                                   | Misma ejecución                                                                                                 |
| Inicio y respuesta HTTP del frontend demo   | Aprobada                                                                   | Misma ejecución                                                                                                 |
| Prettier sobre todo el repositorio          | **No aprobada**: 66 archivos con diferencias de estilo; sin reformatearlos | [Ejecución 43935071262](https://github.com/Codeforgeettttt/A11yPilot/actions/runs/43935071262)                  |

Los resultados se refieren a los commits ejecutados y no garantizan que nuevas modificaciones sean correctas. Verificar la ejecución de CI del último commit antes de dar por terminada una entrega.

## Matriz de pruebas manuales pendientes

| ID  | Caso y acción                                                   | Resultado esperado                                              | Estado    |
| --- | --------------------------------------------------------------- | --------------------------------------------------------------- | --------- |
| M01 | `docker compose up --build -d` con `.env` privado               | Servicios activos; `db-init` termina con código 0               | Pendiente |
| M02 | Abrir `/api/health/database`                                    | Respuesta de conexión SQL Server                                | Pendiente |
| M03 | Registrar cuenta e iniciar/cerrar sesión                        | Sesión funcional y recursos restringidos                        | Pendiente |
| M04 | Crear, editar y volver a cargar un proyecto                     | Persistencia en SQL Server                                      | Pendiente |
| M05 | Registrar/editar sitio autorizado                               | URL validada y confirmación requerida                           | Pendiente |
| M06 | Ejecutar análisis real de URL pública autorizada                | Progreso, resultado y hallazgos o error controlado              | Pendiente |
| M07 | Consultar hallazgos, cambiar estado e historial                 | Cambios persistidos y mostrados                                 | Pendiente |
| M08 | Descargar y abrir PDF de un análisis                            | PDF accesible e identifica análisis simulado cuando corresponda | Pendiente |
| M09 | `compose.demo.yaml`, entrar en modo de prueba                   | Interfaz sin API ni SQL Server; datos de ejemplo                | Pendiente |
| M10 | Probar preferencias, teclado y tamaños móvil/tableta/escritorio | Interacción utilizable y sin problemas graves                   | Pendiente |
| M11 | Reiniciar contenedores sin `down -v`                            | Base de datos conservada                                        | Pendiente |
| M12 | Confirmar que no se publicaron credenciales ni puertos SQL      | `.env` ignorado y SQL sin puerto publicado                      | Pendiente |

## Cómo registrar resultados

Para cada caso indica fecha, resultado (aprobado/fallido), equipo, pasos realizados, captura o log, observaciones y commit comprobado. No incluyas contraseñas ni tokens. Si falla, crea una incidencia y deja su caso abierto hasta volver a ejecutarlo.

**Criterio recomendado de aprobación:** CI principal aprobado, casos M01–M12 revisados, errores críticos resueltos y autorización del equipo. Este documento no certifica cumplimiento WCAG.
