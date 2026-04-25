import { useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const WA_NUMBER = '524422237757';

const rentals = [
  { label: 'Camas Hospitalarias', slug: 'camas-hospitalarias', icon: '🛏️' },
  { label: 'Concentradores de Oxígeno', slug: 'concentradores-de-oxigeno', icon: '💨' },
  { label: 'Equipos de Apoyo', slug: 'equipos-apoyo', icon: '🏥' },
  { label: 'Baño y Seguridad', slug: 'bano-seguridad', icon: '🚿' },
  { label: 'Movilidad', slug: 'andaderas-bastones', icon: '🦯' },
  { label: 'Ortopedia', slug: 'ortopedia', icon: '🦴' },
];

const links = [
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/faq', label: 'Preguntas Frecuentes' },
  { to: '/contacto', label: 'Contacto' },
];

const externalLinks = [
  { href: '/blog', label: 'Blog' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [rentasOpen, setRentasOpen] = useState(false);
  const [mobileRentasOpen, setMobileRentasOpen] = useState(false);
  const timeoutRef = useRef(null);

  const openDropdown = () => {
    clearTimeout(timeoutRef.current);
    setRentasOpen(true);
  };

  const closeDropdown = () => {
    timeoutRef.current = setTimeout(() => setRentasOpen(false), 120);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo-medimundo.png" alt="MediMundo" className="h-11 md:h-14 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {/* RENTAS dropdown — first item */}
          <div
            className="relative"
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdown}
          >
            <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-colors">
              RENTAS
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${rentasOpen ? 'rotate-180' : ''}`} />
            </button>

            {rentasOpen && (
              <div
                className="absolute left-0 top-full mt-1 w-64 rounded-xl border border-gray-100 bg-white py-2 shadow-xl"
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
              >
                {rentals.map((r) => (
                  <Link
                    key={r.slug}
                    to={`/catalogo?slug=${r.slug}`}
                    onClick={() => setRentasOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <span className="text-xl">{r.icon}</span>
                    {r.label}
                  </Link>
                ))}
                <div className="my-1 border-t border-gray-100" />
                <Link
                  to="/catalogo"
                  onClick={() => setRentasOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-colors"
                >
                  Ver catálogo completo →
                </Link>
              </div>
            )}
          </div>

          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {externalLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* WhatsApp CTA */}
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola, me interesa información sobre renta de equipo médico.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex btn-whatsapp text-xs"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp
        </a>

        {/* Mobile toggle */}
        <button
          className="md:hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          onClick={() => setOpen(!open)}
        >
          {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t md:hidden">
          <nav className="flex flex-col px-4 py-2">
            {/* RENTAS accordion */}
            <button
              onClick={() => setMobileRentasOpen(!mobileRentasOpen)}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-primary-600"
            >
              RENTAS
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${mobileRentasOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileRentasOpen && (
              <div className="ml-4 mb-1 border-l-2 border-primary-100 pl-3 space-y-1">
                {rentals.map((r) => (
                  <Link
                    key={r.slug}
                    to={`/catalogo?slug=${r.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 py-2 text-sm text-gray-600"
                  >
                    <span>{r.icon}</span> {r.label}
                  </Link>
                ))}
              </div>
            )}

            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            {externalLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600"
              >
                {l.label}
              </a>
            ))}
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola, me interesa información sobre renta de equipo médico.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mt-2 text-sm"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
