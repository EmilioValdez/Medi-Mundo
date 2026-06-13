import type { Metadata } from "next";
import { getEquipment } from "@/lib/api";
import { isRentalItem } from "@/lib/rentalItems";
import EquipmentCard from "@/components/EquipmentCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Renta de Equipo Médico en Querétaro | Camas, Sillas de Ruedas y Más | MediMundo",
  description:
    "Renta de equipo médico a domicilio en Querétaro. Camas hospitalarias, sillas de ruedas, andaderas, grúa hidráulica y más. Entrega el mismo día.",
  alternates: { canonical: "https://medimundo.mx/rentas" },
  openGraph: {
    title: "Renta de Camas Hospitalarias en Querétaro | MediMundo",
    description:
      "Renta de equipo médico a domicilio en Querétaro. Camas hospitalarias, sillas de ruedas, andaderas, grúa hidráulica y más. Entrega el mismo día.",
    url: "https://medimundo.mx/rentas",
    images: [{ url: "https://medimundo.mx/images/cama-hospitalaria-manual-medimundo-queretaro.jpg" }],
  },
};

const RENTAL_ORDER = ["manual", "eléctrica", "electrica", "lujo", "silla", "reposet", "grúa", "grua"];

const SPECS_MAP = [
  {
    match: (n: string) => n.includes("manual"),
    specs: {
      features: ["Cama Manual con Ruedas", "Altura de 38 a 58 cm", "Profundidad 223 cm, Ancho: 91.2 cm", "Soporta hasta 150 Kg"],
      pagare: 9000,
    },
  },
  {
    match: (n: string) => n.includes("lujo"),
    specs: {
      features: ["Cama Eléctrica de Lujo con Ruedas", "Altura de 45 a 75 cm", "Profundidad 211.5 cm, Ancho: 110 cm", "Soporta hasta 250 Kg"],
      pagare: 22000,
    },
  },
  {
    match: (n: string) => n.includes("eléctrica") || n.includes("electrica"),
    specs: {
      features: ["Cama Eléctrica con Ruedas", "Altura de 45 a 79 cm", "Profundidad 223 cm, Ancho: 90 cm", "Soporta hasta 250 Kg"],
      pagare: 17000,
    },
  },
  {
    match: (n: string) => n.includes("reposet"),
    specs: {
      features: ["Sillón Reposet Eléctrico", "Altura de 66 cm", "Profundidad 50.5 cm", "Soporta hasta 100 Kg"],
      pagare: 15000,
    },
  },
  {
    match: (n: string) => n.includes("grúa") || n.includes("grua"),
    specs: {
      features: ["Grúa Hidráulica con Arnés y Ruedas con Freno de Seguridad", "Altura de 53 a 171 cm", "Profundidad 98 cm, Ancho: 62 a 126 cm", "Soporta hasta 180 Kg"],
      pagare: 18000,
    },
  },
  {
    match: (n: string) => n.includes("mesa"),
    specs: {
      features: ["Mesa de alimento con ruedas", "Altura de 79 a 112 cm", "Profundidad 66.5 cm, Ancho: 39 cm", "Soporta hasta 10 Kg (Mesa 8 Kg)"],
      pagare: 1000,
    },
  },
];

function getSpecs(name: string) {
  const n = (name || "").toLowerCase();
  return SPECS_MAP.find((s) => s.match(n))?.specs ?? null;
}

function sortRentals(items: { name?: string }[]) {
  return [...items].sort((a, b) => {
    const nameA = (a.name || "").toLowerCase();
    const nameB = (b.name || "").toLowerCase();
    const rankA = RENTAL_ORDER.findIndex((k) => nameA.includes(k));
    const rankB = RENTAL_ORDER.findIndex((k) => nameB.includes(k));
    const ra = rankA === -1 ? RENTAL_ORDER.length : rankA;
    const rb = rankB === -1 ? RENTAL_ORDER.length : rankB;
    return ra - rb;
  });
}

export default async function RentasPage() {
  const allEquipment = (await getEquipment()) as { id: number; name: string; images?: string[]; price_monthly?: number; category_name?: string; available?: boolean }[];
  const items = sortRentals(allEquipment.filter((item) => isRentalItem(item.name))) as typeof allEquipment;

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url(/images/fondo-rentas.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
          zIndex: -1,
        }}
      />
      <div className="min-h-screen" style={{ background: "rgba(255,255,255,0.65)", position: "relative" }}>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Renta de Mobiliario Médico</h1>
            <p className="mt-1 text-gray-500">
              Camas hospitalarias, grúa hidráulica y sillón reposet con entrega a domicilio en Querétaro.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="py-20 text-center text-gray-500">No hay equipo disponible en este momento.</div>
          ) : (
            <>
              <h2 className="sr-only">Equipos disponibles en renta</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <EquipmentCard key={item.id} item={item} specs={getSpecs(item.name)} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
