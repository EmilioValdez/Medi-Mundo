"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { waLink, WA_MESSAGES, trackWAClick } from "@/lib/whatsapp";

const MODELS = [
  {
    id: "g2", name: "Inogen One G2", tag: "Portátil",
    tagline: "Robusto y confiable para uso diario en casa o en movimiento.",
    features: ["Flujo de pulso inteligente", "Batería de larga duración", "Aprobado para vuelos"],
    image: "/images/inogen-g2-png.png",
  },
  {
    id: "g3", name: "Inogen One G3", tag: "Portátil",
    tagline: "Compacto y ligero, ideal para mantener tu ritmo de vida activo.",
    features: ["Solo 2.2 kg", "Hasta 4.5 h de batería", "Pantalla LED intuitiva"],
    image: "/images/inogen-g3-png.png",
  },
  {
    id: "g4", name: "Inogen One G4", tag: "Ultra ligero",
    tagline: "El más pequeño y discreto de la línea Inogen, cabe en cualquier bolso.",
    features: ["Solo 1.08 kg", "Ultra compacto", "Silencioso y discreto"],
    image: "/images/inogen-g4-png.webp",
  },
  {
    id: "g5", name: "Inogen One G5", tag: "Más reciente", highlight: true,
    tagline: "La tecnología más avanzada: mayor autonomía y flujos de oxígeno superiores.",
    features: ["Hasta 13 h de autonomía", "Aprobado por la FAA", "6 ajustes de flujo"],
    image: "/images/inogen-g5-png.webp",
  },
  {
    id: "at-home", name: "Inogen At Home", tag: "Para casa",
    tagline: "Diseñado para uso continuo en el hogar, silencioso y sin interrupciones.",
    features: ["Operación 24/7", "Flujo continuo", "Bajo nivel de ruido"],
    image: "/images/inogen-at-home-png.webp",
  },
];

export default function InogenSection({ activeIds }: { activeIds: string[] }) {
  const models = activeIds.length > 0 ? MODELS.filter((m) => activeIds.includes(m.id)) : MODELS;
  const [current, setCurrent] = useState(0);
  const m = models[current];
  const prev = () => setCurrent((c) => (c - 1 + models.length) % models.length);
  const next = () => setCurrent((c) => (c + 1) % models.length);

  if (models.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundImage: "url(/images/inogen-bg-forest.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center 50%",
      }}
    >
      <div className="absolute inset-0 bg-slate-900/50" />
      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block rounded-full bg-blue-500/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-300 ring-1 ring-blue-400/30">
            Concentradores de oxígeno
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
            Línea Inogen — Oxígeno donde vayas
          </h2>
          <p className="mt-2 text-slate-400 max-w-xl mx-auto text-sm">
            Toda la familia Inogen disponible. Desliza para conocer cada modelo.
          </p>
        </div>

        <div className="relative flex items-center gap-4">
          <button onClick={prev} className="shrink-0 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors backdrop-blur-sm border border-white/20" aria-label="Modelo anterior">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </button>

          <div className="flex-1 grid sm:grid-cols-2 gap-6 items-center bg-white/10 backdrop-blur-sm rounded-2xl border border-white/15 p-6 sm:p-8 min-h-[320px]">
            <div className="flex items-center justify-center order-1 sm:order-2">
              <Image key={m.id} src={m.image} alt={`${m.name} — concentrador de oxígeno Querétaro`} width={280} height={280} className="max-h-56 w-auto object-contain drop-shadow-2xl" />
            </div>
            <div className="order-2 sm:order-1">
              <span className={`inline-block rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide mb-3 ${m.highlight ? "bg-blue-500 text-white" : "bg-white/20 text-white"}`}>
                {m.tag}
              </span>
              <h3 className="text-2xl font-extrabold text-white leading-tight">{m.name}</h3>
              <p className="mt-2 text-slate-300 text-sm leading-relaxed">{m.tagline}</p>
              <ul className="mt-4 space-y-1.5">
                {m.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/inogen" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-300 hover:text-white transition-colors">
                Ver detalles y precios
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </Link>
            </div>
          </div>

          <button onClick={next} className="shrink-0 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors backdrop-blur-sm border border-white/20" aria-label="Siguiente modelo">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </button>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {models.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`rounded-full transition-all duration-200 ${i === current ? "w-6 h-2.5 bg-blue-400" : "w-2.5 h-2.5 bg-white/30 hover:bg-white/50"}`} aria-label={`Modelo ${i + 1}`} />
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/inogen" className="btn-primary text-base px-7 py-3">Ver todos los modelos</Link>
          <a href={waLink(WA_MESSAGES.inogen)} target="_blank" rel="noopener noreferrer" onClick={() => trackWAClick("home_inogen")} className="btn-whatsapp text-base px-7 py-3">
            Preguntar disponibilidad
          </a>
        </div>
      </div>
    </section>
  );
}
