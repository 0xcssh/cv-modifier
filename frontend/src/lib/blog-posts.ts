// Blog posts — static content. No CMS, no MDX. Pure TypeScript so both
// server and client components can import it (server for metadata/params,
// client only for the search filter on the index page).

export type BlogCategory = "ATS" | "Métier" | "IA" | "Méthode";

export interface BlogAuthor {
  name: string;
  role: string;
  avatarInitials: string;
}

export type BlogSection =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; id: string; text: string }
  | { type: "list"; style: "bullet" | "numbered"; items: string[] }
  | {
      type: "callout";
      variant: "info" | "warning" | "tip";
      title: string;
      text: string;
    }
  | {
      type: "cta";
      title: string;
      text: string;
      ctaLabel: string;
      ctaHref: string;
    };

export interface BlogFaqItem {
  q: string;
  a: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  readTime: number;
  publishedAt: string; // ISO
  updatedAt: string; // ISO
  author: BlogAuthor;
  heroImage: string; // full URL
  heroAlt: string;
  tocHeadings: { id: string; label: string }[];
  content: BlogSection[];
  faq: BlogFaqItem[];
  keywords: string[];
  relatedSlugs: string[];
}

// Shared fictional author for v1 of the blog.
export const DEFAULT_AUTHOR: BlogAuthor = {
  name: "Équipe CV Modifier",
  role: "Conseils carrière",
  avatarInitials: "CM",
};

// Unsplash base — see next.config.ts remotePatterns.
const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/${id}?w=1200&q=80&auto=format&fit=crop`;

// Category visual tokens — Tailwind utility classes used by BlogCard /
// article chrome. Kept in one map so adding a category later is a 1-line
// change.
export const CATEGORY_STYLES: Record<
  BlogCategory,
  { badge: string; dot: string }
> = {
  ATS: {
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  Métier: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  IA: {
    badge: "bg-violet-50 text-violet-700 border-violet-200",
    dot: "bg-violet-500",
  },
  Méthode: {
    badge: "bg-amber-50 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
  },
};

// -----------------------------------------------------------------------
// Article 1 — Les 10 erreurs qui font rejeter votre CV par les ATS
// -----------------------------------------------------------------------
const post1: BlogPost = {
  slug: "10-erreurs-cv-ats",
  title: "Les 10 erreurs qui font rejeter votre CV par les ATS",
  excerpt:
    "60% des CV sont rejetés avant même d'être lus par un humain. Voici les 10 erreurs de mise en forme et de contenu qui font échouer votre candidature aux filtres ATS.",
  category: "ATS",
  readTime: 6,
  publishedAt: "2026-04-10T09:00:00.000Z",
  updatedAt: "2026-04-22T09:00:00.000Z",
  author: DEFAULT_AUTHOR,
  heroImage: UNSPLASH("photo-1551434678-e076c223a692"),
  heroAlt: "Bureau moderne avec ordinateur portable et documents professionnels",
  keywords: [
    "CV ATS",
    "erreurs CV",
    "filtres ATS",
    "Taleo",
    "Workday",
    "Greenhouse",
    "rejet CV automatique",
    "mots-clés CV",
  ],
  tocHeadings: [
    { id: "pourquoi", label: "Pourquoi les ATS filtrent votre CV" },
    { id: "erreur-1", label: "Erreur 1 : photos, tableaux et colonnes" },
    { id: "erreur-2", label: "Erreur 2 : infos clés dans header/footer" },
    { id: "erreur-3", label: "Erreur 3 : polices non standard" },
    { id: "erreur-4", label: "Erreur 4 : absence de mots-clés" },
    { id: "erreur-5", label: "Erreur 5 : titres de poste trop créatifs" },
    { id: "erreur-6", label: "Erreur 6 : dates incohérentes" },
    { id: "erreur-7", label: "Erreur 7 : PDF scanné" },
    { id: "erreur-8-10", label: "Erreurs 8 à 10 : liens, sections, nom de fichier" },
    { id: "tester", label: "Comment tester votre CV contre un ATS" },
  ],
  content: [
    {
      type: "paragraph",
      text: "Selon plusieurs études menées sur le marché du recrutement, près de 6 CV sur 10 ne parviennent jamais jusqu'à un recruteur humain. Responsable numéro un : l'ATS, ou Applicant Tracking System. Workday, Taleo, Greenhouse, Lever, iCIMS — ces logiciels sont utilisés par la quasi-totalité des grandes entreprises pour trier les candidatures à l'arrivée. Et quand un CV est mal lu par un ATS, il est rejeté sans explication. Voici les 10 erreurs les plus fréquentes, et comment les corriger avant votre prochaine candidature.",
    },
    {
      type: "heading",
      level: 2,
      id: "pourquoi",
      text: "Pourquoi les ATS filtrent votre CV",
    },
    {
      type: "paragraph",
      text: "Un ATS ne lit pas votre CV comme vous. Il l'ouvre, extrait le texte brut, puis tente d'identifier des sections standard : expérience, formation, compétences, coordonnées. Si la mise en page rend cette extraction difficile — ou pire, impossible — le CV est soit mal indexé, soit rejeté. Ensuite, l'ATS compare les mots-clés présents dans votre CV à ceux de l'offre d'emploi. Un score de correspondance trop faible, et votre candidature ne passe pas la première étape.",
    },
    {
      type: "paragraph",
      text: "Bonne nouvelle : un CV bien structuré passe autant les ATS que le regard d'un recruteur humain. Il n'y a pas besoin de faire un « CV pour les robots » distinct. Il y a juste des règles à respecter.",
    },
    {
      type: "heading",
      level: 2,
      id: "erreur-1",
      text: "Erreur #1 : Les photos, tableaux et colonnes complexes",
    },
    {
      type: "paragraph",
      text: "La grande majorité des ATS peinent à lire un CV structuré en deux colonnes asymétriques, avec des tableaux imbriqués ou une photo qui coupe le texte. L'ordre de lecture du texte extrait devient chaotique : le nom apparaît au milieu du CV, les compétences sont mélangées avec les expériences, les dates sont perdues. Préférez une mise en page en une seule colonne principale, avec éventuellement une fine barre latérale contenant uniquement les coordonnées.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "La photo : optionnelle en France, piège à l'étranger",
      text: "En France, la photo reste tolérée mais n'apporte rien côté ATS — et elle peut poser des soucis de discrimination. Aux États-Unis, au Royaume-Uni ou au Canada, elle est formellement déconseillée. Dans le doute, retirez-la.",
    },
    {
      type: "heading",
      level: 2,
      id: "erreur-2",
      text: "Erreur #2 : Mettre les infos clés dans le header/footer",
    },
    {
      type: "paragraph",
      text: "Beaucoup d'ATS ignorent purement et simplement le contenu des zones « en-tête » et « pied de page » des documents Word ou PDF. Si votre email, votre numéro de téléphone ou votre ville sont placés dans le header, ils peuvent ne jamais être extraits. Résultat : le recruteur reçoit votre CV sans savoir comment vous joindre. Placez toujours vos coordonnées dans le corps du document, en haut de la première page.",
    },
    {
      type: "heading",
      level: 2,
      id: "erreur-3",
      text: "Erreur #3 : Polices non-standard et caractères spéciaux",
    },
    {
      type: "paragraph",
      text: "Les polices exotiques téléchargées depuis un site de design (Bebas Neue custom, typos manuscrites, icônes de polices type FontAwesome) se transforment en carrés vides ou en glyphes illisibles lors de l'extraction texte. Idem pour les puces fantaisie « » « » ou les séparateurs visuels. Restez sur une police système ATS-safe : Arial, Calibri, Helvetica, Georgia, Garamond, Carlito. Pour les puces, utilisez le bullet point classique « • » ou un simple tiret.",
    },
    {
      type: "heading",
      level: 2,
      id: "erreur-4",
      text: "Erreur #4 : Absence de mots-clés de l'offre",
    },
    {
      type: "paragraph",
      text: "C'est l'erreur la plus coûteuse. L'ATS mesure un score de correspondance entre votre CV et l'offre. Si l'offre parle de « gestion de projet Agile » et que vous écrivez « pilotage de projets » sans jamais mentionner Agile ni Scrum, votre score chute. Relisez l'offre, surlignez les compétences, outils, méthodes, certifications qui reviennent. Intégrez-les naturellement dans vos expériences — pas dans une liste isolée en fin de CV.",
    },
    {
      type: "cta",
      title: "Adaptez votre CV à chaque offre en 30 secondes",
      text: "CV Modifier analyse l'offre, identifie les mots-clés critiques et reformule vos expériences pour maximiser le score ATS — sans inventer de compétences que vous n'avez pas. 3 générations offertes, sans carte bancaire.",
      ctaLabel: "Essayer gratuitement",
      ctaHref: "/register",
    },
    {
      type: "heading",
      level: 2,
      id: "erreur-5",
      text: "Erreur #5 : Titres de poste trop créatifs",
    },
    {
      type: "paragraph",
      text: "« Magicien du code », « Ninja SEO », « Happiness Manager » sont peut-être vos vrais titres — mais ils ne correspondent à aucune requête standard dans un ATS. Utilisez le titre officiel reconnu du métier (Développeur Full Stack, Chargé de référencement SEO, Office Manager). Vous pouvez garder le titre fun entre parenthèses si vous y tenez, mais commencez toujours par la version ATS-friendly.",
    },
    {
      type: "heading",
      level: 2,
      id: "erreur-6",
      text: "Erreur #6 : Dates au format incohérent",
    },
    {
      type: "paragraph",
      text: "« Depuis 2022 », « Jan 23 – Oct 24 », « 2021 – aujourd'hui ». Un ATS attend un format uniforme, idéalement MM/AAAA – MM/AAAA (ex : 03/2022 – 10/2024). Un format incohérent empêche l'ATS de calculer correctement votre ancienneté dans chaque poste, et certaines entreprises filtrent les candidats sur un minimum d'expérience cumulée. Une colonne « dates » illisible peut vous éliminer automatiquement.",
    },
    {
      type: "heading",
      level: 2,
      id: "erreur-7",
      text: "Erreur #7 : PDF scanné (image au lieu de texte)",
    },
    {
      type: "paragraph",
      text: "Vous avez imprimé votre CV Word, vous l'avez signé à la main, puis scanné. Pour un humain, c'est un beau PDF. Pour un ATS, c'est une image : aucun texte extractible, score de correspondance = 0, rejet automatique. Exportez toujours votre CV directement en PDF depuis Word, Google Docs ou un générateur. Test rapide : ouvrez votre CV dans un lecteur PDF et essayez de sélectionner un mot avec le curseur. Si vous n'y arrivez pas, c'est une image.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Le format DOCX reste la valeur sûre",
      text: "Certains ATS (vieilles versions de Taleo notamment) traitent mieux le DOCX que le PDF. Quand l'offre le permet, envoyez les deux — ou seulement le DOCX. En 2026, les ATS modernes gèrent PDF et DOCX indifféremment, mais en cas de doute sur l'ATS utilisé, DOCX reste le plus compatible.",
    },
    {
      type: "heading",
      level: 2,
      id: "erreur-8-10",
      text: "Erreurs #8 à #10 : liens brisés, sections manquantes, fichier mal nommé",
    },
    {
      type: "paragraph",
      text: "Trois erreurs fréquentes qu'on regroupe ici, chacune capable de vous coûter un entretien :",
    },
    {
      type: "list",
      style: "numbered",
      items: [
        "Liens brisés : LinkedIn, GitHub, portfolio — testez-les avant d'envoyer. Un lien cassé dans un CV signale un manque de rigueur.",
        "Sections manquantes : certains candidats n'ont ni section « Compétences » ni section « Formation ». L'ATS cherche ces sections nommées explicitement. Leur absence peut faire chuter votre score.",
        "Fichier mal nommé : « CV-final-v3-copie.pdf » fait amateur. Nommez votre fichier Nom-Prenom-CV.pdf, ou mieux, Nom-Prenom-Entreprise-CV.pdf quand vous candidatez à une entreprise précise.",
      ],
    },
    {
      type: "heading",
      level: 2,
      id: "tester",
      text: "Comment tester votre CV contre un ATS",
    },
    {
      type: "paragraph",
      text: "Trois méthodes rapides pour vérifier qu'un CV est ATS-compatible :",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        "Le test du copier-coller : ouvrez votre PDF, sélectionnez tout (Ctrl+A), copiez, collez dans un bloc-notes. Si le texte apparaît dans l'ordre logique (nom, coordonnées, expériences dans l'ordre), c'est bon. S'il est mélangé ou illisible, réécrivez la mise en page.",
        "Le test des mots-clés : copiez l'offre dans un outil comme JobScan ou Resume Worded, puis votre CV. Le score de correspondance vous dit quels mots-clés manquent.",
        "Le test d'impression en mode texte : dans Adobe Reader, Fichier > Enregistrer sous > Texte (.txt). Ouvrez le fichier. C'est exactement ce que voit l'ATS.",
      ],
    },
    {
      type: "paragraph",
      text: "En appliquant ces 10 règles, vous multipliez vos chances de franchir la première barrière du recrutement. Ce n'est pas une garantie d'entretien — le fond compte toujours — mais c'est la condition nécessaire pour que votre CV soit seulement lu par un humain. Pour creuser le sujet et voir comment tout cela s'applique concrètement, notre guide complet <a href=\"/cv-ats\" class=\"text-blue-600 hover:underline font-medium\">CV ATS : passer les filtres en 2026</a> détaille template par template ce qui fonctionne. Et si vous voulez automatiser l'adaptation du CV à chaque offre, c'est exactement ce que fait <a href=\"/adapter-cv-offre-emploi\" class=\"text-blue-600 hover:underline font-medium\">CV Modifier</a>.",
    },
  ],
  faq: [
    {
      q: "Quels sont les ATS les plus utilisés en France en 2026 ?",
      a: "Les plus répandus sont Workday (grandes entreprises), Taleo (Oracle, banques et administration), Greenhouse (scale-ups tech), Lever (startups), SmartRecruiters et iCIMS. En France, Beetween, Talentsoft et Flatchr sont aussi très utilisés dans l'ETI.",
    },
    {
      q: "Un CV Canva passe-t-il les ATS ?",
      a: "Ça dépend du template. Les templates Canva une colonne simple avec export PDF natif passent correctement la plupart des ATS. En revanche, les templates multi-colonnes, avec icônes illustrées ou arrière-plans complexes, sont souvent mal lus. Testez toujours le copier-coller du PDF exporté avant de l'envoyer.",
    },
    {
      q: "Faut-il mettre une section \"Objectif professionnel\" en haut du CV ?",
      a: "Pas nécessaire pour les ATS, mais utile pour les humains quand votre candidature ne colle pas évidemment avec le poste (reconversion, profil atypique). En 2-3 lignes, vous reliez votre parcours au poste visé. Inutile sinon : vos expériences parlent d'elles-mêmes.",
    },
    {
      q: "Un CV de 2 pages est-il pénalisé par les ATS ?",
      a: "Non, l'ATS ne compte pas les pages. En revanche, les recruteurs humains préfèrent 1 page pour les profils < 5 ans d'expérience, 2 pages maximum au-delà. Priorisez la pertinence : chaque ligne doit servir la candidature au poste visé.",
    },
    {
      q: "Dois-je envoyer le même CV à toutes les offres ?",
      a: "Non. Même si votre profil est stable, les mots-clés varient d'une offre à l'autre. Prenez 5 à 10 minutes par candidature pour adapter le wording de vos expériences aux termes de l'offre. C'est exactement le gain de temps que CV Modifier automatise.",
    },
  ],
  relatedSlugs: [
    "mots-cles-offre-emploi",
    "cv-developpeur-2026",
    "cv-commercial-structure-gagnante",
  ],
};

// -----------------------------------------------------------------------
// Article 2 — Comment repérer les mots-clés d'une offre d'emploi en 2 minutes
// -----------------------------------------------------------------------
const post2: BlogPost = {
  slug: "mots-cles-offre-emploi",
  title: "Comment repérer les mots-clés d'une offre d'emploi en 2 minutes",
  excerpt:
    "La méthode concrète pour extraire les mots-clés critiques d'une offre et les placer dans votre CV — sans bourrage, sans les inventer, en moins de 2 minutes.",
  category: "Méthode",
  readTime: 5,
  publishedAt: "2026-04-05T09:00:00.000Z",
  updatedAt: "2026-04-18T09:00:00.000Z",
  author: DEFAULT_AUTHOR,
  heroImage: UNSPLASH("photo-1486312338219-ce68d2c6f44d"),
  heroAlt: "Ordinateur portable ouvert avec bloc-notes et stylo",
  keywords: [
    "mots-clés CV",
    "mots-clés offre emploi",
    "adapter CV",
    "hard skills",
    "soft skills",
    "outils CV",
    "densité mots-clés",
  ],
  tocHeadings: [
    { id: "pourquoi-mots-cles", label: "Pourquoi les mots-clés sont critiques en 2026" },
    { id: "3-types", label: "Les 3 types de mots-clés à chasser" },
    { id: "methode", label: "La méthode copier-coller-surligner en 2 min" },
    { id: "densite", label: "Densité : combien de fois répéter chaque mot-clé" },
    { id: "exemples", label: "Les mots-clés qui fonctionnent par métier" },
  ],
  content: [
    {
      type: "paragraph",
      text: "Vous envoyez un CV et vous n'avez jamais de réponse ? Huit fois sur dix, le problème n'est pas votre profil — c'est que votre CV ne contient pas les mots-clés que l'offre (et donc l'ATS) cherche. Les recruteurs lisent en diagonale, les logiciels scorent automatiquement. Dans les deux cas, les mots comptent. Voici comment les repérer proprement et rapidement, sans tomber dans le bourrage de mots-clés qui se voit à l'œil nu.",
    },
    {
      type: "heading",
      level: 2,
      id: "pourquoi-mots-cles",
      text: "Pourquoi les mots-clés sont critiques en 2026",
    },
    {
      type: "paragraph",
      text: "Deux raisons, dans cet ordre. Première raison : l'ATS. Quand votre CV arrive, il est comparé à l'offre via un moteur de matching. Un score trop bas vous envoie en bas de pile — voire hors pile. Les recruteurs trient ensuite les candidatures classées par score décroissant, et en pratique, ils s'arrêtent rapidement. Deuxième raison : le recruteur humain. Il passe en moyenne 6 à 8 secondes sur un CV au premier tri. Les mots-clés servent de balises visuelles : s'il retrouve rapidement « Salesforce », « portefeuille B2B », « closing 6 chiffres » dans votre CV et que c'est ce qu'il cherche, il s'arrête. Sinon, il passe.",
    },
    {
      type: "paragraph",
      text: "Une bonne adaptation du CV à l'offre, c'est donc d'abord un travail de mots-clés. Le reste — reformulation, mise en forme, ordre des expériences — vient après.",
    },
    {
      type: "heading",
      level: 2,
      id: "3-types",
      text: "Les 3 types de mots-clés à chasser (hard, soft, outils)",
    },
    {
      type: "paragraph",
      text: "Dans une offre d'emploi, trois familles de mots-clés cohabitent. Les distinguer vous évite de tout mélanger :",
    },
    {
      type: "list",
      style: "numbered",
      items: [
        "Hard skills (compétences métier) : « gestion de projet », « analyse financière », « développement commercial B2B », « rédaction SEO », « supply chain ». Ce sont les compétences cœur du poste. Elles doivent figurer dans vos expériences, pas juste dans une liste isolée.",
        "Soft skills (savoir-être) : « autonomie », « esprit d'équipe », « rigueur », « leadership », « communication ». Elles sont plus floues, mais certains ATS les matchent quand même. Intégrez-les dans les descriptions d'expériences (« Management d'une équipe de 5 — leadership opérationnel »).",
        "Outils et technos : « Salesforce », « HubSpot », « Excel avancé », « Python », « Figma », « Notion », « SAP ». Ce sont les plus faciles à repérer, les plus stratégiques à inclure. Un mot-clé d'outil manquant, c'est souvent un rejet direct.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Astuce : priorisez les outils",
      text: "Si vous devez ne travailler qu'un type de mot-clé, choisissez les outils. Ils sont non négociables pour les recruteurs tech/data/marketing, et ce sont souvent eux qui déclenchent les filtres ATS automatiques.",
    },
    {
      type: "heading",
      level: 2,
      id: "methode",
      text: "La méthode \"copier-coller-surligner\" en 2 min",
    },
    {
      type: "paragraph",
      text: "La méthode est bête comme chou, mais elle marche mieux que 90% des outils payants. Elle prend 2 minutes par offre :",
    },
    {
      type: "list",
      style: "numbered",
      items: [
        "Copiez l'intégralité de l'offre dans un Google Doc ou un Notion.",
        "Surlignez en jaune tous les noms d'outils, technos, certifications (le plus facile à repérer : souvent en majuscule ou en anglais).",
        "Surlignez en vert les compétences métier (verbes d'action : « piloter », « développer », « négocier », « analyser ») et leurs objets (« portefeuille B2B », « budget 500k€ »).",
        "Surlignez en bleu les soft skills explicites (généralement en fin d'annonce, dans la section « profil recherché »).",
        "Vous avez maintenant la liste de 15 à 25 mots-clés à intégrer dans votre CV. Priorisez les 10 qui apparaissent le plus souvent ou qui sont listés comme « indispensables ».",
      ],
    },
    {
      type: "cta",
      title: "Extraire les mots-clés automatiquement",
      text: "CV Modifier colle l'URL de l'offre, extrait les mots-clés par IA et les intègre naturellement dans vos expériences. Zéro surlignage manuel, CV + lettre prêts en 30 secondes.",
      ctaLabel: "Essayer gratuitement",
      ctaHref: "/adapter-cv-offre-emploi",
    },
    {
      type: "heading",
      level: 2,
      id: "densite",
      text: "Densité : combien de fois répéter chaque mot-clé",
    },
    {
      type: "paragraph",
      text: "Règle générale : chaque mot-clé critique doit apparaître 2 à 3 fois dans le CV, répartis entre plusieurs expériences. Pas 10 fois : le bourrage se voit, et les ATS modernes pénalisent les CV qui répètent le même terme trop mécaniquement. Pas 1 fois non plus : c'est trop peu pour matcher un score décent.",
    },
    {
      type: "paragraph",
      text: "Exemple concret : si l'offre répète 5 fois « Salesforce », mentionnez Salesforce dans 2 ou 3 de vos expériences commerciales (jamais dans toutes si vous ne l'avez utilisé que chez un seul employeur — ça devient mensonger). Idéalement, déclinez : « Salesforce » dans une expérience, « CRM Salesforce » dans une autre, « administration Salesforce » dans une troisième. L'ATS compte les variations, vous évitez la répétition plate.",
    },
    {
      type: "heading",
      level: 2,
      id: "exemples",
      text: "Les mots-clés qui fonctionnent par métier (exemples)",
    },
    {
      type: "paragraph",
      text: "Quelques familles de mots-clés à avoir en tête, selon votre métier. Liste non exhaustive, à combiner avec l'extraction depuis l'offre précise.",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        "Commercial B2B : CRM (Salesforce, HubSpot, Pipedrive), cycle de vente, closing, prospection outbound, pipeline, ARR/MRR, portefeuille clients, négociation, account management.",
        "Développeur : stack (React, Next.js, Node.js, Python, Go), DevOps (Docker, Kubernetes, CI/CD, GitHub Actions), cloud (AWS, GCP, Azure), architecture, code review, Agile, Scrum.",
        "Marketing : SEO, SEA, Google Ads, Meta Ads, acquisition, CRM, marketing automation (HubSpot, Mailchimp, Brevo), GA4, attribution, CAC, LTV, content marketing.",
        "Product : user research, roadmap, OKR, Jira, Notion, Figma, wireframing, A/B test, priorisation, stakeholders, Scrum, discovery / delivery.",
        "RH : SIRH, paie, ADP, recrutement, sourcing LinkedIn Recruiter, onboarding, QVT, conformité droit du travail, mobilité interne, formation.",
      ],
    },
    {
      type: "paragraph",
      text: "Repérer les mots-clés n'est que la première étape. La suivante, c'est de les intégrer proprement dans vos expériences sans transformer le CV en nuage de tags. Notre guide <a href=\"/adapter-cv-offre-emploi\" class=\"text-blue-600 hover:underline font-medium\">comment adapter son CV à une offre d'emploi</a> détaille la méthode complète, et pour tout ce qui est ATS-compatible, jetez un œil à <a href=\"/cv-ats\" class=\"text-blue-600 hover:underline font-medium\">CV ATS : passer les filtres en 2026</a>.",
    },
  ],
  faq: [
    {
      q: "Est-ce que l'IA détecte les CV bourrés de mots-clés ?",
      a: "Oui, de plus en plus. Les ATS modernes (depuis 2023 environ) utilisent du NLP pour mesurer la cohérence entre les mots-clés et leur contexte. Lister \"Salesforce, HubSpot, Pipedrive, Zoho, Microsoft Dynamics\" en vrac dans une section compétences sans jamais les mentionner dans une expérience fait baisser votre score, pas monter.",
    },
    {
      q: "Combien d'offres analyser pour adapter mon CV ?",
      a: "Au minimum 3 à 5 offres sur le même poste, de différentes entreprises. Ça vous donne les mots-clés récurrents (à garder systématiquement) et les mots-clés spécifiques (à adapter à chaque candidature). C'est la base d'un \"CV pivot\" solide que vous déclinez ensuite.",
    },
    {
      q: "Faut-il recopier les mots-clés en anglais tels quels ?",
      a: "Oui, quand ils sont en anglais dans l'offre — notamment en tech, marketing digital et finance. \"Growth hacking\", \"Account Executive\", \"Data Analyst\" sont des termes standards. Les traduire (\"analyste de données\") vous fait perdre en score ATS même en France.",
    },
    {
      q: "Un mot-clé que je ne maîtrise pas, je le mets quand même ?",
      a: "Non, jamais. C'est le point de bascule entre \"adapter un CV\" et \"mentir\". Si vous mettez \"Python\" parce que l'offre le demande mais vous n'en avez jamais écrit une ligne, vous serez démasqué en entretien technique. Mentionnez seulement ce que vous pouvez défendre 5 minutes devant un expert.",
    },
    {
      q: "Les mots-clés dans une section \"Compétences\" isolée suffisent-ils ?",
      a: "Ils améliorent le score ATS mais convainquent peu le recruteur humain. Une liste \"JavaScript, React, Node.js, AWS\" sans aucune expérience qui l'illustre est suspecte. L'idéal : une section compétences synthétique + les mots-clés répétés dans les descriptions d'expériences concrètes.",
    },
  ],
  relatedSlugs: [
    "10-erreurs-cv-ats",
    "cv-commercial-structure-gagnante",
    "cv-developpeur-2026",
  ],
};

// -----------------------------------------------------------------------
// Article 3 — CV commercial : structure gagnante avec exemple avant/après
// -----------------------------------------------------------------------
const post3: BlogPost = {
  slug: "cv-commercial-structure-gagnante",
  title: "CV commercial : structure gagnante avec exemple avant/après",
  excerpt:
    "Les recruteurs commerciaux cherchent des chiffres. Voici la structure de CV qui parle leur langue, avec un exemple avant/après concret et les KPIs à mettre.",
  category: "Métier",
  readTime: 7,
  publishedAt: "2026-03-28T09:00:00.000Z",
  updatedAt: "2026-04-20T09:00:00.000Z",
  author: DEFAULT_AUTHOR,
  heroImage: UNSPLASH("photo-1600880292203-757bb62b4baf"),
  heroAlt: "Deux personnes se serrant la main dans un contexte professionnel",
  keywords: [
    "CV commercial",
    "CV sales",
    "KPI commercial",
    "CV B2B",
    "CV B2C",
    "Account Manager",
    "Business Developer",
    "chiffres CV",
  ],
  tocHeadings: [
    { id: "attentes", label: "Les attentes d'un recruteur commercial" },
    { id: "structure", label: "Structure d'un CV commercial performant" },
    { id: "kpis", label: "Les KPIs à mettre (CA, % atteinte, pipeline)" },
    { id: "avant-apres", label: "Avant / Après : un exemple concret" },
    { id: "erreurs", label: "Les erreurs fatales à éviter" },
    { id: "secteur", label: "Adapter selon le secteur (B2B vs B2C)" },
  ],
  content: [
    {
      type: "paragraph",
      text: "Un recruteur commercial lit un CV en cherchant une seule chose : est-ce que ce candidat a déjà vendu, à qui, combien, et avec quel taux de réussite ? Le reste — diplômes, soft skills, hobbies — passe en arrière-plan. Un CV commercial sans chiffres, c'est comme un CV de pâtissier sans mention de pâtisserie. Voici comment structurer un CV qui parle la langue des recruteurs commerciaux, avec un exemple concret transformé en direct.",
    },
    {
      type: "heading",
      level: 2,
      id: "attentes",
      text: "Les attentes d'un recruteur commercial",
    },
    {
      type: "paragraph",
      text: "Les recruteurs en sales ont vu passer des milliers de CV commerciaux. Ils ont développé un œil affûté pour repérer, en 10 secondes, si le candidat est un vrai performeur ou quelqu'un qui a fait du commercial « par défaut ». Trois signaux déclenchent leur intérêt : des chiffres concrets (CA, objectifs, nombre de comptes), une progression lisible (junior → senior → manager ou petit comptes → grands comptes), et un vocabulaire de métier maîtrisé (ARR, MRR, pipeline, closing, forecast).",
    },
    {
      type: "paragraph",
      text: "À l'inverse, trois signaux font fuir : des descriptions vagues (« en charge du développement commercial »), aucun chiffre, et un langage administratif (« suivi de la clientèle » au lieu de « gestion d'un portefeuille de 80 comptes B2B, ARR 1,2M€ »). Votre CV doit donc être construit pour déclencher les premiers et éliminer les seconds.",
    },
    {
      type: "heading",
      level: 2,
      id: "structure",
      text: "Structure d'un CV commercial performant",
    },
    {
      type: "paragraph",
      text: "La structure gagnante tient en 5 blocs, dans cet ordre, sur 1 à 2 pages :",
    },
    {
      type: "list",
      style: "numbered",
      items: [
        "En-tête : nom + titre de poste cible (\"Account Executive SaaS B2B\", pas juste \"Commercial\") + coordonnées + LinkedIn.",
        "Accroche / chiffre d'ouverture : 2-3 lignes qui résument votre proposition de valeur avec 1 chiffre fort. Exemple : \"Account Executive SaaS B2B — 7 ans d'expérience, 4M€ de CA signé sur les 3 dernières années, 118% d'atteinte d'objectif en moyenne.\"",
        "Expériences professionnelles : chaque expérience commence par le nom de l'entreprise, le contexte (secteur, taille, produit vendu), puis 3-5 bullets avec CHIFFRES. Pas de description générique.",
        "Compétences : outils (Salesforce, HubSpot, Outreach, Gong), méthodo (MEDDIC, SPIN, Challenger Sale), langues.",
        "Formation : titre + école + année. Court. Les recruteurs sales s'en fichent un peu, sauf écoles top tier.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "L'accroche chiffrée, c'est votre pitch de 3 secondes",
      text: "Un recruteur commercial qui voit \"7 ans d'exp, 4M€ de CA, 118% atteinte d'objectif\" en haut de CV est déjà en train de lire la suite avec intérêt. Sans accroche chiffrée, vous comptez sur le fait qu'il lira vos expériences en détail — ce qui arrive rarement.",
    },
    {
      type: "heading",
      level: 2,
      id: "kpis",
      text: "Les KPIs à mettre (CA, % atteinte, pipeline)",
    },
    {
      type: "paragraph",
      text: "Un CV commercial sans KPIs, c'est comme une présentation de résultats Q4 sans slides. Les recruteurs en cherchent 4 principaux, par ordre d'importance :",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        "CA signé / ARR généré : en euros, sur une période précise. Exemple : \"2,3M€ d'ARR signé sur 2024, incluant 3 deals > 200k€.\"",
        "% d'atteinte d'objectif : le plus parlant. \"118% d'atteinte en moyenne sur les 3 dernières années\" est beaucoup plus fort qu'un CA brut isolé.",
        "Nombre de clients / logos / comptes : \"Portefeuille de 45 comptes B2B, dont 8 grands comptes (> 100k€ ARR)\".",
        "Pipeline / volume d'activité : \"Pipeline moyen de 3M€, 40 opportunités actives en permanence\". Utile pour les postes qui misent sur la capacité à gérer du volume (SDR, BDR, Inside Sales).",
      ],
    },
    {
      type: "paragraph",
      text: "Pour les commerciaux en début de carrière sans gros CA à mettre en avant, rabattez-vous sur les KPIs d'activité : nombre d'appels sortants / semaine, taux de transformation lead-to-meeting, nombre de démos réalisées. Un SDR qui écrit « 80 appels/jour, 12 meetings/semaine, taux de transformation lead-to-demo de 18% » dit plus sur sa performance qu'un simple « prospection active ».",
    },
    {
      type: "heading",
      level: 2,
      id: "avant-apres",
      text: "Avant / Après : un exemple concret",
    },
    {
      type: "paragraph",
      text: "Prenons une expérience mal rédigée, typique sur LinkedIn et dans les CV qui nous sont envoyés. Voici la version « avant », vague et interchangeable :",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Avant — version floue",
      text: "Commercial chez Acme SaaS (2022-2024) — En charge du développement commercial auprès des grands comptes. Prospection, négociation, closing. Suivi de la relation client et fidélisation. Reporting régulier à la direction.",
    },
    {
      type: "paragraph",
      text: "Même poste, même personne, version « après » réécrite avec des chiffres et un vocabulaire de métier :",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Après — version chiffrée",
      text: "Account Executive Enterprise chez Acme SaaS — SaaS B2B RH, équipe 40 personnes, 8M€ ARR. Portefeuille de 25 grands comptes (entre 50k€ et 300k€ ARR). 2,1M€ d'ARR signé en 2024 (122% d'atteinte d'objectif), dont 3 deals > 200k€. Pipeline moyen 3,5M€. Outils : Salesforce, Outreach, Gong, LinkedIn Sales Navigator. Méthodo MEDDIC.",
    },
    {
      type: "paragraph",
      text: "La deuxième version est 3 fois plus longue mais elle se lit plus vite — parce que le recruteur y trouve immédiatement ce qu'il cherche. Le message est clair, la crédibilité est établie, et l'envie d'aller plus loin est déclenchée.",
    },
    {
      type: "cta",
      title: "Un CV commercial qui parle chiffres, en 30 secondes",
      text: "Collez l'URL d'une offre commerciale, CV Modifier intègre les KPIs pertinents, adapte le vocabulaire (SaaS, B2B, Enterprise) et optimise pour les ATS commerciaux (Salesforce Work.com, Greenhouse, Lever).",
      ctaLabel: "Essayer gratuitement",
      ctaHref: "/creer-cv",
    },
    {
      type: "heading",
      level: 2,
      id: "erreurs",
      text: "Les erreurs fatales à éviter",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        "Rester vague : \"développement commercial\", \"gestion de portefeuille\", \"relation client\" sans aucun chiffre. C'est le piège numéro un.",
        "Pas de chiffres : un CV commercial sans un seul chiffre est éliminé en 5 secondes. Si vous n'avez pas accès aux chiffres exacts, donnez des ordres de grandeur (\"portefeuille ~40 comptes\", \"CA signé entre 1M€ et 2M€\").",
        "CV trop court : un commercial avec 5 ans d'expérience qui tient sur 3 lignes par poste signale un manque de résultats à montrer, pas une capacité de synthèse. Allez sur 2 pages si nécessaire.",
        "Vocabulaire flou ou mauvais niveau : parler de \"CA\" quand on vend du SaaS (où on parle d'ARR / MRR), ou inversement. Ça décrédibilise.",
        "Mélanger secteurs sans contextualiser : si vous avez vendu du logiciel RH puis de l'assurance, explicitez pourquoi c'est cohérent — ou positionnez clairement votre cible actuelle.",
      ],
    },
    {
      type: "heading",
      level: 2,
      id: "secteur",
      text: "Adapter le CV selon le secteur (B2B vs B2C, SaaS vs industrie)",
    },
    {
      type: "paragraph",
      text: "Tous les CV commerciaux ne se ressemblent pas. Le vocabulaire et les KPIs varient fortement selon le secteur — et un CV qui mélange les codes passe pour celui d'un candidat peu spécialisé :",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        "SaaS B2B : ARR, MRR, pipeline, cycle de vente, CAC, churn, upsell, expansion, logos, MEDDIC / Challenger. Outils : Salesforce, HubSpot, Outreach, Gong, Chorus, Apollo.",
        "Industrie / grands comptes : CA annuel, taille de portefeuille, nombre de gros contrats, durée des cycles (12-24 mois), réponses aux appels d'offres. Vocabulaire plus formel.",
        "Retail / B2C : volume de ventes, panier moyen, taux de conversion, trafic magasin, upsell en caisse, NPS. Outils : ERP, caisse, CRM grand public type Zendesk.",
        "Assurance / banque : encours, production nette, taux de rétention, MIF II / DDA pour les réglementaires, points de vente, diversification gamme.",
      ],
    },
    {
      type: "paragraph",
      text: "Le principe reste le même : des chiffres, du vocabulaire de métier, une progression visible. Pour aller plus loin, voyez notre guide <a href=\"/adapter-cv-offre-emploi\" class=\"text-blue-600 hover:underline font-medium\">adapter son CV à une offre d'emploi</a> — et pour les filtres automatiques des grands groupes qui embauchent des commerciaux, notre page <a href=\"/cv-ats\" class=\"text-blue-600 hover:underline font-medium\">CV ATS</a> détaille ce qu'il faut savoir.",
    },
  ],
  faq: [
    {
      q: "Que faire si mon employeur m'interdit de donner des chiffres précis ?",
      a: "Donnez des ordres de grandeur ou des ratios. \"CA signé > 1M€\", \"portefeuille d'environ 40 comptes\", \"atteinte d'objectif entre 110 et 130% sur 3 ans\". Vous montrez la performance sans révéler d'infos confidentielles. La clause de confidentialité est standard et les recruteurs comprennent.",
    },
    {
      q: "Je débute dans le commercial, que mettre à la place des KPIs ?",
      a: "Misez sur les KPIs d'activité : nombre d'appels, emails, meetings, démos par semaine. Mentionnez les taux de conversion à chaque étape (lead → meeting → démo → signature) si vous les avez. Ajoutez vos ramp-up times (temps pour atteindre le quota) comme preuve de rapidité d'apprentissage.",
    },
    {
      q: "Faut-il une accroche de 2 lignes en haut du CV commercial ?",
      a: "Oui, absolument. Elle sert de pitch de 3 secondes. Format type : \"[Titre poste cible] — [X années] d'expérience en [secteur précis]. [Chiffre fort]. [Spécialité distinctive : produit, taille de deal, méthodo].\" Sans accroche, vous perdez 30% de vos lecteurs dès la première section.",
    },
    {
      q: "LinkedIn ou CV, quel est le plus important pour un commercial ?",
      a: "Les deux sont lus. LinkedIn sert au sourcing (le recruteur vous trouve), le CV sert à la short-list (le recruteur vous propose). Gardez-les cohérents : mêmes chiffres, mêmes outils, même positionnement. Un commercial avec un LinkedIn riche mais un CV vide se disqualifie tout seul.",
    },
    {
      q: "Combien de pages pour un CV commercial avec 10+ ans d'expérience ?",
      a: "2 pages maximum. Au-delà de 10 ans, condensez les expériences anciennes (bullet point unique pour les postes de plus de 10 ans) et détaillez les 3 dernières. Les recruteurs veulent voir vos 3 derniers postes en détail, le reste en contexte.",
    },
  ],
  relatedSlugs: [
    "10-erreurs-cv-ats",
    "mots-cles-offre-emploi",
    "lettre-motivation-ia-credible",
  ],
};

// -----------------------------------------------------------------------
// Article 4 — CV développeur : passer les filtres tech en 2026
// -----------------------------------------------------------------------
const post4: BlogPost = {
  slug: "cv-developpeur-2026",
  title: "CV développeur : passer les filtres tech en 2026",
  excerpt:
    "Stack technique, projets perso, GitHub, buzzwords : ce qu'un recruteur tech cherche vraiment sur un CV de dev en 2026, et comment ne pas se griller sur les détails.",
  category: "Métier",
  readTime: 7,
  publishedAt: "2026-03-20T09:00:00.000Z",
  updatedAt: "2026-04-15T09:00:00.000Z",
  author: DEFAULT_AUTHOR,
  heroImage: UNSPLASH("photo-1555066931-4365d14bab8c"),
  heroAlt: "Écran d'ordinateur affichant du code source en développement",
  keywords: [
    "CV développeur",
    "CV dev",
    "CV programmeur",
    "stack technique",
    "GitHub CV",
    "CV tech",
    "open source CV",
    "buzzwords IT",
  ],
  tocHeadings: [
    { id: "attentes-tech", label: "Ce que les recruteurs tech cherchent vraiment" },
    { id: "stack", label: "La section Stack technique : comment l'organiser" },
    { id: "projets-perso", label: "Valoriser projets perso et open-source" },
    { id: "buzzwords", label: "Le piège des buzzwords (React 19, IA, …)" },
    { id: "certifs", label: "Les certifications qui comptent" },
    { id: "liens", label: "Lier GitHub, LinkedIn, portfolio" },
  ],
  content: [
    {
      type: "paragraph",
      text: "Les CV de développeurs sont les plus lus par des pairs. Le tech lead, l'engineering manager ou le CTO qui scanne votre CV n'est pas dupe : il voit en 10 secondes si votre stack est cohérente, si vos projets tiennent la route, et si vos buzzwords sont légitimes. En 2026, avec l'explosion des outils IA et le retour des recrutements tech, les attendus ont évolué. Voici ce qui marche — et ce qui se voit immédiatement.",
    },
    {
      type: "heading",
      level: 2,
      id: "attentes-tech",
      text: "Ce que les recruteurs tech cherchent vraiment",
    },
    {
      type: "paragraph",
      text: "Contrairement à un recruteur sales ou marketing, un recruteur tech (souvent un dev senior, un EM ou un CTO) lit votre CV pour répondre à 4 questions dans l'ordre : (1) sa stack correspond-elle à la nôtre ? (2) a-t-il travaillé sur des projets d'échelle comparable ? (3) est-ce qu'il continue à apprendre (projets perso, contribs, veille) ? (4) est-ce qu'il aura la culture de code propre qu'on attend ?",
    },
    {
      type: "paragraph",
      text: "Les ATS tech (Greenhouse, Lever, Workable) matchent d'abord sur la stack. Si l'offre demande React + Node.js + Postgres et que votre CV parle de Vue + PHP + MySQL, vous êtes éliminé avant lecture humaine. Il ne s'agit pas de mentir : il s'agit de bien présenter votre stack pour qu'elle soit correctement parsée.",
    },
    {
      type: "heading",
      level: 2,
      id: "stack",
      text: "La section \"Stack technique\" : comment l'organiser",
    },
    {
      type: "paragraph",
      text: "Une section stack bien organisée, c'est 3 à 5 sous-catégories nommées explicitement. Pas un fourre-tout de 40 technos alignées. Format qui fonctionne bien :",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        "Langages : TypeScript, Python, Go, SQL.",
        "Frontend : React, Next.js 16, Tailwind CSS, Radix UI.",
        "Backend : Node.js, FastAPI, PostgreSQL, Redis.",
        "Infra / DevOps : Docker, GitHub Actions, AWS (ECS, S3, Lambda), Terraform.",
        "Outils : Git, Linear, Figma, Cursor, Sentry.",
      ],
    },
    {
      type: "paragraph",
      text: "Deux erreurs fréquentes à éviter : (1) Mettre des niveaux de compétence graphiques (jauges 80%, étoiles). Ça ne veut rien dire et les recruteurs le savent. (2) Lister 30 technos dont vous n'avez fait que le tutoriel officiel. Un dev senior repère ça en 2 secondes et ça vous décrédibilise pour l'entretien.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "La règle des 5 minutes",
      text: "Ne listez dans votre stack que les technos sur lesquelles vous pouvez tenir une discussion de 5 minutes avec un expert sans paniquer. Si vous avez fait une POC en Rust il y a 2 ans et plus rien depuis : laissez tomber. Mieux vaut 10 technos solides que 30 approximatives.",
    },
    {
      type: "heading",
      level: 2,
      id: "projets-perso",
      text: "Valoriser projets perso et open-source",
    },
    {
      type: "paragraph",
      text: "Les projets perso sont souvent le critère qui fait basculer un recruteur entre \"OK sur le papier\" et \"vraiment envie d'en parler en entretien\". Ils montrent la curiosité, l'autonomie, la capacité à livrer sans filet. En 2026, avec les outils IA qui accélèrent le dev, ne pas avoir un projet perso récent est un signal négatif, pas neutre.",
    },
    {
      type: "paragraph",
      text: "Pour qu'un projet perso compte vraiment, il doit cocher 3 cases : (1) il est en ligne (URL publique + code source), (2) il résout un problème précis (pas un énième clone de Todo App), (3) il montre un choix technique intéressant à raconter. Format de présentation efficace :",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        "Nom du projet — 1 phrase de description (ce que ça fait + pour qui). Exemple : \"TrackTrip — App mobile de suivi de road trips avec synchro offline, utilisée par 1 200 personnes.\"",
        "Stack : TypeScript, React Native, Expo, Supabase.",
        "Lien : github.com/votre-user/projet + éventuellement URL live.",
      ],
    },
    {
      type: "paragraph",
      text: "Côté open-source, même logique. Mentionnez les contributions significatives (merge d'une PR non triviale, maintainer d'un repo qui a des étoiles, participation récurrente à un projet connu). Évitez les PR cosmétiques (typos, docs) : ça se voit sur votre profil GitHub et ça fait \"je gonfle mon CV\".",
    },
    {
      type: "heading",
      level: 2,
      id: "buzzwords",
      text: "Le piège des buzzwords (React 19, Next.js 16, IA, …)",
    },
    {
      type: "paragraph",
      text: "En 2026, certains mots reviennent dans tous les CV de dev : IA / LLM, React 19, Next.js 16, Edge computing, microservices, event-driven, serverless. Le problème : un mot-clé sans contexte se voit immédiatement. Un recruteur tech compare votre ligne \"Intégration de LLMs en production\" avec vos expériences datées — si vous avez quitté votre dernier poste en 2023 avant l'explosion des LLMs, la ligne est suspecte.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Buzzword vs crédibilité : le test du \"comment tu l'as utilisé\"",
      text: "Avant de mettre un buzzword dans votre CV, vérifiez que vous pouvez répondre en 2 phrases à la question : \"Concrètement, tu l'as utilisé comment, sur quoi, avec quelle stack ?\" Si votre réponse est floue, enlevez le buzzword. Le dev qui pose la question saura.",
    },
    {
      type: "paragraph",
      text: "Ce qui marche en 2026 : mentionner un buzzword uniquement quand il est ancré dans une expérience concrète. \"Intégration d'une API LLM pour l'adaptation automatique de contenu (cache prompt, streaming, gestion des erreurs)\" est crédible. \"Expérience LLM / IA générative\" en solo dans une liste de compétences ne l'est pas.",
    },
    {
      type: "heading",
      level: 2,
      id: "certifs",
      text: "Les certifications qui comptent (AWS, Azure, GCP — ou pas)",
    },
    {
      type: "paragraph",
      text: "Toutes les certifications ne se valent pas. Certaines sont regardées, d'autres polluent le CV. En 2026, le classement utile :",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        "Regardées (recommandées si vous les avez) : AWS Solutions Architect Associate/Professional, AWS DevOps Engineer, GCP Professional Cloud Architect, Azure Administrator Associate, Kubernetes CKA / CKAD, HashiCorp Terraform Associate.",
        "Neutres : OpenClassrooms, Coursera, Udemy (mentionnez le sujet et la durée, pas le titre pompeux du certificat). Elles prouvent surtout la motivation.",
        "À éviter (effet contre-productif) : certifs commerciales gratuites type \"HubSpot Academy\" sauf si très liées au poste, ou certifs de concepts basiques (\"Certified HTML Developer\").",
      ],
    },
    {
      type: "paragraph",
      text: "Un dev sans certification mais avec 5 ans d'expérience solide passe devant un dev junior multi-certifié. Les certifs comptent, mais elles ne remplacent pas l'expérience.",
    },
    {
      type: "heading",
      level: 2,
      id: "liens",
      text: "Lier GitHub, LinkedIn, portfolio (et bien le faire)",
    },
    {
      type: "paragraph",
      text: "Un CV de dev sans lien GitHub, en 2026, c'est suspect. Au minimum : LinkedIn + GitHub. Idéalement : ajoutez un portfolio ou un blog tech personnel. Mais attention au piège : vos liens DOIVENT être propres. Si votre GitHub n'a pas été touché depuis 2 ans, pas de lien. Si votre dernière activité est une PR abandonnée, nettoyez avant de partager.",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        "GitHub : épinglez 4 à 6 repos qui montrent votre meilleur code. README clairs, commits récents sur au moins un repo.",
        "LinkedIn : header clair, description alignée avec votre CV, recommandations de collègues/anciens managers.",
        "Portfolio / blog : optionnel mais fort différenciateur. 3-5 articles techniques substantiels valent plus que 30 posts LinkedIn superficiels.",
      ],
    },
    {
      type: "cta",
      title: "Un CV dev optimisé ATS, en 30 secondes",
      text: "CV Modifier adapte votre CV de dev à chaque offre tech — stack pertinente au sommet, mots-clés critiques intégrés, projets perso mis en valeur si l'offre les valorise.",
      ctaLabel: "Essayer gratuitement",
      ctaHref: "/creer-cv",
    },
    {
      type: "paragraph",
      text: "Un bon CV dev en 2026 est un CV qu'un tech lead peut parcourir en 30 secondes et à la suite duquel il a envie de discuter technique avec vous. Pour les bases de l'ATS-compatibilité — qui valent aussi pour les CV tech — notre guide <a href=\"/cv-ats\" class=\"text-blue-600 hover:underline font-medium\">CV ATS</a> est le complément direct de cet article. Et pour l'adapter à chaque offre automatiquement, <a href=\"/adapter-cv-offre-emploi\" class=\"text-blue-600 hover:underline font-medium\">CV Modifier</a> fait le job.",
    },
  ],
  faq: [
    {
      q: "Faut-il mentionner Copilot / Cursor / assistants IA dans son CV de dev ?",
      a: "Oui, c'est devenu standard en 2026. Mentionnez les outils IA dans la section \"Outils\" de votre stack (Cursor, GitHub Copilot, ou l'équivalent que vous utilisez). Certaines offres le demandent explicitement. Ne mettez pas \"utilisation de l'IA\" comme compétence isolée — c'est comme mettre \"utilisation de Google\".",
    },
    {
      q: "Mon CV dev doit-il tenir sur 1 page ?",
      a: "Non, 2 pages sont parfaitement acceptables à partir de 3-4 ans d'expérience. Les recruteurs tech préfèrent un CV dense en 2 pages qu'un CV squeezé en 1 qui élide les projets intéressants. Au-delà de 10 ans, condensez les premières expériences.",
    },
    {
      q: "Dois-je mettre mes projets scolaires dans mon CV junior ?",
      a: "Oui si (a) vous êtes junior avec peu d'expérience pro, (b) le projet est substantiel (3+ mois, livrable concret), (c) vous pouvez en parler 10 minutes en entretien. Mettez-le en section \"Projets\" distincte de \"Expérience pro\", pas au même niveau.",
    },
    {
      q: "Les CV avec design très créatif (Figma, custom) pénalisent en tech ?",
      a: "Oui, plus qu'ailleurs. Les recruteurs tech valorisent la clarté. Un CV avec graphiques de compétences, photos stylisées, couleurs agressives signale soit un candidat qui compense un manque technique, soit un manque de culture du métier. Restez sobre : texte clair, hiérarchie visuelle propre, pas de gimmicks.",
    },
    {
      q: "Mon GitHub est vide, je mets quoi ?",
      a: "Pas de lien GitHub vide dans un CV — c'est pire que pas de lien. Solutions : (a) passer un week-end à créer un projet perso concret, (b) contribuer à un repo open-source même modestement (doc, traduction, test), (c) transformer un projet boulot en repo public (avec autorisation) et l'épingler. Sans GitHub actif, misez sur les projets décrits en détail dans les expériences.",
    },
  ],
  relatedSlugs: [
    "10-erreurs-cv-ats",
    "mots-cles-offre-emploi",
    "lettre-motivation-ia-credible",
  ],
};

// -----------------------------------------------------------------------
// Article 5 — Lettre de motivation générée par IA : comment la rendre crédible
// -----------------------------------------------------------------------
const post5: BlogPost = {
  slug: "lettre-motivation-ia-credible",
  title: "Lettre de motivation générée par IA : comment la rendre crédible",
  excerpt:
    "Les lettres de motivation écrites par IA se reconnaissent en 5 secondes. Voici les 5 tics à traquer et la méthode Vous/Moi/Nous pour rendre une lettre IA crédible.",
  category: "IA",
  readTime: 6,
  publishedAt: "2026-03-12T09:00:00.000Z",
  updatedAt: "2026-04-12T09:00:00.000Z",
  author: DEFAULT_AUTHOR,
  heroImage: UNSPLASH("photo-1586281380349-632531db7ed4"),
  heroAlt: "Main écrivant sur un carnet avec un stylo dans un bureau",
  keywords: [
    "lettre motivation IA",
    "lettre ChatGPT",
    "lettre IA générative",
    "lettre crédible",
    "personnaliser lettre IA",
    "Vous Moi Nous",
    "tics IA",
  ],
  tocHeadings: [
    { id: "pourquoi-sentent-ia", label: "Pourquoi les lettres IA sentent l'IA" },
    { id: "5-tics", label: "Les 5 tics de l'IA à traquer" },
    { id: "vous-moi-nous", label: "Structurer en Vous / Moi / Nous" },
    { id: "personnaliser", label: "Personnaliser avec des éléments concrets" },
    { id: "relecture", label: "La relecture humaine : 3 checks essentiels" },
  ],
  content: [
    {
      type: "paragraph",
      text: "En 2026, la quasi-totalité des candidats utilisent une IA à un moment ou un autre pour rédiger leur lettre de motivation. ChatGPT, Gemini, ou les générateurs spécialisés comme CV Modifier. Les recruteurs, eux, ont appris à repérer une lettre 100% IA en quelques secondes. Et quand c'est trop visible, ça signale au mieux un manque d'investissement, au pire un candidat qui triche. Voici comment écrire une lettre assistée par IA qui passe inaperçue, parce qu'elle sonne simplement humaine.",
    },
    {
      type: "heading",
      level: 2,
      id: "pourquoi-sentent-ia",
      text: "Pourquoi les lettres IA sentent l'IA",
    },
    {
      type: "paragraph",
      text: "Une IA génère des lettres qui partagent 3 caractéristiques : elles sont grammaticalement parfaites, elles sont structurées de façon très symétrique (3 paragraphes de longueur similaire), et elles utilisent un vocabulaire formel légèrement vieilli. Prises séparément, ces caractéristiques ne posent pas de problème. Cumulées, elles créent un style reconnaissable qu'on appelle en interne le « style GPT ».",
    },
    {
      type: "paragraph",
      text: "Ce style apparaît parce que les LLMs sont entraînés sur des corpus moyens. Quand vous demandez « rédige une lettre de motivation pour ce poste », le modèle sort ce que serait une lettre moyenne selon tout ce qu'il a lu — ce qui ressemble à tout ce que les recruteurs ont déjà vu. Pour se démarquer, il faut casser cette moyenne.",
    },
    {
      type: "heading",
      level: 2,
      id: "5-tics",
      text: "Les 5 tics de l'IA à traquer",
    },
    {
      type: "paragraph",
      text: "Cinq formulations reviennent dans 90% des lettres IA. Dès qu'un recruteur en voit 2 dans la même lettre, il décroche. Supprimez-les toutes :",
    },
    {
      type: "list",
      style: "numbered",
      items: [
        "\"Je suis ravi(e) d'avoir l'opportunité de postuler…\" — remplacer par \"Je postule au poste de X parce que Y.\". Direct.",
        "\"Fort(e) de mon expérience dans le domaine de…\" — trop formel, trop vague. Remplacer par \"J'ai X années d'expérience en Y, notamment chez [entreprise].\".",
        "\"C'est avec grand intérêt que j'ai pris connaissance de votre offre…\" — cliché absolu. Enlevez-la complètement, allez direct au sujet.",
        "\"Je me permets de vous soumettre ma candidature…\" — ton excessivement déférent des années 90. Remplacer par \"Je candidate au poste de…\".",
        "\"Je suis persuadé(e) que mes compétences correspondent parfaitement…\" — l'auto-éloge vide. Remplacer par un fait précis : \"Mon expérience sur [outil/sujet X] recoupe directement ce que l'offre décrit au point Y.\".",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "Le test du Ctrl+F",
      text: "Avant d'envoyer, faites Ctrl+F sur votre lettre et cherchez : « ravi », « fort de », « grand intérêt », « me permets », « persuadé ». Si vous trouvez un seul de ces termes, réécrivez la phrase. Aucune exception.",
    },
    {
      type: "heading",
      level: 2,
      id: "vous-moi-nous",
      text: "Structurer en Vous / Moi / Nous",
    },
    {
      type: "paragraph",
      text: "C'est le cadre classique de la lettre de motivation, et il reste le meilleur antidote au style IA parce qu'il force la personnalisation à chaque paragraphe. Trois paragraphes, trois angles différents :",
    },
    {
      type: "list",
      style: "numbered",
      items: [
        "Vous : ce qui vous attire spécifiquement chez l'entreprise / le poste. Pas \"votre entreprise leader sur son marché\" (générique) mais \"votre récent lancement de [produit X] / votre prise de position publique sur [sujet Y] / votre approche [Z] que je suis depuis [date]\". Concret, vérifiable, spécifique.",
        "Moi : ce que vous apportez de précis, avec chiffres ou faits. \"J'ai mené un projet similaire chez [entreprise], avec [résultat chiffré].\" — pas de liste de compétences générique.",
        "Nous : ce que vous voulez construire ensemble. Courte projection sur ce que vous imaginez faire les 6 premiers mois dans ce poste, ou une question précise à discuter en entretien.",
      ],
    },
    {
      type: "paragraph",
      text: "Un paragraphe de 4-6 lignes chacun. Pas plus. La lettre de motivation idéale en 2026 tient en 15-20 lignes — le recruteur y passe moins de 30 secondes. Ce qui n'est pas dans cet intervalle ne sera pas lu.",
    },
    {
      type: "heading",
      level: 2,
      id: "personnaliser",
      text: "Personnaliser avec des éléments concrets de l'offre",
    },
    {
      type: "paragraph",
      text: "La différence entre une lettre IA brute et une lettre crédible tient souvent à 3-4 détails précis. L'IA génère un canevas, vous le personnalisez avec des éléments que seul un humain qui a vraiment lu l'offre peut ajouter :",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        "Le nom de la personne qui recrute si vous l'avez trouvé (LinkedIn, signature de l'offre). \"Bonjour Marie\" au lieu de \"Madame, Monsieur\" fait un saut énorme en crédibilité.",
        "Une mission très précise de l'offre, recopiée partiellement. \"L'offre mentionne le chantier de migration vers Postgres 17 — c'est exactement le type de projet que j'ai piloté chez [précédent employeur].\"",
        "Une info spécifique à l'entreprise glanée ailleurs : un article récent, un post LinkedIn du CEO, une annonce de levée de fonds. \"Votre récente série B orientée [marché X] correspond au segment où j'ai le plus d'expérience.\"",
        "Une question précise de fin de lettre. Pas \"dans l'attente de votre retour\" mais \"Je serais ravi de vous expliquer en 15 minutes comment j'aborderais la refonte de [module Y] mentionnée dans l'offre.\"",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Règle pratique : 3 détails minimum",
      text: "Objectif : au moins 3 détails concrets et vérifiables dans votre lettre, qui ne pourraient pas être dans la lettre d'un autre candidat. Si votre lettre pourrait être envoyée à 10 entreprises en changeant juste le nom, elle ne convertira pas.",
    },
    {
      type: "cta",
      title: "Lettre de motivation personnalisée, générée par CV Modifier",
      text: "Notre générateur adapte la lettre à l'offre avec vos expériences concrètes, évite les tics IA par défaut, et vous laisse toujours la main pour l'éditer avant envoi.",
      ctaLabel: "Essayer gratuitement",
      ctaHref: "/lettre-motivation-ia",
    },
    {
      type: "heading",
      level: 2,
      id: "relecture",
      text: "La relecture humaine : 3 checks essentiels",
    },
    {
      type: "paragraph",
      text: "Avant d'envoyer, 3 checks obligatoires qui prennent 5 minutes et changent tout :",
    },
    {
      type: "list",
      style: "numbered",
      items: [
        "Lire à voix haute. Les phrases robotiques se repèrent immédiatement à l'oral. Si vous butez, ça sonne faux — réécrivez. Les humains ne disent pas « Dans la continuité de mon parcours professionnel ».",
        "Vérifier les faits. L'IA hallucine parfois des détails sur l'entreprise (\"votre filiale en Allemagne\", \"votre partenariat avec X\"). Avant d'envoyer, validez chaque affirmation concrète qui concerne l'employeur.",
        "Imposer une phrase personnelle. Une seule. Qui ne ressemble à aucune lettre standard. Exemple : \"En vrai, ce qui m'a accroché dans votre offre, c'est [détail très précis] — c'est rare de voir ça formulé aussi clairement par une entreprise.\" Cette phrase casse le rythme IA et signe votre voix.",
      ],
    },
    {
      type: "paragraph",
      text: "Une lettre IA bien retouchée vaut largement une lettre 100% manuelle — voire mieux, parce que la structure est propre et les fautes d'orthographe éliminées. Mais elle ne doit jamais sortir telle quelle. L'IA est votre premier brouillon, jamais votre version finale. Pour creuser le sujet, voyez notre page complète <a href=\"/lettre-motivation-ia\" class=\"text-blue-600 hover:underline font-medium\">lettre de motivation par IA</a>, et pour que votre CV accompagne bien la lettre, notre guide <a href=\"/adapter-cv-offre-emploi\" class=\"text-blue-600 hover:underline font-medium\">adapter son CV à l'offre</a> reste la référence.",
    },
  ],
  faq: [
    {
      q: "Les recruteurs utilisent-ils des détecteurs d'IA sur les lettres ?",
      a: "Très peu en 2026, et les détecteurs existants sont peu fiables (faux positifs élevés). Le vrai risque, ce n'est pas la détection automatique, c'est l'œil humain entraîné qui repère le \"style GPT\" en 5 secondes. Personnaliser reste la meilleure défense — et de loin.",
    },
    {
      q: "Une lettre courte (5 lignes) passe-t-elle mieux qu'une lettre classique ?",
      a: "Oui dans la plupart des cas, à condition d'être dense. Un email de candidature de 5 lignes bien écrites + CV joint convertit souvent mieux qu'une lettre d'une page générique. Sauf candidature formelle (administration, secteur public, grands cabinets) où la lettre complète reste attendue.",
    },
    {
      q: "Doit-on mentionner qu'on a utilisé une IA pour rédiger sa lettre ?",
      a: "Non. Comme on ne mentionne pas qu'on a utilisé Word, Grammarly ou un dictionnaire. L'IA est un outil d'écriture. Ce qui compte, c'est que le contenu final vous représente fidèlement et soit personnalisé — pas le process.",
    },
    {
      q: "Peut-on réutiliser la même lettre en changeant juste le nom de l'entreprise ?",
      a: "Technique possible mais très visible pour les recruteurs. Vous perdez la spécificité qui fait la valeur d'une lettre. Préférez un \"squelette\" de lettre (votre paragraphe Moi reste stable) et adaptez à chaque fois les parties Vous et Nous. Ça prend 5 minutes.",
    },
    {
      q: "Dois-je inclure un chiffre ou un résultat concret dans ma lettre ?",
      a: "Oui, au moins un. Les chiffres concrets sont le signe le plus fort d'authenticité dans une lettre (l'IA, par défaut, évite les chiffres trop précis qu'elle pourrait halluciner). Un chiffre qui relie votre expérience à la mission de l'offre vaut 10 phrases génériques.",
    },
  ],
  relatedSlugs: [
    "cv-commercial-structure-gagnante",
    "cv-developpeur-2026",
    "mots-cles-offre-emploi",
  ],
};

// -----------------------------------------------------------------------
// Article 6 — Faut-il mettre une photo sur son CV en 2026 ?
// -----------------------------------------------------------------------
const post6: BlogPost = {
  slug: "photo-cv-2026",
  title: "Faut-il mettre une photo sur son CV en 2026 ? (guide)",
  excerpt:
    "Photo ou pas photo sur un CV français en 2026 ? Les règles ont changé. Voici ce que disent le Défenseur des droits, les recruteurs et les ATS — avec la décision concrète à prendre par profil.",
  category: "Méthode",
  readTime: 6,
  publishedAt: "2026-03-05T09:00:00.000Z",
  updatedAt: "2026-04-18T09:00:00.000Z",
  author: DEFAULT_AUTHOR,
  heroImage: UNSPLASH("photo-1494790108377-be9c29b29330"),
  heroAlt: "Portrait professionnel d'une candidate en tenue formelle devant un mur clair",
  keywords: [
    "photo CV",
    "photo CV obligatoire",
    "photo CV 2026",
    "discrimination CV",
    "CV anonyme",
    "photo professionnelle CV",
    "CV international",
  ],
  tocHeadings: [
    { id: "etat-des-lieux", label: "Photo sur CV : état des lieux en France" },
    { id: "que-dit-la-loi", label: "Ce que dit la loi et le Défenseur des droits" },
    { id: "pour-contre", label: "Les arguments pour et contre" },
    { id: "par-profil", label: "La décision par profil (junior, expérimenté, cadre)" },
    { id: "international", label: "Et si vous candidatez à l'étranger ?" },
    { id: "si-vous-mettez", label: "Si vous décidez de mettre une photo : les règles" },
    { id: "alternatives", label: "Les alternatives à la photo classique" },
  ],
  content: [
    {
      type: "paragraph",
      text: "C'est une des questions les plus posées sur les forums carrière : doit-on encore mettre une photo sur son CV en France en 2026 ? Réponse courte : non, plus du tout obligatoire, et de moins en moins recommandée. Réponse longue : ça dépend du poste, du secteur et du pays. Voici le cadre complet pour décider en connaissance de cause — sans le flou habituel.",
    },
    {
      type: "heading",
      level: 2,
      id: "etat-des-lieux",
      text: "Photo sur CV : état des lieux en France",
    },
    {
      type: "paragraph",
      text: "La France reste un des rares pays d'Europe occidentale où la photo sur CV est encore culturellement courante. Selon un sondage APEC publié en 2023, environ 55% des cadres français mettent encore une photo sur leur CV, contre moins de 5% au Royaume-Uni ou aux États-Unis. Mais cette proportion baisse chaque année — elle était de 75% en 2015. Les services RH des grandes entreprises recommandent de plus en plus à leurs managers d'anonymiser les candidatures pour limiter les biais inconscients.",
    },
    {
      type: "paragraph",
      text: "Autrement dit : la photo n'est plus la norme, elle devient une exception. Et quand une photo exceptionnelle apparaît sur un CV, elle attire l'attention — pour de bonnes ou de mauvaises raisons. La question n'est donc plus « faut-il en mettre une » mais « est-ce que ma photo m'aide ou me dessert ? ».",
    },
    {
      type: "heading",
      level: 2,
      id: "que-dit-la-loi",
      text: "Ce que dit la loi et le Défenseur des droits",
    },
    {
      type: "paragraph",
      text: "La photo sur CV n'est et n'a jamais été obligatoire en droit français. Le Code du travail (art. L1132-1) interdit toute discrimination à l'embauche fondée sur l'apparence physique, l'origine, l'âge ou le sexe. Le Défenseur des droits, dans ses recommandations publiques, préconise explicitement de ne pas inclure de photo sur son CV pour éviter les discriminations inconscientes. Source : <a href=\"https://www.defenseurdesdroits.fr\" class=\"text-blue-600 hover:underline font-medium\">defenseurdesdroits.fr</a>.",
    },
    {
      type: "paragraph",
      text: "Côté recruteur, afficher une photo expose l'entreprise à des accusations de discrimination si la candidature est écartée. Plusieurs grands groupes (BNP Paribas, L'Oréal, la Ville de Paris) ont lancé des programmes de CV anonymes depuis 2015. En clair : demander une photo n'est pas une pratique légalement encadrée, et ne pas en mettre ne vous disqualifie pas — sauf exception explicite mentionnée dans l'offre.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Exceptions légales où la photo se justifie",
      text: "Les métiers où l'apparence fait partie intrinsèque du poste peuvent légalement exiger une photo : mannequinat, comédien, hôte/hôtesse d'accueil premium. Pour tout le reste, la photo n'a aucun lien avec la performance attendue.",
    },
    {
      type: "heading",
      level: 2,
      id: "pour-contre",
      text: "Les arguments pour et contre",
    },
    {
      type: "paragraph",
      text: "Les arguments se sont inversés ces dernières années. Voici le match tel qu'il se présente en 2026 :",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        "Pour la photo : crée une connexion humaine rapide, aide à être mémorisé dans une short-list longue, montre une image professionnelle soignée, attendue culturellement dans certains secteurs traditionnels (banque, notariat, luxe, hôtellerie haut de gamme).",
        "Contre la photo : expose à des biais inconscients (âge, origine, apparence), illisible pour les ATS, inutile pour les postes techniques (dev, data, ingénierie), bannie à l'international, peut donner un air daté si la qualité n'est pas pro, prend 3-4 cm² que vous pourriez utiliser pour du contenu.",
      ],
    },
    {
      type: "paragraph",
      text: "En 2026, le rapport coût/bénéfice est clair pour une majorité de profils : retirer la photo minimise les risques sans perte réelle. La photo n'a jamais fait gagner un entretien à un candidat compétent ; une mauvaise photo, en revanche, a fait en perdre beaucoup.",
    },
    {
      type: "heading",
      level: 2,
      id: "par-profil",
      text: "La décision par profil (junior, expérimenté, cadre)",
    },
    {
      type: "paragraph",
      text: "Notre recommandation concrète, par type de profil et secteur :",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        "Junior / premier emploi : pas de photo. Votre CV est déjà court, vous ne voulez pas que le recruteur vous juge d'abord sur votre apparence de 22 ans. Concentrez l'espace sur vos stages et projets.",
        "Expérimenté tech (dev, data, product, design) : pas de photo. Le secteur ne l'attend pas et certains recruteurs la prennent comme un signal négatif (manque de culture du métier).",
        "Commercial / business / marketing : photo optionnelle. Si vous en mettez une, elle doit être très pro — costume/chemise, sourire sobre, fond neutre. Une photo trop décontractée nuit plus qu'elle n'aide.",
        "Cadre dirigeant / secteur conseil : photo acceptée, presque attendue. Mais professionnelle (portrait corporate), pas un selfie ou une photo de vacances recadrée.",
        "Luxe, hôtellerie, accueil premium : photo recommandée, avec les codes du secteur.",
        "Public et para-public : de plus en plus sans photo, surtout concours et CV anonymes internes.",
      ],
    },
    {
      type: "heading",
      level: 2,
      id: "international",
      text: "Et si vous candidatez à l'étranger ?",
    },
    {
      type: "paragraph",
      text: "Si vous candidatez au Royaume-Uni, aux États-Unis, au Canada, en Australie ou en Irlande : JAMAIS de photo. C'est une faute professionnelle qui peut disqualifier votre dossier automatiquement, parce que cela expose l'entreprise à des risques juridiques. En Allemagne, Suisse et Autriche, la photo est encore culturellement acceptée mais plus obligatoire — la tendance est la même qu'en France. Au Japon, en Chine et en Corée du Sud, la photo reste quasi obligatoire sur le CV local (履歴書 / résumé avec photo ID).",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Double CV si vous candidatez international et France",
      text: "Si vous ciblez les deux marchés, maintenez deux versions du CV : une française (avec ou sans photo selon votre choix) et une anglaise sans photo. Ne jamais envoyer la version française avec photo à une entreprise anglo-saxonne, même si elle a une filiale en France.",
    },
    {
      type: "cta",
      title: "CV sans photo mais avec impact visuel",
      text: "Nos 4 templates CV sont conçus pour marquer sans photo — mise en page claire, hiérarchie visuelle, compatibilité ATS garantie. Générez un CV adapté à chaque offre en 30 secondes.",
      ctaLabel: "Essayer gratuitement",
      ctaHref: "/register",
    },
    {
      type: "heading",
      level: 2,
      id: "si-vous-mettez",
      text: "Si vous décidez de mettre une photo : les règles",
    },
    {
      type: "paragraph",
      text: "Si malgré tout vous faites le choix de mettre une photo, respectez ces règles non négociables — une mauvaise photo dessert plus que pas de photo :",
    },
    {
      type: "list",
      style: "numbered",
      items: [
        "Photo prise par un photographe pro ou dans un cabinet de portrait. Pas de selfie, pas de recadrage d'une photo de mariage, pas de photo Instagram filtrée.",
        "Portrait cadré buste et tête, fond neutre (blanc, gris clair, bleu pâle). Pas de paysage, pas de photo de voyage.",
        "Tenue cohérente avec le poste visé : chemise ou tenue sobre pour un cadre, plus décontracté pour un profil créatif mais jamais de t-shirt.",
        "Sourire naturel, regard direct. Pas de lunettes de soleil, pas de chapeau.",
        "Qualité HD, bien éclairée, photo récente (moins de 3 ans).",
        "Format : petit (3x4 cm environ), en haut à droite ou gauche du CV. Jamais une photo qui prend 15% de la page.",
      ],
    },
    {
      type: "heading",
      level: 2,
      id: "alternatives",
      text: "Les alternatives à la photo classique",
    },
    {
      type: "paragraph",
      text: "Si vous voulez apporter une touche visuelle sans photo, plusieurs options marchent bien en 2026 : un lien vers un portfolio (pour les profils créa), un lien vers une vidéo de présentation de 60 secondes (de plus en plus commun en commerce et communication), une photo de profil soignée sur LinkedIn en renvoyant simplement au profil, ou un logo personnel minimaliste avec vos initiales.",
    },
    {
      type: "paragraph",
      text: "L'idée : la photo n'est qu'un outil parmi d'autres pour humaniser votre candidature. Les recruteurs qui veulent voir votre visage iront de toute façon sur LinkedIn. Autant garder le CV propre, ATS-friendly, et réserver la dimension humaine au premier entretien. Pour aller plus loin sur la structure globale d'un CV efficace, voyez notre guide <a href=\"/cv-ats\" class=\"text-blue-600 hover:underline font-medium\">CV ATS : passer les filtres en 2026</a>.",
    },
  ],
  faq: [
    {
      q: "Peut-on être refusé parce qu'on n'a pas mis de photo sur son CV ?",
      a: "Non. Aucune loi ne l'impose, et un recruteur ne peut pas légalement refuser un CV pour cette raison. Si une offre impose la photo, vérifiez que c'est légitime (métiers de l'apparence) ; sinon, c'est un signal que vous pouvez fuir cet employeur.",
    },
    {
      q: "La photo LinkedIn peut-elle servir de photo de CV ?",
      a: "Oui si elle est de qualité pro, récente et cohérente avec votre candidature. Beaucoup de générateurs de CV (dont CV Modifier) permettent d'importer votre photo LinkedIn directement. Assurez-vous juste qu'elle reste récente — une photo de 2019 sur un CV 2026 fait amateur.",
    },
    {
      q: "Un CV avec photo passe-t-il les ATS ?",
      a: "Les ATS modernes ignorent la photo sans poser de problème — ils extraient simplement le texte et laissent la photo de côté. Le vrai risque concerne les mises en page où la photo casse l'ordre de lecture du texte (colonnes asymétriques). Placez la photo en haut, hors de toute colonne, ou supprimez-la.",
    },
    {
      q: "Les photos générées par IA sont-elles acceptables sur un CV ?",
      a: "Non. Utiliser une photo générée par IA ou artificiellement retouchée (modification du visage, vieillissement/rajeunissement) sur un CV relève de la fraude. Un recruteur qui vous rencontre en entretien et ne vous reconnaît pas passera à la candidature suivante. Une photo pro classique reste la seule option acceptable.",
    },
    {
      q: "Vaut-il mieux pas de photo ou une photo moyenne ?",
      a: "Sans hésiter : pas de photo. Une photo moyenne (flou, mal éclairée, sélfie) envoie un signal de négligence qui dessert plus que l'absence de photo. Pour mettre une photo, il faut qu'elle soit clairement professionnelle — sinon on s'abstient.",
    },
  ],
  relatedSlugs: [
    "10-erreurs-cv-ats",
    "cv-anglais-vs-francais",
  ],
};

// -----------------------------------------------------------------------
// Article 7 — CV junior sans expérience : comment le remplir crédiblement
// -----------------------------------------------------------------------
const post7: BlogPost = {
  slug: "cv-junior-sans-experience",
  title: "CV junior sans expérience : comment le remplir crédiblement",
  excerpt:
    "Jeune diplômé, alternance ratée, premier emploi : voici comment construire un CV junior qui tient sur une page sans expérience pro solide — sans broder, sans faire amateur.",
  category: "Méthode",
  readTime: 6,
  publishedAt: "2026-03-15T09:00:00.000Z",
  updatedAt: "2026-04-20T09:00:00.000Z",
  author: DEFAULT_AUTHOR,
  heroImage: UNSPLASH("photo-1523240795612-9a054b0db644"),
  heroAlt: "Jeune étudiante travaillant sur son ordinateur dans une bibliothèque",
  keywords: [
    "CV junior",
    "CV sans expérience",
    "CV jeune diplômé",
    "CV premier emploi",
    "CV étudiant",
    "projets CV",
    "stages CV",
    "alternance CV",
  ],
  tocHeadings: [
    { id: "le-probleme", label: "Le vrai problème du CV junior" },
    { id: "structure", label: "La structure adaptée pour un CV junior" },
    { id: "projets-scolaires", label: "Valoriser projets scolaires et associatifs" },
    { id: "stages", label: "Bien traiter les stages et jobs d'été" },
    { id: "competences", label: "Compétences : ce qui compte vraiment" },
    { id: "accroche", label: "L'accroche qui compense le manque d'expérience" },
    { id: "erreurs", label: "Les erreurs qui font amateur" },
  ],
  content: [
    {
      type: "paragraph",
      text: "Premier emploi, jeune diplômé, stage raté, césure : tous les candidats juniors se retrouvent un jour face à la page blanche du CV avec ce vertige — « qu'est-ce que je mets, je n'ai rien fait ». La vérité, c'est que vous avez fait beaucoup plus que vous ne le pensez. Le problème n'est pas le contenu, c'est la mise en scène. Voici comment construire un CV junior qui tient sur une page, convertit en entretien, et ne fait pas amateur — sans rien inventer.",
    },
    {
      type: "heading",
      level: 2,
      id: "le-probleme",
      text: "Le vrai problème du CV junior",
    },
    {
      type: "paragraph",
      text: "Selon une enquête France Travail de 2024, le taux d'emploi des jeunes diplômés 18 mois après leur sortie d'études est d'environ 75% — mais avec de grandes disparités selon les filières. Source : <a href=\"https://statistiques.francetravail.org\" class=\"text-blue-600 hover:underline font-medium\">statistiques.francetravail.org</a>. Le vrai problème du CV junior n'est pas l'absence d'expérience : c'est l'incapacité à valoriser ce qui a été fait. Les recruteurs savent qu'un candidat de 22 ans n'a pas 5 ans d'expérience en management. Ils cherchent autre chose : la capacité à apprendre, la curiosité, des projets concrets terminés, et la maturité de présenter tout ça clairement.",
    },
    {
      type: "paragraph",
      text: "Un CV junior raté, c'est généralement un CV qui essaie de masquer le manque d'expérience par des formulations vagues (« forte capacité d'adaptation »), des listes de soft skills génériques, ou un design chargé qui masque le vide. Un bon CV junior, au contraire, assume le niveau de séniorité et met en avant les preuves tangibles qu'on peut montrer.",
    },
    {
      type: "heading",
      level: 2,
      id: "structure",
      text: "La structure adaptée pour un CV junior",
    },
    {
      type: "paragraph",
      text: "La structure classique Expérience → Formation → Compétences ne fonctionne pas pour un junior, parce qu'elle met en premier la section la plus faible. Voici l'ordre qui marche mieux quand on a peu ou pas d'expérience pro :",
    },
    {
      type: "list",
      style: "numbered",
      items: [
        "En-tête + accroche courte (3-4 lignes, cf. section dédiée).",
        "Formation en premier : diplôme, école, année, mentions ou spécialisations pertinentes. C'est votre actif principal.",
        "Projets académiques, perso, associatifs : 3-5 projets décrits avec contexte, actions, résultat concret.",
        "Stages et jobs : même courts, décrits avec précision (contexte entreprise, missions, outils, résultat).",
        "Compétences : outils, langues (niveau CECRL), méthodologies. Sobre et ciblé.",
        "Centres d'intérêt (optionnel) : 2-3 lignes max, uniquement si ça ajoute du contexte sur votre personnalité.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Formation détaillée = espace bien rempli",
      text: "Sur un CV junior, la section Formation peut légitimement faire 10-15% de la page : diplôme, école, années, mention, cours majeurs pertinents pour le poste (3-4 modules), mémoire/projet de fin d'études, classement éventuel. Ne la bâclez pas en 2 lignes sous prétexte de modestie.",
    },
    {
      type: "heading",
      level: 2,
      id: "projets-scolaires",
      text: "Valoriser projets scolaires et associatifs",
    },
    {
      type: "paragraph",
      text: "C'est la section clé du CV junior, et c'est aussi celle qui est le plus mal faite. Un projet scolaire bien présenté a autant de valeur qu'un stage pour un recruteur. Pour chaque projet, format type :",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        "Titre du projet + contexte (cours, équipe, durée). Exemple : « Projet de fin d'études — développement d'une app de covoiturage — équipe de 4, 4 mois ».",
        "Votre rôle précis dans l'équipe : « responsable backend » > « ai travaillé sur le projet ».",
        "Actions concrètes + outils : « développement d'une API REST en Node.js, intégration Stripe pour les paiements, déploiement sur Vercel ».",
        "Résultat mesurable : « application fonctionnelle présentée devant jury, note 17/20 » ou « 50 utilisateurs beta recrutés en 3 semaines ».",
      ],
    },
    {
      type: "paragraph",
      text: "Appliquez la même logique aux engagements associatifs : président du BDE, trésorier d'une asso, chef de projet d'un gala étudiant. Ces expériences sont considérées par les recruteurs comme du management léger, de la gestion de projet, ou de la gestion budgétaire selon les cas. Bien présentées, elles valent autant qu'un premier stage court.",
    },
    {
      type: "heading",
      level: 2,
      id: "stages",
      text: "Bien traiter les stages et jobs d'été",
    },
    {
      type: "paragraph",
      text: "Un stage de 2 mois mal présenté fait amateur ; un stage de 2 mois bien présenté fait sérieux. La différence tient dans 4 détails :",
    },
    {
      type: "list",
      style: "numbered",
      items: [
        "Le contexte entreprise : nom, secteur, taille. « Stage chez Acme (PME 45 personnes, distribution B2B d'équipement pro) » > « Stage chez Acme ».",
        "Les missions hiérarchisées : 3-4 bullets du plus important au moins important. Pas une liste de 10 tâches de 5 minutes.",
        "Les outils utilisés : CRM, Excel avancé, SQL, Photoshop. Même 5 jours à utiliser un outil, ça compte — vous l'avez vu en contexte réel.",
        "Un résultat tangible : « amélioration du tableau de suivi qui a servi pendant 6 mois après mon départ », « présentation d'une étude interne au CODIR ». Un stagiaire qui livre quelque chose de réutilisable fait toujours impression.",
      ],
    },
    {
      type: "paragraph",
      text: "Pour les jobs d'été (serveur, caissier, animateur, jobs étudiants), idem : ne les bradez pas. Ils montrent la capacité à travailler en équipe, gérer un rush, prendre une responsabilité opérationnelle. Formulez-les comme des expériences à part entière, pas en annexe.",
    },
    {
      type: "cta",
      title: "Un CV junior qui ne fait pas amateur",
      text: "CV Modifier adapte votre CV à chaque offre en valorisant vos projets et stages avec le vocabulaire attendu par les recruteurs juniors. 3 générations offertes, sans carte bancaire.",
      ctaLabel: "Essayer gratuitement",
      ctaHref: "/register",
    },
    {
      type: "heading",
      level: 2,
      id: "competences",
      text: "Compétences : ce qui compte vraiment",
    },
    {
      type: "paragraph",
      text: "Sur un CV junior, la section compétences est souvent bâclée ou au contraire gonflée artificiellement. Trois règles simples :",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        "Outils concrets avant tout : les logiciels, langages, frameworks que vous avez réellement utilisés. Mieux vaut 5 outils maîtrisés que 15 survolés.",
        "Langues : niveau CECRL standardisé (A2, B1, B2, C1, C2). Pas de « niveau scolaire » ou « bon niveau » — ça n'a aucune valeur pour le recruteur.",
        "Pas de soft skills génériques isolées : « rigoureux, curieux, autonome » en liste nue fait toujours amateur. Intégrez-les dans vos expériences (« Autonomie sur un projet de 4 mois avec livrable final présenté au jury »).",
      ],
    },
    {
      type: "heading",
      level: 2,
      id: "accroche",
      text: "L'accroche qui compense le manque d'expérience",
    },
    {
      type: "paragraph",
      text: "L'accroche (le petit paragraphe en haut du CV) compte encore plus pour un junior que pour un senior. Elle permet au recruteur de se faire un avis en 10 secondes et justifie votre positionnement. Formule qui marche :",
    },
    {
      type: "paragraph",
      text: "« [Diplôme] en [spécialité] — recherche [type de poste : alternance, CDI, stage] en [secteur ou métier précis]. Expérience de [X mois/projets] dans [compétence clé]. Intéressé par [domaine très précis : SaaS B2B, conseil stratégie, data science]. Disponible [date]. »",
    },
    {
      type: "paragraph",
      text: "Cette accroche compense l'absence d'expérience parce qu'elle montre 3 choses : vous savez précisément ce que vous cherchez, vous positionnez votre diplôme dans un contexte pro, et vous donnez au recruteur les infos pratiques (type de contrat, disponibilité) sans qu'il ait à les chercher.",
    },
    {
      type: "heading",
      level: 2,
      id: "erreurs",
      text: "Les erreurs qui font amateur",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        "CV qui essaie de tenir sur 2 pages à 22 ans : faites une page dense et bien remplie, c'est plus pro qu'une double page à moitié vide.",
        "Des dizaines de soft skills listées en vrac. Les recruteurs zappent cette section systématiquement chez les juniors.",
        "Stages présentés en une ligne : « Stage marketing, Acme, 2024 ». C'est du gâchis — c'est votre seule expérience pro et vous ne la racontez pas.",
        "Centres d'intérêt génériques : « lecture, voyage, sport ». Soit vous êtes précis (« trail longue distance — semi-marathon en 1h30 »), soit vous supprimez la section.",
        "Photo de voyage recadrée : aucune photo vaut mieux qu'une photo amateur. Voyez notre article dédié photo de CV.",
        "Zéro lien : pas de LinkedIn, pas de GitHub (pour un profil tech), pas de portfolio (pour un créatif). Le recruteur se demande ce que vous cachez.",
      ],
    },
    {
      type: "paragraph",
      text: "Un CV junior bien fait fait mieux qu'un CV senior bâclé. Le niveau d'expérience, ça se voit — et ça se comprend. Ce que les recruteurs ne pardonnent pas chez un junior, c'est la flemme de mise en forme et la broderie creuse. Pour aller plus loin sur la façon de formuler vos expériences avec des chiffres et des verbes d'action, voyez notre guide <a href=\"/adapter-cv-offre-emploi\" class=\"text-blue-600 hover:underline font-medium\">adapter son CV à une offre d'emploi</a>.",
    },
  ],
  faq: [
    {
      q: "Je n'ai aucun stage ni expérience pro, que faire ?",
      a: "Valorisez les projets scolaires et personnels. Un projet de fin d'études substantiel, un mémoire qui a impliqué du travail terrain, un projet associatif que vous avez piloté — tout ça compte. Si vous avez vraiment zéro de zéro, passez un weekend à construire un projet concret (site perso, app, mission de bénévolat) avant de lancer vos candidatures.",
    },
    {
      q: "Dois-je mettre mes notes et mentions sur le CV ?",
      a: "Oui pour un junior, dans la section Formation. Mention, rang de sortie, moyenne générale si elle est flatteuse. Vos notes sont souvent votre meilleur signal de performance quand vous n'avez pas d'expérience pro à montrer. Les recruteurs de cabinets conseil et finance les regardent de près.",
    },
    {
      q: "Faut-il mettre ses jobs étudiants (serveur, babysitting) ?",
      a: "Oui si vous avez peu d'expérience et si le job a duré au moins 2 mois. Ça montre votre capacité à tenir un engagement, gérer un stress opérationnel, travailler en équipe. Évitez juste de mettre un job de 3 jours pour remplir.",
    },
    {
      q: "Combien de pages pour un CV junior ?",
      a: "Une page, point. Même si vous avez fait 3 stages, un semestre à l'étranger et 2 projets perso — tout doit tenir sur une seule page bien dense. Un junior sur 2 pages fait l'effet inverse de ce qu'il cherche : manque de synthèse.",
    },
    {
      q: "Puis-je mentionner mon BAC si je suis bac+5 ?",
      a: "Non, sauf si c'est un bac avec mention très bien dans une voie sélective (S, prépa, bac pro) ET que vous êtes junior. Pour un bac+5 en poste depuis 2 ans, le bac disparaît du CV. Gardez Formation synthétique : diplômes pertinents seulement.",
    },
  ],
  relatedSlugs: [
    "cv-developpeur-2026",
    "10-erreurs-cv-ats",
  ],
};

// -----------------------------------------------------------------------
// Article 8 — Soft skills sur un CV en 2026 : lesquelles mettre, comment les prouver
// -----------------------------------------------------------------------
const post8: BlogPost = {
  slug: "soft-skills-cv-2026",
  title: "Soft skills sur un CV en 2026 : lesquelles mettre, comment les prouver",
  excerpt:
    "« Rigoureux, autonome, esprit d'équipe » ne veulent plus rien dire. Voici les soft skills qui pèsent en 2026, comment les prouver concrètement, et celles à éviter absolument.",
  category: "Méthode",
  readTime: 6,
  publishedAt: "2026-03-22T09:00:00.000Z",
  updatedAt: "2026-04-18T09:00:00.000Z",
  author: DEFAULT_AUTHOR,
  heroImage: UNSPLASH("photo-1552664730-d307ca884978"),
  heroAlt: "Réunion d'équipe autour d'une table de travail avec ordinateurs portables",
  keywords: [
    "soft skills CV",
    "compétences comportementales",
    "savoir-être CV",
    "soft skills 2026",
    "leadership CV",
    "communication CV",
    "adaptabilité CV",
  ],
  tocHeadings: [
    { id: "pourquoi-changent", label: "Pourquoi les soft skills pèsent plus qu'avant" },
    { id: "top-5", label: "Le top 5 des soft skills recherchées en 2026" },
    { id: "a-eviter", label: "Les soft skills qui ne veulent plus rien dire" },
    { id: "comment-prouver", label: "Comment prouver une soft skill (au lieu de la lister)" },
    { id: "ou-les-placer", label: "Où placer les soft skills dans le CV" },
    { id: "entretien", label: "Préparer l'entretien : les STAR stories" },
  ],
  content: [
    {
      type: "paragraph",
      text: "Les soft skills, ces « compétences comportementales » que tout le monde liste en bas de CV, sont devenues le terrain le plus piégé du recrutement en 2026. D'un côté, les études APEC montrent qu'elles pèsent de plus en plus dans les décisions finales des recruteurs. De l'autre, les CV qui listent « rigueur, autonomie, esprit d'équipe » en vrac sont ignorés par tous les recruteurs sérieux. Voici comment identifier les soft skills qui comptent vraiment, et comment les prouver au lieu de les proclamer.",
    },
    {
      type: "heading",
      level: 2,
      id: "pourquoi-changent",
      text: "Pourquoi les soft skills pèsent plus qu'avant",
    },
    {
      type: "paragraph",
      text: "Deux tendances convergentes expliquent l'importance croissante des soft skills en 2026. Première tendance : l'IA générative absorbe de plus en plus de tâches techniques (rédaction, analyse basique, code de routine), rendant les qualités proprement humaines — jugement, communication, collaboration — plus différenciantes. Selon le rapport Future of Jobs 2023 du World Economic Forum, les compétences cognitives analytiques, la créativité et la résilience sont en tête des compétences en demande. Source : <a href=\"https://www.weforum.org/publications/the-future-of-jobs-report-2023/\" class=\"text-blue-600 hover:underline font-medium\">weforum.org</a>.",
    },
    {
      type: "paragraph",
      text: "Deuxième tendance : les hiring managers recrutent de plus en plus sur potentiel d'évolution (peut-il grandir avec l'équipe ?) plutôt que sur compétences immédiates (sait-il faire exactement X aujourd'hui ?). Les soft skills sont le meilleur proxy de ce potentiel. Conséquence pratique : les recruteurs passent de plus en plus de temps à explorer les soft skills en entretien — et à les vérifier sur le CV en amont.",
    },
    {
      type: "heading",
      level: 2,
      id: "top-5",
      text: "Le top 5 des soft skills recherchées en 2026",
    },
    {
      type: "paragraph",
      text: "D'après les études APEC et les annonces d'emploi cadres analysées sur l'année 2024-2025, cinq soft skills émergent clairement comme les plus demandées, tous secteurs confondus :",
    },
    {
      type: "list",
      style: "numbered",
      items: [
        "Capacité d'apprentissage rapide : dans un contexte où les outils changent tous les 18 mois (IA générative, no-code, stacks logicielles), la capacité à monter en compétence seul est la soft skill n°1. Preuve : certifications récentes, projets perso récents, changement de stack réussi.",
        "Communication écrite : email clair, doc synthétique, Slack pro. Surprenant en 2026 mais plus critique que jamais, parce que le travail distribué la rend centrale. Preuve : un article de blog publié, un post LinkedIn qui a bien performé, une doc technique écrite.",
        "Collaboration transverse : travailler avec d'autres équipes (dev × produit, commercial × ops), sans autorité hiérarchique. Essentiel dans les organisations matricielles actuelles. Preuve : un projet mené avec au moins 3 équipes, avec résultat.",
        "Résolution de problèmes complexes : capacité à décomposer un problème mal défini, proposer plusieurs options, choisir. Les recruteurs testent ça en entretien par cas pratiques. Preuve : un cas où vous avez débloqué une situation ambiguë, raconté en mode STAR.",
        "Adaptabilité / résilience : non pas au sens « je m'adapte à tout » mais au sens précis : gérer le changement de plan, l'incertitude, les priorités qui bougent. Preuve : un projet qui a pivoté en cours de route et que vous avez su reconduire.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Leadership : soft skill à la carte",
      text: "Le « leadership » est souvent listé en top 5 mais c'est une soft skill très contextuelle — elle ne veut rien dire en soi. Précisez toujours : leadership d'influence (sans autorité), leadership opérationnel (une équipe de N personnes), leadership stratégique (vision long terme). Sans précision, ça sonne creux.",
    },
    {
      type: "heading",
      level: 2,
      id: "a-eviter",
      text: "Les soft skills qui ne veulent plus rien dire",
    },
    {
      type: "paragraph",
      text: "Certaines formulations sont tellement usées qu'elles ont un effet inverse en 2026 : les voir sur un CV déclenche un léger rejet (« encore un qui met les mots sans les prouver »). À bannir :",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        "« Rigoureux » : tout le monde se dit rigoureux. Preuve ou silence.",
        "« Autonome » : idem. Le recruteur cherche une preuve factuelle : quel projet mené seul, de A à Z ?",
        "« Esprit d'équipe » : à remplacer par des exemples précis de collaboration.",
        "« Dynamique » : vide de sens. Datée des années 2000.",
        "« Bon relationnel » : idem. Préférer « communication client en B2B » si c'est votre vraie compétence.",
        "« Capacité d'adaptation » : trop générique. Spécifiez à quoi : changement de techno, de contexte, de culture d'entreprise.",
        "« Polyvalent » : signale souvent l'absence de spécialité claire. À ne mettre que si c'est justifié par un parcours qui croise plusieurs métiers.",
      ],
    },
    {
      type: "heading",
      level: 2,
      id: "comment-prouver",
      text: "Comment prouver une soft skill (au lieu de la lister)",
    },
    {
      type: "paragraph",
      text: "La règle d'or : une soft skill listée nue ne compte pas. Seule une soft skill preuvée compte. Trois façons concrètes de prouver :",
    },
    {
      type: "list",
      style: "numbered",
      items: [
        "Dans une description d'expérience, citez la soft skill + son contexte : « Pilotage d'un projet transverse impliquant 4 équipes (produit, tech, marketing, ops) pendant 6 mois — gestion des priorités contradictoires, livraison respectée à J-0. »",
        "Chiffrez quand possible : « Formation accélérée sur Next.js en 3 semaines, déploiement d'un premier feature en production dans le mois suivant. » C'est plus parlant que « capacité d'apprentissage rapide ».",
        "Utilisez un résultat externe tangible : recommandation LinkedIn d'un manager, recommandation sur le CV (« Recommandation : voir Jean Dupont, ex-manager Acme — contact sur demande »), prix, publication, certification.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "La méthode 3 minutes",
      text: "Pour chaque soft skill que vous voulez mettre en avant, demandez-vous : si un recruteur me demandait « racontez-moi un exemple concret en 3 minutes » — est-ce que j'ai l'exemple prêt ? Si oui, mettez-la. Si non, enlevez-la. C'est le seul filtre qui marche.",
    },
    {
      type: "cta",
      title: "Un CV qui prouve les soft skills au lieu de les lister",
      text: "CV Modifier intègre les soft skills directement dans vos expériences avec le bon vocabulaire métier, plutôt que de les lister en vrac. Testez gratuitement.",
      ctaLabel: "Essayer gratuitement",
      ctaHref: "/adapter-cv-offre-emploi",
    },
    {
      type: "heading",
      level: 2,
      id: "ou-les-placer",
      text: "Où placer les soft skills dans le CV",
    },
    {
      type: "paragraph",
      text: "Mauvaise idée : une section « Soft skills » en bas du CV avec 6 mots listés. Bonne idée : les répartir à 3 endroits stratégiques.",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        "Dans l'accroche du CV (2-3 lignes en haut), citez la soft skill distinctive avec son contexte. Exemple : « Product manager, 6 ans d'expérience en scale-up SaaS B2B. Reconnu pour la collaboration tech × produit et la capacité à décomposer des problèmes ambigus en roadmap livrable. »",
        "Dans les descriptions d'expériences, sous forme de contexte ou de résultat. « Pilotage d'un chantier transverse Q3 2024 impliquant 3 équipes — gestion des arbitrages et livraison en fenêtre fixe. »",
        "Dans une mini-section « Compétences » (3-5 lignes max), avec format concret : « Communication écrite (auteur de 12 articles de blog tech cumulant 50k vues), collaboration transverse, résolution de problèmes produits. »",
      ],
    },
    {
      type: "heading",
      level: 2,
      id: "entretien",
      text: "Préparer l'entretien : les STAR stories",
    },
    {
      type: "paragraph",
      text: "Les soft skills sur le CV ne servent à rien si vous ne pouvez pas les défendre en entretien. Les recruteurs utilisent la méthode STAR (Situation, Tâche, Action, Résultat) pour évaluer les soft skills. Préparez 4 à 6 STAR stories courtes (3 minutes chacune) qui illustrent vos soft skills clés. Pour chaque soft skill que vous mettez sur le CV, ayez au moins une STAR story prête.",
    },
    {
      type: "paragraph",
      text: "Exemple de structure : « Chez [employeur], en Q2 2024, on avait un projet bloqué parce que deux équipes étaient en désaccord sur l'architecture. J'ai pris l'initiative d'organiser un atelier de 2h avec les deux tech leads et la PM pour poser les contraintes de chacun. On est sorti de l'atelier avec une décision claire, on a débloqué le projet en 48h. » C'est une STAR story — et c'est la vraie preuve de « collaboration transverse ».",
    },
    {
      type: "paragraph",
      text: "En 2026, les soft skills sont devenues un terrain concurrentiel comme un autre : elles se prouvent, elles se chiffrent, elles se racontent. Le candidat qui arrive encore avec une liste de soft skills en bas de CV en 2026 paraît un candidat des années 2010. Pour aller plus loin sur la structure globale d'un CV efficace, voyez notre guide <a href=\"/creer-cv\" class=\"text-blue-600 hover:underline font-medium\">créer un CV</a>.",
    },
  ],
  faq: [
    {
      q: "Faut-il une section dédiée « Soft skills » sur le CV ?",
      a: "Non, évitez une section listée. Les soft skills bien placées se retrouvent dans l'accroche, dans les descriptions d'expériences, et éventuellement dans une mini-section Compétences très concrète. Une liste nue « rigueur, autonomie, esprit d'équipe » ne fait que signaler que vous ne savez pas où les placer.",
    },
    {
      q: "Les soft skills en anglais passent-elles mieux sur un CV français ?",
      a: "Pas forcément. « Ownership », « critical thinking », « problem solving » sont acceptés dans la tech et le digital, mais sonnent prétentieux dans des secteurs plus classiques (banque, industrie, administration). Adaptez au contexte. Et ne mélangez pas français et anglais dans la même liste — c'est perçu comme du franglais d'école de commerce.",
    },
    {
      q: "Les tests de personnalité (MBTI, DISC) ont-ils leur place sur un CV ?",
      a: "Non. Ces tests ne sont pas reconnus scientifiquement et ils catégorisent de façon trop rigide. Si un employeur en a fait passer un et vous a classé « ENTJ » ou « Dominant », gardez ça pour vous. Aucun recruteur sérieux ne prend de décision sur ces bases.",
    },
    {
      q: "Un manager attend-il les mêmes soft skills qu'un IC (individual contributor) ?",
      a: "Non. Pour un manager, le leadership, le feedback, la capacité à recruter et la gestion de la performance pèsent lourd. Pour un IC, la maîtrise technique, la résolution de problèmes et la capacité à s'auto-diriger sont prioritaires. Un CV de manager qui ne parle que de code, ou inversement, signale une mauvaise lecture du poste.",
    },
    {
      q: "L'IA peut-elle remplacer les soft skills humaines dans 5 ans ?",
      a: "Non, c'est même l'inverse. Plus les tâches techniques sont absorbées par l'IA, plus les soft skills humaines — jugement, empathie, négociation, leadership — deviennent différenciantes. Les études McKinsey et WEF convergent sur ce point. Investir dans ses soft skills en 2026, c'est préparer la décennie.",
    },
  ],
  relatedSlugs: [
    "lettre-motivation-ia-credible",
    "cv-reconversion-professionnelle",
  ],
};

// -----------------------------------------------------------------------
// Article 9 — CV de reconversion : valoriser des compétences transférables
// -----------------------------------------------------------------------
const post9: BlogPost = {
  slug: "cv-reconversion-professionnelle",
  title: "CV de reconversion : valoriser des compétences transférables",
  excerpt:
    "Changer de métier après 5, 10 ou 15 ans : comment construire un CV de reconversion qui convainc, même sans expérience directe dans le nouveau métier.",
  category: "Métier",
  readTime: 7,
  publishedAt: "2026-04-01T09:00:00.000Z",
  updatedAt: "2026-04-22T09:00:00.000Z",
  author: DEFAULT_AUTHOR,
  heroImage: UNSPLASH("photo-1522202176988-66273c2fd55f"),
  heroAlt: "Personnes en reconversion professionnelle dans un atelier collaboratif",
  keywords: [
    "CV reconversion",
    "reconversion professionnelle",
    "compétences transférables",
    "CV changement métier",
    "CPF reconversion",
    "CV second métier",
    "career switch",
  ],
  tocHeadings: [
    { id: "enjeu", label: "L'enjeu d'un CV de reconversion en 2026" },
    { id: "structure", label: "La structure gagnante : CV par compétences" },
    { id: "transferables", label: "Identifier vos compétences transférables" },
    { id: "accroche", label: "L'accroche qui donne le sens de la reconversion" },
    { id: "formations", label: "Valoriser formations et certifications récentes" },
    { id: "projets", label: "Les projets de transition : stages, freelance, perso" },
    { id: "erreurs", label: "Les 5 erreurs fatales en reconversion" },
  ],
  content: [
    {
      type: "paragraph",
      text: "Selon les chiffres France Travail, environ 1 actif sur 5 envisage ou amorce une reconversion professionnelle sur une période de 5 ans. Source : <a href=\"https://www.francetravail.org\" class=\"text-blue-600 hover:underline font-medium\">francetravail.org</a>. Pourtant, le CV de reconversion reste l'un des plus difficiles à rédiger : comment convaincre un recruteur que vos 10 ans d'expérience dans un métier A sont pertinents pour un métier B totalement différent ? Voici la méthode concrète pour construire un CV qui fait sens — sans masquer votre passé ni le mettre en avant au mauvais endroit.",
    },
    {
      type: "heading",
      level: 2,
      id: "enjeu",
      text: "L'enjeu d'un CV de reconversion en 2026",
    },
    {
      type: "paragraph",
      text: "Un CV de reconversion doit répondre à une question silencieuse du recruteur : « pourquoi vous, alors qu'on a des candidats qui ont déjà fait ce métier ? ». La réponse ne peut pas être « parce que je veux changer » — personne ne recrute pour faire plaisir. Elle doit être : « mon parcours précédent m'a donné des compétences qui sont exactement ce dont vous avez besoin, et j'ai déjà commencé à me spécialiser concrètement dans le nouveau métier ».",
    },
    {
      type: "paragraph",
      text: "Le double risque d'un CV de reconversion mal fait : (1) sembler surqualifié pour un poste junior dans le nouveau métier (« il va se lasser et partir »), (2) sembler sous-qualifié face à des candidats expérimentés (« il ne connaît pas le métier »). Le bon CV de reconversion navigue entre ces deux écueils en mettant en avant les compétences transférables et les preuves récentes de spécialisation.",
    },
    {
      type: "heading",
      level: 2,
      id: "structure",
      text: "La structure gagnante : CV par compétences",
    },
    {
      type: "paragraph",
      text: "Pour une reconversion, la structure chronologique classique (expériences du plus récent au plus ancien) n'est souvent pas la meilleure. Elle met en premier votre dernier job dans l'ancien métier — ce que le recruteur ne cherche pas. Préférez un CV hybride ou « par compétences » :",
    },
    {
      type: "list",
      style: "numbered",
      items: [
        "En-tête + accroche claire (titre du poste VISÉ, pas le dernier poste occupé).",
        "Section « Compétences clés » regroupées par thème pertinent pour le nouveau métier. Chaque compétence est illustrée par 1-2 expériences concrètes (avec dates).",
        "Formations et certifications récentes liées à la reconversion, mises en avant.",
        "Projets de transition : stages, freelance, projets perso, bénévolat — tout ce qui touche au nouveau métier.",
        "Parcours professionnel (plus synthétique que dans un CV classique) : entreprises, fonctions, dates. Les détails vont dans la section compétences.",
        "Formation initiale en bas, brève.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Le titre du CV, c'est le nouveau métier",
      text: "Votre CV doit ouvrir sur le titre du poste que vous visez, PAS sur votre dernier poste. « Analyste data — reconversion depuis finance (6 ans) » est mille fois plus clair que « Contrôleur de gestion » en titre. Le recruteur sait en 2 secondes que vous ciblez un autre métier.",
    },
    {
      type: "heading",
      level: 2,
      id: "transferables",
      text: "Identifier vos compétences transférables",
    },
    {
      type: "paragraph",
      text: "Les compétences transférables sont les compétences qui comptent dans le nouveau métier et que vous avez acquises dans l'ancien. Exercice concret : listez 10 compétences de votre métier actuel, puis demandez-vous pour chacune « est-ce que ça compte dans le métier cible ? ». Quelques exemples de passerelles courantes :",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        "Enseignant → formateur en entreprise : pédagogie, ingénierie pédagogique, gestion de groupe, évaluation, production de supports.",
        "Commercial → product manager : compréhension client, priorisation, communication, négociation des trade-offs.",
        "Infirmier → RH / coaching : écoute, gestion du stress, communication difficile, confidentialité, organisation.",
        "Contrôleur de gestion → data analyst : modélisation, rigueur analytique, Excel avancé, SQL, dashboarding.",
        "Journaliste → content marketing : écriture, angle éditorial, recherche, respect des délais, référencement.",
        "Militaire → chef de projet / ops : leadership, gestion de crise, logistique, process, culture du résultat.",
      ],
    },
    {
      type: "paragraph",
      text: "Ne forcez pas les passerelles qui n'existent pas. Si vous passez de boulangerie à data science, le lien n'est pas évident et il vaut mieux miser sur les formations et projets récents que sur des compétences transférables artificielles. Le recruteur sent le pont fabriqué de toutes pièces.",
    },
    {
      type: "heading",
      level: 2,
      id: "accroche",
      text: "L'accroche qui donne le sens de la reconversion",
    },
    {
      type: "paragraph",
      text: "C'est le paragraphe le plus important de votre CV de reconversion. Il doit répondre à 3 questions en 3-4 lignes : qui êtes-vous (passé), où allez-vous (cible), pourquoi ça fait sens (bridge). Format qui fonctionne :",
    },
    {
      type: "paragraph",
      text: "« [Titre du poste visé] — Reconversion depuis [ancien métier, X années d'expérience]. [Compétences transférables clés adaptées au nouveau métier]. Formation [certif récente] validée en [date]. Objectif : [projection concrète : type d'entreprise, taille, secteur]. »",
    },
    {
      type: "paragraph",
      text: "Exemple concret pour une reconversion commercial → product manager : « Product Manager junior — Reconversion depuis le commerce (7 ans en SaaS B2B). Expérience terrain client, compréhension des cycles d'achat enterprise, capacité à prioriser des besoins contradictoires. Formation Product Management validée à l'IPM School en 2025. Cherche une scale-up SaaS B2B pour appliquer la compréhension client à la construction de produit. »",
    },
    {
      type: "cta",
      title: "Un CV de reconversion qui raconte le bon pont",
      text: "CV Modifier adapte votre CV à chaque offre en mettant en avant vos compétences transférables pour le métier cible. 3 générations offertes pour tester.",
      ctaLabel: "Essayer gratuitement",
      ctaHref: "/register",
    },
    {
      type: "heading",
      level: 2,
      id: "formations",
      text: "Valoriser formations et certifications récentes",
    },
    {
      type: "paragraph",
      text: "Les formations récentes liées au nouveau métier sont le signal de crédibilité n°1 d'un CV de reconversion. Elles montrent que vous ne venez pas juste avec une envie mais avec un investissement concret (temps, argent, énergie). À mettre en avant :",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        "Formations longues reconnues : bootcamp (Le Wagon, 42, Ironhack, OpenClassrooms formations diplômantes), mastère spécialisé, CAP/BP/BTS en reconversion via CPF.",
        "Certifications métier : AWS, GCP, Scrum, PMP, Google Ads, HubSpot, Product Management (Product School).",
        "MOOCs sérieux terminés avec projet : Coursera, edX, spécialisations de 4-6 mois — à condition d'avoir livré un projet concret en fin.",
        "Formations courtes spécialisées : 1-2 semaines dans un cabinet réputé, à mentionner si pertinent.",
      ],
    },
    {
      type: "paragraph",
      text: "Attention à ne pas surgonfler : 3 semaines sur Udemy à regarder des vidéos ne sont pas une formation. Mentionnez seulement ce que vous pouvez défendre en entretien (« j'ai fait ce projet, j'ai codé ça, j'ai livré ça »).",
    },
    {
      type: "heading",
      level: 2,
      id: "projets",
      text: "Les projets de transition : stages, freelance, perso",
    },
    {
      type: "paragraph",
      text: "Entre votre ancien métier et votre nouveau poste visé, il y a souvent un sas : stages, missions freelance courtes, projets perso, bénévolat. C'est LE contenu qui fait la différence sur un CV de reconversion. Trois formats qui marchent :",
    },
    {
      type: "list",
      style: "numbered",
      items: [
        "Stage en entreprise dans le nouveau métier, même court (1-3 mois). En reconversion, un stage à 30 ou 40 ans n'est pas ridicule — c'est le signe d'un engagement concret. Utilisez votre réseau pour en trouver un pendant ou après votre formation.",
        "Mission freelance / bénévolat : refaire le site d'une asso, tenir le marketing digital d'un petit commerce, faire du pro bono pour une startup de votre réseau. Tout compte, tant que c'est concret et raconté avec résultat.",
        "Projet perso en ligne : un portfolio, un GitHub, un blog, une app publiée. Le recruteur peut cliquer, voir, juger. Rien ne remplace ça pour une reconversion tech.",
      ],
    },
    {
      type: "heading",
      level: 2,
      id: "erreurs",
      text: "Les 5 erreurs fatales en reconversion",
    },
    {
      type: "list",
      style: "numbered",
      items: [
        "Garder l'ancien titre comme titre du CV : « Contrôleur de gestion » en tête alors que vous postulez data analyst. Le recruteur ne fait pas le pont à votre place.",
        "Lister toutes les expériences passées au même niveau de détail : un recruteur qui cherche un product manager junior n'a pas besoin de lire 3 paragraphes sur votre job de commercial en 2015.",
        "Masquer la reconversion : cacher les dates, éviter de nommer les anciens métiers. Ça crée de la suspicion. Mieux vaut assumer clairement et expliquer le sens.",
        "Pas de formation ni de projet récent dans le nouveau métier : vous demandez au recruteur de vous croire sur parole. Ça ne marche pas.",
        "Ton défaitiste ou plaintif dans l'accroche (« Suite à un burn-out / à une envie d'ailleurs, j'ai décidé de… »). Restez factuel et orienté avenir.",
      ],
    },
    {
      type: "paragraph",
      text: "Une bonne reconversion se prépare 12 à 18 mois avant la première candidature. Le CV n'est que la vitrine finale. Pour les compétences transférables spécifiques à votre nouveau métier cible, voyez notre page <a href=\"/cv-par-metier\" class=\"text-blue-600 hover:underline font-medium\">CV par métier</a> qui détaille les attendus par profession.",
    },
  ],
  faq: [
    {
      q: "Faut-il expliquer le motif de la reconversion en lettre de motivation ?",
      a: "Oui, en 2-3 phrases maximum, et de façon positive (pull factor, pas push factor). « J'ai découvert le produit en tant que client et j'ai voulu passer de l'autre côté » convertit mieux que « J'ai fait un burn-out dans mon ancien métier ». Le recruteur veut voir un projet, pas une fuite.",
    },
    {
      q: "Mon âge peut-il me pénaliser dans une reconversion ?",
      a: "La discrimination à l'âge est interdite (Code du travail, art. L1132-1), mais elle existe en pratique. Compensez en montrant votre énergie (formations récentes terminées, projets livrés, portfolio actif), et positionnez-vous clairement sur le niveau junior/médior du nouveau métier — sans faire dans le senior déguisé en junior.",
    },
    {
      q: "Puis-je postuler à un poste senior dans le nouveau métier si j'étais senior dans l'ancien ?",
      a: "Rarement. Sauf si le nouveau poste valorise massivement vos compétences transférables (ex: ancien commercial senior qui devient Head of Sales d'une startup où son expertise sectorielle pèse). Dans la majorité des cas, viser un poste junior ou médior est plus réaliste — et plus crédible.",
    },
    {
      q: "Dois-je mentionner que j'ai utilisé mon CPF pour ma formation ?",
      a: "Non, ça n'apporte rien. Le recruteur veut savoir quelle formation vous avez faite et ce qu'elle prouve, pas comment elle a été financée. Mentionnez le nom de la formation, l'organisme, la durée, le projet final. Le mode de financement est confidentiel et sans intérêt recruteur.",
    },
    {
      q: "Combien de pages pour un CV de reconversion ?",
      a: "2 pages maximum, souvent 1 page bien dense si vous avez peu d'expérience dans le nouveau métier. Compressez les expériences anciennes en une ligne par poste si besoin, et laissez de la place à vos compétences transférables, formations récentes et projets de transition.",
    },
  ],
  relatedSlugs: [
    "cv-junior-sans-experience",
    "soft-skills-cv-2026",
  ],
};

// -----------------------------------------------------------------------
// Article 10 — CV en anglais vs français : les vraies différences à connaître
// -----------------------------------------------------------------------
const post10: BlogPost = {
  slug: "cv-anglais-vs-francais",
  title: "CV en anglais vs français : les vraies différences à connaître",
  excerpt:
    "Traduire son CV français en anglais ne suffit pas. Voici les 8 vraies différences structurelles entre un CV français et un resume anglo-saxon — à appliquer avant toute candidature internationale.",
  category: "Méthode",
  readTime: 7,
  publishedAt: "2026-04-10T09:00:00.000Z",
  updatedAt: "2026-04-22T09:00:00.000Z",
  author: DEFAULT_AUTHOR,
  heroImage: UNSPLASH("photo-1521737604893-d14cc237f11d"),
  heroAlt: "Candidate en entretien professionnel avec documents en anglais",
  keywords: [
    "CV anglais",
    "resume anglais",
    "CV américain",
    "CV britannique",
    "traduction CV anglais",
    "CV international",
    "cover letter",
    "CV UK vs US",
  ],
  tocHeadings: [
    { id: "resume-vs-cv", label: "Resume, CV, curriculum : de quoi on parle ?" },
    { id: "format", label: "Format et longueur : la règle 1 page" },
    { id: "photo-personal", label: "Photo et infos personnelles : à bannir" },
    { id: "summary", label: "Le summary : votre pitch en 3 lignes" },
    { id: "experience", label: "Les expériences : verbes d'action et chiffres" },
    { id: "vocabulaire", label: "Le vocabulaire piège (faux amis)" },
    { id: "uk-vs-us", label: "UK vs US : les petites différences qui comptent" },
    { id: "cover-letter", label: "La cover letter : quand la mettre, comment la rédiger" },
  ],
  content: [
    {
      type: "paragraph",
      text: "Traduire votre CV français en anglais avec DeepL et l'envoyer à Londres ou New York : c'est l'erreur n°1 des candidats qui se lancent à l'international. Un resume anglo-saxon n'est pas un CV français traduit. La structure, la longueur, le vocabulaire et les règles culturelles sont différentes. Voici les 8 vraies différences à intégrer avant d'envoyer la moindre candidature.",
    },
    {
      type: "heading",
      level: 2,
      id: "resume-vs-cv",
      text: "Resume, CV, curriculum : de quoi on parle ?",
    },
    {
      type: "paragraph",
      text: "Petite mise au point lexicale : aux États-Unis, on parle de « resume » (prononcé rézumé) pour un document court orienté candidature. Le mot « CV » existe aussi mais désigne surtout le document long académique (dans le contexte universitaire, médecine, recherche). Au Royaume-Uni, on parle de « CV » au quotidien — équivalent au resume américain. Dans le reste du monde anglophone (Canada, Australie, Irlande), « resume » et « CV » sont largement interchangeables avec une préférence pour « resume » chez les recruteurs privés.",
    },
    {
      type: "paragraph",
      text: "Dans cet article, on parle indifféremment du document court de candidature — qu'on l'appelle resume (US) ou CV (UK). La différence pratique tient surtout à la longueur (voir section suivante).",
    },
    {
      type: "heading",
      level: 2,
      id: "format",
      text: "Format et longueur : la règle 1 page",
    },
    {
      type: "paragraph",
      text: "Différence n°1, et la plus brutale : aux États-Unis, le resume tient sur 1 seule page, quelle que soit l'expérience. Même avec 20 ans de carrière. C'est une règle quasi sacrée dans le recrutement privé, et un CV de 2 pages d'un candidat non-anglophone sera perçu comme « incapable de synthétiser ». Au Royaume-Uni, la norme est 2 pages maximum. En Irlande et Australie, 2 pages également tolérées.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Exception : l'academic CV",
      text: "Seuls les CV académiques (chercheurs, professeurs, médecins) peuvent dépasser 2 pages. Ils font souvent 5-10 pages avec publications, thèses, bourses, conférences. Pour toute candidature dans le privé, restez dans la règle 1 page (US) / 2 pages (UK).",
    },
    {
      type: "paragraph",
      text: "Format pratique : Letter (8.5x11 pouces) pour les États-Unis, A4 pour le Royaume-Uni et l'Europe. Un resume envoyé en A4 aux États-Unis est imprimé avec des marges bizarres, ce qui fait amateur. Si vous ciblez les US, configurez Letter dans votre outil de CV.",
    },
    {
      type: "heading",
      level: 2,
      id: "photo-personal",
      text: "Photo et infos personnelles : à bannir",
    },
    {
      type: "paragraph",
      text: "Différence n°2, souvent mal comprise : AUCUNE photo, AUCUNE info personnelle sensible sur un resume anglo-saxon. À supprimer systématiquement de votre version française :",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        "Photo : interdite en pratique. Expose l'entreprise à un risque de discrimination. Un recruteur qui reçoit un CV avec photo peut le supprimer sans même le lire.",
        "Date de naissance : à retirer absolument. Illegal to ask in most US states, et source de biais d'âge. Vous gardez juste les années d'expérience implicitement.",
        "État civil (marié(e), célibataire) : inutile et mal vu. Aucun rapport avec la performance pro.",
        "Nationalité : à mentionner uniquement si ça affecte votre autorisation à travailler (« US Citizen », « UK Work Visa — Tier 2 », « EU Citizen with full UK working rights »).",
        "Numéro de sécu ou équivalent : jamais.",
        "Adresse complète : optionnelle. Mentionnez juste la ville + pays (« London, UK » ou « Remote — Paris based »). Pas besoin du 15 rue Machin.",
      ],
    },
    {
      type: "heading",
      level: 2,
      id: "summary",
      text: "Le summary : votre pitch en 3 lignes",
    },
    {
      type: "paragraph",
      text: "Différence n°3 : le summary. C'est un petit paragraphe de 3-4 lignes placé juste après votre nom et vos coordonnées. Équivalent de l'accroche française, mais plus systématique dans le resume anglo-saxon — presque obligatoire. Il remplace l'ancien « Objective » (désuet en 2026 sauf pour les juniors).",
    },
    {
      type: "paragraph",
      text: "Format type qui fonctionne : « [Seniority] [Role] with [X] years of experience in [industry]. Specialized in [specific expertise]. Proven track record of [quantified achievement]. Looking for [next career step, type of company]. »",
    },
    {
      type: "paragraph",
      text: "Exemple : « Senior Product Manager with 7 years of experience in B2B SaaS. Specialized in enterprise onboarding and user activation. Proven track record of shipping features that moved activation rates by 15%+ at two different startups. Looking for a Head of Product role in a Series B+ startup. »",
    },
    {
      type: "heading",
      level: 2,
      id: "experience",
      text: "Les expériences : verbes d'action et chiffres",
    },
    {
      type: "paragraph",
      text: "Différence n°4 : le style des descriptions d'expérience. Un resume anglo-saxon privilégie les bullets qui commencent par un verbe d'action au passé simple + chiffre + impact. Pas de paragraphes descriptifs.",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        "Mauvais (style français traduit) : « In charge of the commercial development of the enterprise segment. »",
        "Bon (style resume) : « Led $4M+ ARR expansion in the enterprise segment (FY2024), closing 3 deals > $200k. »",
      ],
    },
    {
      type: "paragraph",
      text: "Les verbes d'action standard : Led, Built, Launched, Scaled, Reduced, Increased, Designed, Delivered, Negotiated, Managed, Owned. Évitez « Responsible for » — trop passif. Commencez chaque bullet par un verbe d'action fort et enchaînez sur un chiffre quand possible.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "La règle des 3-5 bullets par poste",
      text: "Aux US comme au UK, chaque poste se décrit en 3 à 5 bullets — pas plus. Le format « 10 bullets par poste » qu'on voit parfois en France est perçu comme un manque de priorisation. Gardez seulement ce qui est significatif.",
    },
    {
      type: "cta",
      title: "Votre CV traduit et adapté au format anglo-saxon",
      text: "CV Modifier propose des templates compatibles format US/UK avec le bon vocabulaire sales/tech/product. Essayez gratuitement.",
      ctaLabel: "Essayer gratuitement",
      ctaHref: "/register",
    },
    {
      type: "heading",
      level: 2,
      id: "vocabulaire",
      text: "Le vocabulaire piège (faux amis)",
    },
    {
      type: "paragraph",
      text: "Différence n°5 : plusieurs termes français traduits directement sonnent faux ou faux sens en anglais. Les pièges classiques :",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        "« Experience professionnelle » → « Professional experience » fonctionne, mais on préfère simplement « Experience ».",
        "« Formation » → ne pas traduire par « Formation ». Utilisez « Education » pour les diplômes, « Training » / « Certifications » pour les formations courtes.",
        "« Stage » → « Internship ». Jamais « Stage » (qui signifie « étape »).",
        "« CDI / CDD » → pas de traduction directe. Écrivez « Full-time permanent » ou précisez juste les dates.",
        "« Alternance » → « Apprenticeship » (UK) ou « Work-study program » (US).",
        "« Chef de projet » → « Project Manager ». Pas « Chief of Project » (qui n'existe pas).",
        "« Responsable » → « Manager » ou « Head of » selon le niveau. « Responsible » est un adjectif, pas un titre.",
        "« Maîtrise » pour un diplôme → « Master's degree ». Pas « Mastery ».",
      ],
    },
    {
      type: "heading",
      level: 2,
      id: "uk-vs-us",
      text: "UK vs US : les petites différences qui comptent",
    },
    {
      type: "paragraph",
      text: "Si vous candidatez dans les deux zones, quelques ajustements micro à connaître :",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        "Orthographe : « organization » (US) vs « organisation » (UK), « center » (US) vs « centre » (UK), « color » (US) vs « colour » (UK). Choisissez une variante et soyez cohérent.",
        "Dates : format US « MM/DD/YYYY », format UK « DD/MM/YYYY ». Dans un resume, préférez le format mois + année en toutes lettres (« March 2024 ») pour éviter toute ambiguïté.",
        "Longueur : 1 page (US strict) vs 2 pages (UK tolère).",
        "GPA / mentions : les recruteurs US regardent la GPA (ex: 3.8/4.0) pour les juniors. Les UK regardent la mention (« First Class Honours », « 2:1 »).",
        "« References » : au UK, on écrit souvent « References available on request » en bas. Aux US, on ne met rien — les références sont demandées séparément si besoin.",
      ],
    },
    {
      type: "heading",
      level: 2,
      id: "cover-letter",
      text: "La cover letter : quand la mettre, comment la rédiger",
    },
    {
      type: "paragraph",
      text: "Différence n°6 : la cover letter. Au Royaume-Uni, elle est attendue pour la majorité des candidatures qualifiées. Aux États-Unis, c'est plus variable : certaines entreprises (banques d'affaires, cabinets de conseil, postes senior) en exigent une, d'autres (tech, startups, tous postes juniors) ne la regardent même pas.",
    },
    {
      type: "paragraph",
      text: "Format qui fonctionne : 3 paragraphes, 15-20 lignes total, même structure Vous/Moi/Nous que la lettre de motivation française, mais plus direct. Pas de « It is with great interest… » (cliché), démarrez par « I am applying for [role] because [concrete reason]. ». Signez par votre nom complet.",
    },
    {
      type: "paragraph",
      text: "La différence clé : une cover letter anglo-saxonne est encore plus orientée faits concrets et chiffres qu'une lettre de motivation française. Pas de formules de politesse élaborées. Pas d'effet de style. Clarté, concision, orientation résultat. Pour creuser la structure générale d'une lettre de motivation efficace, voyez notre page <a href=\"/lettre-motivation-ia\" class=\"text-blue-600 hover:underline font-medium\">lettre de motivation par IA</a>.",
    },
    {
      type: "paragraph",
      text: "Conclusion : un resume anglo-saxon n'est pas un CV français traduit, c'est un document à part entière avec ses propres codes. Investir 2-3 heures à le refaire correctement (et pas juste à le traduire) est ce qui fait la différence entre 0 réponse et des entretiens. Pour aller plus loin sur les différences culturelles et la compatibilité ATS, voyez aussi notre guide <a href=\"/cv-ats\" class=\"text-blue-600 hover:underline font-medium\">CV ATS : passer les filtres en 2026</a>.",
    },
  ],
  faq: [
    {
      q: "Dois-je faire traduire mon CV par un traducteur professionnel ?",
      a: "Pas forcément — un bon traducteur coûte cher et ne connaît pas votre métier. Préférez écrire votre resume directement en anglais en vous appuyant sur des exemples de resumes natifs de votre secteur (LinkedIn search sur des profils anglo-saxons). Faites relire le résultat par un natif, idéalement de votre secteur. C'est plus efficace que de partir d'une traduction.",
    },
    {
      q: "Le niveau d'anglais sur le CV : comment l'indiquer ?",
      a: "Pour un CV en anglais : ne mentionnez pas votre niveau d'anglais explicitement, sauf si vous êtes natif (« Native English speaker »). Sinon, le simple fait que votre CV soit en anglais correct prouve votre niveau. Mentionnez plutôt vos autres langues avec niveau CEFR (« French: Native », « Spanish: B2 »).",
    },
    {
      q: "Puis-je mentionner mes « soft skills » sur un resume ?",
      a: "Oui, mais avec les mêmes règles qu'en français : jamais en liste nue. Intégrez-les dans vos bullets d'expériences (« Led a cross-functional team of 6 engineers and designers »). Les recruteurs anglo-saxons sont encore plus allergiques aux soft skills claim sans preuve que les français.",
    },
    {
      q: "Les recruteurs UK/US utilisent-ils les mêmes ATS que la France ?",
      a: "En grande partie oui : Workday, Greenhouse, Lever, iCIMS sont des ATS américains dominants dans les deux zones. Les règles de compatibilité ATS (pas de tableaux, pas de colonnes complexes, polices standard) s'appliquent à l'identique. Un CV ATS-safe en France l'est aussi à l'international.",
    },
    {
      q: "Dois-je adapter mon CV à chaque offre en anglais aussi ?",
      a: "Oui, encore plus qu'en français. Le marché anglo-saxon est plus compétitif et les recruteurs attendent un resume taillé au poste. Adaptez le summary, réordonnez les bullets des expériences pour mettre en premier ceux qui matchent l'offre, intégrez les mots-clés spécifiques. CV Modifier peut le faire automatiquement pour les deux langues.",
    },
    {
      q: "Est-ce que LinkedIn doit être en anglais si mon CV l'est ?",
      a: "Oui. Un CV en anglais et un LinkedIn uniquement en français crée une dissonance qui interroge les recruteurs internationaux. La bonne pratique : LinkedIn en anglais si vous ciblez l'international, avec éventuellement une section en français en bas (« À propos » dupliquée) pour conserver votre visibilité sur le marché français.",
    },
  ],
  relatedSlugs: [
    "photo-cv-2026",
    "10-erreurs-cv-ats",
  ],
};

// Ordered list of all posts — newest first for the index page.
export const BLOG_POSTS: BlogPost[] = [
  post1,
  post2,
  post3,
  post4,
  post5,
  post6,
  post7,
  post8,
  post9,
  post10,
];

export function getAllPosts(): BlogPost[] {
  // Sort by publishedAt descending.
  return [...BLOG_POSTS].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: BlogPost): BlogPost[] {
  // Resolve related slugs, falling back to other posts if unavailable.
  const related: BlogPost[] = [];
  for (const slug of post.relatedSlugs) {
    const match = getPostBySlug(slug);
    if (match && match.slug !== post.slug) related.push(match);
  }
  // If we end up with fewer than 3, top up with any other posts.
  if (related.length < 3) {
    for (const p of BLOG_POSTS) {
      if (
        p.slug !== post.slug &&
        !related.some((r) => r.slug === p.slug) &&
        related.length < 3
      ) {
        related.push(p);
      }
    }
  }
  return related.slice(0, 3);
}

export function formatBlogDate(iso: string): string {
  // DD/MM/YYYY — French standard, no locale quirk.
  const d = new Date(iso);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

export function formatBlogDateLong(iso: string): string {
  const d = new Date(iso);
  const months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
