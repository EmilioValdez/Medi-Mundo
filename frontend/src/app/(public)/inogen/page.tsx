import type { Metadata } from "next";
import InogenContent from "./inogen-content";
import { pageTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageTitle("Concentradores de Oxígeno Inogen en Querétaro"),
  description:
    "Venta de concentradores de oxígeno portátiles Inogen One G3, G4, G5 y Inogen At Home en Querétaro. Paquetes con garantía de 3 años, aprobados FAA y FDA. Entrega a domicilio.",
  alternates: { canonical: "https://medimundo.mx/inogen" },
  openGraph: {
    title: "Venta de Concentradores Inogen en Querétaro | MediMundo",
    description:
      "Venta de concentradores de oxígeno portátiles Inogen One G3, G4, G5 y Inogen At Home en Querétaro. Garantía de 3 años, aprobados FAA y FDA.",
    url: "https://medimundo.mx/inogen",
    images: [{ url: "https://medimundo.mx/images/concentrador-oxigeno-portatil-inogen-one-g5-renta-queretaro.jpg" }],
  },
};

export default function InogenPage() {
  return <InogenContent />;
}
