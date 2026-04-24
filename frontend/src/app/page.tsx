import Link from "next/link";
import {
  FileText,
  Zap,
  Download,
  Shield,
  Star,
  ArrowRight,
  Target,
  RefreshCw,
  GraduationCap,
  Lock,
  Server,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLdScript } from "@/components/json-ld-script";
import { faqPageLd, type FaqItem } from "@/lib/schema";

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Comment CV Modifier adapte-t-il mon CV ?",
    a: "Vous collez l'URL d'une offre d'emploi : notre scraper récupère le contenu, puis notre IA analyse les compétences clés, les mots-clés et le ton attendu. Vos expériences sont ensuite reformulées pour mettre en avant ce qui est pertinent pour CE poste précis — sans inventer de compétences que vous n'avez pas.",
  },
  {
    q: "Puis-je personnaliser les règles d'adaptation ?",
    a: "Oui. Dans votre profil, un champ d'instructions personnalisées vous permet de préciser vos préférences : ton plus formel, mise en avant de certains mots-clés, neutralité de genre, anglicismes à éviter, etc. Ces règles priment sur les règles par défaut.",
  },
  {
    q: "Mes données sont-elles envoyées à des tiers ?",
    a: "Les contenus de vos CV transitent par notre fournisseur IA le temps d'une génération, avec engagement contractuel de ne pas les utiliser pour entraîner les modèles. Aucun tiers marketing ne reçoit vos CV. La liste complète de nos sous-traitants figure sur notre page Confidentialité.",
  },
  {
    q: "Quels formats de CV sont acceptés en import ?",
    a: "PDF uniquement pour l'instant. L'IA extrait automatiquement vos expériences, formations, compétences et coordonnées. Vous pouvez relire et corriger le tout avant la première génération.",
  },
  {
    q: "Combien de crédits me faut-il pour tester ?",
    a: "Chaque compte démarre avec 3 crédits offerts, sans carte bancaire. 1 crédit = 1 CV + 1 lettre de motivation adaptés à une offre. Si la génération échoue pour une raison technique, le crédit est automatiquement remboursé.",
  },
  {
    q: "Puis-je annuler mon abonnement à tout moment ?",
    a: "Oui, depuis le portail client Stripe accessible dans votre espace Facturation. Aucun engagement, aucune pénalité. Vos crédits non utilisés restent disponibles après résiliation.",
  },
  {
    q: "Les CV générés passent-ils les ATS ?",
    a: "Oui. Nos 4 templates (Classique, Moderne, Minimaliste, Créatif) sont construits en texte sélectionnable (pas d'images de texte), avec une structure sémantique que les logiciels de tri (ATS : Workday, Taleo, Greenhouse, etc.) savent lire. Pas de colonnes complexes, pas de texte en image, pas d'icônes parasites : le contenu est extrait correctement par les principaux ATS du marché.",
  },
  {
    q: "Quelle IA est utilisée derrière CV Modifier ?",
    a: "CV Modifier utilise une IA générative de pointe. Nous sélectionnons le modèle qui offre le meilleur rapport qualité/coût pour l'adaptation de CV en français. Nous ne communiquons pas publiquement notre fournisseur actuel pour préserver notre flexibilité technique. La liste détaillée de nos sous-traitants figure sur notre page Confidentialité (obligation RGPD).",
  },
];

export default function LandingPage() {
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
              <Button variant="ghost" className="text-slate-300 hover:text-white text-sm sm:text-base">
                Connexion
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base">
                <span className="sm:hidden">S&apos;inscrire</span>
                <span className="hidden sm:inline">Commencer gratuitement</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-emerald-500/20">
            <Zap className="w-4 h-4" />
            Propulsé par l&apos;IA
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Adaptez votre CV à chaque offre
            <br />
            <span className="text-blue-400">en 30 secondes</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Collez le lien d&apos;une offre d&apos;emploi et obtenez un CV + lettre de motivation
            parfaitement adaptés. Plus besoin de passer des heures à réécrire.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-xl shadow-lg shadow-blue-600/25">
                Créer mon CV gratuitement
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
          <p className="text-slate-400 text-sm mt-4">
            3 générations offertes — aucune carte bancaire requise
          </p>
        </div>
      </section>

      {/* Trust bar — promesses factuelles, non numériques */}
      <section className="bg-slate-900 border-t border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "30s", label: "par candidature" },
              { value: "Gratuit", label: "3 générations offertes" },
              { value: "ATS", label: "format compatible" },
              { value: "UE", label: "données hébergées en Europe" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl md:text-3xl font-extrabold text-white">
                  {s.value}
                </div>
                <div className="text-sm text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-slate-500 text-center mb-14 text-lg">
            3 étapes simples pour un CV sur-mesure
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: FileText,
                title: "Uploadez votre CV",
                desc: "Importez votre CV actuel en PDF. Notre IA extrait automatiquement toutes vos informations.",
                color: "bg-blue-50 text-blue-600 border-blue-100",
              },
              {
                step: "2",
                icon: Zap,
                title: "Collez l'offre d'emploi",
                desc: "Copiez le lien de l'offre qui vous intéresse. L'IA analyse les mots-clés et les compétences recherchées.",
                color: "bg-emerald-50 text-emerald-600 border-emerald-100",
              },
              {
                step: "3",
                icon: Download,
                title: "Téléchargez vos documents",
                desc: "Recevez un CV et une lettre de motivation parfaitement adaptés à l'offre, prêts à envoyer.",
                color: "bg-violet-50 text-violet-600 border-violet-100",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="absolute -top-4 -left-2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  {item.step}
                </div>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 border ${item.color}`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personas — Pour qui ? */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">
            Pour qui est CV Modifier ?
          </h2>
          <p className="text-slate-500 text-center mb-14 text-lg">
            Conçu pour tous ceux qui envoient des candidatures, souvent.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Candidat en recherche active",
                desc: "Vous envoyez 10+ candidatures par semaine et vous êtes fatigué de réécrire votre CV à chaque fois. CV Modifier adapte automatiquement votre profil aux mots-clés de chaque offre, sans perdre votre identité professionnelle.",
                color: "bg-blue-50 text-blue-600 border-blue-100",
              },
              {
                icon: RefreshCw,
                title: "En reconversion",
                desc: "Vous changez de métier et vous devez valoriser des compétences transférables que votre CV actuel met mal en avant. L'IA réécrit vos expériences passées sous l'angle du nouveau poste visé, de façon crédible et honnête.",
                color: "bg-emerald-50 text-emerald-600 border-emerald-100",
              },
              {
                icon: GraduationCap,
                title: "Jeune diplômé",
                desc: "Peu d'expérience à faire tenir sur une page ? CV Modifier maximise chaque stage, chaque projet, chaque soft skill pour que votre CV ne passe plus inaperçu. Lettre de motivation personnalisée incluse à chaque génération.",
                color: "bg-violet-50 text-violet-600 border-violet-100",
              },
            ].map((p) => (
              <div
                key={p.title}
                className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 border ${p.color}`}>
                  <p.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{p.title}</h3>
                <p className="text-slate-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-14">
            Pourquoi CV Modifier ?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Optimisé ATS", desc: "Vos CV passent les filtres automatiques des recruteurs grâce à l'optimisation des mots-clés." },
              { icon: FileText, title: "CV + Lettre de motivation", desc: "Obtenez les deux documents adaptés à chaque offre en une seule génération." },
              { icon: Shield, title: "Crédible et réaliste", desc: "L'IA reformule vos expériences sans inventer. Le résultat reste fidèle à votre parcours." },
              { icon: Star, title: "Design professionnel", desc: "4 templates élégants au choix (Classique, Moderne, Minimaliste, Créatif)." },
              { icon: Download, title: "PDF prêt à l'emploi", desc: "Téléchargez directement en PDF, pas besoin de retoucher manuellement." },
              { icon: FileText, title: "Extraction automatique", desc: "Uploadez votre CV existant — l'IA extrait toutes vos informations automatiquement." },
            ].map((f, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-6 border border-slate-100 hover:border-blue-200 transition-colors">
                <f.icon className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security / Trust badges */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">
            Vos données, notre sécurité
          </h2>
          <p className="text-slate-500 text-center mb-14 text-lg">
            Confidentialité et conformité ne sont pas des options.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Lock,
                title: "Paiement sécurisé",
                desc: "Transactions chiffrées par Stripe (certifié PCI DSS Level 1). Nous ne stockons jamais vos données de carte.",
              },
              {
                icon: Server,
                title: "Hébergement Europe",
                desc: "Infrastructure Vercel (frontend) + Neon PostgreSQL en Allemagne (eu-central-1). Vos données ne quittent pas l'UE.",
              },
              {
                icon: Shield,
                title: "RGPD compliant",
                desc: "Données chiffrées au repos et en transit. Droit d'accès, de rectification et d'effacement sous 30 jours sur simple demande.",
              },
              {
                icon: Bot,
                title: "IA responsable",
                desc: "Vos CV ne sont jamais utilisés pour entraîner l'IA, ni vendus à des tiers. Contenus supprimés une fois la génération terminée.",
              },
            ].map((b) => (
              <div
                key={b.title}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-4">
                  <b.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{b.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-10 text-xs text-slate-600">
            <span className="bg-white border border-slate-200 rounded-full px-3 py-1.5">
              IA générative de pointe
            </span>
            <span className="bg-white border border-slate-200 rounded-full px-3 py-1.5">
              Paiement sécurisé Stripe
            </span>
            <span className="bg-white border border-slate-200 rounded-full px-3 py-1.5">
              Conforme RGPD
            </span>
            <span className="bg-white border border-slate-200 rounded-full px-3 py-1.5">
              Hébergement Europe
            </span>
            <span className="bg-white border border-slate-200 rounded-full px-3 py-1.5">
              Format ATS-compatible
            </span>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">
            Tarifs simples et transparents
          </h2>
          <p className="text-slate-500 text-center mb-14 text-lg">
            Commencez gratuitement, upgradez quand vous voulez
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl border border-slate-200 p-8 bg-white">
              <h3 className="font-semibold text-slate-900 text-lg mb-1">Gratuit</h3>
              <p className="text-slate-400 text-sm mb-4">Pour essayer</p>
              <div className="text-4xl font-bold text-slate-900 mb-6">0&euro;</div>
              <ul className="space-y-3 text-sm text-slate-600 mb-8">
                <li className="flex items-center gap-2"><span className="text-emerald-500">&#10003;</span> 3 générations offertes</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500">&#10003;</span> CV + Lettre de motivation</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500">&#10003;</span> Extraction CV automatique</li>
              </ul>
              <Link href="/register">
                <Button variant="outline" className="w-full">Commencer</Button>
              </Link>
            </div>

            {/* Starter */}
            <div className="rounded-2xl border-2 border-blue-600 p-8 bg-white relative shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Populaire
              </div>
              <h3 className="font-semibold text-slate-900 text-lg mb-1">Starter</h3>
              <p className="text-slate-400 text-sm mb-4">Pour les chercheurs actifs</p>
              <div className="text-4xl font-bold text-slate-900 mb-1">
                9,99&euro;<span className="text-lg font-normal text-slate-400">/mois</span>
              </div>
              <p className="text-sm text-slate-400 mb-6">30 générations/mois</p>
              <ul className="space-y-3 text-sm text-slate-600 mb-8">
                <li className="flex items-center gap-2"><span className="text-emerald-500">&#10003;</span> 30 CV + lettres par mois</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500">&#10003;</span> Tout le plan gratuit</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500">&#10003;</span> Historique complet</li>
              </ul>
              <Link href="/register">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Choisir Starter</Button>
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-2xl border border-slate-200 p-8 bg-white">
              <h3 className="font-semibold text-slate-900 text-lg mb-1">Pro</h3>
              <p className="text-slate-400 text-sm mb-4">Pour les pros</p>
              <div className="text-4xl font-bold text-slate-900 mb-1">
                19,99&euro;<span className="text-lg font-normal text-slate-400">/mois</span>
              </div>
              <p className="text-sm text-slate-400 mb-6">100 générations/mois</p>
              <ul className="space-y-3 text-sm text-slate-600 mb-8">
                <li className="flex items-center gap-2"><span className="text-emerald-500">&#10003;</span> 100 CV + lettres par mois</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500">&#10003;</span> Tout le plan Starter</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500">&#10003;</span> Génération prioritaire</li>
              </ul>
              <Link href="/register">
                <Button variant="outline" className="w-full">Choisir Pro</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">
            Questions fréquentes
          </h2>
          <p className="text-slate-500 text-center mb-14 text-lg">
            Tout ce que vous voulez savoir avant de tester.
          </p>
          <div className="space-y-3">
            {FAQ_ITEMS.map((f) => (
              <details
                key={f.q}
                className="group bg-slate-50 border border-slate-100 rounded-xl overflow-hidden"
              >
                <summary className="cursor-pointer list-none px-6 py-4 flex items-center justify-between gap-4 text-slate-900 font-semibold hover:bg-slate-100 transition-colors">
                  <span>{f.q}</span>
                  <span
                    aria-hidden="true"
                    className="text-blue-600 text-xl font-light transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à décrocher votre prochain job ?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Rejoignez des centaines de candidats qui ont boosté leurs candidatures avec CV Modifier.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 rounded-xl font-semibold">
              Commencer gratuitement
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
            <p className="text-sm">&copy; 2026 CV Modifier. Tous droits réservés.</p>
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

      <JsonLdScript data={faqPageLd(FAQ_ITEMS)} />
    </div>
  );
}
