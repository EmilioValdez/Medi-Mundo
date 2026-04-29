import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { waLink, WA_MESSAGES } from '../../utils/whatsapp';

const links = [
  { to: '/rentas', label: 'Rentas' },
  { to: '/recargas', label: 'Recargas de Oxígeno' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/conocenos', label: 'Conócenos' },
  { to: '/blog', label: 'Blog' },
];

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-base font-medium transition-colors ${
    isActive
      ? 'bg-primary-50 text-primary-700'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  }`;

const mobileNavLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2.5 text-sm font-medium ${
    isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600'
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-0 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo-medimundo-v2.png" alt="MediMundo — Renta de Equipo Médico en Querétaro" className="h-20 md:h-28 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/rentas" className={navLinkClass}>Rentas</NavLink>
          <NavLink to="/recargas" className={navLinkClass}>Recargas de Oxígeno</NavLink>

          {/* Inogen logo link */}
          <NavLink
            to="/respiratorio"
            className={({ isActive }) =>
              `rounded-lg px-2 py-1 transition-colors ${
                isActive ? 'bg-primary-50 ring-1 ring-primary-200' : 'hover:bg-gray-100'
              }`
            }
          >
            <img src="/images/inogen-logo.png" alt="Concentradores Inogen" className="h-14 w-auto" />
          </NavLink>

          <NavLink to="/catalogo" className={navLinkClass}>Catálogo</NavLink>
          <NavLink to="/conocenos" className={navLinkClass}>Conócenos</NavLink>
          <NavLink to="/blog" className={navLinkClass}>Blog</NavLink>
        </nav>

        {/* WhatsApp CTA */}
        <a
          href={waLink(WA_MESSAGES.general)}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex btn-whatsapp text-xs shrink-0"
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
            <NavLink to="/rentas" onClick={() => setOpen(false)} className={mobileNavLinkClass}>Rentas</NavLink>
            <NavLink to="/recargas" onClick={() => setOpen(false)} className={mobileNavLinkClass}>Recargas de Oxígeno</NavLink>

            {/* Inogen logo link — móvil */}
            <NavLink
              to="/respiratorio"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 ${isActive ? 'bg-primary-50' : ''}`
              }
            >
              <img src="/images/inogen-logo.png" alt="Concentradores Inogen" className="h-8 w-auto" />
              <span className="text-sm font-medium text-gray-700">Concentradores Inogen</span>
            </NavLink>

            <NavLink to="/catalogo" onClick={() => setOpen(false)} className={mobileNavLinkClass}>Catálogo</NavLink>
            <NavLink to="/conocenos" onClick={() => setOpen(false)} className={mobileNavLinkClass}>Conócenos</NavLink>
            <NavLink to="/blog" onClick={() => setOpen(false)} className={mobileNavLinkClass}>Blog</NavLink>

            <a
              href={waLink(WA_MESSAGES.general)}
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
