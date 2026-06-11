"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import EquipmentCard from "@/components/EquipmentCard";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://medimundo.mx";

const PREFERRED_ORDER = ["lujo", "eléctrica", "electrica", "manual", "inogen", "concentrador", "silla", "andadera", "bastón", "baston", "ortopedia"];

function sortEquipment(items: Equipment[]) {
  return [...items].sort((a, b) => {
    const nameA = (a.name || "").toLowerCase();
    const nameB = (b.name || "").toLowerCase();
    const rankA = PREFERRED_ORDER.findIndex((k) => nameA.includes(k));
    const rankB = PREFERRED_ORDER.findIndex((k) => nameB.includes(k));
    const ra = rankA === -1 ? PREFERRED_ORDER.length : rankA;
    const rb = rankB === -1 ? PREFERRED_ORDER.length : rankB;
    return ra - rb;
  });
}

interface Category {
  id: number;
  name: string;
  slug: string;
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

function CatalogInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [selectedCat, setSelectedCat] = useState(searchParams.get("categoria") ?? "");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then((r) => r.json())
      .then((data) => {
        const cats: Category[] = Array.isArray(data) ? data : [];
        setCategories(cats);
        const slugParam = searchParams.get("slug");
        if (slugParam) {
          const match = cats.find((c) => c.slug === slugParam);
          if (match) setSelectedCat(String(match.id));
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = new URL(`${API}/api/equipment`);
    url.searchParams.set("active_only", "true");
    if (selectedCat) url.searchParams.set("category_id", selectedCat);
    if (search.trim()) url.searchParams.set("search", search.trim());

    fetch(url.toString())
      .then((r) => r.json())
      .then((data) => setEquipment(sortEquipment(Array.isArray(data) ? data : [])))
      .catch(() => setEquipment([]))
      .finally(() => setLoading(false));
  }, [selectedCat, search]);

  const updateURL = (cat: string, q: string) => {
    const p = new URLSearchParams();
    if (cat) p.set("categoria", cat);
    if (q.trim()) p.set("q", q.trim());
    router.push(`/catalogo${p.toString() ? "?" + p.toString() : ""}`, { scroll: false });
  };

  const handleCatClick = (catId: string) => {
    const newCat = catId === selectedCat ? "" : catId;
    setSelectedCat(newCat);
    updateURL(newCat, search);
    setMobileFiltersOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL(selectedCat, search);
  };

  const clearFilters = () => {
    setSelectedCat("");
    setSearch("");
    router.push("/catalogo", { scroll: false });
  };

  const SidebarContent = () => (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Categorías</p>
      <button
        onClick={() => handleCatClick("")}
        className={`block w-full text-left rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          !selectedCat ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-100"
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
              ? "bg-primary-50 text-primary-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Catálogo de equipo médico</h1>
        <p className="mt-1 text-gray-500">Encuentra el equipo que necesitas para tu recuperación o cuidado en casa.</p>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
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
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
          </svg>
        </button>
      </form>

      {(selectedCat || search) && (
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500">Filtros:</span>
          {selectedCat && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
              {categories.find((c) => String(c.id) === String(selectedCat))?.name || "Categoría"}
              <button onClick={() => handleCatClick("")}>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {search && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              &ldquo;{search}&rdquo;
              <button onClick={() => { setSearch(""); updateURL(selectedCat, ""); }}>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          <button onClick={clearFilters} className="text-xs text-primary-600 hover:underline">
            Limpiar todo
          </button>
        </div>
      )}

      <div className="flex gap-8">
        <aside className="hidden lg:block w-56 shrink-0">
          <SidebarContent />
        </aside>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-72 bg-white p-6 shadow-xl overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filtros</h2>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <SidebarContent />
            </div>
          </div>
        )}

        <div className="flex-1">
          <h2 className="sr-only">Equipo médico disponible</h2>
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
  );
}

export default function CatalogContent() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      }
    >
      <CatalogInner />
    </Suspense>
  );
}
