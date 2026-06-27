import type { Metadata } from "next";
import CatalogContent from "./catalog-content";
import { getCategories, getEquipment } from "@/lib/api";
import { isCatalogItem } from "@/lib/rentalItems";

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

export default async function CatalogPage() {
  const [categories, allEquipment] = await Promise.all([
    getCategories(),
    getEquipment(),
  ]);

  type EqItem = { id: number; name: string; images?: string[]; price_monthly?: number; price_sale?: number; category_name?: string; available?: boolean };
  const equipment = (allEquipment as EqItem[]).filter(isCatalogItem);

  return (
    <CatalogContent
      initialCategories={categories as { id: number; name: string; slug: string }[]}
      initialEquipment={equipment}
    />
  );
}
