import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BLOG_POSTS,
  CATEGORY_STYLES,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/blog-posts";
import { AuthorBadge } from "@/components/blog/author-badge";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { BlogContentRenderer } from "@/components/blog/blog-content-renderer";
import { JsonLdScript } from "@/components/json-ld-script";
import { breadcrumbLd, faqPageLd } from "@/lib/schema";

// Prerender every article at build time.
export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

// Any slug not in the static list should 404 — no runtime fallback.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return {
      title: "Article introuvable",
      description: "Cet article n'existe pas ou a été déplacé.",
    };
  }
  const url = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `https://cvmodifier.com${url}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: [
        {
          url: `${url}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [`${url}/opengraph-image`],
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post);
  const cat = CATEGORY_STYLES[post.category];

  // JSON-LD Article schema — helps Google display the article in rich results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [post.heroImage],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "CV Modifier",
      url: "https://cvmodifier.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://cvmodifier.com/blog/${post.slug}`,
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Nav */}
      <nav className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-xl">
            CV <span className="text-blue-400">Modifier</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-white text-sm sm:text-base"
              >
                Connexion
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base">
                <span className="sm:hidden">S&apos;inscrire</span>
                <span className="hidden sm:inline">
                  Commencer gratuitement
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Breadcrumbs */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <nav
            aria-label="Fil d'Ariane"
            className="flex items-center gap-1.5 text-sm text-slate-500 flex-wrap"
          >
            <Link href="/" className="hover:text-blue-600">
              Accueil
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/blog" className="hover:text-blue-600">
              Blog
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">{post.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-medium line-clamp-1">
              {post.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Article header */}
      <header className="bg-white border-b border-slate-100 py-10 md:py-14">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${cat.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
              {post.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            {post.title}
          </h1>
          <AuthorBadge
            author={post.author}
            updatedAt={post.updatedAt}
            readTime={post.readTime}
          />
        </div>
      </header>

      {/* Hero image */}
      <div className="bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-200 shadow-sm">
            <Image
              src={post.heroImage}
              alt={post.heroAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Article body */}
      <article className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
          {/* Main content */}
          <div className="max-w-prose mx-auto lg:mx-0 w-full">
            <p className="text-lg text-slate-600 leading-relaxed border-l-4 border-blue-500 pl-4 mb-6">
              {post.excerpt}
            </p>

            <TableOfContents headings={post.tocHeadings} />

            <BlogContentRenderer sections={post.content} />

            {/* FAQ */}
            {post.faq.length > 0 && (
              <section className="mt-16">
                <h2
                  id="faq"
                  className="scroll-mt-24 text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-6"
                >
                  Questions fréquentes
                </h2>
                <div className="space-y-3">
                  {post.faq.map((item) => (
                    <details
                      key={item.q}
                      className="group bg-slate-50 border border-slate-100 rounded-xl overflow-hidden"
                    >
                      <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-4 text-slate-900 font-semibold hover:bg-slate-100 transition-colors">
                        <span>{item.q}</span>
                        <span
                          aria-hidden="true"
                          className="text-blue-600 text-xl font-light transition-transform group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <div className="px-5 pb-4 text-slate-600 text-[15px] leading-relaxed">
                        {item.a}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Back to blog */}
            <div className="mt-16 pt-8 border-t border-slate-200">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour au blog
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 space-y-6">
              {/* Product CTA card */}
              <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 shadow-sm">
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-2">
                  CV Modifier
                </p>
                <h3 className="text-lg font-bold mb-2 leading-tight">
                  Adaptez votre CV à chaque offre en 30s
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  CV + lettre de motivation générés par IA, optimisés ATS. 3
                  générations offertes, sans carte bancaire.
                </p>
                <Link href="/register">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Essayer gratuitement
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Related articles */}
              {related.length > 0 && (
                <div className="rounded-2xl bg-white border border-slate-200 p-5">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
                    Articles liés
                  </p>
                  <ul className="space-y-4">
                    {related.map((r) => {
                      const rc = CATEGORY_STYLES[r.category];
                      return (
                        <li key={r.slug}>
                          <Link
                            href={`/blog/${r.slug}`}
                            className="group flex gap-3 items-start"
                          >
                            <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                              <Image
                                src={r.heroImage}
                                alt={r.heroAlt}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <span
                                className={`inline-block text-[10px] font-semibold uppercase tracking-wide rounded px-1.5 py-0.5 border mb-1 ${rc.badge}`}
                              >
                                {r.category}
                              </span>
                              <p className="text-sm font-semibold text-slate-900 leading-snug group-hover:text-blue-600 line-clamp-2">
                                {r.title}
                              </p>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </article>

      {/* Related articles carousel (bottom, all viewports) */}
      {related.length > 0 && (
        <section className="bg-slate-50 border-t border-slate-200 py-14">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
              À lire ensuite
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => {
                const rc = CATEGORY_STYLES[r.category];
                return (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="group flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
                  >
                    <div className="relative aspect-video overflow-hidden bg-slate-100">
                      <Image
                        src={r.heroImage}
                        alt={r.heroAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${rc.badge} mb-3`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${rc.dot}`} />
                        {r.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                        {r.title}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                        {r.excerpt}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="text-white font-bold text-lg">
              CV <span className="text-blue-400">Modifier</span>
            </div>
            <p className="text-sm">
              &copy; 2026 CV Modifier. Tous droits réservés.
            </p>
          </div>
          <nav
            aria-label="Liens légaux"
            className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm"
          >
            <Link href="/a-propos" className="hover:text-white">
              À propos
            </Link>
            <span aria-hidden="true" className="text-slate-600">
              ·
            </span>
            <Link href="/blog" className="hover:text-white">
              Blog
            </Link>
            <span aria-hidden="true" className="text-slate-600">
              ·
            </span>
            <Link href="/legal/mentions-legales" className="hover:text-white">
              Mentions légales
            </Link>
            <span aria-hidden="true" className="text-slate-600">
              ·
            </span>
            <Link href="/legal/cgu" className="hover:text-white">
              CGU
            </Link>
            <span aria-hidden="true" className="text-slate-600">
              ·
            </span>
            <Link href="/legal/confidentialite" className="hover:text-white">
              Confidentialité
            </Link>
            <span aria-hidden="true" className="text-slate-600">
              ·
            </span>
            <Link href="/legal/cookies" className="hover:text-white">
              Cookies
            </Link>
          </nav>
        </div>
      </footer>

      {/* JSON-LD: Article + BreadcrumbList + FAQPage (if FAQs) */}
      <JsonLdScript
        data={[
          jsonLd,
          breadcrumbLd([
            { name: "Accueil", url: "/" },
            { name: "Blog", url: "/blog" },
            { name: post.title, url: `/blog/${post.slug}` },
          ]),
          ...(post.faq.length > 0 ? [faqPageLd(post.faq)] : []),
        ]}
      />
    </div>
  );
}
