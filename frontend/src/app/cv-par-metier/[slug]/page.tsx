import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Quote,
  TrendingUp,
  Building2,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CV_METIERS,
  CATEGORY_STYLES,
  getMetierBySlug,
  getRelatedMetiers,
} from "@/lib/cv-metiers";
import { getPostBySlug } from "@/lib/blog-posts";

// Pillar pages metadata — used for the "related pillars" card block.
const PILLAR_META: Record<
  string,
  { title: string; blurb: string }
> = {
  "cv-ats": {
    title: "CV ATS : passer les filtres automatiques",
    blurb:
      "Les règles concrètes pour qu'un CV passe Taleo, Workday et les autres.",
  },
  "adapter-cv-offre-emploi": {
    title: "Adapter son CV à une offre d'emploi",
    blurb:
      "Méthode pour personnaliser titre, accroche et compétences à chaque offre.",
  },
  "creer-cv": {
    title: "Créer un CV en 2026",
    blurb:
      "Formats, sections, longueur, outils : le guide pour partir sur de bonnes bases.",
  },
  "lettre-motivation-ia": {
    title: "Lettre de motivation par IA",
    blurb:
      "Rendre une lettre IA crédible : brief, structure, ton réaliste.",
  },
};

// Prerender every métier at build time.
export async function generateStaticParams() {
  return CV_METIERS.map((m) => ({ slug: m.slug }));
}

// Any slug not in the static list should 404.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const m = getMetierBySlug(slug);
  if (!m) {
    return {
      title: "Métier introuvable",
      description: "Cette page n'existe pas ou a été déplacée.",
    };
  }
  const title = `CV ${m.name.toLowerCase()} : structure gagnante et exemples (2026)`;
  const description =
    m.intro.length > 155 ? `${m.intro.slice(0, 152)}...` : m.intro;
  const url = `/cv-par-metier/${m.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://cvmodifier.com${url}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CvMetierPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const metier = getMetierBySlug(slug);
  if (!metier) notFound();

  const related = getRelatedMetiers(metier);
  const relatedBlogs = metier.relatedBlogSlugs
    .map((s) => getPostBySlug(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const style = CATEGORY_STYLES[metier.category];

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
            <Link href="/cv-par-metier" className="hover:text-blue-600">
              CV par métier
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-medium">{metier.name}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-100 py-10 md:py-14">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${style.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
              {metier.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
            CV {metier.name.toLowerCase()} : structure gagnante et exemples
            (2026)
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            {metier.intro}
          </p>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16 text-slate-700 leading-relaxed">
        {/* H2 1 — Attentes recruteurs */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Les attentes des recruteurs pour un poste de{" "}
            {metier.name.toLowerCase()}
          </h2>
          <p>{metier.recruiterExpectations}</p>
        </section>

        {/* H2 2 — Compétences clés */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Les compétences clés à valoriser
          </h2>
          <p className="mb-6">
            Les compétences ci-dessous sont celles que les offres{" "}
            {metier.name.toLowerCase()} mentionnent le plus fréquemment dans le
            haut du job description en 2026. Reprenez le vocabulaire exact des
            offres que vous ciblez — les parseurs ATS matchent à la lettre.
          </p>
          <div className="grid gap-3 md:grid-cols-2 mb-6">
            {metier.keySkills.map((s) => (
              <div
                key={s}
                className="flex items-start gap-2 text-[15px] bg-slate-50 border border-slate-100 rounded-lg px-3 py-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{s}</span>
              </div>
            ))}
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">
            Outils et technologies à mentionner
          </h3>
          <div className="flex flex-wrap gap-2">
            {metier.toolsTech.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700"
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* H2 3 — Accroche exemple */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Exemple d&apos;accroche gagnante
          </h2>
          <p className="mb-5">
            L&apos;accroche (3-5 lignes sous l&apos;intitulé du poste visé) est
            lue en premier. Elle doit situer votre niveau, votre domaine, et un
            résultat concret. Voici un modèle adapté au métier de{" "}
            {metier.name.toLowerCase()} :
          </p>
          <blockquote className="relative rounded-2xl border-l-4 border-blue-500 bg-blue-50/50 p-6 italic text-slate-800 leading-relaxed">
            <Quote className="absolute top-4 right-4 w-6 h-6 text-blue-200" />
            {metier.accrocheExample}
          </blockquote>
          <p className="mt-5 text-sm text-slate-500">
            Adaptez les chiffres et le stack à votre réalité — les recruteurs
            sentent les exemples recopiés tels quels. Pour personnaliser une
            accroche à chaque offre en 30 secondes, utilisez{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              CV Modifier
            </Link>
            .
          </p>
        </section>

        {/* H2 4 — KPIs */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Les chiffres qui font la différence
          </h2>
          <p className="mb-6">
            Un CV de {metier.name.toLowerCase()} sans chiffres ressemble à du
            blabla. Voici les indicateurs que votre CV gagne à porter. Deux ou
            trois bien placés valent mieux qu&apos;une liste exhaustive.
          </p>
          <ul className="space-y-3">
            {metier.keyKpis.map((k) => (
              <li key={k} className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>{k}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA mid */}
        <aside className="my-12 rounded-2xl bg-blue-50 border border-blue-100 p-6 md:p-8 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Adapter votre CV à une offre {metier.name.toLowerCase()} en 30
            secondes
          </h3>
          <p className="text-slate-700 mb-5">
            Chaque offre est un peu différente. CV Modifier réécrit titre,
            accroche et compétences à partir de votre profil et de
            l&apos;URL de l&apos;offre. 3 crédits offerts, sans carte bancaire.
          </p>
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-5 rounded-xl">
              Essayer gratuitement
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </aside>

        {/* H2 5 — Erreurs */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Les erreurs fatales à éviter
          </h2>
          <p className="mb-6">
            Ces erreurs reviennent dans la majorité des CV{" "}
            {metier.name.toLowerCase()} que nous voyons passer. Aucune
            n&apos;est grave prise isolément ; accumulées, elles font qu&apos;un
            recruteur passe au CV suivant.
          </p>
          <div className="grid gap-4">
            {metier.commonMistakes.map((mis) => (
              <div
                key={mis.title}
                className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 bg-white"
              >
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 mb-1">
                    {mis.title}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {mis.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* H2 6 — Qui recrute */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Qui recrute en France ?
          </h2>
          <p className="mb-6">
            Entreprises françaises et filiales connues qui recrutent
            régulièrement des profils {metier.name.toLowerCase()}. Liste non
            exhaustive et indicative — elle évolue au gré des levées de fonds
            et des cycles de marché.
          </p>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {metier.hiringCompanies.map((c) => (
              <div
                key={c}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
              >
                <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>{c}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Callout salaire + carrière */}
        <aside className="my-10 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 md:p-7">
          <div className="flex items-start gap-3 mb-3">
            <Lightbulb className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-900 mb-1">
                Salaire et carrière
              </h3>
              <p className="text-slate-700 leading-relaxed">
                <strong>Fourchette 2026 :</strong> {metier.salaryRange}.
              </p>
              <p className="text-slate-700 leading-relaxed mt-2">
                <strong>Évolution typique :</strong> {metier.typicalCareer}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Fourchettes indicatives basées sur les études APEC, Robert Half et
            Glassdoor 2025-2026. Varient fortement selon Paris / province et
            selon la taille d&apos;entreprise.
          </p>
        </aside>

        {/* CTA final */}
        <aside className="mt-16 rounded-2xl bg-slate-900 text-white p-8 md:p-10 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Un CV {metier.name.toLowerCase()} prêt en 30 secondes
          </h3>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto">
            CV + lettre de motivation adaptés à chaque offre, optimisés ATS. 3
            générations offertes à l&apos;inscription, sans carte bancaire.
          </p>
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl text-lg">
              Essayer CV Modifier gratuitement
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </aside>

        {/* Related métiers */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-slate-100 pt-10">
            <h2 className="text-xl font-bold text-slate-900 mb-5">
              Métiers connexes
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {related.map((r) => {
                const rs = CATEGORY_STYLES[r.category];
                return (
                  <Link
                    key={r.slug}
                    href={`/cv-par-metier/${r.slug}`}
                    className="group block rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:bg-blue-50/40 transition-colors"
                  >
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold mb-2 ${rs.badge}`}
                    >
                      <span className={`w-1 h-1 rounded-full ${rs.dot}`} />
                      {r.category}
                    </span>
                    <p className="font-semibold text-slate-900 mb-1 group-hover:text-blue-700">
                      CV {r.name.toLowerCase()}
                    </p>
                    <p className="text-sm text-slate-500 line-clamp-2">
                      {r.nameFull}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Related blog articles */}
        {relatedBlogs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-slate-900 mb-5">
              À lire sur notre blog
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {relatedBlogs.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="block rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
                >
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1.5">
                    {p.category} · {p.readTime} min
                  </p>
                  <p className="font-semibold text-slate-900 mb-1">
                    {p.title}
                  </p>
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {p.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related pillars */}
        {metier.relatedPillarSlugs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-slate-900 mb-5">
              Guides complémentaires
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {metier.relatedPillarSlugs.map((pslug) => {
                const meta = PILLAR_META[pslug];
                if (!meta) return null;
                return (
                  <Link
                    key={pslug}
                    href={`/${pslug}`}
                    className="block rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
                  >
                    <p className="font-semibold text-slate-900 mb-1">
                      {meta.title}
                    </p>
                    <p className="text-sm text-slate-500">{meta.blurb}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </article>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 mt-12">
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
