import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Politique cookies — CV Modifier",
  description:
    "Politique de gestion des cookies utilisés sur CV Modifier : cookies essentiels, cookies analytiques et préférences.",
};

export default function CookiesPage() {
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
              Politique cookies
            </h1>
            <p className="text-sm text-slate-500">
              Dernière mise à jour : 22 avril 2026
            </p>
          </header>

          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-8">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                Qu&apos;est-ce qu&apos;un cookie ?
              </h2>
              <p>
                Un cookie est un petit fichier texte déposé sur votre appareil
                (ordinateur, tablette ou smartphone) par un site web lors de
                votre visite. Il permet notamment de maintenir une session
                ouverte, de mémoriser vos préférences ou, dans certains cas,
                de mesurer l&apos;audience du site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                Cookies essentiels
              </h2>
              <p>
                Ces cookies sont strictement nécessaires au fonctionnement du
                Service. Ils ne peuvent pas être désactivés sans empêcher
                l&apos;utilisation du site. Leur base légale est
                l&apos;exécution du contrat qui nous lie à vous.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-50">
                    <tr className="text-left">
                      <th className="px-4 py-2 font-semibold text-slate-900">Nom</th>
                      <th className="px-4 py-2 font-semibold text-slate-900">Finalité</th>
                      <th className="px-4 py-2 font-semibold text-slate-900">Durée</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-200">
                      <td className="px-4 py-2 font-mono text-xs">
                        cv_modifier_auth
                      </td>
                      <td className="px-4 py-2">
                        Cookie d&apos;authentification (
                        <code>httpOnly</code>) — maintien de la session
                        utilisateur.
                      </td>
                      <td className="px-4 py-2">24 heures</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                Cookies analytiques
              </h2>
              <p className="italic text-slate-500">
                À venir. Aucun cookie analytique ou publicitaire n&apos;est
                actuellement déposé sur le site. Si de tels cookies étaient
                ajoutés ultérieurement, ils ne seraient activés qu&apos;après
                recueil de votre consentement explicite, et cette page sera
                mise à jour en conséquence.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                Comment gérer vos cookies
              </h2>
              <p>
                Vous pourrez prochainement gérer vos préférences via le bouton
                « Préférences cookies » disponible en bas de page. Vous pouvez
                également, à tout moment, configurer votre navigateur pour
                accepter ou refuser les cookies, ou pour être informé de leur
                dépôt. La suppression des cookies essentiels entraînera la
                déconnexion automatique de votre compte.
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-1">
                <li>
                  <a
                    className="text-blue-600 hover:underline"
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Gérer les cookies sur Google Chrome
                  </a>
                </li>
                <li>
                  <a
                    className="text-blue-600 hover:underline"
                    href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Gérer les cookies sur Firefox
                  </a>
                </li>
                <li>
                  <a
                    className="text-blue-600 hover:underline"
                    href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Gérer les cookies sur Safari
                  </a>
                </li>
              </ul>
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
    </div>
  );
}
