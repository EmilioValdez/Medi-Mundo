import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { BUSINESS, MAPS_PLACE_URL } from "@/lib/business";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://medimundo.mx"),
  title: {
    default: "Renta de Equipo Médico en Querétaro | MediMundo",
    template: "%s | MediMundo Querétaro",
  },
  description:
    "Renta de equipo médico sanitizado a domicilio en Querétaro. Camas hospitalarias, concentradores de oxígeno, sillas de ruedas y más. Entrega el mismo día.",
  openGraph: {
    siteName: "MediMundo",
    locale: "es_MX",
    type: "website",
    images: [{ url: "/images/logo-medimundo-og.png", width: 800, height: 800, alt: "MediMundo — Renta de Equipo Médico en Querétaro" }],
  },
  robots: { index: true, follow: true },
};

const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "MediMundo",
  description:
    "Tienda de ortopedia y renta de equipo médico en Querétaro. Camas hospitalarias, concentradores de oxígeno Inogen, sillas de ruedas, andaderas y más.",
  url: "https://medimundo.mx",
  telephone: "+5214423339892",
  email: "medicasaqro@gmail.com",
  image: "https://medimundo.mx/images/tienda-medimundo-queretaro.webp",
  priceRange: "$$",
  // Debe coincidir EXACTO con el Perfil de Negocio de Google (NAP). Fuente: lib/business.ts
  address: {
    "@type": "PostalAddress",
    streetAddress: `${BUSINESS.addressLine1}, Col. Carretas`,
    addressLocality: "Santiago de Querétaro",
    addressRegion: "Querétaro",
    postalCode: BUSINESS.postalCode,
    addressCountry: "MX",
  },
  geo: { "@type": "GeoCoordinates", latitude: BUSINESS.geo.lat, longitude: BUSINESS.geo.lng },
  hasMap: MAPS_PLACE_URL,
  sameAs: [MAPS_PLACE_URL, "https://www.instagram.com/medimundo_qro/"],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "10:00",
      closes: "15:00",
    },
  ],
  areaServed: [
    { "@type": "City", name: "Querétaro" },
    { "@type": "City", name: "Corregidora" },
    { "@type": "City", name: "El Marqués" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-scroll-behavior: le dice a Next.js que desactive el scroll suave al cambiar
    // de página; sin esto la página nueva quedaba a media altura.
    <html lang="es-MX" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="preload" as="image" href="/images/portada-hero-medimundo.webp" fetchPriority="high" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PH9NHGVX58"
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-PH9NHGVX58');`}
        </Script>
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-50 text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
