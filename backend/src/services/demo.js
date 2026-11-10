// Son ejemplos fijos. Este servicio no realiza solicitudes HTTP al sitio registrado.
export const sampleFindings=[
 {rule:'color-contrast',wcag:'1.4.3 Contraste (mínimo)',title:'Contraste insuficiente',description:'El texto podría ser difícil de leer sobre el fondo.',recommendation:'Verificar el contraste de colores y ajustar la combinación hasta cumplir el criterio aplicable.',selector:'.hero__description',impact:'Serio'},
 {rule:'image-alt',wcag:'1.1.1 Contenido no textual',title:'Imagen sin texto alternativo',description:'Una imagen informativa no tiene una descripción accesible.',recommendation:'Agregar un texto alternativo que transmita la función o información de la imagen.',selector:'img.feature-image',impact:'Crítico'},
 {rule:'label',wcag:'1.3.1 Información y relaciones',title:'Campo sin etiqueta asociada',description:'Un control de formulario carece de un nombre accesible.',recommendation:'Asociar una etiqueta visible con el input correspondiente.',selector:'input#email',impact:'Serio'},
 {rule:'link-name',wcag:'2.4.4 Propósito de los enlaces',title:'Enlace ambiguo',description:'El propósito de un enlace no se entiende fuera de contexto.',recommendation:'Usar texto de enlace que describa su destino.',selector:'a.read-more',impact:'Moderado'}
];
