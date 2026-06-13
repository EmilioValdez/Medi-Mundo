"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/adminAuth";

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) router.replace("/admin/dashboard");
  }, [loading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Credenciales incorrectas");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">MediMundo <span className="text-sm font-normal text-gray-400">Admin</span></h1>
        </div>
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Iniciar sesión</h2>
          {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
          <div className="mb-4">
            <label className="label-field">Usuario</label>
            <input type="text" required autoFocus value={username} onChange={(e) => setUsername(e.target.value)} className="input-field" placeholder="admin" />
          </div>
          <div className="mb-6">
            <label className="label-field">Contraseña</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full py-2.5">
            {submitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
