# A11yPilot · Guía de uso de la entrega del MVP

## Qué contiene el proyecto

Frontend React/Vite, API Node/Express, configuración Sequelize/Tedious para SQL Server, modo demo en el navegador, pruebas, documentación y manual de identidad gráfica.

## Preparación en Windows

1. Descarga el ZIP del repositorio o clona el proyecto; abre la carpeta raíz con Visual Studio Code.
2. Instala las dependencias con `npm.cmd run install:all`.
3. **Demo sin SQL Server:** ejecuta `npm.cmd run dev:demo` y abre http://localhost:5173.
4. **Modo con base de datos:** configura `backend/.env` a partir de `backend/.env.example`, utilizando tus credenciales locales, y ejecuta `npm.cmd run dev`.
5. Para una instalación nueva consulta el README antes de configurar o sembrar la base de datos. Nunca inicialices una base de datos con información importante sin una copia de seguridad.

## Cuando ya utilizas PM2

No ejecutes una segunda copia de Vite/Express en los mismos puertos. Detén la anterior o actualiza la ruta de los procesos PM2. SQL Server debe iniciarse por separado.

## Verificación

- `npm.cmd run build`
- `npm.cmd run test`
- Comprobación manual de registro, proyectos, sitios, simulación, historial, seguimiento, PDF y preferencias de accesibilidad en escritorio y móvil.

## Alcance académico

Los resultados y los PDF contienen **hallazgos simulados**, no auditorías WCAG reales. Docker y la integración de un escáner automatizado con Playwright/axe-core son etapas posteriores.
