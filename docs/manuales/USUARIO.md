# Manual de usuario — A11yPilot

**Alcance:** interfaz actual de la rama `Docker`, con un modo completo y otro de prueba. Los análisis completos usan Playwright + axe-core sobre sitios públicos autorizados; el modo de prueba utiliza resultados simulados. Ninguno certifica cumplimiento WCAG.

## 1. Entrar a la aplicación

- **Modo completo:** abre http://localhost:5173 después de iniciar los contenedores. En la pantalla de acceso, crea una cuenta con nombre, correo y contraseña; después inicia sesión. En este modo se utilizan API y SQL Server.
- **Modo de prueba:** abre http://localhost:5174 con `compose.demo.yaml` o entra desde la pantalla de acceso a la opción **«Entrar en modo de prueba (sin SQL Server)»**. Este modo no crea cuenta ni guarda información en SQL Server. Los datos se conservan en el almacenamiento del navegador y pueden perderse si este se limpia.

## 2. Crear y consultar proyectos

1. Abre **Proyectos** desde el menú.
2. Escribe un nombre de al menos tres caracteres y una descripción opcional.
3. Pulsa **Crear proyecto**.
4. Utiliza la búsqueda para localizar proyectos; puedes editar su información o eliminarlos con la confirmación correspondiente.

## 3. Registrar un sitio

1. Accede a **Sitios** y selecciona el proyecto correspondiente.
2. Escribe un nombre y una URL HTTP o HTTPS válida.
3. Marca la confirmación de que tienes autorización para evaluar ese sitio.
4. Guarda los datos. No introduzcas credenciales dentro de la URL.
5. Si editas la URL, confirma nuevamente la autorización.

## 4. Realizar un análisis

1. Entra a **Nuevo análisis**.
2. Selecciona un sitio registrado.
3. Confirma la autorización.
4. Pulsa **Analizar sitio**.
5. Revisa el progreso. En modo completo, el backend intenta abrir una página pública y analizarla con Chromium y axe-core. Si falla, revisa el mensaje y los registros.
6. Una vez completado, abre **Hallazgos** para examinar resultados. En modo de prueba, los resultados son ejemplos y no se visita la URL.

La duración depende del sitio y la conexión. Evita iniciar análisis repetidos mientras uno siga activo.

## 5. Seguimiento, historial e informes

- En **Hallazgos**, utiliza los filtros y cambia el estado de seguimiento cuando corresponda; consulta su historial de modificaciones.
- En **Historial**, revisa análisis anteriores y su estado.
- En **Informes**, identifica un análisis y pulsa **Descargar PDF**. Los reportes de demostración deben identificarse como simulados. No interpretes el PDF como un certificado de accesibilidad.

## 6. Preferencias de accesibilidad

Utiliza el panel de accesibilidad para ajustar contraste, tamaño del texto, espaciado y reducción del movimiento. Comprueba también la navegación con teclado y el foco visible; estos aspectos deben verificarse manualmente.

## 7. Problemas frecuentes

- **No aparecen los proyectos:** comprueba si estás en modo de prueba o completo y si la sesión está iniciada.
- **No se puede registrar un sitio:** revisa el formato de la URL y la confirmación de autorización.
- **Un análisis falla:** verifica que la URL sea pública, que el sitio responda y que los contenedores del modo completo estén activos.
- **No aparece un PDF:** asegúrate de haber ejecutado previamente un análisis y de permitir las descargas del navegador.

Las evidencias y casos pendientes se encuentran en [el plan de pruebas](../pruebas/PLAN_PRUEBAS.md).
