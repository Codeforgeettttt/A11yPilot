// Traduce los errores técnicos del scanner a mensajes que cualquier usuario entienda.

/** Error que ya tiene un mensaje pensado para el usuario. */
export class AnalysisError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AnalysisError';
  }
}

// Fragmentos de los errores de Chromium/Playwright y el mensaje que mostramos para cada uno.
const KNOWN_ERRORS = [
  [
    /Timeout|ERR_TIMED_OUT/i,
    'La página tardó demasiado en cargar (más de 30 segundos). Inténtalo más tarde.',
  ],
  [/ERR_NAME_NOT_RESOLVED/i, 'No se encontró el sitio. Revisa que la dirección esté bien escrita.'],
  [/ERR_CERT_|SSL_PROTOCOL_ERROR/i, 'El certificado de seguridad (HTTPS) del sitio no es válido.'],
  [
    /ERR_CONNECTION_REFUSED|ERR_CONNECTION_RESET|ERR_CONNECTION_CLOSED|ERR_EMPTY_RESPONSE|ERR_TUNNEL_CONNECTION_FAILED|ERR_ADDRESS_UNREACHABLE/i,
    'No se pudo conectar con el sitio. Puede estar caído o rechazar las conexiones.',
  ],
  [/ERR_TOO_MANY_REDIRECTS/i, 'La página redirige demasiadas veces y no termina de cargar.'],
];

/** Devuelve un mensaje claro en español para cualquier error del análisis. */
export function friendlyError(error) {
  // Nuestros propios errores (por ejemplo, la protección SSRF) ya traen un mensaje claro.
  if (error?.name === 'UrlNotAllowedError' || error instanceof AnalysisError) return error.message;
  const text = `${error?.name ?? ''} ${error?.message ?? ''}`;
  for (const [pattern, message] of KNOWN_ERRORS) {
    if (pattern.test(text)) return message;
  }
  return 'No se pudo analizar la página por un error inesperado. Inténtalo de nuevo más tarde.';
}

/** Lanza un error claro si la página respondió con un código HTTP de error (404, 500…). */
export function assertPageLoaded(status) {
  if (status === 404)
    throw new AnalysisError('La página no existe (error 404). Revisa la dirección.');
  if (status === 401 || status === 403) {
    throw new AnalysisError(`El sitio no permite el acceso a esta página (error ${status}).`);
  }
  if (status >= 500)
    throw new AnalysisError(
      `El sitio tiene un problema interno (error ${status}). Inténtalo más tarde.`,
    );
  if (status >= 400)
    throw new AnalysisError(`La página respondió con un error (código ${status}).`);
}
