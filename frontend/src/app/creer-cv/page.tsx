import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLdScript } from "@/components/json-ld-script";
import { breadcrumbLd, faqPageLd, type FaqItem } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Créer un CV en 2026 : guide complet et modèles gratuits",
  description:
    "Créer un CV en 2026 : formats, structure, informations à mettre (ou pas), longueur, outils et 4 templates gratuits. Guide pratique.",
  alternates: { canonical: "/creer-cv" },
  openGraph: {
    title: "Créer un CV en 2026 : guide complet et modèles gratuits",
    description:
      "Formats, structure, informations obligatoires, longueur, outils, templates. Le guide pour créer un CV qui tient la route en 2026.",
    type: "article",
  },
};

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Faut-il mettre une photo sur son CV en 2026 ?",
    a: "En France, plutôt oui (60-70 % des offres l'attendent culturellement). À l'international (US, UK, Canada anglophone), non — c'est même un signal de non-professionnalisme. Si vous mettez une photo, prenez-en une faite par un photographe, pas un selfie.",
  },
  {
    q: "Combien de pages maximum ?",
    a: "Moins de 10 ans d'expérience = 1 page, stricte. 10 à 20 ans = 2 pages max. 20+ ans = 2 pages max, format exécutif. Jamais 3 pages, peu importe votre profil.",
  },
  {
    q: "En quelle langue rédiger mon CV ?",
    a: "Langue de l'offre. Offre en français = CV en français. Offre en anglais (fréquent dans la tech / finance / consulting, même pour un poste en France) = CV en anglais. Si l'entreprise est internationale et que vous avez un doute, deux versions (FR + EN) ne font pas de mal.",
  },
  {
    q: "Puis-je mettre une expérience de 2 mois ?",
    a: "Oui, à condition qu'elle soit pertinente (stage, CDD, mission). Pour une expérience très courte où vous êtes parti rapidement, c'est au cas par cas : la cacher peut paraître suspect si ça crée un trou, la mettre peut amener des questions gênantes en entretien.",
  },
  {
    q: "Mon CV doit-il être différent pour chaque candidature ?",
    a: "Oui, dans la limite du raisonnable. Vous gardez une version master avec toutes vos infos, puis vous adaptez titre, accroche, mots-clés pour chaque offre. Voir notre guide pour adapter son CV à une offre d'emploi.",
  },
  {
    q: "Faut-il mettre des liens cliquables (LinkedIn, GitHub) ?",
    a: "Oui, absolument. Rendez-les cliquables dans le PDF (la plupart des éditeurs le font par défaut quand vous tapez une URL). Les recruteurs cliquent vraiment sur le LinkedIn depuis le PDF — c'est devenu un réflexe pour vérifier que le CV correspond au profil public.",
  },
];

const BREADCRUMB = [
  { name: "Accueil", url: "/" },
  { name: "Créer un CV", url: "/creer-cv" },
];

export default function CreerCvPage() {
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
            Guide · CV
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5">
            Créer un CV en 2026 : guide complet et modèles gratuits
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Créer un CV en 2026 ne prend pas deux heures sur Canva. Les règles
            ont évolué : plus d&apos;ATS, moins de fioritures, un format
            standard qui marche partout. Voici la structure, les infos à
            mettre (et celles à ne pas mettre), la longueur attendue et les
            bons outils.
          </p>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16 text-slate-700 leading-relaxed">
        <section className="mb-12">
          <p className="text-lg">
            Un CV en 2026, c&apos;est 1 à 2 pages A4, texte sélectionnable, 5
            sections principales, lu en 7 secondes au premier passage. Au-
            delà, c&apos;est de l&apos;ornement. Ce guide donne la structure
            de base, les adaptations selon le profil, et les 4 templates
            gratuits de CV Modifier pour partir sur de bonnes bases.
          </p>
        </section>

        {/* H2 1 */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Les 5 formats de CV en France
          </h2>
          <p className="mb-6">
            Il y a grosso modo 5 formats de CV en circulation en France. Le
            choix dépend du profil, pas du goût personnel.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            1. Le CV chronologique inversé (le standard)
          </h3>
          <p className="mb-4">
            Les expériences sont listées de la plus récente à la plus
            ancienne. C&apos;est le format attendu par défaut, 90 % des CV en
            France. Utilisez-le sauf si vous avez une vraie raison de faire
            autrement. Parsable par tous les ATS.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            2. Le CV fonctionnel (ou thématique)
          </h3>
          <p className="mb-4">
            Les expériences sont regroupées par thème / compétence (ex :
            « Management », « Analyse financière »), pas par chronologie. Utile
            pour les reconversions ou les parcours avec des trous, mais mal
            vu par la plupart des recruteurs en France — qui soupçonnent
            qu&apos;on cache quelque chose. À éviter sauf cas particulier.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            3. Le CV mixte
          </h3>
          <p className="mb-4">
            Compromis entre chronologique et fonctionnel : une section
            « Compétences clés » en haut (3-5 bullets), puis les expériences
            en chronologique inversé. Format utile pour les 5-10 ans
            d&apos;expérience qui veulent mettre en avant un profil
            spécialisé.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            4. Le CV court exécutif (C-level / Top Management)
          </h3>
          <p className="mb-4">
            Pour les profils 15+ ans d&apos;XP visant des postes de direction.
            2 pages max, très synthétique, focus sur les impacts P&amp;L,
            équipes managées, M&amp;A éventuels. Pas de détails sur les
            premières expériences (regroupées en une ligne).
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            5. Le CV premier emploi / étudiant
          </h3>
          <p>
            1 page obligatoire. La formation remonte en premier (vu le peu
            d&apos;expérience), les stages et jobs étudiants prennent plus de
            place que d&apos;habitude. Ajoutez une section « Projets
            académiques » ou « Projets personnels » pour compenser le manque
            d&apos;XP pro.
          </p>
        </section>

        {/* H2 2 */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            La structure idéale en 2026 : ordre des sections
          </h2>
          <p className="mb-4">
            Ordre recommandé, valable pour 95 % des CV (chronologique inversé,
            profil 1 à 15 ans d&apos;XP) :
          </p>
          <ol className="list-decimal pl-6 space-y-3 mb-6">
            <li>
              <strong>En-tête</strong> — Nom, prénom (en grand), titre du
              poste visé (juste en-dessous), coordonnées : email
              professionnel, téléphone, ville, LinkedIn. Pas d&apos;adresse
              postale complète.
            </li>
            <li>
              <strong>Accroche / résumé</strong> — 3 à 4 lignes qui synthétisent
              qui vous êtes professionnellement et ce que vous apportez.
              Reprenez 2-3 mots-clés des offres que vous visez.
            </li>
            <li>
              <strong>Expérience professionnelle</strong> — la section
              principale, chronologique inversée. Chaque poste : intitulé +
              entreprise + dates + ville. Puis 3-5 bullets commençant par un
              verbe d&apos;action fort et contenant au moins un chiffre quand
              c&apos;est possible.
            </li>
            <li>
              <strong>Formation</strong> — idem chronologique inversé.
              Intitulé + école + dates. Les mentions peuvent être ajoutées
              jusqu&apos;à 3-4 ans après la sortie, après on les enlève.
            </li>
            <li>
              <strong>Compétences</strong> — listez-les par catégorie si
              elles sont techniques (Langages, Frameworks, Outils, Méthodes).
              Pas de jauges de niveau « ▓▓▓▓░ », indiquez en mot : « Python
              (avancé), Go (intermédiaire) ».
            </li>
            <li>
              <strong>Langues</strong> — Français (langue maternelle),
              Anglais (C1 / bilingue), etc. Utilisez la grille CECRL (A1 à C2).
            </li>
            <li>
              <strong>Projets / publications / centres d&apos;intérêt</strong> —
              optionnel, en bas. Utile pour les profils juniors ou tech (un
              projet open source bien placé peut débloquer un entretien).
            </li>
          </ol>
          <p>
            Cet ordre fait que les 7 premières secondes du recruteur voient :
            nom, titre, accroche, première expérience. C&apos;est exactement
            ce qu&apos;il cherche.
          </p>
        </section>

        {/* H2 3 */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Les informations obligatoires et celles à éviter
          </h2>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            À mettre systématiquement
          </h3>
          <ul className="space-y-2 mb-6">
            {[
              "Nom, prénom, email professionnel, téléphone mobile.",
              "Ville / région (pas l'adresse complète — inutile et risqué RGPD).",
              "Lien LinkedIn à jour (l'URL custom : linkedin.com/in/prenom-nom).",
              "Titre du poste visé, juste sous votre nom.",
              "Dates de chaque expérience et formation (mois + année).",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            À mettre si pertinent
          </h3>
          <ul className="space-y-2 mb-6 list-disc pl-6">
            <li>
              <strong>Photo</strong> : plutôt oui en France (culturellement
              attendu pour 60-70 % des offres), plutôt non à l&apos;international
              (risque de discrimination aux US / UK). Si vous en mettez une,
              prenez-en une pro, pas un selfie.
            </li>
            <li>
              <strong>Permis B</strong> : utile pour les postes commerciaux
              itinérants, technico-commerciaux, métiers de terrain. Inutile
              pour un poste de bureau dans Paris.
            </li>
            <li>
              <strong>Certifications</strong> : AWS, PMP, Scrum Master,
              Google Ads, etc. — à mettre dans une section dédiée si vous en
              avez plusieurs.
            </li>
            <li>
              <strong>GitHub / portfolio</strong> : obligatoire pour les devs,
              designers, data scientists. URL courte, propre, à jour.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            À éviter absolument
          </h3>
          <ul className="space-y-2 mb-4 list-disc pl-6">
            <li>
              <strong>Âge / date de naissance</strong> : interdit en
              recrutement (discrimination), inutile sur le CV. Laissez les
              dates de formation parler pour vous.
            </li>
            <li>
              <strong>Situation familiale / état civil</strong> : « marié, 2
              enfants » n&apos;a rien à faire sur un CV. Non pertinent et
              potentiellement discriminatoire.
            </li>
            <li>
              <strong>Prétentions salariales</strong> : jamais sur le CV.
              Dans la lettre éventuellement si l&apos;offre le demande, sinon
              en entretien.
            </li>
            <li>
              <strong>Numéro de sécurité sociale, nationalité, religion</strong> :
              hors sujet et à risque.
            </li>
            <li>
              <strong>Centres d&apos;intérêt génériques</strong> : « lecture,
              voyages, cinéma » ne dit rien sur vous. Soit précis (« Ultra-
              trail, finisher UTMB 2024 »), soit supprimez la section.
            </li>
            <li>
              <strong>Une adresse email peu pro</strong> :
              « bisoubisou_95@hotmail.fr » tue votre candidature. Créez une
              adresse au format{" "}
              <code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded">
                prenom.nom@gmail.com
              </code>
              .
            </li>
          </ul>
        </section>

        {/* CTA mid */}
        <aside className="my-12 rounded-2xl bg-blue-50 border border-blue-100 p-6 md:p-8 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Créer un CV en 30 secondes avec l&apos;IA
          </h3>
          <p className="text-slate-700 mb-5">
            Uploadez votre CV existant (ou vos infos LinkedIn),
            l&apos;IA génère un CV propre, structuré, ATS-compatible. 4
            templates au choix.
          </p>
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-5 rounded-xl">
              Essayer gratuitement
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </aside>

        {/* H2 4 */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Longueur : 1 ou 2 pages selon profil
          </h2>
          <p className="mb-4">
            Règle simple qui marche dans 95 % des cas :
          </p>
          <ul className="space-y-3 mb-6">
            <li>
              <strong>Moins de 10 ans d&apos;expérience = 1 page.</strong>{" "}
              Stricte. Junior, medior, 5-8 ans : 1 page. Pas de débat. Ce
              n&apos;est pas un aveu de pauvreté, c&apos;est une discipline.
            </li>
            <li>
              <strong>10 à 20 ans d&apos;expérience = 2 pages max.</strong>{" "}
              Jamais 3. À partir de 15-20 ans, on regroupe les premières
              expériences en une ligne (« 2005-2010 : postes juniors chez
              Société Générale, BNP Paribas »).
            </li>
            <li>
              <strong>20+ ans d&apos;expérience = 2 pages max, format
              exécutif.</strong> Synthèse maximale. Le recruteur de
              C-level ne lit pas 3 pages, même pour un poste à 300 K€.
            </li>
          </ul>
          <p className="mb-4">
            Un CV de 3 pages signale soit un manque de synthèse, soit une
            tendance à se justifier. Deux défauts rédhibitoires pour la
            plupart des postes.
          </p>
          <p>
            Astuce densité : si votre CV déborde de 2 lignes sur une deuxième
            page, réduisez les marges à 1,5 cm, passez à 10,5 pt au lieu de
            11 pt, ou coupez une expérience ancienne. Un CV aéré mais bien
            rempli sur 1 page vaut mieux qu&apos;un CV étalé sur 2 pages pour
            meubler.
          </p>
        </section>

        {/* H2 5 */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Les outils pour créer son CV
          </h2>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Word / Google Docs
          </h3>
          <p className="mb-4">
            Le plus universel. Gratuit, maîtrisé par tous, export PDF propre.
            Inconvénient : mise en page limitée, les templates Word sont
            datés. Avantage : parsing ATS impeccable si vous utilisez les
            styles de titre standards.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">Canva</h3>
          <p className="mb-4">
            Très populaire, plein de templates, facile à prendre en main.
            Attention au piège : 80 % des templates Canva sont trop
            graphiques (colonnes, icônes, couleurs) et passent mal les ATS.
            Si vous utilisez Canva, restez sur un template simple en 1
            colonne, sans infographies.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            CV Modifier
          </h3>
          <p className="mb-4">
            L&apos;approche différente : vous uploadez votre CV existant (ou
            vos données LinkedIn), l&apos;IA structure tout
            automatiquement, et vous obtenez un PDF propre en 30 secondes.
            Quatre templates au choix, tous ATS-compatibles (texte pur, pas
            d&apos;images pour les informations clés). Puis vous pouvez
            l&apos;adapter à chaque offre d&apos;emploi en collant juste
            l&apos;URL.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            LaTeX (pour les profils techniques / chercheurs)
          </h3>
          <p className="mb-4">
            Rendu typographique impeccable, standard dans l&apos;académique.
            Courbe d&apos;apprentissage raide. Templates à connaître : Awesome-
            CV, ModernCV. À ne considérer que si vous candidatez dans la
            recherche, ou pour montrer votre maîtrise LaTeX dans un poste
            technique.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Outils spécialisés (Zety, Resume.io…)
          </h3>
          <p>
            Prix élevés (souvent 15-30 € pour télécharger), templates souvent
            verrouillés derrière un paywall. Qualité variable côté ATS.
            Intéressants pour aller vite, mais vérifiez le parsing avant
            d&apos;envoyer.
          </p>
        </section>

        {/* H2 6 - Produit templates */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Les 4 templates CV Modifier : lequel choisir ?
          </h2>
          <p className="mb-6">
            CV Modifier fournit 4 templates gratuits. Tous ATS-compatibles,
            tous générés en PDF texte (pas d&apos;image), tous disponibles
            dans le plan gratuit. Voici dans quel cas utiliser chacun.
          </p>

          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 p-5 bg-white">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                Classique — sidebar slate
              </h3>
              <p className="text-sm text-slate-500 mb-2">
                Quand l&apos;utiliser : grands groupes, secteur banque /
                conseil / industrie, profils corporate 5-20 ans d&apos;XP.
              </p>
              <p>
                Template sobre, classique, sans prise de risque. Sidebar
                foncée (slate) à gauche pour contact + compétences, contenu
                principal en blanc à droite. Le template qui passe partout.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-5 bg-white">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                Moderne — header bleu pleine largeur
              </h3>
              <p className="text-sm text-slate-500 mb-2">
                Quand l&apos;utiliser : startups, scale-ups, tech companies,
                métiers produit / marketing / tech.
              </p>
              <p>
                Header bleu marqué en haut qui met en avant votre nom et
                titre de poste, puis contenu en colonne unique en-dessous.
                Plus contemporain que le Classique, reste 100 % ATS-
                compatible.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-5 bg-white">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                Minimaliste — mono-chrome
              </h3>
              <p className="text-sm text-slate-500 mb-2">
                Quand l&apos;utiliser : cabinets de conseil, finance,
                avocats, profils où la sobriété est un signal de sérieux.
              </p>
              <p>
                Noir et blanc, une seule colonne, pas d&apos;ornement. Le plus
                parsable de tous les templates pour les ATS les plus stricts
                (Taleo, iCIMS). Un classique indémodable.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-5 bg-white">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                Créatif — sidebar emerald + timeline
              </h3>
              <p className="text-sm text-slate-500 mb-2">
                Quand l&apos;utiliser : métiers créatifs (design, marketing,
                contenu), startups audacieuses, postes où se démarquer
                visuellement compte.
              </p>
              <p>
                Sidebar verte (emerald) à gauche, timeline visuelle dans les
                expériences. Plus graphique que les 3 autres, mais reste
                texte-only pour le parsing ATS — pas d&apos;images, pas
                d&apos;icônes décoratives pour les compétences.
              </p>
            </div>
          </div>

          <p className="mt-6">
            Le template se choisit dans votre profil et s&apos;applique à
            toutes vos générations. Vous pouvez en changer à tout moment.
            Pour aller plus loin, lisez{" "}
            <Link
              href="/cv-ats"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              notre guide sur les CV ATS
            </Link>{" "}
            et{" "}
            <Link
              href="/adapter-cv-offre-emploi"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              la méthode pour adapter un CV à chaque offre
            </Link>
            .
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
            Questions fréquentes
          </h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
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

        {/* Sources */}
        <section className="mb-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-bold text-slate-900 mb-3 uppercase tracking-wide">
            Sources et ressources
          </h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>
              •{" "}
              <a
                href="https://www.francetravail.fr/candidat/mes-services/construire-son-cv.html"
                rel="noopener"
                className="text-blue-700 hover:text-blue-800 underline"
              >
                France Travail — Construire son CV
              </a>{" "}
              (modèles officiels et conseils méthodo).
            </li>
            <li>
              •{" "}
              <a
                href="https://www.apec.fr/candidat/mon-projet-professionnel/je-reflechis-a-mon-projet/cv-lettre-de-motivation.html"
                rel="noopener"
                className="text-blue-700 hover:text-blue-800 underline"
              >
                APEC — CV et lettre de motivation
              </a>{" "}
              (section candidats cadres).
            </li>
            <li>
              •{" "}
              <a
                href="https://europass.europa.eu/fr/create-europass-cv"
                rel="noopener"
                className="text-blue-700 hover:text-blue-800 underline"
              >
                Europass — CV européen
              </a>{" "}
              (format reconnu dans toute l&apos;UE).
            </li>
          </ul>
        </section>

        {/* CTA final */}
        <aside className="mt-16 rounded-2xl bg-slate-900 text-white p-8 md:p-10 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Créer un CV propre en 30 secondes
          </h3>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto">
            4 templates gratuits, structuration automatique, export PDF ATS-
            compatible. 3 générations offertes à l&apos;inscription.
          </p>
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl text-lg">
              Essayer CV Modifier gratuitement
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </aside>

        {/* CV par métier */}
        <section className="mt-16 border-t border-slate-100 pt-10">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Conseils CV par métier
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            Chaque métier a ses codes. Guides dédiés avec accroche-type, KPIs à
            chiffrer et entreprises qui recrutent.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {[
              { slug: "developpeur-web", label: "CV développeur web" },
              { slug: "commercial-b2b", label: "CV commercial B2B" },
              { slug: "chef-de-projet", label: "CV chef de projet" },
              { slug: "data-analyst", label: "CV data analyst" },
              { slug: "infirmier", label: "CV infirmier·e" },
              { slug: "comptable", label: "CV comptable" },
            ].map((m) => (
              <Link
                key={m.slug}
                href={`/cv-par-metier/${m.slug}`}
                className="block rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-800 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
              >
                {m.label}
              </Link>
            ))}
          </div>
          <Link
            href="/cv-par-metier"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Voir les 20 métiers
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>

        {/* Related */}
        <section className="mt-16 border-t border-slate-100 pt-10">
          <h2 className="text-xl font-bold text-slate-900 mb-5">
            À lire aussi
          </h2>
          <ul className="grid md:grid-cols-2 gap-4">
            <li>
              <Link
                href="/adapter-cv-offre-emploi"
                className="block rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
              >
                <p className="font-semibold text-slate-900 mb-1">
                  Adapter son CV à une offre d&apos;emploi
                </p>
                <p className="text-sm text-slate-500">
                  Personnaliser titre, accroche, compétences pour chaque
                  candidature en 30 secondes.
                </p>
              </Link>
            </li>
            <li>
              <Link
                href="/cv-ats"
                className="block rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
              >
                <p className="font-semibold text-slate-900 mb-1">
                  CV ATS : passer les filtres automatiques
                </p>
                <p className="text-sm text-slate-500">
                  Structure, format, pièges : comment un CV passe Taleo,
                  Workday et les autres.
                </p>
              </Link>
            </li>
            <li>
              <Link
                href="/lettre-motivation-ia"
                className="block rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
              >
                <p className="font-semibold text-slate-900 mb-1">
                  Lettre de motivation par IA
                </p>
                <p className="text-sm text-slate-500">
                  Rendre une lettre IA crédible : brief, structure Vous / Moi /
                  Nous, ton réaliste.
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
                  offerts.
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

      <JsonLdScript
        data={[breadcrumbLd(BREADCRUMB), faqPageLd(FAQ_ITEMS)]}
      />
    </div>
  );
}
