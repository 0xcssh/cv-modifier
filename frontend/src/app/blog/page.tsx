import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllPosts } from "@/lib/blog-posts";
import { BlogSearch } from "./blog-search";

export const metadata: Metadata = {
  title: "Blog CV Modifier — Conseils carrière, CV et lettres de motivation",
  description:
    "Les conseils concrets de l'équipe CV Modifier pour passer les ATS, adapter votre CV à chaque offre, écrire une lettre de motivation crédible et décrocher l'entretien.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog CV Modifier — Conseils carrière et CV",
    description:
      "Les conseils concrets de l'équipe CV Modifier pour passer les ATS, adapter votre CV à chaque offre et décrocher l'entretien.",
    type: "website",
    url: "https://cvmodifier.com/blog",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

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
            className="flex items-center gap-1.5 text-sm text-slate-500"
          >
            <Link href="/" className="hover:text-blue-600">
              Accueil
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-medium">Blog</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-100 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-blue-600 text-sm font-semibold mb-3 uppercase tracking-wide">
            Le blog CV Modifier
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Conseils carrière et CV
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Des guides concrets, testés sur le terrain, pour passer les filtres
            ATS, adapter votre CV à chaque offre et écrire des lettres de
            motivation qui déclenchent l&apos;entretien.
          </p>
        </div>
      </header>

      {/* Grid + search */}
      <section className="py-12 md:py-16 bg-slate-50 flex-1">
        <div className="max-w-6xl mx-auto px-4">
          <BlogSearch posts={posts} />
        </div>
      </section>

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
    </div>
  );
}
