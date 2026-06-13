"use client";

import { useState } from "react";
import { waLink } from "@/lib/whatsapp";

function waMsg(model: string, label?: string, name?: string) {
  return waLink(`Hola, me interesa comprar *${model}${label ? " " + label : ""}${name ? " — " + name : ""}*. ¿Pueden darme más información?`);
}

function WaIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ImagePlaceholder({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center bg-gray-50 text-gray-300 rounded-xl ${className}`}>
      <svg className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 3h18M3 21h18" />
      </svg>
      <span className="text-xs">Próximamente</span>
    </div>
  );
}

function FeatureIcon({ type, highlight }: { type: string; highlight?: boolean }) {
  const iconStyle = { color: highlight ? "#243e8c" : "#9ca3af" };
  const cls = "h-5 w-5 shrink-0";
  if (type === "warranty") return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} style={iconStyle}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  );
  if (type === "faa") return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} style={iconStyle}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
  );
  if (type === "weight") return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} style={iconStyle}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.59 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
    </svg>
  );
  if (type === "flow") return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} style={iconStyle}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
    </svg>
  );
  if (type === "battery") return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} style={iconStyle}>
      <rect x="2" y="8" width="15" height="8" rx="1.5" />
      <path strokeLinecap="round" d="M17 11.5h2a.5.5 0 0 1 .5.5v0a.5.5 0 0 1-.5.5h-2" />
      <line x1="5" y1="11" x2="5" y2="13" strokeLinecap="round" />
      <line x1="8" y1="11" x2="8" y2="13" strokeLinecap="round" />
    </svg>
  );
  return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} style={iconStyle}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

const G2_SPECS = [
  { label: "Peso", value: "3.17 kg (7 lbs)" },
  { label: "Dimensiones", value: "22cm x 18cm x 8cm" },
  { label: "Flujo", value: "1 – 4 litros por minuto" },
  { label: "Ruido", value: "<38 dBA en ajuste 2" },
  { label: "Batería chica", value: "Dura 4 horas en ajuste 2" },
  { label: "Batería grande", value: "Dura 8 horas en ajuste 2" },
  { label: "Consumo conectado", value: "40W a 100W en AC y DC" },
  { label: "Operación", value: "Controles intuitivos y pantalla LCD de fácil lectura" },
];
const G3_SPECS = [
  { label: "Peso", value: "2.7 kg (5.95 lbs)" },
  { label: "Dimensiones", value: "22cm x 18cm x 8cm" },
  { label: "Flujo", value: "1 – 5 litros por minuto" },
  { label: "Ruido", value: "<39 dBA en ajuste 2" },
  { label: "Batería chica", value: "Dura 4.5 hrs en 1LPM" },
  { label: "Batería grande", value: "Dura 9 hrs en 1LPM" },
  { label: "Consumo conectado", value: "40W a 120W en AC y DC" },
  { label: "Operación", value: "Controles intuitivos y pantalla LCD de fácil lectura" },
];
const G4_SPECS = [
  { label: "Peso", value: "1.27 kg (2.79 lbs)" },
  { label: "Dimensiones", value: "15cm x 18.28cm x 6.5cm" },
  { label: "Flujo", value: "1 – 3 litros por minuto" },
  { label: "Ruido", value: "<40 dBA en ajuste 2" },
  { label: "Batería grande", value: "Dura 5 hrs en 1LPM" },
  { label: "Consumo conectado", value: "40W a 120W en AC y DC" },
  { label: "Operación", value: "Controles intuitivos y pantalla LCD de fácil lectura" },
];
const G5_SPECS = [
  { label: "Peso", value: "2.2 kg (4.7 lbs)" },
  { label: "Dimensiones", value: "18.26cm x 20.7cm x 8.31cm" },
  { label: "Flujo", value: "1 – 6 litros por minuto" },
  { label: "Ruido", value: "<38 dBA en ajuste 2" },
  { label: "Batería chica", value: "Dura 6.5 hrs en 1LPM" },
  { label: "Batería grande", value: "Dura 13 hrs en 1LPM" },
  { label: "Consumo conectado", value: "40W a 120W en AC y DC" },
  { label: "Operación", value: "Controles intuitivos y pantalla LCD de fácil lectura" },
];

interface Feature { text: string; highlight?: boolean; icon: string; }
interface Include { label: string; image: string; }
interface Spec { label: string; value: string; }
interface Product {
  id: string;
  name: string;
  model: string;
  label?: string;
  category: string;
  price?: number | null;
  badge?: string;
  image?: string;
  description: string;
  features?: Feature[];
  includes?: Include[];
  specs?: Spec[];
  soldOut?: boolean;
}

const MODELS_PRODUCTS: Record<string, Product[]> = {
  g5: [
    { id: "g5-basico", name: "Inogen One G5", model: "Inogen One G5", label: "Paquete Básico", category: "concentrador", price: 69000, badge: "1 Batería chica", image: "/images/inogen-g5-png.webp", description: "Concentrador de oxígeno portátil Inogen One G5 con 3 años de garantía. Aprobado por la FDA y certificado FAA para uso en avión.", features: [{ text: "3 Años de garantía", highlight: true, icon: "warranty" },{ text: "Certificado FAA (uso en avión)", icon: "faa" },{ text: "2.2 kg (4.7 lbs)", icon: "weight" },{ text: "Flujo de 1-6 (LPM)", icon: "flow" },{ text: "1 Batería chica (6.5 hrs)", icon: "battery" }], includes: [{ label: "Equipo", image: "/images/inogen-g5-png.webp" },{ label: "Mochila de transporte", image: "/images/inogen-one-g5-mochila.jpg" },{ label: "Cargador (AC) de pared", image: "/images/inogen-one-g5-cargador-pared.jpg" },{ label: "Cargador (DC) para auto", image: "/images/inogen-one-g5-cargador-auto.jpg" },{ label: "Una (1) Batería chica", image: "/images/inogen-one-g5-bateria-chica.jpg" }], specs: G5_SPECS },
    { id: "g5-plus", name: "Inogen One G5", model: "Inogen One G5", label: "Paquete Plus", category: "concentrador", price: 74500, badge: "1 Batería grande", image: "/images/inogen-g5-png.webp", description: "Inogen One G5 con batería grande para mayor autonomía. Hasta 13 horas sin conectar a la corriente.", features: [{ text: "3 Años de garantía", highlight: true, icon: "warranty" },{ text: "Certificado FAA (uso en avión)", icon: "faa" },{ text: "2.2 kg (4.7 lbs)", icon: "weight" },{ text: "Flujo de 1-6 (LPM)", icon: "flow" },{ text: "1 Batería grande (13 hrs)", icon: "battery" }], includes: [{ label: "Equipo", image: "/images/inogen-g5-png.webp" },{ label: "Mochila de transporte", image: "/images/inogen-one-g5-mochila.jpg" },{ label: "Cargador (AC) de pared", image: "/images/inogen-one-g5-cargador-pared.jpg" },{ label: "Cargador (DC) para auto", image: "/images/inogen-one-g5-cargador-auto.jpg" },{ label: "Una (1) Batería grande", image: "/images/inogen-one-g5-bateria-grande.jpg" }], specs: G5_SPECS },
    { id: "g5-tres", name: "Inogen One G5", model: "Inogen One G5", label: "Paquete Tres", category: "concentrador", price: 83000, badge: "2 Baterías chicas", image: "/images/inogen-g5-png.webp", description: "Inogen One G5 con dos baterías chicas para mayor flexibilidad. Intercambia baterías y mantén el equipo funcionando sin interrupciones.", features: [{ text: "3 Años de garantía", highlight: true, icon: "warranty" },{ text: "Certificado FAA (uso en avión)", icon: "faa" },{ text: "2.2 kg (4.7 lbs)", icon: "weight" },{ text: "Flujo de 1-6 (LPM)", icon: "flow" },{ text: "2 Baterías chicas (6.5 hrs c/u)", icon: "battery" }], includes: [{ label: "Equipo", image: "/images/inogen-g5-png.webp" },{ label: "Mochila de transporte", image: "/images/inogen-one-g5-mochila.jpg" },{ label: "Cargador (AC) de pared", image: "/images/inogen-one-g5-cargador-pared.jpg" },{ label: "Cargador (DC) para auto", image: "/images/inogen-one-g5-cargador-auto.jpg" },{ label: "Dos (2) Baterías chicas", image: "/images/inogen-one-g5-bateria-chica.jpg" }], specs: G5_SPECS },
    { id: "g5-cuatro", name: "Inogen One G5", model: "Inogen One G5", label: "Paquete Cuatro", category: "concentrador", price: 88000, badge: "1 Bat. grande + 1 Bat. chica", image: "/images/inogen-g5-png.webp", description: "El paquete más completo del Inogen One G5. Batería grande y batería chica para hasta 19 horas combinadas de autonomía.", features: [{ text: "3 Años de garantía", highlight: true, icon: "warranty" },{ text: "Certificado FAA (uso en avión)", icon: "faa" },{ text: "2.2 kg (4.7 lbs)", icon: "weight" },{ text: "Flujo de 1-6 (LPM)", icon: "flow" },{ text: "1 Bat. grande + 1 Bat. chica", icon: "battery" }], includes: [{ label: "Equipo", image: "/images/inogen-g5-png.webp" },{ label: "Mochila de transporte", image: "/images/inogen-one-g5-mochila.jpg" },{ label: "Cargador (AC) de pared", image: "/images/inogen-one-g5-cargador-pared.jpg" },{ label: "Cargador (DC) para auto", image: "/images/inogen-one-g5-cargador-auto.jpg" },{ label: "Una (1) Batería grande", image: "/images/inogen-one-g5-bateria-grande.jpg" },{ label: "Una (1) Batería chica", image: "/images/inogen-one-g5-bateria-chica.jpg" }], specs: G5_SPECS },
    { id: "g5-bat-chica", name: "Batería chica", model: "Inogen One G5", category: "bateria", price: 11900, image: "/images/inogen-one-g5-bateria-chica.jpg", description: "Batería chica original para Inogen One G5. Hasta 6.5 horas de autonomía en ajuste 1LPM.", specs: G5_SPECS },
    { id: "g5-bat-grande", name: "Batería grande", model: "Inogen One G5", category: "bateria", price: 16000, image: "/images/inogen-one-g5-bateria-grande.jpg", description: "Batería grande original para Inogen One G5. Hasta 13 horas de autonomía en ajuste 1LPM.", specs: G5_SPECS },
    { id: "g5-cargador-externo", name: "Cargador externo", model: "Inogen One G5", category: "accesorio", price: 8800, image: "/images/inogen-one-g5-cargador-externo.jpg", description: "Cargador externo para baterías del Inogen One G5. Permite cargar una batería de repuesto mientras el equipo opera." },
    { id: "g5-cargador-pared", name: "Cargador de pared (AC)", model: "Inogen One G5", category: "accesorio", price: 5100, image: "/images/inogen-one-g5-cargador-pared.jpg", description: "Cargador de corriente alterna original para Inogen One G5." },
    { id: "g5-cargador-auto", name: "Cargador de auto (DC)", model: "Inogen One G5", category: "accesorio", price: 2200, image: "/images/inogen-one-g5-cargador-auto.jpg", description: "Cargador de corriente directa para mantener el Inogen One G5 cargado en el automóvil." },
    { id: "g5-mochila", name: "Mochila de transporte", model: "Inogen One G5", category: "accesorio", price: 3700, image: "/images/inogen-one-g5-mochila.jpg", description: "Mochila original diseñada para el Inogen One G5." },
    { id: "g5-backpack", name: "Backpack", model: "Inogen One G5", category: "accesorio", price: 3700, image: "/images/inogen-one-g5-backpack.jpg", description: "Backpack para Inogen One G5, cómodo y discreto para uso diario." },
    { id: "g5-carrito", name: "Carrito de transporte", model: "Inogen One G5", category: "accesorio", price: 4000, image: "/images/inogen-one-g5-carrito.jpg", description: "Carrito de transporte para el Inogen One G5. Ruedas y asa retráctil para desplazarse sin esfuerzo." },
  ],
  g4: [
    { id: "g4-plus", name: "Inogen One G4", model: "Inogen One G4", label: "Paquete Plus", category: "concentrador", price: 62500, badge: "1 Batería grande", image: "/images/inogen-g4-png.webp", description: "El concentrador de oxígeno más compacto y ligero de Inogen. Solo 1.27 kg, ideal para quien prioriza discreción y portabilidad.", features: [{ text: "3 Años de garantía", highlight: true, icon: "warranty" },{ text: "Certificado FAA (uso en avión)", icon: "faa" },{ text: "1.27 kg (2.79 lbs)", icon: "weight" },{ text: "Flujo de 1-3 (LPM)", icon: "flow" },{ text: "1 Batería grande (5 hrs)", icon: "battery" }], includes: [{ label: "Equipo", image: "/images/inogen-g4-png.webp" },{ label: "Mochila de transporte", image: "/images/inogen-one-g4-mochila.jpg" },{ label: "Cargador (AC) de pared", image: "/images/inogen-one-g4-cargador-pared.jpg" },{ label: "Cargador (DC) para auto", image: "/images/inogen-one-g4-cargador-auto.jpg" },{ label: "Una (1) Batería grande", image: "/images/inogen-one-g4-bateria-grande.jpg" }], specs: G4_SPECS },
    { id: "g4-cuatro", name: "Inogen One G4", model: "Inogen One G4", label: "Paquete Cuatro", category: "concentrador", price: 77500, badge: "2 Baterías grandes", image: "/images/inogen-g4-png.webp", description: "Inogen One G4 con dos baterías grandes para hasta 10 horas de autonomía. El paquete más completo del modelo más ligero.", features: [{ text: "3 Años de garantía", highlight: true, icon: "warranty" },{ text: "Certificado FAA (uso en avión)", icon: "faa" },{ text: "1.27 kg (2.79 lbs)", icon: "weight" },{ text: "Flujo de 1-3 (LPM)", icon: "flow" },{ text: "2 Baterías grandes (5 hrs c/u)", icon: "battery" }], includes: [{ label: "Equipo", image: "/images/inogen-g4-png.webp" },{ label: "Mochila de transporte", image: "/images/inogen-one-g4-mochila.jpg" },{ label: "Cargador (AC) de pared", image: "/images/inogen-one-g4-cargador-pared.jpg" },{ label: "Cargador (DC) para auto", image: "/images/inogen-one-g4-cargador-auto.jpg" },{ label: "Dos (2) Baterías grandes", image: "/images/inogen-one-g4-bateria-grande.jpg" }], specs: G4_SPECS },
    { id: "g4-bat-grande", name: "Batería grande", model: "Inogen One G4", category: "bateria", price: 16000, image: "/images/inogen-one-g4-bateria-grande.jpg", description: "Batería grande original para Inogen One G4. Hasta 5 horas de autonomía en ajuste 1LPM.", specs: G4_SPECS },
    { id: "g4-cargador-externo", name: "Cargador externo", model: "Inogen One G4", category: "accesorio", price: 8800, image: "/images/inogen-one-g4-cargador-externo.jpg", description: "Cargador externo para baterías del Inogen One G4." },
    { id: "g4-cargador-pared", name: "Cargador de pared (AC)", model: "Inogen One G4", category: "accesorio", price: 5100, image: "/images/inogen-one-g4-cargador-pared.jpg", description: "Cargador de corriente alterna original para Inogen One G4." },
    { id: "g4-cargador-auto", name: "Cargador de auto (DC)", model: "Inogen One G4", category: "accesorio", price: 2200, image: "/images/inogen-one-g4-cargador-auto.jpg", description: "Cargador de corriente directa para Inogen One G4 en el automóvil." },
    { id: "g4-mochila", name: "Mochila de transporte", model: "Inogen One G4", category: "accesorio", price: 3700, image: "/images/inogen-one-g4-mochila.jpg", description: "Mochila original diseñada para el Inogen One G4." },
    { id: "g4-backpack", name: "Backpack", model: "Inogen One G4", category: "accesorio", price: 3700, image: "/images/inogen-one-g4-backpack.jpg", description: "Backpack para Inogen One G4, cómodo y discreto para uso diario." },
  ],
  g3: [
    { id: "g3-basico", name: "Inogen One G3", model: "Inogen One G3", label: "Paquete Básico", category: "concentrador", price: 57500, badge: "1 Batería chica", image: "/images/inogen-g3-png.png", description: "Concentrador de oxígeno portátil Inogen One G3 con 3 años de garantía. Ligero y eficiente, aprobado por la FDA y certificado FAA.", features: [{ text: "3 Años de garantía", highlight: true, icon: "warranty" },{ text: "Certificado FAA (uso en avión)", icon: "faa" },{ text: "2.7 kg (5.95 lbs)", icon: "weight" },{ text: "Flujo de 1-5 (LPM)", icon: "flow" },{ text: "1 Batería chica (4.5 hrs)", icon: "battery" }], includes: [{ label: "Equipo", image: "/images/inogen-g3-png.png" },{ label: "Mochila de transporte", image: "/images/inogen-one-g3-mochila.jpg" },{ label: "Cargador (AC) de pared", image: "/images/inogen-one-g3-cargador-pared.jpg" },{ label: "Cargador (DC) para auto", image: "/images/inogen-one-g3-cargador-auto.jpg" },{ label: "Una (1) Batería chica", image: "/images/inogen-one-g3-bateria-chica.jpg" }], specs: G3_SPECS },
    { id: "g3-plus", name: "Inogen One G3", model: "Inogen One G3", label: "Paquete Plus", category: "concentrador", price: 62500, badge: "1 Batería grande", image: "/images/inogen-g3-png.png", description: "Inogen One G3 con batería grande para mayor autonomía. Hasta 9 horas sin conectar a la corriente.", features: [{ text: "3 Años de garantía", highlight: true, icon: "warranty" },{ text: "Certificado FAA (uso en avión)", icon: "faa" },{ text: "2.7 kg (5.95 lbs)", icon: "weight" },{ text: "Flujo de 1-5 (LPM)", icon: "flow" },{ text: "1 Batería grande (9 hrs)", icon: "battery" }], includes: [{ label: "Equipo", image: "/images/inogen-g3-png.png" },{ label: "Mochila de transporte", image: "/images/inogen-one-g3-mochila.jpg" },{ label: "Cargador (AC) de pared", image: "/images/inogen-one-g3-cargador-pared.jpg" },{ label: "Cargador (DC) para auto", image: "/images/inogen-one-g3-cargador-auto.jpg" },{ label: "Una (1) Batería grande", image: "/images/inogen-one-g3-bateria-grande.jpg" }], specs: G3_SPECS },
    { id: "g3-dos", name: "Inogen One G3", model: "Inogen One G3", label: "Paquete Dos", category: "concentrador", price: 62500, badge: "2 Baterías chicas", image: "/images/inogen-g3-png.png", description: "Inogen One G3 con dos baterías chicas para mayor flexibilidad.", features: [{ text: "3 Años de garantía", highlight: true, icon: "warranty" },{ text: "Certificado FAA (uso en avión)", icon: "faa" },{ text: "2.7 kg (5.95 lbs)", icon: "weight" },{ text: "Flujo de 1-5 (LPM)", icon: "flow" },{ text: "2 Baterías chicas (4.5 hrs c/u)", icon: "battery" }], includes: [{ label: "Equipo", image: "/images/inogen-g3-png.png" },{ label: "Mochila de transporte", image: "/images/inogen-one-g3-mochila.jpg" },{ label: "Cargador (AC) de pared", image: "/images/inogen-one-g3-cargador-pared.jpg" },{ label: "Cargador (DC) para auto", image: "/images/inogen-one-g3-cargador-auto.jpg" },{ label: "Dos (2) Baterías chicas", image: "/images/inogen-one-g3-bateria-chica.jpg" }], specs: G3_SPECS },
    { id: "g3-tres", name: "Inogen One G3", model: "Inogen One G3", label: "Paquete Tres", category: "concentrador", price: 71000, badge: "1 Bat. chica + 1 Bat. grande", image: "/images/inogen-g3-png.png", description: "Inogen One G3 con batería chica y batería grande.", features: [{ text: "3 Años de garantía", highlight: true, icon: "warranty" },{ text: "Certificado FAA (uso en avión)", icon: "faa" },{ text: "2.7 kg (5.95 lbs)", icon: "weight" },{ text: "Flujo de 1-5 (LPM)", icon: "flow" },{ text: "1 Bat. chica + 1 Bat. grande", icon: "battery" }], includes: [{ label: "Equipo", image: "/images/inogen-g3-png.png" },{ label: "Mochila de transporte", image: "/images/inogen-one-g3-mochila.jpg" },{ label: "Cargador (AC) de pared", image: "/images/inogen-one-g3-cargador-pared.jpg" },{ label: "Cargador (DC) para auto", image: "/images/inogen-one-g3-cargador-auto.jpg" },{ label: "Una (1) Batería chica", image: "/images/inogen-one-g3-bateria-chica.jpg" },{ label: "Una (1) Batería grande", image: "/images/inogen-one-g3-bateria-grande.jpg" }], specs: G3_SPECS },
    { id: "g3-cuatro", name: "Inogen One G3", model: "Inogen One G3", label: "Paquete Cuatro", category: "concentrador", price: 77500, badge: "2 Baterías grandes", image: "/images/inogen-g3-png.png", description: "El paquete más completo del Inogen One G3. Dos baterías grandes para hasta 18 horas continuas.", features: [{ text: "3 Años de garantía", highlight: true, icon: "warranty" },{ text: "Certificado FAA (uso en avión)", icon: "faa" },{ text: "2.7 kg (5.95 lbs)", icon: "weight" },{ text: "Flujo de 1-5 (LPM)", icon: "flow" },{ text: "2 Baterías grandes (9 hrs c/u)", icon: "battery" }], includes: [{ label: "Equipo", image: "/images/inogen-g3-png.png" },{ label: "Mochila de transporte", image: "/images/inogen-one-g3-mochila.jpg" },{ label: "Cargador (AC) de pared", image: "/images/inogen-one-g3-cargador-pared.jpg" },{ label: "Cargador (DC) para auto", image: "/images/inogen-one-g3-cargador-auto.jpg" },{ label: "Dos (2) Baterías grandes", image: "/images/inogen-one-g3-bateria-grande.jpg" }], specs: G3_SPECS },
    { id: "g3-bat-chica", name: "Batería chica", model: "Inogen One G3", category: "bateria", price: 6950, image: "/images/inogen-one-g3-bateria-chica.jpg", description: "Batería chica original para Inogen One G3.", specs: G3_SPECS },
    { id: "g3-bat-grande", name: "Batería grande", model: "Inogen One G3", category: "bateria", price: 9800, image: "/images/inogen-one-g3-bateria-grande.jpg", description: "Batería grande original para Inogen One G3.", specs: G3_SPECS },
    { id: "g3-cargador-externo", name: "Cargador externo", model: "Inogen One G3", category: "accesorio", price: 4350, image: "/images/inogen-one-g3-cargador-externo.jpg", description: "Cargador externo para baterías del Inogen One G3." },
    { id: "g3-cargador-pared", name: "Cargador de pared (AC)", model: "Inogen One G3", category: "accesorio", price: 4350, image: "/images/inogen-one-g3-cargador-pared.jpg", description: "Cargador de corriente alterna original para Inogen One G3." },
    { id: "g3-cargador-auto", name: "Cargador de auto (DC)", model: "Inogen One G3", category: "accesorio", price: 2200, image: "/images/inogen-one-g3-cargador-auto.jpg", description: "Cargador de corriente directa para mantener el Inogen One G3 cargado en el automóvil." },
    { id: "g3-mochila", name: "Mochila de transporte", model: "Inogen One G3", category: "accesorio", price: 2900, image: "/images/inogen-one-g3-mochila.jpg", description: "Mochila original diseñada para el Inogen One G3." },
    { id: "g3-backpack", name: "Backpack", model: "Inogen One G3", category: "accesorio", price: 2900, image: "/images/inogen-one-g3-backpack.jpg", description: "Backpack resistente para transportar el Inogen One G3 con ambas manos libres." },
    { id: "g3-carrito", name: "Carrito de transporte", model: "Inogen One G3", category: "accesorio", price: 4000, image: "/images/inogen-one-g3-carrito.jpg", description: "Carrito de transporte para el Inogen One G3." },
  ],
  g2: [
    { id: "g2-bat-grande", name: "Batería grande", model: "Inogen One G2", category: "bateria", price: 15000, image: "/images/inogen-one-g2-bateria-grande.jpg", description: "Batería de larga duración para el Inogen One G2.", specs: G2_SPECS },
    { id: "g2-cargador-externo", name: "Cargador externo", model: "Inogen One G2", category: "accesorio", price: 4400, image: "/images/inogen-one-g2-cargador-externo.jpg", description: "Cargador externo para baterías del Inogen One G2." },
    { id: "g2-cargador-pared", name: "Cargador de pared (AC)", model: "Inogen One G2", category: "accesorio", price: 4350, image: "/images/inogen-one-g2-cargador-pared.jpg", description: "Cargador de corriente alterna para el Inogen One G2." },
    { id: "g2-cargador-auto", name: "Cargador de auto (DC)", model: "Inogen One G2", category: "accesorio", price: 2200, image: "/images/inogen-one-g2-cargador-auto.jpg", description: "Cargador de corriente directa para Inogen One G2 en el automóvil." },
    { id: "g2-backpack", name: "Backpack", model: "Inogen One G2", category: "accesorio", price: 2900, image: "/images/inogen-one-g2-backpack.jpg", description: "Mochila de transporte diseñada para el Inogen One G2." },
  ],
  "at-home": [
    { id: "at-home-equipo", name: "Inogen At Home", model: "Inogen At Home", label: "Concentrador fijo", category: "concentrador", price: null, soldOut: true, image: "/images/inogen-at-home-png.webp", description: "Concentrador de oxígeno estacionario para uso domiciliario. Actualmente no disponible.", features: [{ text: "3 Años de garantía", highlight: true, icon: "warranty" },{ text: "Flujo continuo para uso en casa", icon: "flow" },{ text: "Silencioso y compacto", icon: "weight" }], specs: [{ label: "Uso", value: "Estacionario / domiciliario" },{ label: "Flujo", value: "Continuo" },{ label: "Garantía", value: "3 años" }] },
  ],
};

const SIDEBAR = [
  { id: "g5", label: "Inogen G5", subs: [{ id: "all", label: "Todos los productos" },{ id: "concentrador", label: "Equipos Inogen G5" },{ id: "bateria", label: "Baterías Inogen G5" },{ id: "accesorio", label: "Accesorios Inogen G5" }] },
  { id: "g4", label: "Inogen G4", subs: [{ id: "all", label: "Todos los productos" },{ id: "concentrador", label: "Equipos Inogen G4" },{ id: "bateria", label: "Baterías Inogen G4" },{ id: "accesorio", label: "Accesorios Inogen G4" }] },
  { id: "g3", label: "Inogen G3", subs: [{ id: "all", label: "Todos los productos" },{ id: "concentrador", label: "Equipos Inogen G3" },{ id: "bateria", label: "Baterías Inogen G3" },{ id: "accesorio", label: "Accesorios Inogen G3" }] },
  { id: "g2", label: "Inogen G2", subs: [{ id: "all", label: "Todos los productos" },{ id: "bateria", label: "Baterías Inogen G2" },{ id: "accesorio", label: "Accesorios Inogen G2" }] },
  { id: "at-home", label: "Inogen At Home", subs: [{ id: "all", label: "Todos los productos" },{ id: "concentrador", label: "Concentrador fijo" }] },
];

function ProductDetailView({ product, onBack }: { product: Product; onBack: () => void }) {
  const link = waMsg(product.model, product.label, product.name);
  const isEquipo = product.category === "concentrador";

  return (
    <div>
      <button onClick={onBack} className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Volver
      </button>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {isEquipo ? (
          <div className="flex items-stretch rounded-2xl bg-white border border-gray-100 overflow-hidden" style={{ minHeight: "320px" }}>
            <div className="flex items-center justify-center shrink-0 py-5 pl-5 pr-2" style={{ width: "38%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/credenciales-fda-faa-garantia-inogen.svg" alt="FDA - FAA - Garantía 3 Años" className="w-full h-full object-contain pointer-events-none select-none" />
            </div>
            <div className="flex flex-1 items-center justify-center p-6">
              {product.image
                ? <img src={product.image} alt={product.name} className="max-h-72 w-auto object-contain" /> // eslint-disable-line @next/next/no-img-element
                : <ImagePlaceholder className="w-full h-64" />}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 p-8 min-h-64">
            {product.image
              ? <img src={product.image} alt={product.name} className="max-h-72 w-auto object-contain" /> // eslint-disable-line @next/next/no-img-element
              : <ImagePlaceholder className="w-full h-64" />}
          </div>
        )}

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-gray-400">{product.model}</p>
          {product.label && (
            <span className="inline-block rounded-full text-xs font-semibold px-3 py-1 mb-2 text-white" style={{ backgroundColor: "#243e8c" }}>{product.label}</span>
          )}
          <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">{product.description}</p>

          {product.soldOut ? (
            <div className="mt-5 inline-block rounded-full bg-red-50 border border-red-200 px-4 py-2 text-sm font-semibold text-red-600">
              No disponible actualmente
            </div>
          ) : (
            product.price != null && (
              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="text-5xl font-black" style={{ color: "#243e8c" }}>${product.price.toLocaleString("es-MX")}</span>
                <span className="text-xl font-semibold text-gray-500">MXN</span>
              </div>
            )
          )}

          {product.features && (
            <ul className="mt-5 space-y-3">
              {product.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <FeatureIcon type={f.icon} highlight={f.highlight} />
                  <span className={f.highlight ? "font-bold text-base" : "text-sm text-gray-600"} style={f.highlight ? { color: "#243e8c" } : {}}>{f.text}</span>
                </li>
              ))}
            </ul>
          )}

          {!product.soldOut && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="btn-whatsapp mt-6 inline-flex items-center gap-2 px-6 py-3">
              <WaIcon />Consultar por WhatsApp
            </a>
          )}
        </div>
      </div>

      {product.includes && (
        <div className="border-t border-gray-100 pt-10">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-1">¿Qué incluye el paquete?</h3>
          <p className="text-center text-sm text-gray-400 mb-8">Las fotografías pueden verse diferentes al producto real</p>
          <div className="flex flex-wrap justify-center gap-6">
            {product.includes.map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-32">
                <div className="h-28 w-28 rounded-xl border border-gray-100 bg-white flex items-center justify-center overflow-hidden">
                  {item.image
                    ? <img src={item.image} alt={item.label} className="h-full w-full object-contain p-2" /> // eslint-disable-line @next/next/no-img-element
                    : <ImagePlaceholder className="h-full w-full" />}
                </div>
                <span className="text-xs text-center text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {product.specs && (
        <div className="border-t border-gray-100 pt-10 mt-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Especificaciones:</h3>
          <ul className="space-y-2.5 max-w-lg">
            {product.specs.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-gray-500 shrink-0 w-36">{s.label}:</span>
                <span className="font-bold text-gray-900">{s.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ProductGrid({ modelId, subcatFilter, onSelect }: { modelId: string; subcatFilter: string; onSelect: (p: Product) => void }) {
  const all = MODELS_PRODUCTS[modelId] || [];
  const products = subcatFilter === "all" ? all : all.filter((p) => p.category === subcatFilter);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
          <svg className="h-8 w-8" style={{ color: "#243e8c" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Próximamente</h3>
        <p className="text-sm text-gray-500 max-w-xs">Contáctanos por WhatsApp para consultar disponibilidad.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => onSelect(product)}
          className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow text-left cursor-pointer"
        >
          <div className="relative flex items-center justify-center h-44 bg-white px-6 pt-5">
            {product.badge && (
              <span className="absolute top-3 left-3 text-xs font-semibold rounded-full px-2.5 py-1 text-white" style={{ backgroundColor: "#243e8c" }}>
                {product.badge}
              </span>
            )}
            {product.soldOut && (
              <span className="absolute top-3 right-3 text-xs font-semibold rounded-full px-2.5 py-1 bg-red-100 text-red-600">
                Agotado
              </span>
            )}
            {product.image
              ? <img src={product.image} alt={product.name} className="h-full w-auto object-contain transition-transform duration-300 hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /> // eslint-disable-line @next/next/no-img-element
              : <ImagePlaceholder className="w-full h-full" />}
          </div>
          <div className="p-5 flex flex-col flex-1 gap-3">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{product.model}</p>
              <h3 className="text-base font-bold text-gray-900">{product.label ? `${product.name} — ${product.label}` : product.name}</h3>
            </div>
            {product.soldOut ? (
              <p className="text-sm font-semibold text-red-500">No disponible</p>
            ) : product.price ? (
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-4 py-2.5 text-center" style={{ backgroundColor: "#243e8c" }}>
                  <p className="text-lg font-bold text-white">${product.price.toLocaleString("es-MX")} <span className="text-xs font-normal text-white/70">MXN</span></p>
                </div>
              </div>
            ) : null}
            <div className="flex items-center gap-1 text-sm font-semibold mt-auto" style={{ color: "#243e8c" }}>
              Ver detalles
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default function InogenContent() {
  const [selectedModel, setSelectedModel] = useState("g5");
  const [selectedSubcat, setSelectedSubcat] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSidebarClick = (modelId: string, subcatId: string) => {
    setSelectedModel(modelId);
    setSelectedSubcat(subcatId);
    setSelectedProduct(null);
  };

  return (
    <>
      <div
        className="relative text-white overflow-hidden"
        style={{ backgroundImage: "url(/images/inogen-bg-forest.webp)", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-slate-900/50" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h1>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/inogen-one-logo.svg"
              alt="Inogen One — Concentradores de Oxígeno"
              className="h-24 sm:h-32 lg:h-40 w-auto object-contain"
              style={{ filter: "drop-shadow(0 3px 8px rgba(0,0,0,1)) drop-shadow(0 0 20px rgba(0,0,0,0.85))" }}
            />
          </h1>
          <p className="mt-1 text-xl sm:text-2xl font-semibold tracking-[0.3em]" style={{ color: "#aabcd6" }}>
            Querétaro
          </p>
          <p className="mt-3 max-w-2xl text-slate-200 sm:text-lg">
            Venta de concentradores de oxígeno portátiles y fijos. Equipos originales con garantía de 3 años, aprobados por la FDA y certificados FAA para uso en avión.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex gap-10">
          <aside className="hidden lg:block w-52 shrink-0">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Categorías</h2>
            <div className="space-y-10">
              {SIDEBAR.map((group) => (
                <div key={group.id}>
                  <button
                    onClick={() => handleSidebarClick(group.id, "all")}
                    className="text-lg font-bold mb-3 block text-left w-full transition-opacity hover:opacity-75"
                    style={{ color: "#243e8c" }}
                  >
                    {group.label}
                  </button>
                  <ul className="space-y-3 pl-1">
                    {group.subs.map((sub) => (
                      <li key={sub.id}>
                        <button
                          onClick={() => handleSidebarClick(group.id, sub.id)}
                          className="text-base text-left w-full transition-colors"
                          style={selectedModel === group.id && selectedSubcat === sub.id ? { color: "#243e8c", fontWeight: 600 } : {}}
                        >
                          <span className={selectedModel === group.id && selectedSubcat === sub.id ? "" : "text-gray-600 hover:text-gray-900"}>
                            {sub.label}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {selectedProduct ? (
              <ProductDetailView product={selectedProduct} onBack={() => setSelectedProduct(null)} />
            ) : (
              <ProductGrid modelId={selectedModel} subcatFilter={selectedSubcat} onSelect={setSelectedProduct} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
