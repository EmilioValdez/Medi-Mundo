import { Component } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
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

import Navbar from './components/public/Navbar';
import Footer from './components/public/Footer';
import WhatsAppButton from './components/public/WhatsAppButton';
import AdminLayout from './components/admin/AdminLayout';

import HomePage from './pages/public/HomePage';
import CatalogPage from './pages/public/CatalogPage';
import RentasPage from './pages/public/RentasPage';
import EquipmentDetailPage from './pages/public/EquipmentDetailPage';
import AboutPage from './pages/public/AboutPage';
import FAQPage from './pages/public/FAQPage';
import ContactPage from './pages/public/ContactPage';

import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import InventoryPage from './pages/admin/InventoryPage';
import BookingsPage from './pages/admin/BookingsPage';
import CustomersPage from './pages/admin/CustomersPage';
import CategoriesPage from './pages/admin/CategoriesPage';

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
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
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/equipo/:id" element={<EquipmentDetailPage />} />
        <Route path="/nosotros" element={<AboutPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contacto" element={<ContactPage />} />
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
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </ErrorBoundary>
  );
}
