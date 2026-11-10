# Decisiones técnicas · Entrega 1

- **React + Vite**: componentes y desarrollo local rápido.
- **Express**: API separada de la presentación.
- **SQL Server + Sequelize + Tedious**: base relacional prevista en la ficha técnica.
- **Simulación en backend**: datos de ejemplo explícitos; el servidor no visita direcciones ingresadas.
- **Sin autenticación**: el MVP se ejecuta solo en la computadora del estudiante. No exponer a Internet.
- **SQL Server por configuración**: credenciales en `.env`, nunca en Git.
- **Sequelize `sync()`**: inicialización simple para tablas nuevas. Las migraciones de producción quedan pendientes.
- **Accesibilidad**: estructura semántica, alto contraste global, zoom de texto, espaciado, reducción de movimiento, gestión de foco y controles con nombre.
- **Sin fuentes propietarias incluidas**: se usan nombres de familia y alternativas. Integrar los archivos de Intro Rust, Archivo Black y Nunito únicamente si se cuenta con las licencias correspondientes.

## Límites del MVP

No hay autenticación, autorización por usuario, worker aislado, Playwright ni axe-core ejecutándose sobre páginas. Los resultados de análisis son simulados. El acceso externo a esta API está fuera del alcance.
