## Abrir la aplicación sin SQL Server (modo de prueba)

Desde la carpeta raíz, ejecuta:

```powershell
npm.cmd run install:all
npm.cmd run dev:demo
```

Abre `http://localhost:5173` y selecciona **Entrar en modo de prueba (sin SQL Server)**.
Este modo no utiliza la API ni SQL Server. Los proyectos, sitios y estados se guardan únicamente en `localStorage` de este navegador. El análisis es simulado y la exportación genera PDF localmente, sin API ni SQL Server. No hay cuentas reales, aislamiento de seguridad ni persistencia entre dispositivos.

Para usar **cuentas reales, reportes PDF persistentes y SQL Server**, configura `backend/.env`, ejecuta `npm.cmd run db:setup` y luego `npm.cmd run dev` como se indica más adelante.

---

# A11yPilot · MVP avanzado con cuentas (Entrega 1)

Proyecto académico de Ingeniería Web II. A11yPilot reúne proyectos, sitios registrados, análisis de demostración, hallazgos y seguimiento de accesibilidad en una aplicación web.

**Importante:** el motor de análisis real aún no está implementado. Los resultados son predefinidos, están marcados como simulados y no constituyen certificación WCAG.

## Alcance entregado en el código

- Interfaz React + Vite con dashboard, proyectos, sitios, nuevo análisis, hallazgos, historial y reportes.
- Panel global de accesibilidad: alto contraste, tamaño de texto, espaciado, reducción de movimiento, restablecimiento y preferencias guardadas en el navegador.
- Registro, inicio/cierre de sesión, edición de perfil, cambio y recuperación de contraseña; proyectos, hallazgos y PDF restringidos a su cuenta.
- API REST Express con validación, limitación básica de solicitudes, manejo de errores y documentación OpenAPI.
- Persistencia en Microsoft SQL Server mediante Sequelize y Tedious.
- CRUD inicial de proyectos y sitios; resultados simulados persistentes; seguimiento con bitácora y exportación PDF.
- Pruebas básicas de backend y frontend.

## Requisitos

- Node.js 20 o superior y npm.
- Instancia local de Microsoft SQL Server con autenticación SQL y TCP/IP habilitado.
- Una base de datos llamada `A11yPilot`, creada previamente por el administrador de SQL Server.
- Usuario SQL con permisos para crear tablas en esa base de datos durante el setup.

## Preparación en Windows PowerShell

Desde la carpeta `A11yPilot_MVP` (la que contiene este README):

```powershell
Copy-Item backend\.env.example backend\.env
notepad backend\.env
npm.cmd run install:all
npm.cmd run db:setup
# Si quieres datos de muestra, configura SEED_USER_EMAIL y SEED_USER_PASSWORD en backend/.env.
npm.cmd run db:seed
npm.cmd run dev
```

Edita `backend/.env` con **tu propio usuario, contraseña, host y puerto** de SQL Server. `DB_ENCRYPT=false` y `DB_TRUST_CERT=true` son valores para el entorno de laboratorio local, no para producción. Si tu instancia utiliza cifrado y certificado válido, configura esos campos correctamente.

- Interfaz: `http://localhost:5173`
- API: `http://127.0.0.1:3001/api/health`
- API y SQL Server: `http://127.0.0.1:3001/api/health/database`

> Si no ejecutas `db:setup`, las rutas que consultan tablas fallarán. Después del setup, crea una cuenta desde la interfaz; los registros anteriores sin propietario no se mostrarán en las cuentas nuevas. Si SQL Server no está disponible, el backend avisará y no iniciará. No existe modo ficticio de persistencia oculto.

## Scripts

```powershell
npm.cmd run dev        # frontend + backend
npm.cmd run build      # compilación frontend
npm.cmd run test       # pruebas automáticas
npm.cmd run db:setup   # crea tablas si no existen
npm.cmd run db:seed    # añade un proyecto y análisis de ejemplo, sin duplicarlos
```

El comando `db:setup` utiliza `sequelize.sync()` sin `force` ni `alter`. No reemplaza un sistema de migraciones versionadas, que será necesario antes de despliegues de producción.

## Estructura

```text
frontend/    React, Vite, componentes y estilos
backend/     Express, modelos, rutas, servicios, configuración y pruebas
docs/        API, arquitectura y evidencias
```

## Flujo de demostración

1. Crear un proyecto en **Proyectos**.
2. Registrar un sitio en **Sitios web**; marcar autorización.
3. Abrir **Nuevo análisis**, seleccionar sitio y confirmar.
4. Revisar **Hallazgos**, cambiar estado y agregar una observación.
5. Consultar **Historial** y descargar un PDF en **Reportes**.
6. Abrir **Accesibilidad** para probar alto contraste, texto grande, espaciado y movimiento reducido.

Los cambios de seguimiento se guardan en SQL Server, y las preferencias visuales se guardan en `localStorage`.

## Seguridad y limitaciones

- **Solo desarrollo local:** la API utiliza sesiones con cookies HttpOnly y autoriza el acceso a proyectos y reportes por cuenta. No se ha realizado una auditoría de seguridad para despliegue público.
- Registrar una URL no causa ninguna solicitud de red a ese destino. El motor real necesitará validación anti-SSRF, listas de denegación, aislamiento y límites de recursos.
- La generación PDF utiliza datos guardados de demostración.
- Se aplica una política básica con Helmet, CORS de origen local, tasa limitada y validación de entradas, pero no representa una evaluación de seguridad completa.
- Se utiliza la imagen del logotipo proporcionada por el equipo. Las fuentes propietarias no se incluyen; existen alternativas en CSS.
- No se declara cumplimiento WCAG 2.2 AA: faltan auditorías manuales, lectores de pantalla y revisión automatizada integral.

## Calidad y documentación

- `npm.cmd run test` ejecuta las pruebas incluidas.
- `npm.cmd run build` compila el frontend para comprobar sintaxis e integración.
- `docs/api/openapi.yaml` documenta rutas implementadas.
- `docs/evidencias/` está listo para capturas reales antes de la entrega.

## Próximas fases

Motor Playwright + axe-core, cola de trabajos aislada, seguridad SSRF completa, roles administrativos, comparación de revisiones, migraciones versionadas y despliegue seguro.

Repositorio: https://github.com/Codeforgeettttt/A11yPilot

## Cuentas y recuperación de contraseña

- En la primera visita, selecciona **Crear una cuenta**. La contraseña debe tener entre 12 y 128 caracteres.
- El backend almacena un hash `scrypt` con sal aleatoria; utiliza sesiones revocables guardadas en SQL Server y cookies `HttpOnly`, `SameSite=Strict`.
- Los endpoints de proyectos, sitios, análisis, hallazgos y PDF se filtran por la cuenta autenticada. Una cuenta no puede consultar recursos de otra.
- **Mi cuenta** permite actualizar el nombre, cambiar la contraseña y cerrar la sesión. Cambiar la contraseña revoca las otras sesiones.
- La recuperación genera un enlace de un solo uso válido durante 15 minutos. Si se configura `SMTP_HOST`, `SMTP_FROM` y credenciales SMTP, se envía por correo. Para desarrollo local, `DEV_SHOW_RESET_LINK=true` muestra un enlace de prueba en la pantalla. **Deshabilítalo en producción.**
- Cuando configures un servidor público, utiliza HTTPS, correo transaccional, controles CSRF adicionales, migraciones versionadas y revisiones de seguridad.

### Actualización de una base de datos anterior

Ejecuta `npm.cmd run db:setup` con la versión nueva. El script añade `userId` a `Projects` si no existe y crea las tablas de usuarios/sesiones/restablecimientos. Los proyectos anteriores sin propietario se conservan pero no se asignan automáticamente a ninguna cuenta. No ejecutes `sync({force:true})` sobre tus datos.

### Rutas de autenticación

`POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `PATCH /api/auth/me`, `POST /api/auth/change-password`, `POST /api/auth/logout`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`.

## Reportes PDF en ambos modos

El modo de prueba genera PDF directamente en el navegador usando `jspdf`, sin pedir datos al backend. El modo completo genera PDF desde Express, basado en registros persistentes de SQL Server. En ambos casos se advierte explícitamente que los hallazgos son simulados. Los informes de prueba son descargables y no constituyen una certificación WCAG.
