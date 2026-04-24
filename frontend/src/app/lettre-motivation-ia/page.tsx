import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLdScript } from "@/components/json-ld-script";
import { breadcrumbLd, faqPageLd, type FaqItem } from "@/lib/schema";

export const metadata: Metadata = {
  title:
    "Lettre de motivation par IA : comment la rendre crédible et personnalisée",
  description:
    "Lettre de motivation par IA : éviter le ton générique, briefer correctement le modèle, structurer en Vous/Moi/Nous. Guide 2026 avec exemples.",
  alternates: { canonical: "/lettre-motivation-ia" },
  openGraph: {
    title:
      "Lettre de motivation par IA : comment la rendre crédible et personnalisée",
    description:
      "Éviter le ton générique, briefer correctement l'IA, et structurer une lettre qu'un recruteur lit vraiment.",
    type: "article",
  },
};

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Les recruteurs détectent-ils les lettres écrites par IA ?",
    a: "Les lettres IA brutes, oui — en 5 à 10 secondes. Les lettres IA retravaillées avec le bon brief et une relecture humaine, non. Aucun outil de détection (Turnitin, GPTZero…) n'est fiable sur 200 mots de français. Le vrai risque, c'est le ton générique, pas la détection algorithmique.",
  },
  {
    q: "Combien de temps dois-je passer sur une lettre ?",
    a: "Avec IA + relecture : 5 à 10 minutes par lettre. Sans IA : 30 à 60 minutes. Si vous envoyez 20 candidatures par semaine, ça fait la différence entre 1h30 et 15h de travail. L'important : ne jamais envoyer ce que l'IA produit au premier jet.",
  },
  {
    q: "Faut-il mettre une lettre de motivation en 2026 ?",
    a: "La tendance est à la baisse — beaucoup de startups n'en demandent plus. Mais dès que c'est demandé (PME, grands groupes, secteur public, cabinets), l'absence de lettre est éliminatoire. Si l'offre la mentionne, vous en mettez une, point.",
  },
  {
    q: "Quelle longueur pour une lettre ?",
    a: "200 à 250 mots en français, soit une demi-page A4. Plus court, ça fait bâclé. Plus long, ça ne se lit pas. Une lettre qui tient sur l'écran d'un iPhone sans scroll est une bonne longueur.",
  },
  {
    q: "Faut-il commencer par « Madame, Monsieur » ?",
    a: "Si vous connaissez le nom du recruteur (souvent dispo sur l'offre LinkedIn ou le site carrière), adressez-vous à lui directement : « Madame Dupont ». Sinon, « Madame, Monsieur » reste standard en France. Évitez « Bonjour » dans un contexte corporate, c'est trop familier.",
  },
  {
    q: "Puis-je utiliser la même lettre pour plusieurs offres ?",
    a: "Non. Deux offres similaires ont rarement le même contexte, les mêmes mots-clés, la même culture. Adaptez a minima le paragraphe 'Vous' (sur l'entreprise) et 2-3 mots-clés dans le paragraphe 'Moi'. C'est 2 minutes de travail et ça multiplie les réponses.",
  },
];

const BREADCRUMB = [
  { name: "Accueil", url: "/" },
  { name: "Lettre de motivation par IA", url: "/lettre-motivation-ia" },
];

export default function LettreMotivationIaPage() {
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
            Lettre de motivation par IA : comment la rendre crédible et
            personnalisée
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Une lettre de motivation par IA mal prompté se repère en 3 lignes :
            formules creuses, élogieux générique, « Madame, Monsieur, votre
            entreprise m&apos;inspire beaucoup ». Bien faite, elle est
            indétectable et libère des heures. Voici la méthode.
          </p>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16 text-slate-700 leading-relaxed">
        <section className="mb-12">
          <p className="text-lg">
            Les recruteurs lisent des centaines de lettres par semaine. Ils
            ont appris à repérer les lettres IA en quelques secondes — et
            souvent à les écarter. Pourtant, une lettre générée par IA et
            bien retravaillée passe sans problème. L&apos;IA est un outil,
            pas un remplaçant : la différence se fait dans le brief et le
            post-processing.
          </p>
        </section>

        {/* H2 1 */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Pourquoi les lettres générées par IA ont mauvaise réputation
          </h2>
          <p className="mb-4">
            Depuis fin 2022, les recruteurs reçoivent des vagues de lettres
            générées sans retouche. Trois symptômes reviennent tout le temps :
          </p>
          <ol className="list-decimal pl-6 space-y-3 mb-6">
            <li>
              <strong>Le ton « cher recruteur »</strong> — formules alambiquées,
              vocabulaire soutenu à l&apos;excès, tournures que personne
              n&apos;utilise à l&apos;oral (« C&apos;est avec un vif
              enthousiasme que je me permets de soumettre ma candidature »).
            </li>
            <li>
              <strong>Le compliment générique</strong> — « Votre entreprise est
              reconnue pour son innovation et son excellence » s&apos;applique
              à 90 % des entreprises. Le recruteur a vu cette phrase 500 fois.
            </li>
            <li>
              <strong>La paraphrase du CV</strong> — la lettre répète mot pour
              mot les bullets du CV au lieu d&apos;apporter quelque chose de
              différent. Résultat : zéro information nouvelle, zéro intérêt à
              la lire.
            </li>
          </ol>
          <p className="mb-4">
            S&apos;ajoute un tic GPT bien connu : les listes à puces avec
            « je dispose de », « je possède », « je maîtrise » enchaînées sur
            10 lignes. Les recruteurs appellent ça « la lettre CV-bis » et la
            ferment avant la fin.
          </p>
          <p>
            Le vrai problème n&apos;est pas l&apos;IA, c&apos;est le prompt
            par défaut (« Écris une lettre de motivation pour ce poste »).
            Sortir de ce template demande 2 minutes de brief et 5 minutes de
            relecture. C&apos;est tout.
          </p>
        </section>

        {/* H2 2 */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Les 3 composantes d&apos;une lettre crédible : Vous / Moi / Nous
          </h2>
          <p className="mb-4">
            La structure la plus éprouvée pour une lettre de motivation en
            France reste la règle des trois paragraphes :
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Vous : parler de l&apos;entreprise et du poste
          </h3>
          <p className="mb-4">
            Premier paragraphe. Objectif : montrer que vous avez lu l&apos;offre
            et compris le contexte. Pas « Votre entreprise m&apos;intéresse ».
            Plutôt « Votre ouverture récente du bureau de Lyon et la montée
            en charge de l&apos;équipe data (visible sur votre page carrière)
            m&apos;indiquent un moment de croissance ». Factuel, spécifique,
            vérifiable.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Moi : ce que vous apportez au poste
          </h3>
          <p className="mb-4">
            Deuxième paragraphe. Objectif : 2 ou 3 réalisations concrètes qui
            répondent aux besoins de l&apos;offre. Pas « Je suis dynamique et
            rigoureux ». Plutôt « Sur mon poste précédent, j&apos;ai piloté
            la migration d&apos;un pipeline data de Redshift vers Snowflake
            (500 GB, 6 mois, sans downtime), exactement le type de projet
            décrit dans votre offre ». Chiffres + contexte = crédible.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Nous : la projection commune
          </h3>
          <p className="mb-4">
            Troisième paragraphe. Objectif : montrer qu&apos;on a déjà
            commencé à imaginer la collaboration. « Rejoindre votre équipe
            serait l&apos;occasion de transférer cette expérience sur un
            scale plus large (vos 200 M€ de revenus vs 20 M€ sur mon poste
            précédent), tout en développant sur la partie streaming que je
            n&apos;ai pas encore abordée ». Le recruteur sent un candidat qui
            a réfléchi, pas un candidat qui postule par défaut.
          </p>

          <p>
            Clôture simple : disponibilité pour un échange, formule de
            politesse standard. Pas de « Dans l&apos;attente impatiente de
            votre retour », trop marqué IA.
          </p>
        </section>

        {/* H2 3 */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Comment briefer l&apos;IA pour éviter le syndrome « Bonjour cher
            recruteur »
          </h2>
          <p className="mb-4">
            Un bon prompt contient 4 choses : le contexte, le ton, la
            structure, les contraintes.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            1. Contexte factuel
          </h3>
          <p className="mb-4">
            Donnez à l&apos;IA votre CV (ou les 3-4 réalisations les plus
            pertinentes), l&apos;offre complète (titre, entreprise, missions,
            compétences demandées), et ce que vous savez de l&apos;entreprise
            (taille, stack, ton). Plus de contexte = moins de générique.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            2. Ton explicite
          </h3>
          <p className="mb-4">
            Dites le ton attendu. Exemples :
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>« Ton professionnel mais direct, phrases courtes. »</li>
            <li>« Tutoiement si l&apos;offre tutoie, vouvoiement sinon. »</li>
            <li>
              « Éviter les superlatifs (« excellence », « passionné »,
              « dynamique »). »
            </li>
            <li>
              « Pas de formules toutes faites (« C&apos;est avec un vif
              intérêt… »). »
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            3. Structure imposée
          </h3>
          <p className="mb-4">
            Imposez la structure Vous / Moi / Nous (ou celle que vous
            préférez), avec des longueurs : « Paragraphe 1 : 3-4 lignes sur
            l&apos;entreprise. Paragraphe 2 : 5-6 lignes avec 2 réalisations
            chiffrées. Paragraphe 3 : 3 lignes sur la projection. »
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            4. Contraintes de forme
          </h3>
          <p>
            Longueur totale maximale (200-250 mots pour une lettre FR),
            interdiction de copier les bullets du CV, obligation de citer au
            moins 2 éléments factuels sur l&apos;entreprise, pas de « Madame,
            Monsieur » si vous connaissez le nom du recruteur.
          </p>
        </section>

        {/* CTA mid */}
        <aside className="my-12 rounded-2xl bg-blue-50 border border-blue-100 p-6 md:p-8 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Envie d&apos;essayer une lettre IA bien faite ?
          </h3>
          <p className="text-slate-700 mb-5">
            CV Modifier génère une lettre de motivation adaptée + un CV à
            chaque offre. Structure Vous / Moi / Nous, ton réaliste, 3
            générations offertes.
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
            Les signaux qui trahissent une lettre IA
          </h2>
          <p className="mb-4">
            Les recruteurs entraînés repèrent ces tics en 5 secondes. Si votre
            lettre en contient deux ou plus, elle sent l&apos;IA brute :
          </p>
          <ul className="space-y-3 mb-6">
            <li>
              <strong>« C&apos;est avec un grand/vif intérêt que… »</strong> —
              formule d&apos;ouverture par défaut de tous les modèles. À
              remplacer par une phrase qui commence par une observation sur
              l&apos;entreprise ou le poste.
            </li>
            <li>
              <strong>Adjectifs vides</strong> : « passionné », « dynamique »,
              « rigoureux », « innovant », « excellence ». Ils décrivent tout
              le monde et donc personne.
            </li>
            <li>
              <strong>Listes à puces au milieu de la lettre</strong> — une
              lettre est un texte continu, pas un deuxième CV. Les puces sont
              un signal IA (le modèle adore structurer).
            </li>
            <li>
              <strong>Phrases trop longues et alambiquées</strong> — le
              français natif casse les phrases. L&apos;IA par défaut les
              rallonge avec des subordonnées.
            </li>
            <li>
              <strong>« Je me tiens à votre disposition » + « bien
              cordialement »</strong> — pack standard GPT. À remplacer par
              « Disponible pour un échange » et une clôture moins cliché.
            </li>
            <li>
              <strong>Zéro info spécifique sur l&apos;entreprise</strong> — si
              votre lettre peut être envoyée à 10 boîtes différentes en
              changeant juste le nom, elle est IA.
            </li>
            <li>
              <strong>« Votre entreprise »</strong> répété 4 fois dans la
              lettre — marque d&apos;une IA qui n&apos;a pas le nom en
              contexte fort.
            </li>
          </ul>
          <p>
            Règle pratique : après génération, relisez à voix haute. Si ça
            sonne comme un script de télé-achat, réécrivez.
          </p>
        </section>

        {/* H2 5 */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Adapter la lettre à la culture de l&apos;entreprise
          </h2>
          <p className="mb-4">
            Même contenu, même poste, deux entreprises différentes = deux
            lettres différentes. La culture d&apos;entreprise se lit sur le
            site, dans les offres d&apos;emploi, sur LinkedIn, dans les
            interviews du fondateur.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Startup / scale-up (Alan, Qonto, Doctolib, BlaBlaCar…)
          </h3>
          <p className="mb-4">
            Ton direct, tutoiement fréquent, phrases courtes. Pas de « Madame,
            Monsieur » si l&apos;offre tutoie. Vocabulaire : « builder », « ship »,
            « driver l&apos;impact ». Évitez le jargon français trop
            corporate. Une lettre de 180-200 mots suffit.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Grand groupe / CAC 40 (BNP, L&apos;Oréal, Total…)
          </h3>
          <p className="mb-4">
            Vouvoiement systématique, « Madame, Monsieur » si pas de nom,
            structure classique. Le vocabulaire est plus formel :
            « pilotage », « transformation », « conduite du changement ».
            Une lettre de 230-250 mots est la norme.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Cabinet de conseil / finance (BCG, McKinsey, Rothschild…)
          </h3>
          <p className="mb-4">
            Vouvoiement, ton précis et structuré, réalisations très chiffrées.
            Le recruteur attend de voir une rigueur d&apos;analyse dans la
            lettre elle-même. « J&apos;ai construit un modèle 3-statements
            sur une cible de 80 M€ d&apos;ARR » pèse plus que « Je suis
            rigoureux ». Lettre de 220-250 mots.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Tech / produit (Stripe, Notion, Datadog…)
          </h3>
          <p>
            Souvent en anglais même pour un poste en France. Tutoiement en
            français, first name en anglais. Ton informel mais précis,
            beaucoup de références techniques (stack, outils, méthodes).
            Pas de formules de politesse lourdes.
          </p>
        </section>

        {/* H2 6 - Produit */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            L&apos;approche CV Modifier pour les lettres de motivation
          </h2>
          <p className="mb-4">
            Tout ce qui précède est intégré dans la génération de lettre de
            CV Modifier. Trois choix techniques clés :
          </p>
          <p className="mb-4">
            <strong>1. Structure Vous / Moi / Nous imposée</strong> — le
            prompt force systématiquement cette structure en trois
            paragraphes. Pas de listes à puces dans la lettre, pas de
            répétition du CV, obligation de citer au moins un élément factuel
            sur l&apos;entreprise (extrait du scrape de l&apos;offre).
          </p>
          <p className="mb-4">
            <strong>2. IA générative + règles d&apos;adaptation
            strictes</strong> — notre moteur IA est moins sujet aux tics
            génériques (« C&apos;est avec un vif enthousiasme… ») quand il est
            bien prompté. Le system prompt contient une blacklist de tournures
            interdites et une obligation de phrases courtes.
          </p>
          <p className="mb-4">
            <strong>3. Prompt caching</strong> — le prompt système et vos
            données de profil sont mis en cache côté modèle (
            <code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded">
              cache_control: ephemeral
            </code>
            ). Résultat : cohérence entre générations, moins de dérive d&apos;une
            lettre à l&apos;autre, et coût / latence plus faibles.
          </p>
          <p className="mb-4">
            Vous pouvez aussi ajouter des instructions personnalisées sur
            votre profil : « toujours tutoyer si le poste est dans une
            start-up », « ne jamais utiliser le mot passionné », « signer
            avec mon prénom uniquement ». Ces règles sont injectées dans
            chaque prompt et remplacent les règles par défaut.
          </p>
          <p>
            Enfin, la lettre générée est éditable en ligne (vous pouvez
            réécrire un paragraphe avant l&apos;export PDF) et suit la même
            logique d&apos;adaptation que le CV. Voir aussi{" "}
            <Link
              href="/adapter-cv-offre-emploi"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              le guide pour adapter son CV à une offre
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
                href="https://www.apec.fr/candidat/mon-projet-professionnel/je-reflechis-a-mon-projet/cv-lettre-de-motivation.html"
                rel="noopener"
                className="text-blue-700 hover:text-blue-800 underline"
              >
                APEC — CV et lettre de motivation
              </a>{" "}
              (exemples et bonnes pratiques cadres).
            </li>
            <li>
              •{" "}
              <a
                href="https://www.francetravail.fr/candidat/mes-services/construire-son-cv.html"
                rel="noopener"
                className="text-blue-700 hover:text-blue-800 underline"
              >
                France Travail — Candidature
              </a>{" "}
              (méthodo officielle lettre + CV).
            </li>
            <li>
              •{" "}
              <a
                href="https://www.service-public.fr/particuliers/vosdroits/F2918"
                rel="noopener"
                className="text-blue-700 hover:text-blue-800 underline"
              >
                Service-Public.fr — Recherche d&apos;emploi
              </a>{" "}
              (droits et aides).
            </li>
          </ul>
        </section>

        {/* CTA final */}
        <aside className="mt-16 rounded-2xl bg-slate-900 text-white p-8 md:p-10 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Des lettres qui ne sentent pas l&apos;IA
          </h3>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto">
            CV Modifier génère CV + lettre adaptés à chaque offre, avec
            structure Vous / Moi / Nous et ton réaliste. 3 crédits offerts.
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
                href="/adapter-cv-offre-emploi"
                className="block rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
              >
                <p className="font-semibold text-slate-900 mb-1">
                  Adapter son CV à une offre d&apos;emploi
                </p>
                <p className="text-sm text-slate-500">
                  Méthode complète pour personnaliser CV et lettre à chaque
                  candidature.
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
                  Les 10 règles pour structurer un CV qui passe Taleo, Workday
                  et les autres.
                </p>
              </Link>
            </li>
            <li>
              <Link
                href="/creer-cv"
                className="block rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
              >
                <p className="font-semibold text-slate-900 mb-1">
                  Créer un CV en 2026
                </p>
                <p className="text-sm text-slate-500">
                  Formats, structure et outils pour un CV qui tient la route.
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
