/**
 * Convierte una fecha en texto legible en formato colombiano.
 * Si no hay fecha, devuelve "Sin fecha".
 */
export function formatDate(value) {
  if (!value) return 'Sin fecha';
  return new Date(value).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
}
