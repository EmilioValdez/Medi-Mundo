import Link from "next/link";
import Image from "next/image";
import { waLink, WA_MESSAGES } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/logo-medimundo-v2.webp" alt="MediMundo" width={120} height={38} className="h-8 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed">
              Renta de equipo médico a domicilio en Querétaro. Equipos sanitizados, entrega rápida y soporte continuo.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">Navegación</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/catalogo" className="hover:text-sky-400 transition-colors">Catálogo</Link></li>
              <li><Link href="/rentas" className="hover:text-sky-400 transition-colors">Rentas</Link></li>
              <li><Link href="/inogen" className="hover:text-sky-400 transition-colors">Concentradores Inogen</Link></li>
              <li><Link href="/recargas" className="hover:text-sky-400 transition-colors">Recargas de Oxígeno</Link></li>
              <li><Link href="/conocenos" className="hover:text-sky-400 transition-colors">Conócenos</Link></li>
              <li><Link href="/blog" className="hover:text-sky-400 transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">Equipo</h3>
            <ul className="space-y-2 text-sm">
              <li>Sillas de ruedas</li>
              <li>Camas hospitalarias</li>
              <li>Concentradores de oxígeno</li>
              <li>CPAP / BiPAP</li>
              <li>Andaderas y bastones</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <span>Av. Canadá 230, Plaza de las Américas, Col. Carretas, Querétaro</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                <a href="tel:+5214423339892" className="hover:text-white transition-colors">442 333 98 92</a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span>L-V: 10am–7pm | Sáb: 10am–3pm</span>
              </li>
              <li>
                <a href={waLink(WA_MESSAGES.general)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-green-400 transition-colors">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:medicasaqro@gmail.com" className="hover:text-white transition-colors">medicasaqro@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} MediMundo. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
