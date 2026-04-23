import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "CV ATS : comment passer les filtres automatiques des recruteurs",
  description:
    "CV ATS : les 10 règles pour passer Taleo, Workday et autres filtres automatiques. Format, structure, mots-clés, pièges à éviter. Guide 2026.",
  alternates: { canonical: "/cv-ats" },
  openGraph: {
    title:
      "CV ATS : comment passer les filtres automatiques des recruteurs",
    description:
      "Les 10 règles concrètes pour qu'un CV passe les ATS en 2026. Format, structure, mots-clés, pièges à éviter.",
    type: "article",
  },
};

export default function CvAtsPage() {
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
            Guide · Recrutement
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5">
            CV ATS : comment passer les filtres automatiques des recruteurs
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Entre vous et le recruteur humain, il y a souvent une machine.
            Elle s&apos;appelle ATS (Applicant Tracking System) et elle rejette
            une part importante des CV avant même qu&apos;un humain y jette un
            œil. Voici comment un CV ATS-compatible se structure en 2026, les
            pièges à éviter, et comment tester votre CV avant de l&apos;envoyer.
          </p>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16 text-slate-700 leading-relaxed">
        <section className="mb-12">
          <p className="text-lg">
            Un CV ATS, ce n&apos;est pas un CV « pour les robots » opposé à un
            CV « pour les humains ». C&apos;est un CV propre, lisible, bien
            structuré, qui fonctionne pour les deux. Les règles de ce guide
            s&apos;appliquent à tous les CV, mais les enfreindre coûte
            particulièrement cher si votre candidature passe par un ATS.
          </p>
        </section>

        {/* H2 1 */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Qu&apos;est-ce qu&apos;un ATS (Applicant Tracking System) ?
          </h2>
          <p className="mb-4">
            Un ATS est un logiciel utilisé par les services RH pour gérer les
            candidatures. Chaque fois que vous postulez via un portail carrière
            d&apos;entreprise (pas une plateforme externe type LinkedIn ou
            HelloWork), votre CV est importé dans un ATS, parsé (extraction
            automatique des infos), stocké, et rendu cherchable par les
            recruteurs via une recherche par mots-clés.
          </p>
          <p className="mb-4">
            Concrètement, un recruteur qui reçoit 800 candidatures sur un poste
            ne va pas lire 800 CV. Il tape dans la barre de recherche de
            l&apos;ATS : <code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded">
              &quot;Python&quot; AND &quot;Django&quot; AND &quot;5 ans&quot;
            </code>{" "}
            et ne regarde que les 30-50 résultats retournés. Si votre CV ne
            contient pas ces mots-clés, exactement, vous êtes invisible.
          </p>
          <p className="mb-4">
            Quelques ATS font du « scoring » automatique (ils notent chaque CV
            de 0 à 100 selon sa correspondance avec l&apos;offre), mais la
            majorité se contentent d&apos;être des bases de données
            cherchables. Dans les deux cas, la logique est la même : mots-
            clés + structure propre = vous êtes trouvable.
          </p>
          <p>
            Les chiffres qui circulent (« 75 % des CV sont rejetés par les
            ATS ») sont à prendre avec des pincettes : la plupart des ATS ne
            rejettent rien automatiquement, ils filtrent. Mais un CV introuvable
            dans l&apos;ATS équivaut à un CV rejeté. Le résultat est le même.
          </p>
        </section>

        {/* H2 2 */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Les grandes familles d&apos;ATS utilisés en France
          </h2>
          <p className="mb-4">
            Vous n&apos;avez pas besoin de les connaître par cœur, mais savoir
            qu&apos;ils existent (et qu&apos;ils sont différents) aide à
            comprendre pourquoi un CV trop fancy ne passe pas partout.
          </p>
          <ul className="space-y-3 mb-6">
            <li>
              <strong>Taleo (Oracle)</strong> — Historiquement leader, utilisé
              par de nombreux grands comptes du CAC 40. Parsing très littéral,
              peu tolérant aux mises en page complexes.
            </li>
            <li>
              <strong>Workday</strong> — De plus en plus présent dans les ETI
              et grandes entreprises internationales. Le candidat doit souvent
              ressaisir ses expériences à la main dans un formulaire, le CV
              étant un doublon.
            </li>
            <li>
              <strong>SmartRecruiters</strong> — Populaire dans les scale-ups
              et groupes modernes (Bosch, Visa). Parsing correct, interface
              plus propre.
            </li>
            <li>
              <strong>Greenhouse / Lever</strong> — Scale-ups et tech
              companies. Parsing moderne, plutôt tolérant, mais la majorité
              des champs sont remplis à la main par le candidat côté
              formulaire.
            </li>
            <li>
              <strong>ADP Recruitment, Cornerstone OnDemand, iCIMS</strong> —
              Plus présents dans les groupes US ou l&apos;industrie. Parsing
              variable.
            </li>
            <li>
              <strong>Beetween, Flatchr, DigitalRecruiters</strong> — Acteurs
              français / européens, présents dans les PME et ETI hexagonales.
            </li>
          </ul>
          <p>
            La bonne nouvelle : tous ces ATS partagent des limites communes
            (parsing de colonnes imparfait, rejet des images, sensibilité à
            la structure). Les règles ci-dessous valent pour tous.
          </p>
        </section>

        {/* H2 3 */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Les 10 règles d&apos;un CV ATS-compatible
          </h2>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            1. Format PDF texte (pas PDF image)
          </h3>
          <p className="mb-4">
            Envoyez un PDF généré depuis Word / Pages / Google Docs, ou un
            outil qui produit du PDF texte. Évitez les scans de CV papier : ce
            sont des images, l&apos;ATS n&apos;en extrait rien. Test rapide :
            si vous pouvez copier-coller du texte depuis votre PDF, c&apos;est
            bon.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            2. Pas de colonnes complexes
          </h3>
          <p className="mb-4">
            Les CV à deux colonnes (sidebar gauche + contenu droite) sont
            risqués. Certains ATS lisent dans le bon ordre, d&apos;autres
            mélangent tout. Règle simple : une colonne principale pour les
            expériences et formation, au maximum une sidebar fine pour
            compétences et contact.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            3. Polices standard
          </h3>
          <p className="mb-4">
            Arial, Calibri, Carlito, Helvetica, Georgia, Times New Roman, ou
            Inter. Évitez les polices exotiques, scripts, décoratives : elles
            peuvent être converties en glyphes illisibles par le parser.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            4. Structure claire avec titres de sections standards
          </h3>
          <p className="mb-4">
            Utilisez des intitulés classiques : « Expérience professionnelle »,
            « Formation », « Compétences », « Langues », « Projets ». Les ATS
            connaissent ces sections et les parsent correctement. Évitez les
            intitulés créatifs (« Mon parcours », « Ce que je sais faire »)
            qui risquent de ne pas être reconnus.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            5. Titres de poste exacts
          </h3>
          <p className="mb-4">
            Pour chaque expérience, utilisez l&apos;intitulé de poste tel
            qu&apos;il apparaît dans l&apos;offre que vous visez ou dans le
            vocabulaire standard du métier. « Product Manager » ou « Chef de
            produit », pas « Guide produit ».
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            6. Mots-clés de l&apos;offre présents dans le CV
          </h3>
          <p className="mb-4">
            L&apos;ATS trouve votre CV en cherchant des mots-clés. Si
            l&apos;offre demande « Kubernetes », votre CV doit contenir le mot
            « Kubernetes » quelque part (dans compétences, bullets, ou
            expérience). Voir{" "}
            <Link
              href="/adapter-cv-offre-emploi"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              notre guide sur l&apos;adaptation du CV à l&apos;offre
            </Link>{" "}
            pour la méthode complète.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            7. Dates cohérentes et lisibles
          </h3>
          <p className="mb-4">
            Format uniforme : « Janvier 2021 — Mars 2024 » ou « 01/2021 —
            03/2024 ». Pas de mix. Les ATS parsent les dates pour calculer
            l&apos;ancienneté automatiquement ; un format aberrant fausse le
            score.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            8. Informations de contact dans le corps du CV
          </h3>
          <p className="mb-4">
            Nom, email, téléphone, LinkedIn dans le <strong>corps</strong> du
            CV (pas dans un header / footer Word). Les headers et footers sont
            souvent ignorés par les parsers.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            9. Pas d&apos;image pour du texte
          </h3>
          <p className="mb-4">
            Si vos compétences ou votre nom sont insérés sous forme
            d&apos;image (capture d&apos;un logo, texte stylisé en PNG), ils
            sont invisibles pour l&apos;ATS. Tout ce qui compte doit être du
            texte sélectionnable.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            10. Nom de fichier propre
          </h3>
          <p>
            <code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded">
              prenom-nom-cv.pdf
            </code>{" "}
            ou{" "}
            <code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded">
              prenom-nom-entreprise-cv.pdf
            </code>
            . Pas « CV_v3_final_corrigé.pdf ». Le nom de fichier est vu par le
            recruteur et stocké par l&apos;ATS.
          </p>
        </section>

        {/* CTA mid */}
        <aside className="my-12 rounded-2xl bg-blue-50 border border-blue-100 p-6 md:p-8 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Besoin d&apos;un CV ATS-compatible prêt à envoyer ?
          </h3>
          <p className="text-slate-700 mb-5">
            CV Modifier génère des PDFs texte-only, structurés ATS, adaptés à
            chaque offre. 3 générations offertes, sans carte bancaire.
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
            Les pièges qui font rejeter un CV par un ATS
          </h2>

          <div className="grid gap-4 mb-6">
            {[
              {
                title: "Headers / footers Word avec les infos clés",
                desc: "Nom, téléphone, email placés dans l'en-tête Word : souvent ignorés par le parser. À remettre dans le corps du CV.",
              },
              {
                title: "Skills présentés en image ou badge coloré",
                desc: "Les badges « compétences » en forme de pastilles PNG ou SVG mal étiquetés sont invisibles. Mettez une simple liste de mots, séparés par des virgules ou en bullets.",
              },
              {
                title: "Tableaux complexes multi-colonnes",
                desc: "Les tableaux avec cellules fusionnées, en-têtes colorés, bordures complexes cassent le parsing. Le contenu se retrouve dans le désordre, voire perdu.",
              },
              {
                title: "Polices custom non embarquées",
                desc: "Une police exotique non incluse dans le PDF est remplacée par une police par défaut côté ATS, parfois en glyphes cassés. Toujours embarquer les polices au moment de l'export PDF.",
              },
              {
                title: "Graphiques de niveau (jauges de compétences)",
                desc: "« Python ▓▓▓▓░ » rendu en SVG : l'ATS ne sait pas lire ça. Il comprendra « Python » (parfois) sans aucune info de niveau. Remplacez par « Python (avancé) » en texte.",
              },
              {
                title: "Mise en page sur deux colonnes serrées",
                desc: "Un CV moderne à 2 colonnes étroites peut être lu en zigzag par l'ATS : ligne colonne gauche, ligne colonne droite, ligne colonne gauche… Résultat : bouillie de texte inexploitable.",
              },
            ].map((p, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 bg-white"
              >
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 mb-1">
                    {p.title}
                  </p>
                  <p className="text-sm text-slate-600">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* H2 5 */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Comment tester son CV contre un ATS (sans outil payant)
          </h2>
          <p className="mb-4">
            Pas besoin d&apos;un outil à 30 € pour vérifier. Trois tests
            manuels suffisent à attraper 90 % des problèmes :
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Test 1 : copier-coller dans un éditeur de texte
          </h3>
          <p className="mb-4">
            Ouvrez votre PDF, sélectionnez tout (Ctrl+A), copiez, collez dans
            le Bloc-notes (Notepad) ou TextEdit. Résultat attendu : le texte
            doit apparaître dans le bon ordre (nom en haut, puis résumé, puis
            expériences chronologiquement), sans caractères cassés, sans
            morceaux manquants. Si l&apos;ordre est cassé ou si du texte
            manque, votre ATS aura le même problème.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Test 2 : Ctrl+F sur les mots-clés de l&apos;offre
          </h3>
          <p className="mb-4">
            Ouvrez votre PDF dans un navigateur (ou un reader), faites Ctrl+F,
            tapez chaque mot-clé important de l&apos;offre. S&apos;il
            n&apos;est pas trouvé, l&apos;ATS non plus ne le trouvera pas. Le
            mot doit apparaître quelque part (titre, accroche, compétences,
            bullet).
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Test 3 : upload dans LinkedIn pour voir le parsing
          </h3>
          <p className="mb-4">
            LinkedIn a un parser de CV (dans le flow « Importer un CV » lors
            de la mise à jour de profil). Uploadez votre PDF et regardez
            comment LinkedIn extrait les champs. Si LinkedIn se trompe sur les
            dates, titres de poste, ou mélange des expériences, la plupart des
            ATS auront le même comportement.
          </p>

          <p>
            Ces trois tests combinés prennent 5 minutes et détectent la
            majorité des problèmes de parsing avant qu&apos;ils ne vous
            coûtent une opportunité.
          </p>
        </section>

        {/* H2 6 - Produit */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            CV Modifier et les ATS
          </h2>
          <p className="mb-4">
            Les 4 templates CV Modifier (Classique, Moderne, Minimaliste,
            Créatif) sont générés via FPDF2 en PDF texte, pas en image. Tout
            le texte est sélectionnable et cherchable. Pas d&apos;icônes
            vectorielles pour les compétences, pas de jauges de niveau, pas de
            texte en image pour le nom ou les titres de section.
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Template Classique et Minimaliste</strong> — une seule
                colonne principale, parfaits pour les ATS les plus stricts
                (Taleo, iCIMS).
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Templates Moderne et Créatif</strong> — sidebar fine
                dédiée aux compétences + contact (parsing ATS ok dans nos
                tests), contenu principal en colonne unique.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Police Carlito</strong> (équivalent Calibri), embarquée
                systématiquement dans le PDF.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Titres de section standards</strong> : « Expérience
                professionnelle », « Formation », « Compétences ».
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Nom de fichier</strong> au format{" "}
                <code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded">
                  nom-prenom-entreprise-cv.pdf
                </code>{" "}
                à chaque génération.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Mots-clés de l&apos;offre</strong> injectés
                automatiquement par l&apos;IA Claude dans le titre,
                l&apos;accroche et les compétences.
              </span>
            </li>
          </ul>
          <p>
            Résultat : un CV qui passe les parsers, qui contient les mots-clés
            de chaque offre, et qui reste lisible pour le recruteur humain qui
            finit par l&apos;ouvrir.
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
                q: "PDF ou Word pour un CV ATS ?",
                a: "Les deux fonctionnent, mais le PDF est préférable : votre mise en page reste stable quel que soit l'ordinateur du recruteur. Certains ATS anciens préfèrent Word — c'est rare aujourd'hui. Envoyez un PDF sauf si l'offre demande explicitement un autre format.",
              },
              {
                q: "Faut-il mettre une photo sur un CV ATS ?",
                a: "La photo est ignorée par l'ATS (c'est juste un objet image dans le PDF, sans effet sur le parsing). Côté recruteur humain, c'est culturel : plutôt oui en France, plutôt non dans les pays anglo-saxons. Une photo bien faite ne nuit pas, une mauvaise photo nuit.",
              },
              {
                q: "Les CV créatifs (Canva, graphistes) passent-ils les ATS ?",
                a: "Mal. Les templates très graphiques (avec icônes, colonnes décoratives, polices custom) ont des taux de parsing médiocres. Si vous candidatez à un poste créatif, envoyez deux versions : un CV créatif pour montrer votre style + un CV ATS-friendly pour passer les filtres.",
              },
              {
                q: "Combien de mots-clés faut-il mettre ?",
                a: "Visez 60 à 80 % des mots-clés explicites de l'offre. N'essayez pas de tout caser — un CV qui contient 100 % des mots-clés sent le bourrage et le recruteur humain le voit. Priorisez les 10-15 mots-clés les plus récurrents et les plus techniques.",
              },
              {
                q: "Les ATS pénalisent-ils les fautes d'orthographe ?",
                a: "Les ATS ne corrigent pas, mais ils matchent littéralement : une faute dans un mot-clé (« Pythno » au lieu de « Python ») vous rend invisible sur cette recherche. Relire deux fois, ou utiliser un correcteur.",
              },
              {
                q: "Mon CV passé chez un ATS reste-t-il stocké ?",
                a: "Oui, souvent plusieurs années. Le RGPD impose à l'entreprise d'informer sur la durée de conservation (généralement 2 ans). Ça signifie qu'un CV envoyé à un grand groupe revient parfois dans une recherche 18 mois plus tard pour un autre poste. Raison de plus pour qu'il soit bien fait.",
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
            Un CV ATS-compatible en 30 secondes
          </h3>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto">
            CV Modifier génère des PDFs propres, adaptés à chaque offre,
            conçus pour passer les parsers automatiques. 3 crédits offerts,
            sans carte bancaire.
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
                  Méthode complète pour personnaliser votre CV à chaque
                  candidature sans y passer des heures.
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
                  Rendre une lettre générée par IA crédible et personnalisée
                  pour chaque offre.
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
                  Formats, sections, outils : le guide complet pour partir sur
                  de bonnes bases.
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
    </div>
  );
}
