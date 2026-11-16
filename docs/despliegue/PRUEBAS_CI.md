# Pruebas automáticas de Docker

El flujo [Docker branch checks](../../.github/workflows/docker-checks.yml) comprueba los cambios de la rama `Docker` y de los Pull Requests dirigidos a `main`.

## Qué revisa

- Instalación reproducible de las dependencias mediante `npm ci`.
- Análisis estático con `npm run lint`.
- Formato con `npm run format:check`.
- Pruebas de backend y frontend con `npm test`.
- Compilación de la interfaz con `npm run build`.
- Interpretación de `docker-compose.yml` y construcción de imágenes Docker.
- Arranque y respuesta HTTP del frontend del modo demo (`http://127.0.0.1:5174/`).

El valor de `MSSQL_SA_PASSWORD` usado para validar Compose es **ficticio y temporal**; la prueba no inicia SQL Server.

## Qué no sustituye

Este flujo no comprueba el funcionamiento completo de SQL Server, el registro de usuarios, el análisis real con Chromium ni el PDF de extremo a extremo. Son pruebas de integración que deben realizarse con el sistema iniciado localmente antes de fusionar.

Las comprobaciones de calidad pueden marcar problemas de formato o advertencias del código existente. Si una comprobación aparece en rojo, revisa los registros y corrige la causa; no ignores un fallo solo porque la configuración y el Dockerfile existan.

## Consultar resultados

1. En GitHub, abre **Actions**.
2. Selecciona **Docker branch checks**.
3. Abre la ejecución correspondiente a la rama `Docker`.
4. Entra al trabajo que falló y despliega el paso indicado.

La comprobación de Prettier recorre el repositorio, pero es **informativa** mediante `continue-on-error: true`: sus diferencias quedan en el registro y no bloquean los otros trabajos de CI. No se modifica el formato del código del equipo. Antes de publicar una versión debe acordarse cómo resolver la deuda de estilo.

El flujo también permite ejecución manual mediante **Run workflow**, siempre que GitHub Actions exponga la opción para esa rama.
