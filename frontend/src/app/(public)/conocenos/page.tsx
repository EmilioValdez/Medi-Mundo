import type { Metadata } from "next";
import ConocenosContent from "./conocenos-content";
import { pageTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageTitle("Quiénes Somos: Tienda de Ortopedia en Querétaro"),
  description:
    "Somos MediMundo, tienda de ortopedia y renta de equipo médico en Querétaro con más de 20 años. Visítanos en Plaza de las Américas o escríbenos por WhatsApp.",
  alternates: { canonical: "https://medimundo.mx/conocenos" },
  openGraph: {
    title: "Conócenos — MediMundo Querétaro",
    description:
      "Somos MediMundo, tienda de ortopedia y renta de equipo médico en Querétaro con más de 20 años. Visítanos en Plaza de las Américas o escríbenos por WhatsApp.",
    url: "https://medimundo.mx/conocenos",
    images: [{ url: "https://medimundo.mx/images/tienda-medimundo-queretaro.jpg" }],
  },
};

export default function ConocenosPage() {
  return <ConocenosContent />;
}
