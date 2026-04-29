import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

import { waLink, WA_MESSAGES } from '../../utils/whatsapp';

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

export default function FAQPage() {
  return (
    <>
      <Helmet>
        <title>Preguntas Frecuentes — MediMundo</title>
      </Helmet>

      <section className="bg-gradient-to-br from-primary-700 to-primary-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold sm:text-4xl">Preguntas frecuentes</h1>
          <p className="mt-3 text-lg text-primary-100">
            Resolvemos tus dudas sobre el proceso de renta de equipo médico.
          </p>
        </div>
      </section>

      <section className="bg-watermark mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div>
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} />
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-primary-50 p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900">¿Tienes otra pregunta?</h3>
          <p className="mt-1 text-sm text-gray-500">
            Escríbenos por WhatsApp y con gusto te atendemos.
          </p>
          <a
            href={waLink(WA_MESSAGES.faq)}
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
