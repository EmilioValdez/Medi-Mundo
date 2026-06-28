export const WA_NUMBER = "524423339892";

export const WA_MESSAGES = {
  general:    "Hola, me interesa información sobre renta de equipo médico en MediMundo.",
  rentas:     "Hola, quiero información sobre renta de equipo médico. ¿Qué opciones tienen disponibles?",
  inogen:     "Hola, me interesa rentar un concentrador de oxígeno Inogen. ¿Qué modelos tienen disponibles?",
  recargas:   "Hola, necesito una recarga de oxígeno medicinal. ¿Cuál es el proceso?",
  catalogo:   "Hola, estoy revisando el catálogo y me gustaría saber más sobre sus productos.",
  blog:       "Hola, leí un artículo en su blog y me interesa rentar equipo médico.",
  faq:        "Hola, tengo una pregunta sobre la renta de equipo médico en MediMundo.",
  contacto:   "Hola, me gustaría ponerme en contacto con MediMundo.",
  noEncontro: "Hola, estoy buscando un equipo médico que no encuentro en su catálogo. ¿Pueden ayudarme?",
};

export function waLink(msg: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function trackWAClick(location: string) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "whatsapp_click", {
      event_category: "conversion",
      event_label: location,
    });
  }
}
