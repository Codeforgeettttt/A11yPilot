# Ejecución local de A11yPilot con Docker

## Requisitos y alcance

- Docker Desktop con Docker Compose V2 y contenedores Linux.
- Al menos 4 GB de RAM disponibles para Docker (SQL Server requiere recursos considerables).
- Puertos 5173, 5174 y 3001 sin ocupar según el modo elegido.
- A11yPilot es un MVP académico: **los hallazgos actuales son simulados**. No es una plataforma de auditoría WCAG ni está preparada para exposición pública.

## Modo completo: SQL Server + API + frontend

Desde la raíz del repositorio, en PowerShell:

```powershell
Copy-Item .env.docker.example .env
notepad .env
docker compose config --quiet
docker compose up --build -d
docker compose ps
```

Antes del primer `docker compose`, reemplazar el valor de `MSSQL_SA_PASSWORD` en `.env` por una contraseña **privada y robusta**; no guardar esa contraseña en Git. El comando `docker compose config` sin `--quiet` puede mostrarla.

La base de datos `A11yPilot` y las tablas se crean durante el arranque inicial a través de `db-init`. El backend se inicia después de que ese proceso termine con éxito. Los datos persisten en el volumen `sqlserver_data`.

Direcciones:
- **Frontend:** http://localhost:5173
- **API:** http://localhost:3001/api/health
- **API + SQL Server:** http://localhost:3001/api/health/database

El navegador se comunica con Vite en el puerto 5173, que envía las solicitudes `/api` al servicio Docker `backend:3001`. La API se conecta a `db:1433`. SQL Server no publica el puerto 1433 en el equipo anfitrión.

Para revisar estado y errores:

```powershell
docker compose ps -a
docker compose logs --tail=100 db db-init backend frontend
```

Si necesitas volver a ejecutar la creación/verificación del esquema:

```powershell
docker compose run --rm db-init
```

Detener sin borrar datos:

```powershell
docker compose down
```

**No ejecutes** `docker compose down -v` a menos que quieras borrar los datos del volumen. Si cambias la contraseña del archivo `.env` después de crear el volumen, la instancia persistente puede conservar la contraseña anterior.

## Modo demo independiente (F30)

Este modo permite mostrar la interfaz **sin SQL Server ni backend**:

```powershell
docker compose -f compose.demo.yaml up --build -d
```

Abrir **http://localhost:5174** y elegir el acceso de demostración en la pantalla de la aplicación. Ese modo usa `localStorage` y `sessionStorage`; los análisis y PDF son ejemplos simulados. No se crea una cuenta real.

Detener:

```powershell
docker compose -f compose.demo.yaml down
```

## Pruebas que deben ejecutarse en el equipo

```powershell
npm.cmd run install:all
npm.cmd run lint
npm.cmd run format:check
npm.cmd run test
npm.cmd run build
docker compose build
docker compose up -d
docker compose ps -a
```

Después revisar manualmente registro, inicio de sesión, creación de proyectos y sitios, análisis simulado, historial, seguimiento, PDF y preferencias de accesibilidad. Probar también el modo demo y documentar resultados con capturas sin secretos.

**Estado:** los comandos anteriores son instrucciones para ejecutar y registrar; no se afirma que se hayan verificado en Docker Desktop.

## Seguridad y límites

Se publican únicamente puertos locales en `127.0.0.1`. La API se ejecuta en modo de desarrollo para permitir el acceso de prueba HTTP, y habilita enlaces de recuperación de contraseña de desarrollo. No publicar estos puertos en Internet, ni copiar esta configuración a un entorno productivo. En producción hacen falta HTTPS, manejo seguro de secretos, migraciones, revisión de seguridad y reemplazar el servidor Vite de desarrollo por un servidor web de producción.
