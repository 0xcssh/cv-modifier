import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { JsonLdScript } from "@/components/json-ld-script";
import { breadcrumbLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales de CV Modifier : éditeur, contact, hébergement et propriété intellectuelle.",
  alternates: { canonical: "/legal/mentions-legales" },
};

function TBD({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-semibold text-amber-600">[{children}]</span>
  );
}

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l&apos;accueil
        </Link>

        <article className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
              Mentions légales
            </h1>
            <p className="text-sm text-slate-500">
              Dernière mise à jour : 22 avril 2026
            </p>
          </header>

          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-8">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                Éditeur du site
              </h2>
              <ul className="space-y-1.5 list-none pl-0">
                <li>
                  <strong>Raison sociale :</strong>{" "}
                  <TBD>À COMPLÉTER — nom de la société</TBD>
                </li>
                <li>
                  <strong>Forme juridique :</strong>{" "}
                  <TBD>À COMPLÉTER — SAS, SASU, SARL, EI…</TBD>
                </li>
                <li>
                  <strong>Capital social :</strong>{" "}
                  <TBD>À COMPLÉTER — montant en euros</TBD>
                </li>
                <li>
                  <strong>Siège social :</strong>{" "}
                  <TBD>À COMPLÉTER — adresse complète</TBD>
                </li>
                <li>
                  <strong>SIRET :</strong>{" "}
                  <TBD>À COMPLÉTER — 14 chiffres</TBD>
                </li>
                <li>
                  <strong>Numéro de TVA intracommunautaire :</strong>{" "}
                  <TBD>À COMPLÉTER — FRxx xxxxxxxxx</TBD>
                </li>
                <li>
                  <strong>Directeur de la publication :</strong>{" "}
                  <TBD>À COMPLÉTER — nom et prénom</TBD>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Contact</h2>
              <p>
                Pour toute question relative au site ou au service CV Modifier,
                vous pouvez nous écrire à :{" "}
                <a
                  href="mailto:hello@cvmodifier.com"
                  className="text-blue-600 hover:underline"
                >
                  hello@cvmodifier.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                Hébergement
              </h2>
              <p className="mb-3">
                Le site CV Modifier s&apos;appuie sur les prestataires suivants :
              </p>
              <ul className="space-y-2 list-disc pl-6">
                <li>
                  <strong>Frontend :</strong> Vercel Inc., 440 N Barrows Court,
                  Oakland, CA 94607, USA.
                </li>
                <li>
                  <strong>Backend :</strong> Railway App Inc., 2261 Market
                  Street #4382, San Francisco, CA 94114, USA (région de
                  déploiement : Irlande).
                </li>
                <li>
                  <strong>Base de données :</strong> Neon Inc., base PostgreSQL
                  hébergée dans la région Frankfurt (Allemagne).
                </li>
                <li>
                  <strong>Stockage de fichiers :</strong> Cloudflare Inc.
                  (Cloudflare R2, bucket <code>cv-modifier</code>).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                Propriété intellectuelle
              </h2>
              <p>
                L&apos;ensemble du contenu présent sur le site CV Modifier
                (textes, graphismes, logos, icônes, images, mises en page,
                codes sources, modèles de CV et de lettre, prompts d&apos;IA)
                est la propriété exclusive de l&apos;éditeur, sauf mention
                contraire. Toute reproduction, représentation, modification,
                publication ou adaptation totale ou partielle de ces éléments,
                quel que soit le moyen ou le procédé utilisé, est interdite
                sans l&apos;autorisation écrite préalable de l&apos;éditeur.
                Toute exploitation non autorisée est susceptible de constituer
                une contrefaçon sanctionnée par le Code de la propriété
                intellectuelle.
              </p>
              <p className="mt-3">
                Les données et documents générés pour un utilisateur (CV
                adapté, lettre de motivation) restent, quant à eux, la
                propriété de cet utilisateur.
              </p>
            </section>
          </div>

          <footer className="mt-10 pt-6 border-t border-slate-100">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à l&apos;accueil
            </Link>
          </footer>
        </article>
      </div>
      <JsonLdScript
        data={breadcrumbLd([
          { name: "Accueil", url: "/" },
          { name: "Mentions légales", url: "/legal/mentions-legales" },
        ])}
      />
    </div>
  );
}
