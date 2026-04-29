import { useState, useEffect } from 'react';
import { waLink, WA_MESSAGES } from '../../utils/whatsapp';

const PHONE_DISPLAY = '442 615 6649';

// Schedule in Querétaro local time (UTC-6, no DST since 2023)
const SCHEDULE = [
  { label: 'Lunes a Viernes', days: [1, 2, 3, 4, 5], open: 10, close: 19, closeLabel: '19:00' },
  { label: 'Sábado',          days: [6],               open: 10, close: 15, closeLabel: '15:00' },
  { label: 'Domingo',         days: [0],               open: null, close: null, closeLabel: null },
];

function getQroNow() {
  const now = new Date();
  // Use Mexico City timezone (Querétaro follows the same, UTC-6 year-round since 2023)
  const local = new Date(now.toLocaleString('en-US', { timeZone: 'America/Mexico_City' }));
  return { day: local.getDay(), hour: local.getHours() };
}

function getRowStatus(slot) {
  const { day, hour } = getQroNow();
  const isToday = slot.days.includes(day);
  if (!isToday) return null; // don't show badge for other days
  if (slot.open === null) return 'closed';
  return hour >= slot.open && hour < slot.close ? 'open' : 'closed';
}

const MAP_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3735.007167391934!2d-100.37788342450413!3d20.587764902778694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d344cb31c2fdb9%3A0xb327f6fa8468547c!2sMediMundo!5e0!3m2!1ses!2smx!4v1777221988631!5m2!1ses!2smx';

export default function LocationSection() {
  const [, tick] = useState(0);

  // Refresh status badge every minute
  useEffect(() => {
    const id = setInterval(() => tick(t => t + 1), 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Map — 3/5 width on desktop */}
          <div className="lg:col-span-3 overflow-hidden rounded-2xl border border-gray-200 shadow-sm" style={{ minHeight: '340px' }}>
            <iframe
              title="MediMundo ubicación"
              src={MAP_SRC}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '340px', display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Info — 2/5 width on desktop */}
          <div className="lg:col-span-2 flex flex-col justify-center gap-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Querétaro</h2>
              <p className="mt-1 text-sm text-gray-500">
                Av. Canadá 230, Plaza de las Américas,<br />
                Col. Carretas, CP 76010, Querétaro, Qro.
              </p>
            </div>

            {/* Hours */}
            <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 overflow-hidden">
              {SCHEDULE.map((slot) => {
                const status = getRowStatus(slot);
                return (
                  <div key={slot.label} className="flex items-center justify-between px-4 py-3 bg-white">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="h-4 w-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      <span>
                        <span className="font-medium">{slot.label}:</span>{' '}
                        {slot.open !== null
                          ? `${String(slot.open).padStart(2, '0')}:00 – ${slot.closeLabel}`
                          : 'Cerrado'}
                      </span>
                    </div>
                    {status && (
                      <span className={`ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        status === 'open'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {status === 'open' ? 'Abierto' : 'Cerrado'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* WhatsApp button */}
            <a
              href={waLink(WA_MESSAGES.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp justify-center text-base py-3 px-6"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
