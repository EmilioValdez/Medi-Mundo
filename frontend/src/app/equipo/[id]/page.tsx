import type { Metadata } from "next";
import { getEquipmentById } from "@/lib/api";
import EquipmentDetail from "./equipment-detail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = (await getEquipmentById(id)) as { name?: string } | null;
  const name = item?.name ?? "Equipo médico";
  return {
    title: `${name} — MediMundo`,
  };
}

export default function EquipmentPage() {
  return <EquipmentDetail />;
}
