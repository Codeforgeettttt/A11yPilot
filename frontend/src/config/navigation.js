import {
  ClipboardList,
  FileText,
  Folder,
  Globe,
  History,
  LayoutDashboard,
  ScanSearch,
  ShieldCheck,
} from 'lucide-react';

/**
 * Secciones del panel, en el orden del menú lateral.
 * - id: lo que aparece en la URL (?page=projects).
 * - name: el nombre en el menú y en el título.
 * - icon: el icono del menú.
 * - lede: la frase que aparece debajo del título de la página.
 */
export const NAV = [
  {
    id: 'dashboard',
    name: 'Resumen',
    icon: LayoutDashboard,
    lede: 'Consulta el estado de tus proyectos y los análisis registrados.',
  },
  {
    id: 'projects',
    name: 'Proyectos',
    icon: Folder,
    lede: 'Organiza los sitios que necesitas revisar.',
  },
  {
    id: 'sites',
    name: 'Sitios web',
    icon: Globe,
    lede: 'Administra las direcciones autorizadas para evaluar.',
  },
  {
    id: 'analysis',
    name: 'Nuevo análisis',
    icon: ScanSearch,
    lede: 'Analiza la accesibilidad de un sitio registrado.',
  },
  {
    id: 'findings',
    name: 'Hallazgos',
    icon: ClipboardList,
    lede: 'Revisa los problemas detectados y registra el avance de su corrección.',
  },
  {
    id: 'history',
    name: 'Historial',
    icon: History,
    lede: 'Consulta las ejecuciones guardadas en el sistema.',
  },
  {
    id: 'reports',
    name: 'Reportes',
    icon: FileText,
    lede: 'Descarga el informe PDF de cada análisis.',
  },
  {
    id: 'profile',
    name: 'Mi cuenta',
    icon: ShieldCheck,
    lede: 'Consulta y actualiza tu perfil y contraseña.',
  },
];

/** Devuelve la sección indicada en la URL (?page=...), o el Resumen si no hay ninguna válida. */
export function getPageFromUrl() {
  const page = new URLSearchParams(window.location.search).get('page');
  return NAV.some((item) => item.id === page) ? page : 'dashboard';
}
