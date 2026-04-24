import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { JsonLdScript } from "@/components/json-ld-script";
import { breadcrumbLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description:
    "Conditions générales d'utilisation du service CV Modifier : inscription, crédits, responsabilités et droit applicable.",
  alternates: { canonical: "/legal/cgu" },
};

function TBD({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-semibold text-amber-600">[{children}]</span>
  );
}

export default function CguPage() {
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
              Conditions Générales d&apos;Utilisation
            </h1>
            <p className="text-sm text-slate-500">
              Dernière mise à jour : 22 avril 2026
            </p>
          </header>

          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-8">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                1. Objet
              </h2>
              <p>
                Les présentes Conditions Générales d&apos;Utilisation (ci-après
                « CGU ») régissent l&apos;utilisation du service CV Modifier
                (ci-après « le Service »), accessible à l&apos;adresse
                cvmodifier.com. Le Service permet aux utilisateurs
                d&apos;adapter automatiquement leur CV et leur lettre de
                motivation à des offres d&apos;emploi, à l&apos;aide
                d&apos;une intelligence artificielle générative.
                L&apos;utilisation du Service implique l&apos;acceptation
                sans réserve des présentes CGU.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                2. Inscription et compte utilisateur
              </h2>
              <p>
                L&apos;inscription au Service est réservée aux personnes âgées
                d&apos;au moins 16 ans. L&apos;utilisateur doit fournir une
                adresse email valide et choisir un mot de passe suffisamment
                robuste (longueur minimale et combinaison de caractères).
                Chaque utilisateur ne peut disposer que d&apos;un seul compte.
                L&apos;utilisateur s&apos;engage à maintenir ses identifiants
                confidentiels et à ne pas les partager avec un tiers. Toute
                activité réalisée depuis le compte est réputée être le fait de
                son titulaire.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                3. Services
              </h2>
              <p>
                Le Service fonctionne en trois étapes principales :
              </p>
              <ol className="list-decimal pl-6 space-y-1 mt-2">
                <li>
                  l&apos;utilisateur téléverse son CV au format PDF, dont le
                  contenu est extrait automatiquement par l&apos;IA ;
                </li>
                <li>
                  l&apos;utilisateur fournit l&apos;URL ou le texte d&apos;une
                  offre d&apos;emploi ;
                </li>
                <li>
                  le Service génère un CV et une lettre de motivation au
                  format PDF, adaptés à l&apos;offre.
                </li>
              </ol>
              <p className="mt-3">
                Les documents générés sont le résultat d&apos;une adaptation
                produite par une IA. Ils peuvent contenir des erreurs,
                inexactitudes ou formulations inadaptées.{" "}
                <strong>
                  Il appartient à l&apos;utilisateur de les relire, de les
                  corriger et de les valider avant tout envoi à un recruteur.
                </strong>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                4. Crédits
              </h2>
              <p>
                À l&apos;inscription, chaque utilisateur bénéficie de 3 crédits
                gratuits. Un crédit permet de générer un CV accompagné
                d&apos;une lettre de motivation (CV + lettre = 1 crédit). Des
                packs de crédits payants et des abonnements seront proposés
                ultérieurement{" "}
                <TBD>À COMPLÉTER — offres et tarifs définitifs</TBD>. Les
                crédits achetés ne sont pas remboursables, sauf dans les cas
                prévus par la loi (notamment droit de rétractation applicable
                aux consommateurs et obligations légales en matière de
                conformité).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                5. Responsabilité
              </h2>
              <p>
                L&apos;utilisateur est seul responsable du contenu qu&apos;il
                téléverse (notamment son CV), de l&apos;exactitude des
                informations fournies et de l&apos;usage qu&apos;il fait des
                documents générés par le Service. L&apos;éditeur ne saurait
                être tenu responsable d&apos;un recrutement manqué, d&apos;une
                candidature rejetée ou de tout préjudice professionnel lié à
                l&apos;utilisation du Service. L&apos;éditeur met en œuvre ses
                meilleurs efforts pour assurer la disponibilité du Service,
                sans toutefois garantir une disponibilité ininterrompue.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                6. Propriété
              </h2>
              <p>
                Le CV téléversé par l&apos;utilisateur ainsi que les documents
                générés à partir de celui-ci (CV adapté, lettre de motivation)
                restent la propriété exclusive de l&apos;utilisateur. En
                revanche, les modèles de CV, mises en page, prompts
                d&apos;intelligence artificielle et l&apos;ensemble des
                éléments techniques du Service restent la propriété de
                l&apos;éditeur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                7. Résiliation
              </h2>
              <p>
                L&apos;utilisateur peut à tout moment demander la suppression
                de son compte (fonctionnalité à venir){" "}
                <TBD>
                  À COMPLÉTER — décrire la procédure actuelle (email, formulaire)
                </TBD>
                . L&apos;éditeur se réserve le droit de suspendre ou supprimer
                un compte en cas de violation des présentes CGU, de
                comportement frauduleux ou d&apos;usage abusif du Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                8. Droit applicable et juridiction
              </h2>
              <p>
                Les présentes CGU sont soumises au droit français. En cas de
                litige, et à défaut de résolution amiable, les tribunaux
                compétents seront ceux de{" "}
                <TBD>À COMPLÉTER — ressort du siège social</TBD>, sous réserve
                des règles impératives applicables aux consommateurs.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                9. Modifications
              </h2>
              <p>
                Les CGU peuvent être modifiées à tout moment afin de refléter
                l&apos;évolution du Service ou du cadre légal. Les
                utilisateurs seront informés par email de toute modification
                substantielle, au moins 30 jours avant son entrée en vigueur.
                La poursuite de l&apos;utilisation du Service après cette
                date vaut acceptation des nouvelles CGU.
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
          { name: "CGU", url: "/legal/cgu" },
        ])}
      />
    </div>
  );
}
