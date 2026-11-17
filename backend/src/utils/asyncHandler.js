/**
 * Envuelve una ruta async de Express para que, si lanza un error,
 * este llegue al manejador de errores de app.js en lugar de perderse
 * y dejar la petición colgada.
 *
 * Uso: router.get('/ruta', asyncHandler(async (req, res) => { ... }));
 */
export function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}
