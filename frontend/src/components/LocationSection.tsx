import {
  BUSINESS,
  MAPS_DIRECTIONS_URL,
  MAPS_EMBED_SRC,
  MAPS_PLACE_URL,
} from "@/lib/business";
import { waLink, WA_MESSAGES } from "@/lib/whatsapp";
import StoreHours from "@/components/StoreHours";
import { GoogleRatingBadge } from "@/components/GoogleRating";

/**
 * Mapa + horario + reseñas + contacto. Se muestra en TODAS las páginas públicas
 * (vive dentro de <Footer />). Se perdió una vez en la migración Vite → Next.js
 * (jun 2026); scripts/check-critical.mjs hace fallar el build si se vuelve a quitar.
 */
export default function LocationSection() {
  return (
    <section id="ubicacion" aria-labelledby="ubicacion-titulo" className="border-b border-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="overflow-hidden rounded-2xl border border-gray-700 lg:col-span-3" style={{ minHeight: 320 }}>
            <iframe
              title="Ubicación de MediMundo en Google Maps"
              src={MAPS_EMBED_SRC}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 320, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="flex flex-col gap-5 lg:col-span-2">
            <div>
              <h2 id="ubicacion-titulo" className="text-xl font-bold text-white">Visítanos en Querétaro</h2>
              <a
                href={MAPS_PLACE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-sm text-gray-400 hover:text-white transition-colors"
              >
                {BUSINESS.addressLine1}
                <br />
                {BUSINESS.addressLine2}
                <span className="mt-1 block font-semibold text-sky-400">Ver en Google Maps →</span>
              </a>
            </div>

            <GoogleRatingBadge dark />

            <StoreHours dark />

            <div className="flex flex-wrap gap-3">
              <a href={MAPS_DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Cómo llegar
              </a>
              <a href={`tel:${BUSINESS.phoneTel}`} className="inline-flex items-center rounded-lg border border-gray-600 px-4 py-2 text-sm font-semibold text-white hover:border-gray-400 transition-colors">
                Llamar · {BUSINESS.phoneDisplay}
              </a>
              <a href={waLink(WA_MESSAGES.general)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                WhatsApp · {BUSINESS.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
