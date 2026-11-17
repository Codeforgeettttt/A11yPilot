# Manual de instalación y puesta en marcha — A11yPilot

**Rama principal actual:** `main` · **Versión declarada en paquetes:** 0.6.2 (raíz y frontend) / 0.6.0 (backend) · **Estado:** contiene Docker y escáner real, aún pendiente de verificación integral; no es una guía de despliegue público.

## 1. Antes de empezar

Instala Docker Desktop con contenedores Linux y Docker Compose V2. Para la ejecución completa, reserva recursos suficientes para SQL Server y Chromium (se recomiendan al menos 6 GB de RAM disponibles para Docker). Comprueba que los puertos 5173, 5174 y 3001 estén libres. Se necesita conexión a Internet para descargar las imágenes y el navegador.

Si quieres utilizar los comandos de calidad fuera de Docker, instala Node.js 22 y Git.

## 2. Obtener el código

En PowerShell:

```powershell
git clone https://github.com/Codeforgeettttt/A11yPilot.git
cd A11yPilot
```

Si ya existe un clon sin cambios locales por guardar y quieres actualizarlo desde la rama principal:

```powershell
git fetch origin
git switch main
git pull --ff-only origin main
```

## 3. Arrancar el modo completo (SQL Server + Express + React)

1. Inicia Docker Desktop.
2. Crea el archivo privado de configuración:

```powershell
Copy-Item .env.docker.example .env
notepad .env
```

3. Sustituye `MSSQL_SA_PASSWORD` por una contraseña privada que cumpla los requisitos de SQL Server (mayúscula, minúscula, número, símbolo y longitud suficiente). No la publiques ni la envíes en capturas.
4. Verifica y arranca:

```powershell
docker compose config --quiet
docker compose up --build -d
docker compose ps -a
```

5. Comprueba los servicios:
   - Web: http://localhost:5173
   - API: http://localhost:3001/api/health
   - Base de datos: http://localhost:3001/api/health/database

En la primera ejecución, `db-init` debe completar la creación/verificación de la base y sus tablas. Es normal que ese contenedor termine con código 0 después de trabajar.

## 4. Arrancar solo el modo demostración

```powershell
docker compose -f compose.demo.yaml up --build -d
```

Abre http://localhost:5174 y selecciona «Entrar en modo de prueba». No se conecta a SQL Server; el navegador almacena los datos simulados.

Para detener este modo:

```powershell
docker compose -f compose.demo.yaml down
```

## 5. Diagnóstico y recuperación

```powershell
docker compose ps -a
docker compose logs --tail=150 db db-init backend frontend
docker compose exec backend node -e "import('playwright').then(async ({chromium}) => {const b=await chromium.launch(); console.log('Chromium disponible'); await b.close()})"
```

- Si `db` no inicia, revisa la contraseña, memoria disponible y el registro del servicio.
- Si `db-init` termina con error, consulta sus logs antes de volver a lanzarlo: `docker compose run --rm db-init`.
- Si `localhost:5173` no abre, verifica que el puerto esté libre y que `frontend` siga iniciado.
- Si los análisis reales fallan, comprueba Chromium, los registros del backend y que la URL sea pública y esté autorizada.
- Si se modificó la contraseña luego de crear el volumen SQL Server, el cambio en `.env` no actualiza automáticamente la contraseña persistente.

Detén los contenedores sin borrar la base de datos:

```powershell
docker compose down
```

**Advertencia:** `docker compose down -v` elimina los volúmenes y puede borrar los datos. No lo ejecutes salvo que quieras reiniciar expresamente el entorno y tengas copia de seguridad.

## 6. Pruebas y entrega

Sigue [la matriz de pruebas](../pruebas/PLAN_PRUEBAS.md) y [las pruebas CI](../despliegue/PRUEBAS_CI.md). Guarda evidencias reales sin claves ni información personal. `LICENSE` y la publicación de `v1.0.0` siguen pendientes de la decisión del equipo y la aprobación de pruebas.

**Limitación:** estos pasos son de desarrollo local. Para publicar se requieren HTTPS, gestión segura de secretos y revisión de seguridad.
