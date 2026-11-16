# A11yPilot en Docker — instalación y pruebas locales

## Requisitos

- Docker Desktop con Compose V2, motor Linux y recursos suficientes para SQL Server y Chromium (se recomiendan **al menos 6 GB de RAM asignables** para las pruebas completas).
- Windows PowerShell y puertos locales 5173, 5174 y 3001 disponibles.
- Conexión a Internet para descargar imágenes y el navegador Chromium durante la construcción.

La configuración es para **desarrollo local**, no para publicación en Internet.

## Inicio del sistema completo

Desde la raíz del repositorio (rama `Docker`):

```powershell
Copy-Item .env.docker.example .env
notepad .env
docker compose config --quiet
docker compose up --build -d
docker compose ps -a
```

**Importante:** reemplaza `MSSQL_SA_PASSWORD` en `.env` por una contraseña privada y robusta. El archivo `.env` se ignora en Git: nunca lo publiques. No compartas la salida de `docker compose config` sin `--quiet`, porque puede incluir contraseñas.

Servicios: `db` (SQL Server 2022 Express), `db-init` (crea la base y comprueba las tablas), `backend` (API Express y escáner de accesibilidad con Playwright/axe-core) y `frontend` (React y Vite).

En la primera ejecución, `db-init` debe finalizar correctamente antes de que inicie la API. Los datos se mantienen en `sqlserver_data`.

- **Aplicación:** http://localhost:5173
- **Estado API:** http://localhost:3001/api/health
- **Estado base de datos:** http://localhost:3001/api/health/database

Vite reenvía `/api` a `backend:3001`; el backend consulta la base en `db:1433`. La base de datos no publica puertos al sistema anfitrión.

## Pruebas recomendadas

```powershell
docker compose ps -a
docker compose logs --tail=100 db db-init backend frontend
docker compose exec backend node -e "import('playwright').then(async ({chromium}) => { const browser=await chromium.launch(); console.log('Chromium disponible'); await browser.close(); })"
```

Después prueba manualmente:

1. Abrir la web, registrar una cuenta e iniciar sesión.
2. Crear un proyecto y registrar un sitio público **autorizado**.
3. Ejecutar un análisis real con Playwright/axe-core; comprobar progreso, hallazgos e historial.
4. Generar el PDF y probar las opciones de accesibilidad.
5. Ejecutar las pruebas de código desde la raíz del repositorio:

```powershell
npm.cmd run install:all
npm.cmd run lint
npm.cmd run format:check
npm.cmd run test
npm.cmd run build
```

Los resultados de `lint` y `format:check` pueden señalar problemas de estilo preexistentes. No ejecutes `npm run format` sobre todos los archivos sin coordinarlo con el equipo.

Para ver errores: `docker compose logs --tail=150 backend`. Para repetir la preparación de tablas: `docker compose run --rm db-init`.

Para detener sin borrar datos:

```powershell
docker compose down
```

**No ejecutes `docker compose down -v`**, a menos que quieras eliminar permanentemente la base almacenada en el volumen. Cambiar la clave de `.env` no necesariamente cambia la contraseña de una instancia SQL Server ya inicializada.

## Modo demo independiente (F30)

No requiere backend ni SQL Server y conserva los hallazgos **simulados** del navegador:

```powershell
docker compose -f compose.demo.yaml up --build -d
```

Abre http://localhost:5174 y elige «Entrar en modo de prueba». Los proyectos y análisis del modo demo se almacenan en el navegador; los informes PDF de esta modalidad son ilustrativos.

Para detenerlo:

```powershell
docker compose -f compose.demo.yaml down
```

## Seguridad y límites

El modo completo permite análisis **reales** de sitios web públicos autorizados, pero esto **no certifica conformidad WCAG**. El escáner utiliza controles de validación de URL y un proxy restrictivo incorporados por el equipo. Deben verificarse las restricciones de red y seguridad antes de cualquier uso fuera del desarrollo local. La API se expone solo en `127.0.0.1`, usa HTTP y la configuración habilita enlaces de recuperación de desarrollo. No es segura como configuración pública ni de producción.

**Estado de verificación:** esta guía describe las pruebas que se deben hacer en Docker Desktop; no presupone que ya se hayan ejecutado.
