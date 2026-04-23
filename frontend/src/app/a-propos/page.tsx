import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Cpu,
  Users,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "À propos — Notre mission",
  description:
    "CV Modifier aide les candidats à adapter leur CV et leur lettre de motivation à chaque offre d'emploi grâce à l'IA. Notre mission, notre équipe, notre tech.",
  alternates: { canonical: "/a-propos" },
};

export default function AProposPage() {
  return (
    <div className="flex flex-col min-h-screen">
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

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            À propos de <span className="text-blue-400">CV Modifier</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300">
            Nous rendons la candidature spontanée obsolète : un CV pertinent pour
            chaque offre, en 30 secondes, propulsé par l&apos;IA.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 space-y-14">
          {/* Mission */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                Notre mission
              </h2>
            </div>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                Chercher un job, c&apos;est un métier à plein temps. Les études
                le répètent depuis des années : un recruteur consacre environ 7
                secondes à la lecture initiale d&apos;un CV. Sept. Secondes. Et
                avant même d&apos;arriver entre ses mains, votre candidature
                doit franchir un ATS (Applicant Tracking System) qui filtre sur
                les mots-clés présents dans l&apos;offre.
              </p>
              <p>
                Résultat : pour avoir une chance, vous devez réécrire votre CV
                pour chaque offre. Remplacer un verbe, déplacer une compétence,
                adapter le ton de votre lettre de motivation. C&apos;est
                fastidieux, chronophage, et franchement démotivant quand vous
                enchaînez les candidatures sans retour.
              </p>
              <p>
                CV Modifier est né de ce constat. Notre mission est simple :{" "}
                <strong className="text-slate-900">
                  rendre l&apos;adaptation d&apos;un CV aussi rapide que
                  l&apos;envoi d&apos;un email
                </strong>
                . Vous collez une offre, l&apos;IA fait le travail de
                reformulation, et vous récupérez un CV et une lettre prêts à
                être envoyés, sans avoir à inventer quoi que ce soit sur votre
                parcours.
              </p>
            </div>
          </div>

          {/* Tech */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                <Cpu className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                La tech derrière
              </h2>
            </div>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                Nous avons choisi nos outils pour une seule raison : la qualité
                du résultat final. Pas de hype, pas de dépendances gratuites.
              </p>
              <ul className="space-y-3 list-disc pl-6">
                <li>
                  <strong className="text-slate-900">
                    Anthropic Claude Haiku 4.5
                  </strong>{" "}
                  — le modèle d&apos;IA qui reformule vos expériences. Nous avons
                  retenu Claude pour sa rigueur en français et son faible taux
                  d&apos;hallucination : l&apos;IA ne s&apos;autorise pas à
                  inventer des compétences que vous n&apos;avez pas.
                </li>
                <li>
                  <strong className="text-slate-900">
                    4 templates de CV construits sur-mesure
                  </strong>{" "}
                  (Classique, Moderne, Minimaliste, Créatif) — générés via
                  FPDF2 pour garantir un PDF texte sélectionnable,
                  ATS-compatible, sans image de texte.
                </li>
                <li>
                  <strong className="text-slate-900">Next.js + FastAPI</strong>{" "}
                  — frontend React Server Components côté candidat, backend
                  Python asynchrone côté génération. Stack moderne, performante,
                  maintenue.
                </li>
                <li>
                  <strong className="text-slate-900">
                    Infrastructure 100% Europe
                  </strong>{" "}
                  — base de données Neon PostgreSQL à Francfort, frontend Vercel
                  avec edge europe, stockage Cloudflare R2. Vos données ne
                  transitent jamais par des serveurs hors UE, hors passage
                  éclair par l&apos;API d&apos;Anthropic le temps d&apos;une
                  génération.
                </li>
                <li>
                  <strong className="text-slate-900">Paiements Stripe</strong> —
                  certifié PCI DSS Level 1. Nous ne voyons jamais les données
                  bancaires : Stripe gère tout en scope réduit à zéro pour nous.
                </li>
              </ul>
            </div>
          </div>

          {/* Équipe */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                L&apos;équipe
              </h2>
            </div>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                CV Modifier est une startup française basée à Toulouse, fondée
                fin 2025 par une petite équipe passionnée de tech et de
                recrutement.
              </p>
              <p>
                Nous sommes partis d&apos;une frustration personnelle : passer
                nos soirées à reformuler les mêmes expériences pour des offres
                qui ne répondaient même pas. On s&apos;est dit qu&apos;il
                devait y avoir mieux à faire avec un LLM moderne. Quelques
                semaines plus tard, le premier prototype tournait. Quelques
                mois plus tard, CV Modifier était en production, utilisé par
                des candidats partout en France.
              </p>
              <p>
                On reste une petite équipe, et on l&apos;assume : ça nous permet
                d&apos;itérer vite, de répondre en direct aux messages de nos
                utilisateurs, et de faire évoluer le produit à partir de
                retours concrets plutôt que de roadmaps figées.
              </p>
            </div>
          </div>

          {/* Valeurs */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                Nos valeurs
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-5">
                <h3 className="font-semibold text-slate-900 mb-2">
                  Transparence
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Tarifs clairs, pas de reconduction masquée, résiliation en un
                  clic depuis le portail Stripe. Les limites de l&apos;IA sont
                  documentées : nous ne promettons pas un emploi, nous promettons
                  un CV pertinent.
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-5">
                <h3 className="font-semibold text-slate-900 mb-2">
                  Confidentialité
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Vos CV ne sont jamais utilisés pour entraîner des modèles,
                  jamais revendus, jamais transmis à des recruteurs sans votre
                  action explicite. Droit à l&apos;oubli effectif sous 30 jours.
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-5">
                <h3 className="font-semibold text-slate-900 mb-2">
                  Pragmatisme
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Pas de buzzwords, pas de dashboard inutile. Vous uploadez,
                  vous collez, vous téléchargez. Si une fonctionnalité ne sert
                  pas directement à décrocher un entretien, elle n&apos;est pas
                  prioritaire.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Essayer CV Modifier gratuitement
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            3 générations offertes, sans carte bancaire, sans engagement.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 rounded-xl font-semibold"
            >
              Créer mon compte
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
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
