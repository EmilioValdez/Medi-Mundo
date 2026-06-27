import type { Metadata } from "next";
import CatalogContent from "./catalog-content";
import { getCategories, getEquipment } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ortopedia y Equipo Médico en Querétaro | Venta y Renta | MediMundo",
  description:
    "Catálogo de ortopedia y equipo médico en Querétaro. Venta y renta de sillas de ruedas, camas, andaderas, fajas, collarines y equipo de diagnóstico. +20 años de experiencia.",
  alternates: { canonical: "https://medimundo.mx/catalogo" },
  openGraph: {
    title: "Catálogo de Equipo Médico en Querétaro | MediMundo",
    description:
      "Catálogo de ortopedia y equipo médico en Querétaro. Venta y renta de sillas de ruedas, camas, andaderas, fajas, collarines y equipo de diagnóstico. +20 años de experiencia.",
    url: "https://medimundo.mx/catalogo",
    images: [{ url: "https://medimundo.mx/images/silla-de-ruedas-renta-queretaro-medimundo.jpg" }],
  },
};

const CATEGORY_ORDER = [
  "camas-hospitalarias",
  "sillas-de-ruedas",
  "andaderas-bastones",
  "bano-seguridad",
  "equipos-apoyo",
  "concentradores-de-oxigeno",
  "ortopedia",
];

export default async function CatalogPage() {
  const [categories, equipment] = await Promise.all([
    getCategories(),
    getEquipment(),
  ]);

  type CatItem = { id: number; name: string; slug: string };
  const cats = categories as CatItem[];
  const sortedCategories: CatItem[] = [
    ...CATEGORY_ORDER.map((slug) => cats.find((c) => c.slug === slug)).filter(Boolean) as CatItem[],
    ...cats.filter((c) => !CATEGORY_ORDER.includes(c.slug)),
  ];

  return (
    <CatalogContent
      initialCategories={sortedCategories}
      initialEquipment={equipment as { id: number; name: string; images?: string[]; price_monthly?: number; price_sale?: number; category_name?: string; available?: boolean }[]}
    />
  );
}
