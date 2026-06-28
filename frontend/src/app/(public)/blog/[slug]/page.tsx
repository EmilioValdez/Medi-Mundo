import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogPosts } from "@/lib/api";
import { waLink, WA_MESSAGES } from "@/lib/whatsapp";

interface Post {
  slug: string;
  titulo: string;
  resumen?: string;
  meta_title?: string;
  meta_description?: string;
  categoria?: string;
  fecha_publicacion?: string;
  actualizado?: string;
  contenido_html?: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getBlogPost(slug)) as Post | null;
  if (!post) return { title: "Artículo no encontrado | MediMundo" };
  return {
    title: `${post.meta_title || post.titulo} | MediMundo Querétaro`,
    description: post.meta_description || post.resumen,
    alternates: { canonical: `https://medimundo.mx/blog/${post.slug}` },
    openGraph: {
      title: post.meta_title || post.titulo,
      description: post.meta_description || post.resumen,
      url: `https://medimundo.mx/blog/${post.slug}`,
      type: "article",
      locale: "es_MX",
    },
  };
}

function RelatedCard({ post }: { post: Post }) {
  const fecha = post.fecha_publicacion
    ? new Date(post.fecha_publicacion).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" })
    : "";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col gap-2 p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-sm bg-white transition-all"
    >
      {post.categoria && (
        <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">
          {post.categoria}
        </span>
      )}
      <p className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-primary-700 transition-colors line-clamp-2">
        {post.titulo}
      </p>
      {fecha && <span className="text-xs text-gray-400">{fecha}</span>}
      <span className="text-xs font-semibold text-primary-600 flex items-center gap-1 mt-auto">
        Leer artículo
        <svg className="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </span>
    </Link>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getBlogPost(slug) as Promise<Post | null>,
    getBlogPosts() as Promise<Post[]>,
  ]);

  if (!post) notFound();

  const others = allPosts.filter((p) => p.slug !== post.slug);
  const sameCategory = others.filter((p) => p.categoria === post.categoria);
  const different = others.filter((p) => p.categoria !== post.categoria);
  const related = [...sameCategory, ...different].slice(0, 3);

  const fechaFormateada = post.fecha_publicacion
    ? new Date(post.fecha_publicacion).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })
    : "";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.titulo,
    description: post.meta_description || post.resumen,
    datePublished: post.fecha_publicacion,
    dateModified: post.actualizado || post.fecha_publicacion,
    author: { "@type": "Organization", name: "MediMundo", url: "https://medimundo.mx" },
    publisher: {
      "@type": "Organization",
      name: "MediMundo",
      url: "https://medimundo.mx",
      logo: { "@type": "ImageObject", url: "https://medimundo.mx/logo-medimundo-v2.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://medimundo.mx/blog/${post.slug}` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">

        <nav className="text-sm text-gray-400 mb-8 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-primary-600 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary-600 transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-gray-700 truncate max-w-xs">
            {post.titulo?.slice(0, 55)}{(post.titulo?.length ?? 0) > 55 ? "…" : ""}
          </span>
        </nav>

        <article>
          {post.categoria && (
            <span className="inline-block text-[11px] font-bold text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full mb-4">
              {post.categoria}
            </span>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
            {post.titulo}
          </h1>

          {post.resumen && (
            <p className="text-lg text-gray-500 leading-relaxed mb-6">{post.resumen}</p>
          )}

          <div className="flex items-center gap-5 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-200 flex-wrap">
            {fechaFormateada && (
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                {fechaFormateada}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              MediMundo, Querétaro
            </span>
          </div>

          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.contenido_html ?? "" }}
          />
        </article>

        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-5">
              También te puede interesar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((p) => <RelatedCard key={p.slug} post={p} />)}
            </div>
          </div>
        )}

        <div className="mt-14 bg-gradient-to-br from-primary-50 to-blue-50 border border-primary-100 rounded-2xl p-8 text-center">
          <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-2">¿Necesitas equipo médico?</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Estamos en Querétaro, listos para ayudarte</h2>
          <p className="text-gray-600 mb-7 max-w-md mx-auto text-sm leading-relaxed">
            Llámanos o escríbenos por WhatsApp. Te orientamos sin compromiso y entregamos a domicilio.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:+5214423339892" className="btn-primary text-sm px-6 py-3">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              442 333 98 92
            </a>
            <a
              href={waLink(WA_MESSAGES.blog)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-sm px-6 py-3"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-5">
            Av. Canadá 212, Plaza de las Américas, Querétaro &nbsp;·&nbsp; L–V 10am–7pm &nbsp;·&nbsp; Sáb 10am–3pm
          </p>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors group"
          >
            <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Volver al blog
          </Link>
        </div>
      </div>
    </>
  );
}
