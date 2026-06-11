import type { Metadata } from "next";
import CatalogContent from "./catalog-content";

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

export default function CatalogPage() {
  return <CatalogContent />;
}
