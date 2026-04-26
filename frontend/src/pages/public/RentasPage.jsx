import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import apiClient from '../../api/client';
import EquipmentCard from '../../components/public/EquipmentCard';
import { isRentalItem } from '../../utils/rentalItems';

// Order: 1-lujo 2-eléctrica 3-manual 4-silla 5-reposet 6-grúa
const RENTAL_ORDER = ['lujo', 'eléctrica', 'electrica', 'manual', 'silla', 'reposet', 'grúa', 'grua'];

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
        <title>Rentas — MediMundo</title>
        <meta name="description" content="Renta de camas hospitalarias, grúa hidráulica y sillón reposet a domicilio en Querétaro. Precios por día, semana y mes." />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Equipo en renta</h1>
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
              <EquipmentCard key={item.id} item={item} showPrices />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
