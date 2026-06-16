"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/adminAuth";
import { useAuth } from "@/lib/adminAuth";
import { Spinner } from "@/lib/icons";

interface AdminUser {
  id: number;
  username: string;
  full_name: string;
  role: string;
  is_active: boolean;
}

export default function ConfiguracionPage() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ username: "", password: "", full_name: "", role: "operator" });

  const load = () => {
    apiFetch("/users").then((r) => r.ok ? r.json() : []).then(setUsers).catch(() => setUsers([])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (me?.role !== "admin") {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
        Solo el administrador puede acceder a esta sección.
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCreating(true);
    const res = await apiFetch("/users", { method: "POST", body: JSON.stringify(form) }).catch(() => null);
    if (res?.ok) {
      const newUser = await res.json();
      setUsers((prev) => [...prev, newUser]);
      setForm({ username: "", password: "", full_name: "", role: "operator" });
    } else {
      const body = await res?.json().catch(() => ({}));
      setError(body?.detail || "Error al crear usuario.");
    }
    setCreating(false);
  };

  const remove = async (id: number) => {
    if (!confirm("¿Eliminar este usuario? Esta acción no se puede deshacer.")) return;
    const res = await apiFetch(`/users/${id}`, { method: "DELETE" }).catch(() => null);
    if (res?.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } else {
      const body = await res?.json().catch(() => ({}));
      alert(body?.detail || "Error al eliminar usuario.");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuración — Usuarios</h1>
        <p className="text-sm text-gray-500 mt-1">Agrega o elimina cuentas de acceso al panel de administración.</p>
      </div>

      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">Agregar usuario</h2>
        <form onSubmit={submit} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input required placeholder="Usuario" value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none" />
          <input required type="password" placeholder="Contraseña" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none" />
          <input placeholder="Nombre completo" value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none" />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none">
            <option value="operator">Operador</option>
            <option value="admin">Administrador</option>
          </select>
          <button type="submit" disabled={creating}
            className="sm:col-span-2 lg:col-span-4 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50">
            {creating ? "Creando…" : "Crear usuario"}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-200">
              <th className="px-5 py-3 font-medium">Usuario</th>
              <th className="px-5 py-3 font-medium">Nombre</th>
              <th className="px-5 py-3 font-medium">Rol</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-5 py-3 font-semibold text-gray-900">{u.username}</td>
                <td className="px-5 py-3 text-gray-600">{u.full_name || "—"}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${u.role === "admin" ? "bg-sky-100 text-sky-700" : "bg-gray-100 text-gray-600"}`}>
                    {u.role === "admin" ? "Administrador" : "Operador"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  {u.id !== me?.id && (
                    <button onClick={() => remove(u.id)} className="text-xs font-medium text-red-600 hover:underline">
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
