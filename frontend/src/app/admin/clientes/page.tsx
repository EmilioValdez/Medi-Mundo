"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/adminAuth";

export default function ClientesPage() {
  const [customers, setCustomers] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/customers/?limit=100").then((r) => r.ok ? r.json() : []).catch(() => []).then((d) => { setCustomers(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Clientes</h1>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>{["ID", "Nombre", "Teléfono", "Email", "Dirección"].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map((c) => (
              <tr key={c.id as number} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">#{c.id as number}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{c.name as string}</td>
                <td className="px-4 py-3 text-gray-700">{c.phone as string || "-"}</td>
                <td className="px-4 py-3 text-gray-500">{c.email as string || "-"}</td>
                <td className="px-4 py-3 text-gray-500">{c.address as string || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && <div className="py-10 text-center text-sm text-gray-500">No hay clientes registrados.</div>}
      </div>
    </div>
  );
}
