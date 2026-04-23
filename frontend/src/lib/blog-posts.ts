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

// Ordered list of all posts — newest first for the index page.
export const BLOG_POSTS: BlogPost[] = [post1, post2, post3, post4, post5];

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
