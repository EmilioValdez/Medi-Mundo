import { GOOGLE_REVIEWS, MAPS_PLACE_URL } from "@/lib/business";

function Stars({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <span className="flex gap-0.5" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} className={`${className} text-amber-400`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

/** Insignia compacta "4.9 ★★★★★ · 111 reseñas en Google" que enlaza a la ficha. */
export function GoogleRatingBadge({ dark = false }: { dark?: boolean }) {
  return (
    <a
      href={MAPS_PLACE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
        dark
          ? "border-gray-700 bg-gray-800/60 hover:border-amber-400/60"
          : "border-gray-200 bg-white hover:border-amber-300 shadow-sm"
      }`}
      aria-label={`Calificación ${GOOGLE_REVIEWS.rating} de 5 en Google con ${GOOGLE_REVIEWS.count} reseñas`}
    >
      <span className={`text-3xl font-extrabold ${dark ? "text-white" : "text-gray-900"}`}>
        {GOOGLE_REVIEWS.rating.toFixed(1)}
      </span>
      <span className="flex flex-col">
        <Stars className="h-4 w-4" />
        <span className={`mt-1 text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>
          {GOOGLE_REVIEWS.count} reseñas en Google
        </span>
      </span>
    </a>
  );
}

/** Bloque de logro para /conocenos. */
export function GoogleRatingAchievement() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-8 text-center shadow-sm sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">Nuestro mayor logro</p>
      <div className="mt-4 flex items-center justify-center gap-4">
        <span className="text-6xl font-extrabold text-gray-900 sm:text-7xl">
          {GOOGLE_REVIEWS.rating.toFixed(1)}
        </span>
        <span className="flex flex-col items-start">
          <Stars className="h-6 w-6" />
          <span className="mt-1 text-sm font-medium text-gray-600">de 5 en Google</span>
        </span>
      </div>
      <p className="mx-auto mt-5 max-w-xl text-gray-700 leading-relaxed">
        <strong>{GOOGLE_REVIEWS.count} familias de Querétaro</strong> han calificado nuestro servicio en
        Google. Cada reseña es de un cliente real que rentó, compró o recargó con nosotros, y es la
        mejor prueba de que cuidamos a tus pacientes como si fueran nuestros.
      </p>
      <a
        href={MAPS_PLACE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-6 inline-flex"
      >
        Leer las reseñas en Google
      </a>
    </div>
  );
}
