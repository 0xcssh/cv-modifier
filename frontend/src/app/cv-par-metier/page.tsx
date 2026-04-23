import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_ORDER,
  CATEGORY_STYLES,
  getMetiersByCategory,
} from "@/lib/cv-metiers";

export const metadata: Metadata = {
  title:
    "CV par métier : conseils et exemples pour 20 professions (2026)",
  description:
    "20 guides CV par métier : développeur, commercial, data analyst, chef de projet, infirmier, comptable… Compétences, KPIs et entreprises qui recrutent en France.",
  alternates: { canonical: "/cv-par-metier" },
  openGraph: {
    title:
      "CV par métier : conseils et exemples pour 20 professions (2026)",
    description:
      "Des guides concrets pour construire un CV adapté à votre métier : accroche, compétences, KPIs, erreurs à éviter, entreprises qui recrutent.",
    type: "website",
    url: "https://cvmodifier.com/cv-par-metier",
  },
};

export default function CvParMetierIndexPage() {
  const grouped = getMetiersByCategory();

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
            <span className="text-slate-900 font-medium">
              CV par métier
            </span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-100 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-blue-600 text-sm font-semibold mb-3 uppercase tracking-wide">
            Conseils CV
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            CV par métier : conseils et exemples pour 20 professions
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Chaque métier a ses codes, ses KPIs, ses erreurs récurrentes et ses
            entreprises qui recrutent. Ces 20 guides condensent ce qu&apos;il
            faut savoir pour construire un CV qui parle directement aux
            recruteurs de votre secteur.
          </p>
        </div>
      </header>

      {/* Intro contextuelle */}
      <section className="bg-slate-50 py-10 md:py-12 border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 text-slate-700 leading-relaxed">
          <p className="mb-4">
            Un CV qui marche pour un commercial B2B ne marche pas pour un
            infirmier. Le vocabulaire change, les chiffres attendus changent,
            les entreprises qui lisent le CV changent. Ces guides regroupent,
            pour chaque métier, l&apos;essentiel : accroche exemple, compétences
            à valoriser, erreurs à éviter, KPIs que les recruteurs veulent voir
            chiffrés, et fourchette de salaire 2026.
          </p>
          <p>
            Une fois que vous avez les bases, utilisez{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-700 underline font-medium"
            >
              CV Modifier
            </Link>{" "}
            pour adapter automatiquement votre CV à chaque offre que vous ciblez
            — 30 secondes par candidature, 3 crédits offerts sans carte
            bancaire.
          </p>
        </div>
      </section>

      {/* Grid par catégorie */}
      <section className="flex-1 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 space-y-14">
          {CATEGORY_ORDER.map((cat) => {
            const list = grouped[cat];
            if (!list || list.length === 0) return null;
            const style = CATEGORY_STYLES[cat];
            return (
              <div key={cat}>
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${style.badge}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                    />
                    {cat}
                  </span>
                  <span className="text-sm text-slate-500">
                    {list.length} métier{list.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {list.map((m) => (
                    <Link
                      key={m.slug}
                      href={`/cv-par-metier/${m.slug}`}
                      className="group rounded-2xl border border-slate-200 p-5 bg-white hover:border-blue-300 hover:shadow-sm transition-all flex flex-col justify-between"
                    >
                      <div>
                        <h2 className="font-semibold text-slate-900 text-base leading-tight mb-1.5 group-hover:text-blue-700 transition-colors">
                          CV {m.name.toLowerCase()}
                        </h2>
                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                          {m.nameFull}
                        </p>
                      </div>
                      <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:gap-2 transition-all">
                        Lire le guide
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Votre CV adapté à chaque offre en 30 secondes
          </h2>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto">
            CV + lettre de motivation personnalisés par IA, optimisés ATS, pour
            n&apos;importe quel métier. 3 générations offertes, sans carte
            bancaire.
          </p>
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl text-lg">
              Essayer CV Modifier gratuitement
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800">
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
            <Link
              href="/legal/mentions-legales"
              className="hover:text-white"
            >
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
