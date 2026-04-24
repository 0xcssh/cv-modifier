import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { JsonLdScript } from "@/components/json-ld-script";
import { breadcrumbLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité et de protection des données personnelles de CV Modifier, conforme au RGPD.",
  alternates: { canonical: "/legal/confidentialite" },
};

function TBD({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-semibold text-amber-600">[{children}]</span>
  );
}

export default function ConfidentialitePage() {
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
              Politique de confidentialité
            </h1>
            <p className="text-sm text-slate-500">
              Dernière mise à jour : 22 avril 2026
            </p>
          </header>

          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-8">
            <section>
              <p>
                La présente politique décrit la manière dont CV Modifier
                collecte, utilise et protège vos données personnelles,
                conformément au Règlement (UE) 2016/679 du 27 avril 2016
                (ci-après « RGPD ») et à la loi « Informatique et Libertés »
                modifiée.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                Responsable de traitement
              </h2>
              <p>
                Le responsable de traitement des données est{" "}
                <TBD>À COMPLÉTER — raison sociale</TBD>, dont le siège est
                situé{" "}
                <TBD>À COMPLÉTER — adresse</TBD>, joignable par email à{" "}
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
                Données collectées
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>À l&apos;inscription :</strong> adresse email, mot
                  de passe (stocké sous forme hachée, jamais en clair).
                </li>
                <li>
                  <strong>Dans votre profil :</strong> nom, prénom, adresse
                  postale, numéro de téléphone, âge, photo, contenu complet du
                  CV (expériences professionnelles, formations, compétences,
                  langues, centres d&apos;intérêt).
                </li>
                <li>
                  <strong>Lors d&apos;une génération :</strong> URL ou texte
                  de l&apos;offre d&apos;emploi, historique des générations,
                  fichiers PDF générés (CV adapté et lettre de motivation).
                </li>
                <li>
                  <strong>Automatiquement :</strong> journaux techniques
                  incluant adresse IP, agent utilisateur (navigateur) et
                  horodatages de connexion. Ces logs sont conservés 12 mois
                  pour des finalités de sécurité et de lutte contre la fraude.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                Finalités et bases légales
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Exécution du Service</strong> (création de compte,
                  génération de CV et lettres, gestion des crédits) — base
                  légale : exécution du contrat.
                </li>
                <li>
                  <strong>Amélioration du produit</strong> (statistiques
                  agrégées d&apos;usage, correction de bugs) — base légale :
                  intérêt légitime de l&apos;éditeur à faire évoluer le
                  Service.
                </li>
                <li>
                  <strong>Communications transactionnelles</strong>{" "}
                  (confirmation d&apos;inscription, vérification d&apos;email,
                  réinitialisation de mot de passe, alertes liées aux
                  crédits) — base légale : exécution du contrat.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                Destinataires et sous-traitants
              </h2>
              <p>
                Vos données peuvent être transmises aux sous-traitants
                suivants, strictement pour les besoins du Service :
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  <strong>Anthropic (Claude AI)</strong> — traitement du
                  contenu de votre profil et de l&apos;offre d&apos;emploi
                  pour générer les documents adaptés. Serveurs situés aux
                  États-Unis ; transferts encadrés par des clauses
                  contractuelles types et un Data Processing Addendum.
                </li>
                <li>
                  <strong>Resend</strong> — envoi des emails transactionnels
                  (vérification, réinitialisation de mot de passe, etc.).
                </li>
                <li>
                  <strong>Vercel, Railway, Neon, Cloudflare</strong> —
                  hébergement de l&apos;application, de la base de données et
                  des fichiers (voir mentions légales pour les adresses
                  complètes).
                </li>
              </ul>
              <p className="mt-3">
                Vos données ne sont <strong>jamais vendues</strong> et ne sont
                pas partagées avec des tiers à des fins commerciales ou
                publicitaires.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                Durées de conservation
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Compte actif :</strong> vos données sont conservées
                  tant que votre compte reste actif.
                </li>
                <li>
                  <strong>Compte inactif :</strong> au bout de 24 mois sans
                  connexion, un email d&apos;alerte vous est envoyé ; en
                  l&apos;absence de réaction de votre part dans les 3 mois,
                  votre compte et les données associées sont supprimés
                  définitivement.
                </li>
                <li>
                  <strong>Générations :</strong> les CV et lettres générés,
                  ainsi que les URL d&apos;offres associées, sont conservés 12
                  mois puis purgés automatiquement{" "}
                  <TBD>À COMPLÉTER si politique différente</TBD>.
                </li>
                <li>
                  <strong>Logs techniques :</strong> 12 mois maximum.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                Vos droits (RGPD)
              </h2>
              <p>
                Conformément au RGPD, vous disposez des droits suivants sur
                vos données personnelles :
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>droit d&apos;accès ;</li>
                <li>droit de rectification ;</li>
                <li>droit à l&apos;effacement (« droit à l&apos;oubli ») ;</li>
                <li>droit à la portabilité ;</li>
                <li>droit d&apos;opposition ;</li>
                <li>droit à la limitation du traitement.</li>
              </ul>
              <p className="mt-3">
                Pour exercer l&apos;un de ces droits, adressez-nous un email à{" "}
                <a
                  href="mailto:hello@cvmodifier.com"
                  className="text-blue-600 hover:underline"
                >
                  hello@cvmodifier.com
                </a>
                . Vous disposez également du droit d&apos;introduire une
                réclamation auprès de la CNIL (
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  www.cnil.fr
                </a>
                ) si vous estimez que le traitement de vos données n&apos;est
                pas conforme à la réglementation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                Sécurité
              </h2>
              <p>
                Nous mettons en œuvre les mesures techniques et
                organisationnelles suivantes pour protéger vos données :
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>
                  mots de passe hachés avec un algorithme robuste (bcrypt) ;
                </li>
                <li>communications chiffrées en HTTPS sur l&apos;ensemble du site ;</li>
                <li>
                  authentification par jeton JWT stocké dans un cookie{" "}
                  <code>httpOnly</code> ;
                </li>
                <li>
                  isolation stricte des données entre comptes au niveau
                  applicatif ;
                </li>
                <li>
                  chiffrement au repos appliqué par nos prestataires Neon
                  (base de données) et Cloudflare R2 (stockage fichiers).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                Transferts hors Union Européenne
              </h2>
              <p>
                Certains de nos sous-traitants (notamment Anthropic, Vercel,
                Railway et Cloudflare) sont établis aux États-Unis ou
                traitent des données depuis des serveurs situés hors de
                l&apos;Union Européenne. Ces transferts sont encadrés par les
                clauses contractuelles types adoptées par la Commission
                européenne et, le cas échéant, par des mesures
                supplémentaires (chiffrement, pseudonymisation, Data
                Processing Addendum).
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
          { name: "Confidentialité", url: "/legal/confidentialite" },
        ])}
      />
    </div>
  );
}
