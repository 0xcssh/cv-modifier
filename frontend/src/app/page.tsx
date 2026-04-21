import Link from "next/link";
import { FileText, Zap, Download, Shield, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-14">
            Pourquoi CV Modifier ?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Optimisé ATS", desc: "Vos CV passent les filtres automatiques des recruteurs grâce à l'optimisation des mots-clés." },
              { icon: FileText, title: "CV + Lettre de motivation", desc: "Obtenez les deux documents adaptés à chaque offre en une seule génération." },
              { icon: Shield, title: "Crédible et réaliste", desc: "L'IA reformule vos expériences sans inventer. Le résultat reste fidèle à votre parcours." },
              { icon: Star, title: "Design professionnel", desc: "Un template de CV élégant à deux colonnes, prêt à impressionner les recruteurs." },
              { icon: Download, title: "PDF prêt à l'emploi", desc: "Téléchargez directement en PDF, pas besoin de retoucher manuellement." },
              { icon: FileText, title: "Extraction automatique", desc: "Uploadez votre CV existant — l'IA extrait toutes vos informations automatiquement." },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-100 hover:border-blue-200 transition-colors">
                <f.icon className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
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
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-white font-bold text-lg">
            CV <span className="text-blue-400">Modifier</span>
          </div>
          <p className="text-sm">&copy; 2026 CV Modifier. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
