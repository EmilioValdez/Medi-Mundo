"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/adminAuth";

interface Category { id: number; name: string; slug: string; }

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchCats = () => {
    apiFetch("/categories/").then((r) => r.ok ? r.json() : []).catch(() => []).then((d) => { setCategories(Array.isArray(d) ? d : []); setLoading(false); });
  };

  useEffect(() => { fetchCats(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    const slug = newName.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    await apiFetch("/categories/", { method: "POST", body: JSON.stringify({ name: newName.trim(), slug }) });
    setNewName("");
    fetchCats();
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Categorías</h1>
      <form onSubmit={handleAdd} className="mb-6 flex gap-2 max-w-sm">
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nueva categoría..." className="input-field" required />
        <button type="submit" disabled={saving} className="btn-primary shrink-0">{saving ? "..." : "Agregar"}</button>
      </form>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>{["ID", "Nombre", "Slug"].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">#{c.id}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{c.slug}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
