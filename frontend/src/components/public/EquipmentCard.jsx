import { Link } from 'react-router-dom';
import formatMXN from '../../utils/formatMXN';

const WA_NUMBER = '524421234567';

const categoryPlaceholders = {
  'sillas de ruedas': { emoji: '\u267F', bg: 'bg-blue-100', text: 'text-blue-600' },
  'camas hospitalarias': { emoji: '\uD83D\uDECF\uFE0F', bg: 'bg-indigo-100', text: 'text-indigo-600' },
  'andaderas y bastones': { emoji: '\uD83E\uDDAF', bg: 'bg-green-100', text: 'text-green-600' },
  'concentradores de oxigeno': { emoji: '\uD83D\uDCA8', bg: 'bg-cyan-100', text: 'text-cyan-600' },
  'concentradores de ox\u00edgeno': { emoji: '\uD83D\uDCA8', bg: 'bg-cyan-100', text: 'text-cyan-600' },
  'cpap / bipap': { emoji: '\uD83D\uDE34', bg: 'bg-purple-100', text: 'text-purple-600' },
  'nebulizadores': { emoji: '\uD83D\uDC8A', bg: 'bg-pink-100', text: 'text-pink-600' },
  'muletas': { emoji: '\uD83E\uDE7C', bg: 'bg-amber-100', text: 'text-amber-600' },
  'colchones antiescaras': { emoji: '\uD83D\uDECB\uFE0F', bg: 'bg-teal-100', text: 'text-teal-600' },
};

function getPlaceholder(categoryName) {
  if (!categoryName) return { emoji: '\uD83C\uDFE5', bg: 'bg-gray-100', text: 'text-gray-500' };
  const key = categoryName.toLowerCase();
  for (const [k, v] of Object.entries(categoryPlaceholders)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return { emoji: '\uD83C\uDFE5', bg: 'bg-gray-100', text: 'text-gray-500' };
}

export default function EquipmentCard({ item }) {
  const waMsg = encodeURIComponent(
    `Hola, me interesa rentar: ${item.name}. \u00BFPodr\u00EDan darme m\u00E1s informaci\u00F3n?`
  );

  const imageUrl = item.images?.[0] || item.image_url || null;
  const placeholder = getPlaceholder(item.category_name);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`${imageUrl ? 'hidden' : ''} flex h-full w-full flex-col items-center justify-center ${placeholder.bg}`}>
          <span className="text-5xl">{placeholder.emoji}</span>
          <span className={`mt-2 text-xs font-medium ${placeholder.text}`}>{item.category_name || 'Equipo m\u00E9dico'}</span>
        </div>
        {item.available !== undefined && (
          <span
            className={`absolute top-2 right-2 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              item.available
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {item.available ? 'Disponible' : 'No disponible'}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {item.category_name && (
          <span className="mb-1 text-xs font-medium uppercase tracking-wider text-primary-600">
            {item.category_name}
          </span>
        )}
        <h3 className="mb-2 text-base font-semibold text-gray-900 line-clamp-2">{item.name}</h3>

        {/* Prices */}
        <div className="mt-auto mb-3 grid grid-cols-3 gap-2 text-center">
          {item.price_daily != null && (
            <div className="rounded-lg bg-gray-50 px-2 py-1.5">
              <div className="text-xs text-gray-500">Diario</div>
              <div className="text-sm font-bold text-gray-900">{formatMXN(item.price_daily)}</div>
            </div>
          )}
          {item.price_weekly != null && (
            <div className="rounded-lg bg-gray-50 px-2 py-1.5">
              <div className="text-xs text-gray-500">Semanal</div>
              <div className="text-sm font-bold text-gray-900">{formatMXN(item.price_weekly)}</div>
            </div>
          )}
          {item.price_monthly != null && (
            <div className="rounded-lg bg-primary-50 px-2 py-1.5">
              <div className="text-xs text-primary-600">Mensual</div>
              <div className="text-sm font-bold text-primary-700">{formatMXN(item.price_monthly)}</div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/equipo/${item.id}`}
            className="btn-primary flex-1 text-xs py-2"
          >
            Ver detalles
          </Link>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp text-xs py-2 px-3"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
