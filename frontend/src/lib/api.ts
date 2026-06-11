// BACKEND_URL: server-only var, used by server components inside the container
// NEXT_PUBLIC_API_URL: fallback for local dev
const API = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'https://medimundo.mx';

async function safeFetch<T>(url: string, opts: RequestInit & { next?: { revalidate?: number } }, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, opts);
    if (!res.ok) return fallback;
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("application/json")) return fallback;
    return res.json();
  } catch {
    return fallback;
  }
}

export async function getEquipment() {
  return safeFetch(`${API}/api/equipment`, { next: { revalidate: 3600 } }, []);
}

export async function getEquipmentById(id: string) {
  return safeFetch(`${API}/api/equipment/${id}`, { next: { revalidate: 3600 } }, null);
}

export async function getCategories() {
  return safeFetch(`${API}/api/categories`, { next: { revalidate: 3600 } }, []);
}

export async function getBlogPosts() {
  return safeFetch(`${API}/api/blog/posts`, { next: { revalidate: 1800 } }, []);
}

export async function getBlogPost(slug: string) {
  return safeFetch(`${API}/api/blog/posts/${slug}`, { next: { revalidate: 1800 } }, null);
}

export async function getInogenModels() {
  return safeFetch(`${API}/api/inogen`, { next: { revalidate: 3600 } }, []);
}
