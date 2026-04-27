import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import apiClient from '../../api/client';
import EquipmentCard from '../../components/public/EquipmentCard';

// Preferred name-keyword ordering for equipment cards
const PREFERRED_ORDER = [
  'lujo',
  'eléctrica',
  'electrica',
  'manual',
  'inogen',
  'concentrador',
  'silla',
  'andadera',
  'bastón',
  'baston',
  'ortopedia',
];

function sortEquipment(items) {
  return [...items].sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();
    const rankA = PREFERRED_ORDER.findIndex(k => nameA.includes(k));
    const rankB = PREFERRED_ORDER.findIndex(k => nameB.includes(k));
    const ra = rankA === -1 ? PREFERRED_ORDER.length : rankA;
    const rb = rankB === -1 ? PREFERRED_ORDER.length : rankB;
    return ra - rb;
  });
}

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selectedCat, setSelectedCat] = useState(searchParams.get('categoria') || '');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Resolve ?slug= param to a category id once categories load
  useEffect(() => {
    apiClient.get('/categories/').then((res) => {
      const cats = Array.isArray(res.data) ? res.data : [];
      setCategories(cats);

      const slugParam = searchParams.get('slug');
      if (slugParam) {
        const match = cats.find(c => c.slug === slugParam);
        if (match) {
          setSelectedCat(String(match.id));
        }
      }
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { active_only: true };
    if (selectedCat) params.category_id = selectedCat;
    if (search.trim()) params.search = search.trim();

    apiClient.get('/equipment/', { params })
      .then((res) => {
        const items = Array.isArray(res.data) ? res.data : [];
        setEquipment(sortEquipment(items));
      })
      .catch(() => setEquipment([]))
      .finally(() => setLoading(false));
  }, [selectedCat, search]);

  const handleCatClick = (catId) => {
    const newCat = catId === selectedCat ? '' : catId;
    setSelectedCat(newCat);
    const p = new URLSearchParams();
    if (newCat) p.set('categoria', newCat);
    if (search.trim()) p.set('q', search.trim());
    setSearchParams(p);
    setMobileFiltersOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (search.trim()) p.set('q', search.trim());
    if (selectedCat) p.set('categoria', selectedCat);
    setSearchParams(p);
  };

  const clearFilters = () => {
    setSelectedCat('');
    setSearch('');
    setSearchParams({});
  };

  const Sidebar = () => (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Categorías</h3>
      <button
        onClick={() => handleCatClick('')}
        className={`block w-full text-left rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          !selectedCat ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        Todas
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleCatClick(String(cat.id))}
          className={`block w-full text-left rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            String(selectedCat) === String(cat.id)
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Catálogo de Equipo Médico en Querétaro | MediMundo</title>
        <meta name="description" content="Catálogo completo de equipo médico en renta en Querétaro. Camas hospitalarias, sillas de ruedas, concentradores de oxígeno, movilidad y más." />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Catálogo de equipo médico</h1>
          <p className="mt-1 text-gray-500">Encuentra el equipo que necesitas para tu recuperación o cuidado en casa.</p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar equipo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button type="submit" className="btn-primary">Buscar</button>
          <button
            type="button"
            className="lg:hidden btn-white"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <FunnelIcon className="h-5 w-5" />
          </button>
        </form>

        {/* Active filters */}
        {(selectedCat || search) && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500">Filtros:</span>
            {selectedCat && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                {categories.find((c) => String(c.id) === String(selectedCat))?.name || 'Categoría'}
                <button onClick={() => handleCatClick('')}>
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                "{search}"
                <button onClick={() => { setSearch(''); const p = new URLSearchParams(); if (selectedCat) p.set('categoria', selectedCat); setSearchParams(p); }}>
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            <button onClick={clearFilters} className="text-xs text-primary-600 hover:underline">
              Limpiar todo
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <Sidebar />
          </aside>

          {/* Mobile filter drawer */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="fixed inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
              <div className="fixed inset-y-0 left-0 w-72 bg-white p-6 shadow-xl overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Filtros</h2>
                  <button onClick={() => setMobileFiltersOpen(false)}>
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
                <Sidebar />
              </div>
            </div>
          )}

          {/* Equipment grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
              </div>
            ) : equipment.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg font-medium text-gray-900">No se encontró equipo</p>
                <p className="mt-1 text-sm text-gray-500">Intenta ajustar tus filtros de búsqueda.</p>
                <button onClick={clearFilters} className="btn-primary mt-4">
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <p className="mb-4 text-sm text-gray-500">{equipment.length} equipo(s) encontrado(s)</p>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {equipment.map((item) => (
                    <EquipmentCard key={item.id} item={item} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
