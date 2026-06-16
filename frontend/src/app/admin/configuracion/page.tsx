"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/adminAuth";
import { useAuth } from "@/lib/adminAuth";
import { Spinner } from "@/lib/icons";

function IconEye({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

function IconEyeSlash({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );
}

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
  const [form, setForm] = useState({ username: "", password: "", confirm: "", full_name: "", role: "operator" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setCreating(true);
    const { confirm: _, ...payload } = form;
    const res = await apiFetch("/users", { method: "POST", body: JSON.stringify(payload) }).catch(() => null);
    if (res?.ok) {
      const newUser = await res.json();
      setUsers((prev) => [...prev, newUser]);
      setForm({ username: "", password: "", confirm: "", full_name: "", role: "operator" });
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
        <form onSubmit={submit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input required placeholder="Usuario" value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none" />
          <input placeholder="Nombre completo" value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none" />

          <div className="relative">
            <input required type={showPassword ? "text" : "password"} placeholder="Contraseña"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-sky-400 focus:outline-none" />
            <button type="button" onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <IconEyeSlash className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
            </button>
          </div>

          <div className="relative">
            <input required type={showConfirm ? "text" : "password"} placeholder="Confirmar contraseña"
              value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm focus:outline-none ${
                form.confirm && form.password !== form.confirm
                  ? "border-red-400 focus:border-red-400"
                  : "border-gray-300 focus:border-sky-400"
              }`} />
            <button type="button" onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showConfirm ? <IconEyeSlash className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
            </button>
            {form.confirm && form.password !== form.confirm && (
              <p className="mt-1 text-xs text-red-500">Las contraseñas no coinciden</p>
            )}
          </div>

          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none">
            <option value="operator">Operador</option>
            <option value="admin">Administrador</option>
          </select>

          <button type="submit" disabled={creating}
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50">
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
