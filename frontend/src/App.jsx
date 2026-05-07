import { Component, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
import useAuth from './hooks/useAuth';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, fontFamily: 'monospace' }}>
          <h1 style={{ color: 'red' }}>Error de renderizado</h1>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#fee', padding: 20, borderRadius: 8 }}>
            {this.state.error?.message}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

import { Helmet } from 'react-helmet-async';
import Navbar from './components/public/Navbar';
import Footer from './components/public/Footer';
import LocationSection from './components/public/LocationSection';
import WhatsAppButton from './components/public/WhatsAppButton';
import AdminLayout from './components/admin/AdminLayout';

const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "MediMundo",
  "description": "Tienda de ortopedia y renta de equipo médico en Querétaro. Camas hospitalarias, concentradores de oxígeno Inogen, sillas de ruedas, andaderas y más. Entrega a domicilio sanitizada.",
  "url": "https://medimundo.mx",
  "telephone": "+5214426156649",
  "email": "medicasaqro@gmail.com",
  "image": "https://medimundo.mx/images/tienda-medimundo-queretaro.webp",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Av. Canadá 212, Plaza de las Américas, Col. Carretas",
    "addressLocality": "Querétaro",
    "addressRegion": "Querétaro",
    "addressCountry": "MX"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 20.5905,
    "longitude": -100.3926
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "10:00",
      "closes": "19:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday"],
      "opens": "10:00",
      "closes": "15:00"
    }
  ],
  "areaServed": [
    { "@type": "City", "name": "Querétaro" },
    { "@type": "City", "name": "Corregidora" },
    { "@type": "City", "name": "El Marqués" }
  ],
  "sameAs": [
    "https://facebook.com/medimundo",
    "https://instagram.com/medimundo"
  ]
};

import HomePage from './pages/public/HomePage';
import CatalogPage from './pages/public/CatalogPage';
import RentasPage from './pages/public/RentasPage';
import RespiratoryPage from './pages/public/RespiratoryPage';
import OxygenRefillPage from './pages/public/OxygenRefillPage';
import EquipmentDetailPage from './pages/public/EquipmentDetailPage';
import AboutPage from './pages/public/AboutPage';
import FAQPage from './pages/public/FAQPage';
import ContactPage from './pages/public/ContactPage';
import ConocenosPage from './pages/public/ConocenosPage';
import BlogPage from './pages/public/BlogPage';
import BlogPostPage from './pages/public/BlogPostPage';

import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import InventoryPage from './pages/admin/InventoryPage';
import BookingsPage from './pages/admin/BookingsPage';
import CustomersPage from './pages/admin/CustomersPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import InogenPage from './pages/admin/InogenPage';

function PublicLayout() {
  return (
    <>
      <ScrollToTop />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(LOCAL_BUSINESS_SCHEMA)}
        </script>
      </Helmet>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <LocationSection />
      <Footer />
      <WhatsAppButton />
    </>
  );
}

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/rentas" element={<RentasPage />} />
        <Route path="/respiratorio" element={<RespiratoryPage />} />
        <Route path="/recargas" element={<OxygenRefillPage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/equipo/:id" element={<EquipmentDetailPage />} />
        <Route path="/conocenos" element={<ConocenosPage />} />
        <Route path="/nosotros" element={<Navigate to="/conocenos" replace />} />
        <Route path="/faq" element={<Navigate to="/conocenos" replace />} />
        <Route path="/contacto" element={<Navigate to="/conocenos" replace />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
      </Route>

      {/* Admin login (no layout) */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Admin protected */}
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route index element={<DashboardPage />} />
        <Route path="inventario" element={<InventoryPage />} />
        <Route path="reservas" element={<BookingsPage />} />
        <Route path="clientes" element={<CustomersPage />} />
        <Route path="categorias" element={<CategoriesPage />} />
        <Route path="inogen" element={<InogenPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </ErrorBoundary>
  );
}
