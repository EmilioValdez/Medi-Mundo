import type { Metadata } from "next";
import { getEquipmentById } from "@/lib/api";
import EquipmentDetail from "./equipment-detail";
import { notFound } from "next/navigation";

interface Equipment {
  id: number;
  name: string;
  images?: string[];
  image_url?: string;
  available?: boolean;
  description?: string;
  category_name?: string;
  price_daily?: number;
  price_weekly?: number;
  price_monthly?: number;
  deposit?: number;
  serial_number?: string;
  condition?: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = (await getEquipmentById(id)) as Equipment | null;
  if (!item) return { title: "Equipo no encontrado — MediMundo" };
  return {
    title: `${item.name} en renta en Querétaro — MediMundo`,
    description: item.description
      ? item.description.slice(0, 155)
      : `Renta de ${item.name} en Querétaro. Entrega a domicilio, sanitizado y con soporte técnico. Contáctanos en MediMundo.`,
    alternates: { canonical: `https://medimundo.mx/equipo/${id}` },
  };
}

export default async function EquipmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = (await getEquipmentById(id)) as Equipment | null;
  if (!item) notFound();
  return <EquipmentDetail item={item} />;
}
