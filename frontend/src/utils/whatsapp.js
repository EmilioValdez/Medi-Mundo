export const WA_NUMBER = '5214426156649';

export const WA_MESSAGES = {
  general:       'Hola, me interesa información sobre renta de equipo médico en MediMundo.',
  rentas:        'Hola, quiero información sobre renta de equipo médico. ¿Qué opciones tienen disponibles?',
  respiratorio:  'Hola, necesito información sobre concentradores de oxígeno en renta.',
  recargas:      'Hola, necesito una recarga de oxígeno medicinal. ¿Cuál es el proceso?',
  catalogo:      'Hola, estoy revisando el catálogo y me gustaría saber más sobre sus productos.',
  blog:          'Hola, leí un artículo en su blog y me interesa rentar equipo médico.',
  faq:           'Hola, tengo una pregunta sobre la renta de equipo médico en MediMundo.',
  contacto:      'Hola, me gustaría ponerme en contacto con MediMundo.',
  inogen:        'Hola, me interesa rentar un concentrador de oxígeno Inogen. ¿Qué modelos tienen disponibles?',
  adultoMayor:   'Hola, necesito equipo médico para el cuidado de un adulto mayor en casa.',
  noEncontro:    'Hola, estoy buscando un equipo médico que no encuentro en su catálogo. ¿Pueden ayudarme?',
};

export function trackWAClick(source = 'general') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'whatsapp_click', {
      event_category: 'conversion',
      event_label: source,
    });
  }
}

export function waLink(msg) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function waProductLink(productName) {
  return waLink(`Hola, me interesa rentar: *${productName}*. ¿Está disponible y cuál es el precio?`);
}
