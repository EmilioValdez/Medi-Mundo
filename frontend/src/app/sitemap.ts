import type { MetadataRoute } from "next";

const BASE = "https://medimundo.mx";
const API = process.env.BACKEND_URL ?? "https://medimundo.mx";

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: `${BASE}/`,          lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
  { url: `${BASE}/catalogo`,  lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
  { url: `${BASE}/rentas`,    lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
  { url: `${BASE}/inogen`,    lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
  { url: `${BASE}/recargas`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE}/conocenos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE}/blog`,      lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [equipment, posts] = await Promise.all([
    fetch(`${API}/api/equipment/`, { next: { revalidate: 3600 } })
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => []),
    fetch(`${API}/api/blog/posts`, { next: { revalidate: 3600 } })
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => []),
  ]);

  const equipmentPages: MetadataRoute.Sitemap = (equipment as { id: number }[]).map((e) => ({
    url: `${BASE}/equipo/${e.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = (posts as { slug: string }[]).map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...STATIC_PAGES, ...equipmentPages, ...blogPages];
}
