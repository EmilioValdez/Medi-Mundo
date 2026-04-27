import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import apiClient from '../../api/client';
import EquipmentCard from '../../components/public/EquipmentCard';
import { isRentalItem } from '../../utils/rentalItems';

// Order: 1-manual 2-eléctrica 3-lujo 4-silla 5-reposet 6-grúa
const RENTAL_ORDER = ['manual', 'eléctrica', 'electrica', 'lujo', 'silla', 'reposet', 'grúa', 'grua'];

const SPECS_MAP = [
  {
    match: (n) => n.includes('manual'),
    specs: {
      features: ['Cama Manual con Ruedas', 'Altura de 38 a 58 cm', 'Profundidad 223 cm, Ancho: 91.2 cm', 'Soporta hasta 150 Kg'],
      pagare: 9000,
    },
  },
  {
    match: (n) => n.includes('lujo'),
    specs: {
      features: ['Cama Eléctrica de Lujo con Ruedas', 'Altura de 45 a 75 cm', 'Profundidad 211.5 cm, Ancho: 110 cm', 'Soporta hasta 250 Kg'],
      pagare: 22000,
    },
  },
  {
    match: (n) => n.includes('eléctrica') || n.includes('electrica'),
    specs: {
      features: ['Cama Eléctrica con Ruedas', 'Altura de 45 a 79 cm', 'Profundidad 223 cm, Ancho: 90 cm', 'Soporta hasta 250 Kg'],
      pagare: 17000,
    },
  },
  {
    match: (n) => n.includes('reposet'),
    specs: {
      features: ['Sillón Reposet Eléctrico', 'Altura de 66 cm', 'Profundidad 50.5 cm', 'Soporta hasta 100 Kg'],
      pagare: 15000,
    },
  },
  {
    match: (n) => n.includes('grúa') || n.includes('grua'),
    specs: {
      features: ['Grúa Hidráulica con Arnés y Ruedas con Freno de Seguridad', 'Altura de 53 a 171 cm', 'Profundidad 98 cm, Ancho: 62 a 126 cm', 'Soporta hasta 180 Kg'],
      pagare: 18000,
    },
  },
  {
    match: (n) => n.includes('mesa'),
    specs: {
      features: ['Mesa de alimento con ruedas', 'Altura de 79 a 112 cm', 'Profundidad 66.5 cm, Ancho: 39 cm', 'Soporta hasta 10 Kg (Mesa 8 Kg)'],
      pagare: 1000,
    },
  },
];

function getSpecs(name) {
  const n = (name || '').toLowerCase();
  return SPECS_MAP.find(s => s.match(n))?.specs || null;
}

function sortRentals(items) {
  return [...items].sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();
    const rankA = RENTAL_ORDER.findIndex(k => nameA.includes(k));
    const rankB = RENTAL_ORDER.findIndex(k => nameB.includes(k));
    const ra = rankA === -1 ? RENTAL_ORDER.length : rankA;
    const rb = rankB === -1 ? RENTAL_ORDER.length : rankB;
    return ra - rb;
  });
}

export default function RentasPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/equipment/', { params: { active_only: true } })
      .then((res) => {
        const all = Array.isArray(res.data) ? res.data : [];
        setItems(sortRentals(all.filter(item => isRentalItem(item.name))));
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Renta de Camas Hospitalarias en Querétaro | MediMundo</title>
        <meta name="description" content="Renta de camas hospitalarias manuales y eléctricas, grúa hidráulica y sillón reposet a domicilio en Querétaro. Precios por día, semana y mes." />
      </Helmet>

      <div
        className="min-h-screen"
        style={{
          backgroundImage: 'url(/images/fondo-rentas.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
        }}
      >
      <div className="min-h-screen" style={{ background: 'rgba(255,255,255,0.65)' }}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Renta de Mobiliario Médico</h1>
          <p className="mt-1 text-gray-500">Camas hospitalarias, grúa hidráulica y sillón reposet con entrega a domicilio en Querétaro.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center text-gray-500">No hay equipo disponible en este momento.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(item => (
              <EquipmentCard key={item.id} item={item} showPrices specs={getSpecs(item.name)} />
            ))}
          </div>
        )}
      </div>
      </div>
      </div>
    </>
  );
}
