import { Link } from 'react-router-dom';
import formatMXN from '../../utils/formatMXN';

const WA_NUMBER = '524422237757';

const categoryPlaceholders = {
  'sillas de ruedas':          { emoji: '♿',  bg: 'bg-blue-50',   text: 'text-blue-500' },
  'camas hospitalarias':       { emoji: '🛏️', bg: 'bg-indigo-50', text: 'text-indigo-500' },
  'andaderas y bastones':      { emoji: '🦯',  bg: 'bg-green-50',  text: 'text-green-500' },
  'concentradores de oxigeno': { emoji: '💨',  bg: 'bg-cyan-50',   text: 'text-cyan-500' },
  'concentradores de oxígeno': { emoji: '💨',  bg: 'bg-cyan-50',   text: 'text-cyan-500' },
  'cpap / bipap':              { emoji: '😴',  bg: 'bg-purple-50', text: 'text-purple-500' },
  'nebulizadores':             { emoji: '💊',  bg: 'bg-pink-50',   text: 'text-pink-500' },
  'muletas':                   { emoji: '🩼',  bg: 'bg-amber-50',  text: 'text-amber-500' },
  'colchones antiescaras':     { emoji: '🛋️', bg: 'bg-teal-50',   text: 'text-teal-500' },
  'equipos de apoyo':          { emoji: '🏥',  bg: 'bg-gray-50',   text: 'text-gray-500' },
};

function getPlaceholder(categoryName) {
  if (!categoryName) return { emoji: '🏥', bg: 'bg-gray-50', text: 'text-gray-400' };
  const key = categoryName.toLowerCase();
  for (const [k, v] of Object.entries(categoryPlaceholders)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return { emoji: '🏥', bg: 'bg-gray-50', text: 'text-gray-400' };
}

export default function EquipmentCard({ item, showPrices = false }) {
  const waMsg = encodeURIComponent(
    `Hola, me interesa rentar: ${item.name}. ¿Podrían darme más información?`
  );

  const imageUrl = item.images?.[0] || item.image_url || null;
  const placeholder = getPlaceholder(item.category_name);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5">

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`${imageUrl ? 'hidden' : ''} flex h-full w-full flex-col items-center justify-center ${placeholder.bg}`}>
          <span className="text-6xl">{placeholder.emoji}</span>
        </div>

        {/* Availability badge */}
        {item.available !== undefined && (
          <span className={`absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm ${
            item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {item.available ? 'Disponible' : 'No disponible'}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">

        {item.category_name && (
          <span className="text-[11px] font-semibold uppercase tracking-widest text-primary-500 mb-1">
            {item.category_name}
          </span>
        )}
        <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2">{item.name}</h3>

        {/* Monthly price only */}
        {showPrices && item.price_monthly != null && (
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Renta mensual</p>
              <p className="text-2xl font-extrabold text-primary-600 leading-none">
                {formatMXN(item.price_monthly)}
              </p>
            </div>
            {item.deposit > 0 && (
              <span className="text-xs text-gray-400 bg-gray-50 rounded-lg px-2 py-1 border border-gray-100">
                Depósito {formatMXN(item.deposit)}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Link to={`/equipo/${item.id}`} className="btn-primary flex-1 text-xs py-2.5">
            Ver detalles
          </Link>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp text-xs py-2.5 px-3.5"
            aria-label="Preguntar por WhatsApp"
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
