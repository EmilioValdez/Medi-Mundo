"use client";

import Link from "next/link";
import { waLink, trackWAClick } from "@/lib/whatsapp";

const PLACEHOLDERS: Record<string, { emoji: string; bg: string }> = {
  "sillas de ruedas":          { emoji: "♿",  bg: "bg-blue-50" },
  "camas hospitalarias":       { emoji: "🛏️", bg: "bg-indigo-50" },
  "andaderas y bastones":      { emoji: "🦯",  bg: "bg-green-50" },
  "concentradores de oxigeno": { emoji: "💨",  bg: "bg-cyan-50" },
  "concentradores de oxígeno": { emoji: "💨",  bg: "bg-cyan-50" },
  "equipos de apoyo":          { emoji: "🏥",  bg: "bg-gray-50" },
  "baño y seguridad":          { emoji: "🚿",  bg: "bg-teal-50" },
};

function getPlaceholder(name?: string) {
  if (!name) return { emoji: "🏥", bg: "bg-gray-50" };
  const key = name.toLowerCase();
  for (const [k, v] of Object.entries(PLACEHOLDERS)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return { emoji: "🏥", bg: "bg-gray-50" };
}

function formatMXN(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
}

interface Equipment {
  id: number;
  name: string;
  images?: string[];
  image_url?: string;
  price_monthly?: number;
  category_name?: string;
  available?: boolean;
}

interface Specs {
  features: string[];
  pagare?: number;
}

export default function EquipmentCard({
  item,
  specs = null,
}: {
  item: Equipment;
  showPrices?: boolean;
  specs?: Specs | null;
}) {
  const imageUrl = item.images?.[0] ?? item.image_url ?? null;
  const placeholder = getPlaceholder(item.category_name);
  const [namePrefix, ...rest] = item.name.split(" ");
  const nameSuffix = rest.join(" ");
  const waMsg = waLink(`Hola, me interesa rentar: *${item.name}*. ¿Está disponible y cuál es el precio?`);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg">
      <div
        className={`relative flex items-center justify-center px-8 pt-8 pb-4 ${imageUrl ? "bg-white" : placeholder.bg}`}
        style={{ minHeight: "220px" }}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={`${item.name} en renta en Querétaro — MediMundo`}
            loading="lazy"
            className="max-h-48 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <span className="text-6xl">{placeholder.emoji}</span>
        )}
        {item.available !== undefined && (
          <span className={`absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            item.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {item.available ? "Disponible" : "No disponible"}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-4">
        <h3 className="text-xl font-bold leading-snug">
          <span className="text-gray-900">{namePrefix} </span>
          {nameSuffix && <span className="text-sky-600">{nameSuffix}</span>}
        </h3>

        {item.price_monthly != null ? (
          <div className="mt-3">
            <p className="text-4xl font-black text-gray-900 leading-none">{formatMXN(item.price_monthly)}</p>
            <p className="mt-1 text-sm text-gray-400">Pago Mensual</p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-400">Consultar precio</p>
        )}

        {specs?.features && specs.features.length > 0 && (
          <ul className="mt-3 space-y-1">
            {specs.features.map((f, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        )}

        {specs?.pagare != null && specs.pagare > 0 && (
          <p className="mt-2 text-xs font-semibold text-primary-600">
            Pagaré por {formatMXN(specs.pagare)}
          </p>
        )}

        <a
          href={waMsg}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWAClick("catalogo_card")}
          className="btn-whatsapp mt-5 w-full justify-center py-3 text-sm"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Rentar este producto
        </a>

        <Link
          href={`/equipo/${item.id}`}
          className="mt-2 text-center text-sm text-gray-400 hover:text-sky-600 transition-colors"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
}
