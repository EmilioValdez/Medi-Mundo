"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { AuthProvider, useAuth } from "@/lib/adminAuth";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/inventario", label: "Inventario", icon: "📦" },
  { href: "/admin/reservas", label: "Reservas", icon: "📅" },
  { href: "/admin/clientes", label: "Clientes", icon: "👥" },
  { href: "/admin/categorias", label: "Categorías", icon: "🏷️" },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [loading, isAuthenticated, pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
    </div>
  );

  if (!isAuthenticated) return null;

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center gap-3 border-b border-gray-700 px-4">
        <span className="text-lg font-bold text-white">MediMundo</span>
        <span className="text-xs text-gray-400">Admin</span>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              pathname === item.href
                ? "bg-sky-600/20 text-sky-400"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-gray-700 p-4">
        <div className="mb-2 text-xs text-gray-400 truncate">{user?.username}</div>
        <button
          onClick={() => { logout(); router.push("/admin/login"); }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <span>🚪</span> Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-gray-900">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 flex w-64 flex-col bg-gray-900">
            <button className="absolute right-4 top-4 text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>✕</button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
          <button className="lg:hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <span className="text-sm font-medium text-gray-500 hidden lg:block">Panel de Administración</span>
          <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center">
            <span className="text-sm font-semibold text-sky-700">{(user?.username || "A")[0].toUpperCase()}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider><AdminShell>{children}</AdminShell></AuthProvider>;
}
