/**
 * Ejecuta una acción y actualiza la información visible.
 * Devuelve false si la escritura falla para conservar los datos del formulario.
 */
export async function submitAndRefresh(action, refresh, onSuccess, onError, successMessage = '') {
  try {
    await action();
  } catch (error) {
    onError(error?.message || 'No se pudo completar la operación.');
    return false;
  }
  try {
    await refresh();
    if (successMessage) onSuccess(successMessage);
  } catch (error) {
    onError('Los cambios se guardaron, pero no se pudo actualizar la vista: ' + (error?.message || 'Error de conexión') + '. Intenta recargar.');
  }
  return true;
}
