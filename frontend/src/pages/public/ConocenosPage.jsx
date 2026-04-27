import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ShieldCheckIcon, SparklesIcon, HeartIcon, TruckIcon,
  PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

const WA_NUMBER = '524422237757';

const values = [
  { icon: ShieldCheckIcon, title: 'Seguridad', desc: 'Todos nuestros equipos pasan por un riguroso protocolo de limpieza y desinfección antes de cada entrega.' },
  { icon: HeartIcon, title: 'Cuidado', desc: 'Nos preocupamos genuinamente por la recuperación y bienestar de nuestros clientes.' },
  { icon: TruckIcon, title: 'Puntualidad', desc: 'Entregas y recolecciones a tiempo, sin complicaciones para ti ni tu familia.' },
  { icon: SparklesIcon, title: 'Calidad', desc: 'Equipo médico de marcas reconocidas, en excelente estado y con mantenimiento constante.' },
];

const sanitizationSteps = [
  'Desmontaje y limpieza profunda de cada componente',
  'Desinfección con soluciones hospitalarias certificadas',
  'Inspección técnica y funcional completa',
  'Empacado en material limpio para transporte seguro',
  'Verificación final antes de entrega al cliente',
];

const testimonials = [
  {
    name: 'María González',
    text: 'Excelente servicio. La cama hospitalaria llegó en perfecto estado y sanitizada. Me ayudaron a instalarla y explicaron todo el funcionamiento.',
    location: 'Juriquilla, Querétaro',
  },
  {
    name: 'Roberto Martínez',
    text: 'Necesitábamos un concentrador de oxígeno con urgencia y nos lo entregaron el mismo día. Muy profesionales y atentos.',
    location: 'Centro, Querétaro',
  },
  {
    name: 'Ana Luisa Ramírez',
    text: 'La silla de ruedas que rentamos para mi mamá estaba como nueva. El precio es muy accesible comparado con la compra. Totalmente recomendados.',
    location: 'El Pueblito, Corregidora',
  },
];

const contactInfo = [
  {
    icon: PhoneIcon,
    title: 'Teléfono / WhatsApp',
    lines: ['442 223 77 57'],
    link: `https://wa.me/${WA_NUMBER}`,
    linkText: 'Enviar WhatsApp',
  },
  {
    icon: EnvelopeIcon,
    title: 'Correo electrónico',
    lines: ['medicasaqro@gmail.com'],
    link: 'mailto:medicasaqro@gmail.com',
    linkText: 'Enviar correo',
  },
  {
    icon: MapPinIcon,
    title: 'Ubicación',
    lines: ['Av. Canadá 230, Plaza de las Américas', 'Col. Carretas, Querétaro'],
  },
  {
    icon: ClockIcon,
    title: 'Horario de atención',
    lines: ['Lunes a Viernes: 10:00 - 19:00', 'Sábado: 10:00 - 15:00', 'Domingo: Cerrado'],
  },
];

const faqs = [
  {
    q: '¿Cómo funciona el proceso de renta?',
    a: 'Es muy sencillo: elige el equipo que necesitas en nuestro catálogo, envía tu solicitud o contáctanos por WhatsApp, y te lo entregamos sanitizado a domicilio. Al finalizar tu periodo de renta, pasamos a recogerlo sin costo adicional.',
  },
  {
    q: '¿Cuáles son las zonas de entrega?',
    a: 'Realizamos entregas en toda la zona metropolitana de Querétaro, incluyendo Corregidora, El Marqués y Juriquilla. Para zonas fuera del área metropolitana, contáctanos para verificar disponibilidad.',
  },
  {
    q: '¿Cuánto tiempo tarda la entrega?',
    a: 'En la mayoría de los casos entregamos el mismo día o al día siguiente hábil. Para equipos especiales o de alta demanda, el plazo puede ser de 24 a 48 horas.',
  },
  {
    q: '¿Se requiere depósito en garantía?',
    a: 'Sí, solicitamos un depósito en garantía que varía según el equipo. Este depósito es 100% reembolsable al devolver el equipo en las condiciones acordadas. El monto se especifica en la ficha de cada equipo.',
  },
  {
    q: '¿Qué pasa si el equipo se descompone durante la renta?',
    a: 'Brindamos soporte técnico durante toda tu renta. Si el equipo presenta alguna falla por uso normal, lo reemplazamos sin costo adicional. Contáctanos por WhatsApp y lo resolvemos a la brevedad.',
  },
  {
    q: '¿Los equipos están sanitizados?',
    a: 'Absolutamente. Cada equipo pasa por un riguroso protocolo de limpieza y desinfección con productos hospitalarios certificados antes de cada entrega. Tu seguridad es nuestra prioridad.',
  },
  {
    q: '¿Cuáles son los periodos mínimos de renta?',
    a: 'El periodo mínimo es de 1 día para la mayoría de los equipos. Ofrecemos tarifas diarias, semanales y mensuales. Entre más largo el periodo, mejor precio por día obtienes.',
  },
  {
    q: '¿Puedo extender mi periodo de renta?',
    a: 'Sí, puedes extender tu renta fácilmente. Solo avísanos antes de que termine tu periodo actual y lo ajustamos. El cobro se prorratea según la tarifa vigente.',
  },
  {
    q: '¿Qué formas de pago aceptan?',
    a: 'Aceptamos efectivo, transferencia bancaria y depósito. El pago se realiza al momento de la entrega del equipo o por adelantado vía transferencia.',
  },
  {
    q: '¿Necesito factura?',
    a: 'Sí, emitimos facturas (CFDI). Solo solicítalo al momento de contratar el servicio proporcionando tus datos fiscales.',
  },
  {
    q: '¿Ofrecen capacitación para usar el equipo?',
    a: 'Sí. Al momento de la entrega, nuestro personal te explica el funcionamiento del equipo y te da recomendaciones de uso y cuidado. Para equipos como concentradores de oxígeno o CPAP, la capacitación es más detallada.',
  },
  {
    q: '¿Qué documentos necesito para rentar?',
    a: 'Solo necesitamos una identificación oficial vigente (INE) y un comprobante de domicilio. Para algunos equipos de alto valor, podemos solicitar un aval adicional.',
  },
];

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-base font-medium text-gray-900 pr-4">{faq.q}</span>
        <ChevronDownIcon
          className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="pb-5 pr-12">
          <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function ConocenosPage() {
  return (
    <>
      <Helmet>
        <title>Conócenos — MediMundo Querétaro</title>
        <meta name="description" content="Conoce a MediMundo: quiénes somos, cómo contactarnos y respuestas a las preguntas más frecuentes sobre renta de equipo médico en Querétaro." />
        <link rel="canonical" href="https://medimundo.mx/conocenos" />
        <meta property="og:title" content="Conócenos — MediMundo Querétaro" />
        <meta property="og:description" content="Conoce a MediMundo: quiénes somos, cómo contactarnos y respuestas a las preguntas más frecuentes sobre renta de equipo médico en Querétaro." />
        <meta property="og:url" content="https://medimundo.mx/conocenos" />
        <meta property="og:image" content="https://medimundo.mx/images/tienda-medimundo-queretaro.jpg" />
      </Helmet>

      {/* Hero */}
      <section
        style={{
          backgroundImage: 'url(/images/tienda-medimundo-queretaro.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ background: 'rgba(255,255,255,0.72)' }}>
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold sm:text-4xl text-gray-900">Conócenos</h1>
              <p className="mt-4 text-lg text-gray-600">
                Somos una empresa queretana con más de 20 años facilitando el acceso a equipo médico
                de calidad. Aquí encontrarás todo sobre nosotros, cómo contactarnos y respuestas
                a tus dudas más comunes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── NOSOTROS ── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">Nuestros valores</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">{v.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sanitization */}
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

      {/* Testimonials */}
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
              <p className="text-sm text-gray-600 italic">"{t.text}"</p>
              <div className="mt-4 border-t border-gray-100 pt-3">
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACTO ── */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">Contáctanos</h2>
          <p className="mt-2 text-center text-gray-500">Estamos para ayudarte por el medio que prefieras.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((c, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <c.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">{c.title}</h3>
                {c.lines.map((line, j) => (
                  <p key={j} className="mt-1 text-sm text-gray-500">{line}</p>
                ))}
                {c.link && (
                  <a href={c.link} target="_blank" rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm font-medium text-primary-600 hover:text-primary-700">
                    {c.linkText} &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-10 text-center text-white">
            <svg className="mx-auto h-14 w-14 mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <h2 className="text-2xl font-bold sm:text-3xl">La forma más rápida de contactarnos</h2>
            <p className="mt-2 text-green-100 text-lg">Escríbenos por WhatsApp y te respondemos en minutos.</p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola, me interesa información sobre renta de equipo médico.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 text-base font-semibold text-green-600 shadow-lg transition-all hover:bg-green-50"
            >
              Abrir WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
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
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola, tengo una pregunta sobre la renta de equipo médico.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-4"
          >
            Preguntar por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
