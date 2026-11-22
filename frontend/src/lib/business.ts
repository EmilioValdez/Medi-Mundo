/**
 * FUENTE ÚNICA de los datos del negocio (dirección, horario, mapa, reseñas).
 *
 * Footer, /recargas, /conocenos y cualquier página nueva deben importar de aquí.
 * No copies estos datos en otros archivos: así un rediseño o migración no puede
 * "perder" el horario o el mapa sin que lo note `npm run build`
 * (ver scripts/check-critical.mjs).
 */

export const BUSINESS = {
  name: "MediMundo",
  addressLine1: "Av. Canadá 230, Plaza de las Américas",
  addressLine2: "Col. Carretas, 76059 Querétaro, Qro.",
  postalCode: "76059",
  /** Coordenadas exactas de la ficha de Google Maps. */
  geo: { lat: 20.5877962, lng: -100.3752015 },
  phoneDisplay: "442 333 98 92",
  phoneTel: "+524423339892",
} as const;

/** Reseñas de Google. Actualizar cuando cambien (Perfil de Negocio → Reseñas). */
export const GOOGLE_REVIEWS = {
  rating: 4.9,
  count: 111,
  updated: "2026-11-21",
} as const;

/** Ficha de MediMundo en Google Maps (CID del Perfil de Negocio). */
export const MAPS_PLACE_URL = "https://maps.google.com/?cid=12909558412704502908";
export const MAPS_DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=" +
  encodeURIComponent("MediMundo, Av. Canadá 230, Plaza de las Américas, Querétaro");
export const MAPS_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3735.007167391934!2d-100.37788342450413!3d20.587764902778694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d344cb31c2fdb9%3A0xb327f6fa8468547c!2sMediMundo!5e0!3m2!1ses!2smx!4v1777221988631!5m2!1ses!2smx";

/** Horario en hora de Querétaro. open/close en horas (24h); null = cerrado. */
export const SCHEDULE = [
  { label: "Lunes a viernes", days: [1, 2, 3, 4, 5], open: 10, close: 19 },
  { label: "Sábado", days: [6], open: 10, close: 15 },
  { label: "Domingo", days: [0], open: null, close: null },
] as const;

export type ScheduleSlot = (typeof SCHEDULE)[number];

export function formatHours(slot: ScheduleSlot): string {
  if (slot.open === null) return "Cerrado";
  const fmt = (h: number) => `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? "pm" : "am"}`;
  return `${fmt(slot.open)} – ${fmt(slot.close!)}`;
}

/** ¿Está abierto ahora? Calculado en zona horaria de Querétaro (UTC-6). */
export function isOpenNow(date = new Date()): { open: boolean; todayIndex: number } {
  const local = new Date(date.toLocaleString("en-US", { timeZone: "America/Mexico_City" }));
  const day = local.getDay();
  const hour = local.getHours() + local.getMinutes() / 60;
  const todayIndex = SCHEDULE.findIndex((s) => (s.days as readonly number[]).includes(day));
  const slot = SCHEDULE[todayIndex];
  const open = slot.open !== null && hour >= slot.open && hour < slot.close!;
  return { open, todayIndex };
}
