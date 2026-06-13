import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | MediMundo — Equipo Médico en Querétaro",
  description:
    "Guías y consejos sobre renta de equipo médico, cuidado del adulto mayor y recuperación en casa en Querétaro.",
  alternates: { canonical: "https://medimundo.mx/blog" },
};

interface Post {
  slug: string;
  titulo: string;
  resumen?: string;
  categoria?: string;
  fecha_publicacion?: string;
}

function BlogCard({ post }: { post: Post }) {
  return (
    <article className="group bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-100">
      <div className="h-1 bg-gradient-to-r from-primary-500 to-primary-400" />
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          {post.categoria && (
            <span className="text-[11px] font-bold text-primary-600 uppercase tracking-widest bg-primary-50 px-2.5 py-1 rounded-full">
              {post.categoria}
            </span>
          )}
          {post.fecha_publicacion && (
            <span className="text-[11px] text-gray-400 ml-auto">
              {new Date(post.fecha_publicacion).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" })}
            </span>
          )}
        </div>

        <h2 className="text-base font-bold text-gray-900 leading-snug mb-3 flex-none line-clamp-3">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary-600 transition-colors">
            {post.titulo}
          </Link>
        </h2>

        {post.resumen && (
          <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3">{post.resumen}</p>
        )}

        <div className="mt-5 pt-4 border-t border-gray-100">
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors group/link"
          >
            Leer artículo
            <svg className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default async function BlogPage() {
  const posts = (await getBlogPosts()) as Post[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">

      <div className="mb-12">
        <nav className="text-sm text-gray-400 mb-5 flex items-center gap-1.5">
          <Link href="/" className="hover:text-primary-600 transition-colors">Inicio</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">Blog</span>
        </nav>
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-2">Recursos y guías</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Información útil para<br className="hidden sm:block" /> tu recuperación en casa
            </h1>
          </div>
          <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
            Guías prácticas sobre equipo médico, cuidado del adulto mayor y recuperación postoperatoria en Querétaro.
          </p>
        </div>
        <div className="mt-8 h-px bg-gradient-to-r from-primary-200 via-gray-200 to-transparent" />
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg font-medium">No hay artículos publicados aún.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
