import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Adapter son CV à une offre d'emploi : le guide complet (2026)",
  description:
    "Adapter son CV à chaque offre d'emploi multiplie vos chances de décrocher un entretien. Méthode, checklist et exemples concrets à appliquer en 2026.",
  alternates: { canonical: "/adapter-cv-offre-emploi" },
  openGraph: {
    title: "Adapter son CV à une offre d'emploi : le guide complet (2026)",
    description:
      "Adapter son CV à chaque offre d'emploi multiplie vos chances de décrocher un entretien. Méthode, checklist et exemples concrets.",
    type: "article",
  },
};

export default function AdapterCvOffreEmploiPage() {
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

      {/* Hero */}
      <header className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-emerald-400 text-sm font-medium mb-3">
            Guide · Candidature
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5">
            Adapter son CV à une offre d&apos;emploi : le guide complet (2026)
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Envoyer le même CV à 50 offres ne marche plus. En 2026, les
            recruteurs passent en moyenne 7 secondes sur un CV (source : APEC)
            et les ATS filtrent les candidatures avant même qu&apos;un humain
            les voie. Voici la méthode complète pour adapter votre CV à chaque
            offre, sans y passer deux heures.
          </p>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16 text-slate-700 leading-relaxed">
        {/* Intro */}
        <section className="mb-12">
          <p className="text-lg">
            Un CV adapté à l&apos;offre a jusqu&apos;à 3 fois plus de chances
            d&apos;obtenir un entretien qu&apos;un CV générique. Ce guide
            couvre tout : les cinq éléments à personnaliser systématiquement,
            comment extraire les mots-clés d&apos;une offre en deux minutes,
            une checklist pratique et les cinq erreurs classiques qui coulent
            une candidature.
          </p>
        </section>

        {/* H2 1 */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Pourquoi adapter son CV à chaque offre ?
          </h2>
          <p className="mb-4">
            Le marché français de l&apos;emploi reçoit des millions de
            candidatures chaque année, et la majorité des grands comptes
            utilisent désormais un ATS (Applicant Tracking System) pour
            pré-filtrer les CV. Selon les chiffres communément partagés dans
            les rapports RH, une part significative des CV est écartée avant
            d&apos;atteindre un recruteur humain, souvent parce qu&apos;ils ne
            contiennent pas les mots-clés de l&apos;offre.
          </p>
          <p className="mb-4">
            Côté recruteur humain, la lecture d&apos;un CV en premier passage
            dure en moyenne 7 secondes d&apos;après une étude bien connue de
            l&apos;APEC. En 7 secondes, le recruteur cherche trois choses : un
            titre de poste cohérent avec le sien, une expérience récente
            alignée, et des compétences clés visibles. Si ces trois signaux ne
            sont pas là, le CV est classé « pas cette fois » en moins de temps
            qu&apos;il n&apos;en faut pour finir une phrase.
          </p>
          <p className="mb-4">
            Adapter son CV, ce n&apos;est pas mentir ni réécrire son parcours.
            C&apos;est mettre en avant ce qui compte <em>pour cette offre</em>,
            dans le vocabulaire de l&apos;offre, et faire disparaître le bruit
            qui dilue le message. Un profil marketing qui postule à un rôle
            « Growth » a intérêt à parler de SEO, acquisition payante et
            A/B testing plutôt que de « stratégies 360 ».
          </p>
          <p>
            Les candidats qui adaptent systématiquement leur CV rapportent des
            taux de conversion (candidature → entretien) 2 à 3 fois supérieurs
            à ceux qui envoient toujours le même document. Sur 30 candidatures
            mensuelles, ça fait la différence entre 1 et 3 entretiens. Sur une
            recherche d&apos;emploi de 3 mois, c&apos;est le chômage ou une
            signature.
          </p>
        </section>

        {/* H2 2 */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Les 5 éléments à personnaliser systématiquement
          </h2>
          <p className="mb-6">
            Pas besoin de tout réécrire. Cinq points pilotent 90 % de
            l&apos;impact :
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            1. Le titre du CV
          </h3>
          <p className="mb-4">
            Le titre (juste sous votre nom) doit refléter l&apos;intitulé exact
            du poste visé. Si l&apos;offre parle de « Product Manager
            Senior », écrivez « Product Manager Senior » — pas « Chef de
            produit expérimenté ». Les ATS matchent les titres littéralement,
            et les recruteurs aussi.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            2. L&apos;accroche (ou résumé)
          </h3>
          <p className="mb-4">
            3 à 4 lignes qui reprennent les 2-3 mots-clés principaux de
            l&apos;offre et quantifient un résultat pertinent. Exemple :
            « Product Manager senior, 6 ans d&apos;expérience sur des produits
            SaaS B2B. Lancé 3 produits de 0 à 1M€ ARR. Spécialisé en
            discovery, A/B testing et priorisation data-driven. »
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            3. L&apos;ordre et le contenu des expériences
          </h3>
          <p className="mb-4">
            Réordonnez les bullet points de vos expériences pour faire
            remonter ce qui matche l&apos;offre. Sur une expérience passée, si
            vous avez fait à la fois du management et du pricing et que
            l&apos;offre parle de pricing, le bullet pricing remonte en
            première position. Les bullets de vos 2 expériences les plus
            récentes comptent beaucoup plus que le reste.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            4. La section compétences
          </h3>
          <p className="mb-4">
            Réorganisez (et retirez) les compétences pour mettre en avant
            celles citées dans l&apos;offre. Si l&apos;offre mentionne SQL,
            Python, Looker : ces trois là en premier, et virez les compétences
            hors sujet. Ne listez pas 30 outils — un recruteur ne croit pas
            quelqu&apos;un qui prétend être expert en 30 technologies.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            5. Les mots-clés métier dans les bullets
          </h3>
          <p>
            Reformulez vos réalisations en reprenant le vocabulaire exact de
            l&apos;offre. « Amélioration du taux de conversion » devient
            « Optimisation du funnel d&apos;acquisition (+18 % de conversion) »
            si l&apos;offre parle de funnel et d&apos;acquisition. C&apos;est
            du matching littéral, c&apos;est ce que les ATS et les recruteurs
            scannent.
          </p>
        </section>

        {/* CTA mid */}
        <aside className="my-12 rounded-2xl bg-blue-50 border border-blue-100 p-6 md:p-8 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Pas envie de faire ça à la main ?
          </h3>
          <p className="text-slate-700 mb-5">
            CV Modifier adapte automatiquement votre CV et votre lettre de
            motivation à chaque offre. 3 générations offertes, sans carte
            bancaire.
          </p>
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-5 rounded-xl">
              Essayer gratuitement
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </aside>

        {/* H2 3 */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Comment extraire les mots-clés d&apos;une offre en 2 minutes
          </h2>
          <p className="mb-4">
            Méthode simple, reproductible, sans outil externe :
          </p>
          <ol className="list-decimal pl-6 space-y-3 mb-6">
            <li>
              <strong>Copiez toute l&apos;offre</strong> dans un document
              vierge (titre + description + compétences requises).
            </li>
            <li>
              <strong>Surlignez en 3 couleurs</strong> : compétences
              techniques (SQL, Figma, React…), soft skills / méthodo (agile,
              discovery, leadership…), mots métier récurrents (funnel,
              conversion, pipeline…).
            </li>
            <li>
              <strong>Comptez les occurrences</strong>. Les mots répétés 3 fois
              et plus sont les mots-clés structurants de l&apos;offre.
            </li>
            <li>
              <strong>Listez 10-15 mots-clés finaux</strong>, classés par
              importance, et injectez-les dans votre titre, accroche,
              compétences et bullets.
            </li>
          </ol>
          <p className="mb-4">
            Exemple court. Offre : « Product Manager Senior. Vous pilotez la
            roadmap, animez la discovery, priorisez via RICE, et travaillez en
            étroite collaboration avec data et design. Stack : Amplitude,
            Figma, Linear. Agile nécessaire. »
          </p>
          <p>
            Mots-clés extraits : Product Manager Senior, roadmap, discovery,
            priorisation RICE, data, design, Amplitude, Figma, Linear, agile.
            Votre CV doit contenir la majorité de ces termes, à des endroits
            stratégiques (titre, accroche, bullets récents, compétences).
          </p>
        </section>

        {/* H2 4 */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Adapter titre, accroche, expériences : checklist pratique
          </h2>
          <p className="mb-4">
            Checklist à appliquer avant d&apos;envoyer chaque candidature. Si
            vous cochez les 10, vous êtes au-dessus de 95 % des CV reçus par le
            recruteur.
          </p>
          <ul className="space-y-3 mb-6">
            {[
              "Le titre du CV reprend l'intitulé exact du poste de l'offre.",
              "L'accroche contient 2-3 mots-clés de l'offre + 1 résultat chiffré.",
              "Les 2 expériences les plus récentes ont leurs bullets réordonnés selon la priorité de l'offre.",
              "Au moins 60 % des mots-clés de l'offre apparaissent quelque part dans le CV.",
              "La section compétences affiche en premier les compétences citées dans l'offre.",
              "Aucune compétence hors sujet en top 5 de la liste.",
              "Chaque bullet commence par un verbe d'action fort (piloté, lancé, livré, déployé…).",
              "Au moins 3 bullets contiennent un chiffre (%, €, nombre d'utilisateurs, délai…).",
              "Le nom du fichier PDF est `prenom-nom-cv.pdf` (pas `CV_v3_final2.pdf`).",
              "La lettre de motivation est différente du CV (pas une paraphrase).",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* H2 5 */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Les 5 erreurs à éviter quand on adapte un CV
          </h2>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            1. Copier-coller l&apos;offre dans l&apos;accroche
          </h3>
          <p className="mb-4">
            Réécrire l&apos;offre dans votre résumé est détecté immédiatement
            par les recruteurs et sanctionné. Reprenez les mots-clés, pas les
            phrases. Reformulez en parlant de <em>vous</em>.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            2. Mentir sur une compétence
          </h3>
          <p className="mb-4">
            Ajouter « Kubernetes » parce que l&apos;offre le demande alors que
            vous n&apos;avez jamais touché : vous serez grillé à la première
            question technique en entretien. Le coût du mensonge est toujours
            supérieur au gain.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            3. Oublier d&apos;adapter la lettre de motivation
          </h3>
          <p className="mb-4">
            Un CV adapté + une lettre générique = message brouillé. Les deux
            documents doivent raconter la même histoire cohérente avec
            l&apos;offre. Voir notre guide sur{" "}
            <Link
              href="/lettre-motivation-ia"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              la lettre de motivation par IA
            </Link>{" "}
            pour les détails.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            4. Ignorer les ATS
          </h3>
          <p className="mb-4">
            Un CV trop graphique (colonnes complexes, images, infographies)
            passe mal le parsing ATS. Même adapté, il n&apos;arrivera jamais
            jusqu&apos;au recruteur. Lire{" "}
            <Link
              href="/cv-ats"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              notre guide CV ATS
            </Link>{" "}
            pour savoir comment structurer un CV qui passe les filtres.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            5. Changer de version de CV sans tracer
          </h3>
          <p>
            Si vous adaptez 20 CV par semaine et que l&apos;un obtient un
            entretien, vous devez savoir lequel. Nommez vos fichiers
            systématiquement (ex :{" "}
            <code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded">
              prenom-nom-entreprise-cv.pdf
            </code>
            ) et archivez une copie avec la date d&apos;envoi.
          </p>
        </section>

        {/* H2 6 - Bridge produit */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Faire adapter son CV automatiquement avec CV Modifier
          </h2>
          <p className="mb-4">
            Adapter un CV correctement prend 20 à 40 minutes si on le fait
            bien. Sur 10 candidatures, c&apos;est 4 à 7 heures. La plupart des
            candidats abandonnent après 3 CV adaptés et repartent sur le
            « même CV pour tous » — ce qui plombe leur taux de conversion.
          </p>
          <p className="mb-4">
            CV Modifier automatise exactement la méthode décrite plus haut.
            Vous uploadez votre CV une fois (l&apos;IA extrait automatiquement
            vos expériences, compétences, formations), puis vous collez
            l&apos;URL d&apos;une offre. Notre IA adapte le titre,
            l&apos;accroche, réordonne les bullets, met en avant les
            compétences pertinentes, et génère une lettre de motivation
            cohérente. Le tout en 30 secondes, au format PDF prêt à envoyer.
          </p>
          <p className="mb-4">
            Les 4 templates fournis (Classique, Moderne, Minimaliste, Créatif)
            sont conçus pour passer les ATS : texte pur, pas d&apos;image pour
            les informations clés, structure lisible. Le prompt intègre des
            règles d&apos;adaptation strictes : pas d&apos;invention, pas de
            mensonge, reformulation fidèle du parcours.
          </p>
          <p>
            3 générations offertes à l&apos;inscription, sans carte bancaire.
            De quoi tester sur vos 3 prochaines candidatures et mesurer vous-
            même l&apos;écart. Voir aussi{" "}
            <Link
              href="/creer-cv"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              notre guide pour créer un CV
            </Link>{" "}
            si vous partez de zéro.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
            Questions fréquentes
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Combien de temps faut-il pour adapter un CV ?",
                a: "Manuellement, comptez 20 à 40 minutes par offre si vous appliquez la méthode complète (extraction des mots-clés, réécriture du titre, accroche, réorganisation des bullets). Avec un outil comme CV Modifier, 30 secondes.",
              },
              {
                q: "Faut-il vraiment adapter le CV pour chaque offre ?",
                a: "Oui, dès que le poste visé change, même légèrement. Entre deux offres de Product Manager, les mots-clés peuvent varier du tout au tout (B2B vs B2C, hardware vs SaaS, discovery vs delivery). Envoyer le même CV à tout le monde divise vos chances par 2 à 3.",
              },
              {
                q: "Est-ce que réorganiser un CV, c'est mentir ?",
                a: "Non. Mettre en avant ce qui est pertinent pour une offre, réordonner des bullets, reformuler avec le vocabulaire du secteur : ce n'est pas mentir. Inventer une compétence ou une expérience qu'on n'a pas : c'est mentir. La frontière est claire.",
              },
              {
                q: "Combien de versions de CV dois-je garder ?",
                a: "Une version 'master' avec toutes vos expériences, compétences et réalisations. Puis une version adaptée par candidature, archivée avec un nom explicite (prenom-nom-entreprise-cv.pdf). Jamais plus de 30-40 versions en rotation — sinon vous êtes noyé.",
              },
              {
                q: "Mon CV doit-il tenir sur une page ou deux ?",
                a: "Règle simple : moins de 10 ans d'expérience = 1 page. 10+ ans = 2 pages max, jamais plus. Un recruteur qui voit 3 pages les ferme d'office. Le guide complet dans notre article sur comment créer un CV.",
              },
              {
                q: "Les ATS détectent-ils l'adaptation d'un CV ?",
                a: "Les ATS ne détectent pas l'adaptation, ils matchent des mots-clés. Un CV adapté avec les bons termes passe mieux qu'un CV générique, tout simplement parce qu'il contient plus de termes de l'offre. Zéro risque à adapter.",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-slate-200 bg-white px-5 py-4 open:border-blue-200 open:bg-blue-50/30"
              >
                <summary className="cursor-pointer list-none font-semibold text-slate-900 flex items-center justify-between gap-4">
                  <span>{item.q}</span>
                  <span
                    aria-hidden="true"
                    className="text-blue-600 text-xl font-normal group-open:rotate-45 transition-transform"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-slate-700">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <aside className="mt-16 rounded-2xl bg-slate-900 text-white p-8 md:p-10 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Adaptez votre prochain CV en 30 secondes
          </h3>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto">
            3 générations offertes à l&apos;inscription. CV + lettre de
            motivation adaptés par l&apos;IA à chaque offre. Aucune carte
            bancaire requise.
          </p>
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl text-lg">
              Essayer CV Modifier gratuitement
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </aside>

        {/* Related */}
        <section className="mt-16 border-t border-slate-100 pt-10">
          <h2 className="text-xl font-bold text-slate-900 mb-5">
            À lire aussi
          </h2>
          <ul className="grid md:grid-cols-2 gap-4">
            <li>
              <Link
                href="/cv-ats"
                className="block rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
              >
                <p className="font-semibold text-slate-900 mb-1">
                  CV ATS : passer les filtres automatiques
                </p>
                <p className="text-sm text-slate-500">
                  Comprendre comment fonctionnent Taleo, Workday et les autres,
                  et structurer un CV qui passe.
                </p>
              </Link>
            </li>
            <li>
              <Link
                href="/lettre-motivation-ia"
                className="block rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
              >
                <p className="font-semibold text-slate-900 mb-1">
                  Lettre de motivation par IA : la rendre crédible
                </p>
                <p className="text-sm text-slate-500">
                  Comment éviter le ton « GPT générique » et écrire une lettre
                  que le recruteur lit vraiment.
                </p>
              </Link>
            </li>
            <li>
              <Link
                href="/creer-cv"
                className="block rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
              >
                <p className="font-semibold text-slate-900 mb-1">
                  Créer un CV en 2026 : guide complet
                </p>
                <p className="text-sm text-slate-500">
                  Formats, sections, longueur, outils : tout ce qu&apos;il faut
                  savoir pour partir sur de bonnes bases.
                </p>
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="block rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
              >
                <p className="font-semibold text-slate-900 mb-1">
                  Découvrir CV Modifier
                </p>
                <p className="text-sm text-slate-500">
                  CV + lettre adaptés par l&apos;IA en 30 secondes. 3 crédits
                  offerts, sans carte bancaire.
                </p>
              </Link>
            </li>
          </ul>
        </section>
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
