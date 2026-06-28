"use client";

import { useState, useEffect, useCallback } from "react";
import { waLink, WA_MESSAGES, trackWAClick } from "@/lib/whatsapp";

const STORE_PHOTOS = [
  { src: "/images/tienda-sillas-de-ruedas-medimundo.webp",     alt: "Sillas de ruedas en renta — MediMundo Querétaro",         caption: "Sillas de ruedas" },
  { src: "/images/tienda-interior-medimundo.webp",             alt: "Interior de tienda MediMundo — equipo médico Querétaro",   caption: "Nuestro local" },
  { src: "/images/tienda-ortopedia-medimundo.webp",            alt: "Ortopedia y productos de rehabilitación — MediMundo",      caption: "Ortopedia" },
  { src: "/images/tienda-calcetas-compresion-medimundo.webp",  alt: "Calcetas de compresión Therafirm — MediMundo Querétaro",  caption: "Calcetas de compresión" },
  { src: "/images/tienda-orliman-medimundo.webp",              alt: "Ortesis y férulas Orliman — MediMundo Querétaro",         caption: "Ortesis Orliman" },
  { src: "/images/tienda-equipo-medico-medimundo.webp",        alt: "Equipo médico y de rehabilitación — MediMundo Querétaro", caption: "Equipo médico" },
];

function StoreCarousel() {
  const [current, setCurrent] = useState(0);
  const total = STORE_PHOTOS.length;
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = () => setCurrent((c) => (c - 1 + total) % total);

  useEffect(() => {
    const timer = setInterval(next, 3500);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative overflow-hidden aspect-[16/9] bg-gray-100">
      {STORE_PHOTOS.map((photo, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-6 py-4">
            <p className="text-white text-sm font-semibold tracking-wide">{photo.caption}</p>
          </div>
        </div>
      ))}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/75 hover:bg-white shadow transition"
        aria-label="Anterior"
      >
        <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/75 hover:bg-white shadow transition"
        aria-label="Siguiente"
      >
        <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {STORE_PHOTOS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-white" : "w-2 bg-white/50"}`}
            aria-label={`Ir a imagen ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function FAQItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-base font-medium text-gray-900 pr-4">{faq.q}</span>
        <svg
          className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="pb-5 pr-12">
          <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

const values = [
  {
    title: "Seguridad",
    desc: "Todos nuestros equipos pasan por un riguroso protocolo de limpieza y desinfección antes de cada entrega.",
    Icon: () => (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    title: "Cuidado",
    desc: "Nos preocupamos genuinamente por la recuperación y bienestar de nuestros clientes.",
    Icon: () => (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    ),
  },
  {
    title: "Puntualidad",
    desc: "Entregas y recolecciones a tiempo, sin complicaciones para ti ni tu familia.",
    Icon: () => (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    title: "Calidad",
    desc: "Equipo médico de marcas reconocidas, en excelente estado y con mantenimiento constante.",
    Icon: () => (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
  },
];

const sanitizationSteps = [
  "Desmontaje y limpieza profunda de cada componente",
  "Desinfección con soluciones hospitalarias certificadas",
  "Inspección técnica y funcional completa",
  "Empacado en material limpio para transporte seguro",
  "Verificación final antes de entrega al cliente",
];

const testimonials = [
  { name: "María González", text: "Excelente servicio. La cama hospitalaria llegó en perfecto estado y sanitizada. Me ayudaron a instalarla y explicaron todo el funcionamiento.", location: "Juriquilla, Querétaro" },
  { name: "Roberto Martínez", text: "Necesitábamos un concentrador de oxígeno con urgencia y nos lo entregaron el mismo día. Muy profesionales y atentos.", location: "Centro, Querétaro" },
  { name: "Ana Luisa Ramírez", text: "La silla de ruedas que rentamos para mi mamá estaba como nueva. El precio es muy accesible comparado con la compra. Totalmente recomendados.", location: "El Pueblito, Corregidora" },
];

const contactInfo = [
  {
    title: "Teléfono / WhatsApp",
    lines: ["442 333 98 92"],
    link: waLink(WA_MESSAGES.contacto),
    linkText: "Enviar WhatsApp",
    Icon: () => (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
    ),
  },
  {
    title: "Correo electrónico",
    lines: ["medicasaqro@gmail.com"],
    link: "mailto:medicasaqro@gmail.com",
    linkText: "Enviar correo",
    Icon: () => (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    title: "Ubicación",
    lines: ["Av. Canadá 230, Plaza de las Américas", "Col. Carretas, Querétaro"],
    Icon: () => (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
  },
  {
    title: "Horario de atención",
    lines: ["Lunes a Viernes: 10:00 - 19:00", "Sábado: 10:00 - 15:00", "Domingo: Cerrado"],
    Icon: () => (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
];

const faqs = [
  { q: "¿Cómo funciona el proceso de renta?", a: "Es muy sencillo: elige el equipo que necesitas en nuestro catálogo, envía tu solicitud o contáctanos por WhatsApp, y te lo entregamos sanitizado a domicilio. Al finalizar tu periodo de renta, pasamos a recogerlo sin costo adicional." },
  { q: "¿Cuáles son las zonas de entrega?", a: "Realizamos entregas en toda la zona metropolitana de Querétaro, incluyendo Corregidora, El Marqués y Juriquilla. Para zonas fuera del área metropolitana, contáctanos para verificar disponibilidad." },
  { q: "¿Cuánto tiempo tarda la entrega?", a: "En la mayoría de los casos entregamos el mismo día o al día siguiente hábil. Para equipos especiales o de alta demanda, el plazo puede ser de 24 a 48 horas." },
  { q: "¿Se requiere depósito en garantía?", a: "Sí, solicitamos un depósito en garantía que varía según el equipo. Este depósito es 100% reembolsable al devolver el equipo en las condiciones acordadas. El monto se especifica en la ficha de cada equipo." },
  { q: "¿Qué pasa si el equipo se descompone durante la renta?", a: "Brindamos soporte técnico durante toda tu renta. Si el equipo presenta alguna falla por uso normal, lo reemplazamos sin costo adicional. Contáctanos por WhatsApp y lo resolvemos a la brevedad." },
  { q: "¿Los equipos están sanitizados?", a: "Absolutamente. Cada equipo pasa por un riguroso protocolo de limpieza y desinfección con productos hospitalarios certificados antes de cada entrega. Tu seguridad es nuestra prioridad." },
  { q: "¿Cuáles son los periodos mínimos de renta?", a: "El periodo mínimo es de 1 día para la mayoría de los equipos. Ofrecemos tarifas diarias, semanales y mensuales. Entre más largo el periodo, mejor precio por día obtienes." },
  { q: "¿Puedo extender mi periodo de renta?", a: "Sí, puedes extender tu renta fácilmente. Solo avísanos antes de que termine tu periodo actual y lo ajustamos. El cobro se prorratea según la tarifa vigente." },
  { q: "¿Qué formas de pago aceptan?", a: "Aceptamos efectivo, transferencia bancaria y depósito. El pago se realiza al momento de la entrega del equipo o por adelantado vía transferencia." },
  { q: "¿Necesito factura?", a: "Sí, emitimos facturas (CFDI). Solo solicítalo al momento de contratar el servicio proporcionando tus datos fiscales." },
  { q: "¿Ofrecen capacitación para usar el equipo?", a: "Sí. Al momento de la entrega, nuestro personal te explica el funcionamiento del equipo y te da recomendaciones de uso y cuidado. Para equipos como concentradores de oxígeno o CPAP, la capacitación es más detallada." },
  { q: "¿Qué documentos necesito para rentar?", a: "Solo necesitamos una identificación oficial vigente (INE) y un comprobante de domicilio. Para algunos equipos de alto valor, podemos solicitar un aval adicional." },
];

export default function ConocenosContent() {
  return (
    <>
      <section
        style={{
          backgroundImage: "url(/images/tienda-medimundo-queretaro.webp)",
          backgroundSize: "cover",
          backgroundPosition: "70% 40%",
        }}
      >
        <div style={{ background: "rgba(255,255,255,0.78)" }}>
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold sm:text-4xl text-gray-900">Conócenos</h1>
              <p className="mt-4 text-lg text-gray-900 font-semibold leading-relaxed">
                Somos una empresa queretana con más de 20 años facilitando el acceso a equipo médico
                de calidad. Aquí encontrarás todo sobre nosotros, cómo contactarnos y respuestas
                a tus dudas más comunes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pt-12 pb-0 sm:px-6 lg:px-8">
        <div className="text-center mb-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-1">Nuestra tienda</p>
          <h2 className="text-xl font-bold text-gray-800">Más de 20 años en Querétaro</h2>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-gray-200">
          <StoreCarousel />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">Nuestros valores</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <v.Icon />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">{v.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">Proceso de sanitización</h2>
            <p className="mt-2 text-center text-gray-500">Cada equipo pasa por este protocolo antes de ser entregado.</p>
            <ol className="mt-10 space-y-4">
              {sanitizationSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-200">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">{i + 1}</span>
                  <p className="text-sm text-gray-700 pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">Lo que dicen nuestros clientes</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-600 italic">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-4 border-t border-gray-100 pt-3">
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">Contáctanos</h2>
          <p className="mt-2 text-center text-gray-500">Estamos para ayudarte por el medio que prefieras.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((c, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <c.Icon />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">{c.title}</h3>
                {c.lines.map((line, j) => (
                  <p key={j} className="mt-1 text-sm text-gray-500">{line}</p>
                ))}
                {c.link && (
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={c.link.includes("wa.me") ? () => trackWAClick("conocenos_contacto") : undefined}
                    className="mt-3 inline-block text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    {c.linkText} &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-10 text-center text-white">
            <svg className="mx-auto h-14 w-14 mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <h2 className="text-2xl font-bold sm:text-3xl">La forma más rápida de contactarnos</h2>
            <p className="mt-2 text-green-100 text-lg">Escríbenos por WhatsApp y te respondemos en minutos.</p>
            <a
              href={waLink(WA_MESSAGES.general)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWAClick("conocenos_hero")}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 text-base font-semibold text-green-600 shadow-lg transition-all hover:bg-green-50"
            >
              Abrir WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">Preguntas frecuentes</h2>
        <p className="mt-2 text-center text-gray-500">Resolvemos tus dudas sobre el proceso de renta.</p>
        <div className="mt-10">
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} />
          ))}
        </div>
        <div className="mt-12 rounded-xl bg-primary-50 p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900">¿Tienes otra pregunta?</h3>
          <p className="mt-1 text-sm text-gray-500">Escríbenos por WhatsApp y con gusto te atendemos.</p>
          <a
            href={waLink(WA_MESSAGES.faq)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWAClick("conocenos_faq")}
            className="btn-whatsapp mt-4"
          >
            Preguntar por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
