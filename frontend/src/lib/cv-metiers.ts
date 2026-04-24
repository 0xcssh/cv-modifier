// CV par métier — données statiques programmatic SEO.
//
// Chaque entrée contient du contenu UNIQUE (pas de template fill) : accroches,
// KPIs, erreurs, entreprises qui recrutent varient d'un métier à l'autre. Les
// salaires sont des fourchettes estimées 2026 basées sur APEC / Robert Half /
// Glassdoor ; on reste volontairement sur des fourchettes larges pour éviter
// les erreurs par sous-métier.

export type CvMetierCategory =
  | "Tech"
  | "Commerce"
  | "Marketing"
  | "RH"
  | "Finance"
  | "Santé"
  | "Management";

export interface CvMetierMistake {
  title: string;
  explanation: string;
}

export interface CvMetierFaqItem {
  q: string;
  a: string;
}

export interface CvMetier {
  slug: string;
  name: string;
  nameFull: string;
  category: CvMetierCategory;

  // Contenu unique
  intro: string;
  recruiterExpectations: string;
  keySkills: string[];
  toolsTech: string[];

  accrocheExample: string;
  keyKpis: string[];

  commonMistakes: CvMetierMistake[];
  hiringCompanies: string[];

  salaryRange: string;
  typicalCareer: string;

  relatedSlugs: string[];
  relatedBlogSlugs: string[];
  relatedPillarSlugs: string[];

  // Optionnel — alimente FAQPage JSON-LD + section FAQ dans la page
  // si renseigné. 4 Q/A typiques : salaire, diplôme, évolution, format CV.
  faq?: CvMetierFaqItem[];
}

// Badge colors per category — reuse palette cohérente avec le blog.
export const CATEGORY_STYLES: Record<
  CvMetierCategory,
  { badge: string; dot: string }
> = {
  Tech: {
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  Commerce: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  Marketing: {
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
  },
  RH: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  Finance: {
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
  },
  Santé: {
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
  Management: {
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-500",
  },
};

export const CV_METIERS: CvMetier[] = [
  // ─────────────────────────────── TECH ───────────────────────────────
  {
    slug: "developpeur-web",
    name: "Développeur web",
    nameFull: "Développeur web full-stack",
    category: "Tech",
    intro:
      "Le marché du dev web s'est resserré depuis 2023 : moins de juniors recrutés en sortie de bootcamp, plus d'exigence sur la seniorité et sur les vraies réalisations en prod. Un CV développeur en 2026 doit prouver par le code et par des projets mesurables, pas par une liste de frameworks.",
    recruiterExpectations:
      "Le tech lead qui lit votre CV ne cherche pas une liste d'outils. Il cherche : (1) des projets en production avec du trafic réel ou des utilisateurs concrets, (2) un niveau de responsabilité lisible (« j'ai livré », « j'ai architecturé », pas « j'ai participé à »), (3) un stack cohérent — si vous listez React, Vue, Angular, Svelte, Next et Nuxt, le recruteur comprend que vous avez « touché » sans rien maîtriser. Privilégiez la profondeur : deux stacks solides valent mieux que huit survolés.",
    keySkills: [
      "Architecture frontend (Next.js App Router, SSR/ISR, Server Components)",
      "API REST et GraphQL (design, versioning, rate limiting)",
      "Bases de données relationnelles (PostgreSQL, SQL brut, indexation)",
      "Tests automatisés (Jest, Vitest, Playwright) et CI GitHub Actions",
      "Performance web (Core Web Vitals, lazy loading, cache)",
      "Sécurité applicative (OWASP Top 10, CSP, auth JWT/cookies)",
      "Git avancé (rebase, bisect, workflows trunk-based)",
      "Observabilité (Sentry, logs structurés, traces OpenTelemetry)",
    ],
    toolsTech: [
      "TypeScript",
      "React / Next.js",
      "Node.js / Express / NestJS",
      "PostgreSQL / Prisma",
      "Docker",
      "GitHub Actions",
      "Vercel / Railway",
      "VS Code",
    ],
    accrocheExample:
      "Développeur full-stack avec 4 ans d'expérience sur TypeScript, Next.js et PostgreSQL. J'ai porté en production une plateforme SaaS B2B (12 000 users actifs, LCP passé de 3,8s à 1,2s) et migré un monolithe Rails vers une archi Node/Fastify découpée en services. Intéressé par les produits à fort volume où la perf côté utilisateur compte réellement.",
    keyKpis: [
      "Core Web Vitals avant/après optimisation (LCP, INP, CLS chiffrés)",
      "Nombre d'utilisateurs actifs sur les produits livrés",
      "Volume de requêtes API traitées (req/s en pic)",
      "Couverture de tests et fréquence de déploiement (plusieurs fois/jour vs mensuel)",
      "Réduction de temps de build ou de coût infra en pourcentage",
      "Taille d'équipe impactée quand vous avez mentoré ou mené une migration",
    ],
    commonMistakes: [
      {
        title: "Lister 25 technos sans les contextualiser",
        explanation:
          "Le CV « Python, Java, Go, Rust, C++, Kotlin, Swift, PHP, Ruby » en section compétences est un signal rouge : soit c'est du bluff, soit c'est du survol. Gardez 6-10 techs maîtrisées, rattachées à un projet ou une expérience concrète.",
      },
      {
        title: "Ne pas mettre de liens GitHub / portfolio",
        explanation:
          "Pour un profil dev, l'absence de lien vers du code (GitHub actif, site perso, contribution open source) oblige le recruteur à deviner. Un GitHub avec 2-3 projets bien documentés vaut souvent plus qu'une ligne d'expérience.",
      },
      {
        title: "Cacher les années de galère junior",
        explanation:
          "Sauter les stages ou les alternances pour paraître plus senior est visible aux incohérences de dates. Mieux vaut assumer 1-2 ans juniors sous-payés chez un ESN : le recruteur comprend, il ne juge pas.",
      },
      {
        title: "Écrire « participé au développement de » sans rien spécifier",
        explanation:
          "Le verbe faible tue la crédibilité technique. Précisez : quel module ? combien de lignes ? quelle techno ? En solo ou en binôme ? Le recruteur tech veut du concret.",
      },
      {
        title: "Mettre une photo en sidebar sur un CV deux colonnes",
        explanation:
          "Les CV dev chez les scale-ups françaises sont majoritairement sans photo et en une colonne. Une sidebar photo + jauges de compétences signale un template Canva : l'ATS plante et le tech lead soupire.",
      },
    ],
    hiringCompanies: [
      "Doctolib",
      "Qonto",
      "Alan",
      "BlaBlaCar",
      "Back Market",
      "ManoMano",
      "Ubisoft",
      "PayFit",
      "Mirakl",
      "Vinted",
    ],
    salaryRange: "40-55k€ junior, 55-75k€ confirmé, 75-110k€ senior/lead en France (fourchette APEC 2026)",
    typicalCareer:
      "Développeur junior → confirmé (3-5 ans) → senior ou tech lead (6+ ans) → staff engineer, engineering manager ou freelance TJM 550-750€.",
    relatedSlugs: ["devops", "data-analyst", "product-manager"],
    relatedBlogSlugs: ["cv-developpeur-2026", "10-erreurs-cv-ats"],
    relatedPillarSlugs: ["cv-ats", "adapter-cv-offre-emploi"],
    faq: [
      {
        q: "Quel salaire pour un développeur web junior en 2026 ?",
        a: "40 à 55 k€ brut annuel à Paris pour un junior (0-2 ans), 35 à 45 k€ en province. Les scale-ups françaises (Qonto, Alan, Payfit, Swile, Doctolib) sont plutôt en haut de la fourchette ; les ESN et agences, plutôt en bas. En freelance, un junior facture rarement au-dessus de 400 €/jour — le sweet spot commence vers 3 ans d'expérience.",
      },
      {
        q: "Faut-il un diplôme d'école d'ingé pour être développeur ?",
        a: "Non. Les bootcamps (Le Wagon, 42, OpenClassrooms) sont largement acceptés côté tech, notamment dans les scale-ups et les startups. Les écoles d'ingénieur gardent un petit avantage côté grands groupes et en consulting (Capgemini, Sopra), et pour les candidatures visa à l'international. Ce qui pèse le plus sur un CV, c'est le portfolio GitHub et les projets concrets, pas l'intitulé du diplôme.",
      },
      {
        q: "GitHub public obligatoire sur un CV développeur ?",
        a: "Quasi obligatoire pour un junior ou un candidat en reconversion : sans GitHub, on n'a aucun moyen de juger votre code. Pour un senior, un GitHub vide est moins bloquant si les expériences pro suffisent à illustrer le niveau. Conseil : au moins 2-3 repos avec README propre, un stack moderne (TypeScript, tests, CI), et le lien cliquable dans le header du CV.",
      },
      {
        q: "Une page ou deux pour un CV développeur ?",
        a: "Une page en dessous de 5 ans d'expérience. Au-delà, deux pages maximum en gardant l'expérience la plus récente en haut. Les recruteurs tech scanneront les 30 dernières secondes stack + rôle + réalisations : un CV qui scrolle au-delà de deux pages finit fermé avant d'être lu.",
      },
    ],
  },

  {
    slug: "data-analyst",
    name: "Data Analyst",
    nameFull: "Data Analyst / BI Analyst",
    category: "Tech",
    intro:
      "Le métier de data analyst s'est démocratisé : quasiment toute PME de plus de 50 salariés en embauche un, et les outils se sont standardisés autour de SQL, dbt et Looker/Metabase. Résultat : moins de place pour les profils « je sais faire du Tableau », plus de valeur pour ceux qui savent formuler un problème business en requête.",
    recruiterExpectations:
      "Un data analyst n'est pas là pour produire des dashboards jolis — il est là pour faire prendre de meilleures décisions. Ce que le recruteur cherche : capacité à challenger une demande métier (« pourquoi tu veux ce KPI ? »), maîtrise SQL sans IA (fenêtres, CTE, joins complexes), et au moins un cas où votre analyse a changé une décision concrète (prix, feature, budget).",
    keySkills: [
      "SQL avancé (window functions, CTE récursives, joins complexes)",
      "Modélisation analytique avec dbt (staging, marts, tests)",
      "Visualisation (Looker, Metabase, Tableau, Power BI)",
      "Statistiques appliquées (A/B tests, intervalles de confiance, significativité)",
      "Python pour l'analyse (pandas, plotly) et parfois R",
      "Business acumen : lire un P&L, comprendre un funnel SaaS",
      "Communication : rapports écrits et présentations exec",
      "Data quality : tests, alerting, documentation",
    ],
    toolsTech: [
      "SQL (Postgres, BigQuery, Snowflake)",
      "dbt",
      "Looker / Metabase",
      "Python (pandas, jupyter)",
      "Git",
      "Mode / Hex",
      "Airflow",
    ],
    accrocheExample:
      "Data analyst avec 3 ans d'expérience en scale-up SaaS. Au quotidien : stack Postgres + dbt + Metabase. J'ai construit la modélisation des marts revenue qui a permis au CFO de sortir sa première forecast mensuelle sans passer par la finance (-4 jours de closing). Spécialisée sur les funnels produit B2B et les A/B tests.",
    keyKpis: [
      "Nombre de dashboards en production et d'utilisateurs actifs",
      "Décisions produit ou business déclenchées par une analyse (donner 1-2 exemples nommés)",
      "Réduction de délai de reporting (jours de closing, fréquence de rafraîchissement)",
      "Volume de données manipulé (lignes, Go, TB)",
      "Taux de tests dbt sur les modèles critiques",
      "ROI ou uplift d'un A/B test que vous avez conçu ou analysé",
    ],
    commonMistakes: [
      {
        title: "Mettre « Excel expert » en première compétence",
        explanation:
          "Excel est un pré-requis, pas une compétence différenciante en 2026. La mettre en tête du CV envoie le signal « je n'ai rien de mieux à dire ». Remontez SQL, dbt ou une compétence métier.",
      },
      {
        title: "Confondre data analyst, data engineer et data scientist",
        explanation:
          "Écrire « j'ai fait du ML, du pipeline Spark et du Tableau » trahit un flou. Positionnez-vous clairement : analyst = SQL + modélisation + visualisation + stats légères. Pas de Spark ni de MLOps sauf si vous visez un rôle hybride.",
      },
      {
        title: "Lister des outils sans dire à quoi ils ont servi",
        explanation:
          "« Tableau, Power BI, Looker, Metabase, Qlik, Mode, Hex » en section compétences ne dit rien. Mieux : « Looker (migration depuis Tableau, 40 dashboards recréés en 3 mois) ».",
      },
      {
        title: "Ne pas montrer un seul résultat business concret",
        explanation:
          "Le recruteur veut un exemple d'impact : « mon analyse sur la cohorte entreprise a fait remonter un churn caché à 18 %, on a changé la politique de pricing ». Sans ça, vous êtes un opérateur de dashboard.",
      },
    ],
    hiringCompanies: [
      "Doctolib",
      "Vinted",
      "BlaBlaCar",
      "Contentsquare",
      "ManoMano",
      "Qonto",
      "Aircall",
      "Spendesk",
      "Malt",
      "Lydia",
    ],
    salaryRange: "38-48k€ junior, 48-62k€ confirmé, 62-85k€ senior/lead en France",
    typicalCareer:
      "Analyst junior → confirmé (2-4 ans) → senior analyst ou analytics engineer → lead analytics / head of data dans une PME.",
    relatedSlugs: ["developpeur-web", "product-manager", "controleur-gestion"],
    relatedBlogSlugs: ["mots-cles-offre-emploi", "10-erreurs-cv-ats"],
    relatedPillarSlugs: ["cv-ats", "adapter-cv-offre-emploi"],
    faq: [
      {
        q: "Quel salaire pour un data analyst en 2026 ?",
        a: "38 à 48 k€ brut annuel pour un junior à Paris (0-2 ans), 35 à 42 k€ en province. Un analyst confirmé (3-5 ans) tourne à 48-62 k€, et le senior ou analytics engineer monte à 62-85 k€ dans les scale-ups (Qonto, Doctolib, Vinted, Aircall). En freelance, le TJM démarre vers 450-550 €/jour et atteint 650-750 € pour les profils avec dbt et une vraie connaissance métier SaaS.",
      },
      {
        q: "Quel diplôme pour devenir data analyst ?",
        a: "Un bac+3 à bac+5 en stats, éco, data ou ingénierie reste la voie classique (ENSAE, ENSAI, masters MIASHS, écoles de commerce spé data). Les bootcamps type DataScientest, Le Wagon Data ou Jedha sont largement acceptés en scale-up à condition d'avoir 2-3 projets SQL + dbt documentés. Les reconversions finance ou BI vers data analyst passent bien si le candidat maîtrise vraiment SQL et un outil de dataviz moderne.",
      },
      {
        q: "Faut-il savoir coder en SQL sans IA pour passer les entretiens ?",
        a: "Oui, c'est le filtre n°1. La plupart des process incluent un test SQL live (jointures, window functions, CTE) où ChatGPT n'est pas autorisé. Un candidat qui ne sait écrire qu'avec l'IA se fait griller en 10 minutes. Entraînez-vous sur StrataScratch, LeetCode SQL ou DataLemur. Python pandas est un plus, mais rarement bloquant au recrutement — SQL reste la compétence dure.",
      },
      {
        q: "Faut-il un portfolio ou GitHub pour un data analyst ?",
        a: "Recommandé pour un junior ou une reconversion : un repo GitHub avec 2-3 projets (requêtes SQL commentées, notebook d'analyse, dashboard Looker Studio public) fait largement la différence. Pour un confirmé, le track record pro suffit, mais un blog technique ou une contribution dbt package reste un vrai bonus côté scale-ups. Un CV une page maximum, avec les stacks réellement utilisés, pas une liste de tous les outils BI du marché.",
      },
    ],
  },

  {
    slug: "designer-ux-ui",
    name: "Designer UX/UI",
    nameFull: "Product Designer / UX-UI Designer",
    category: "Tech",
    intro:
      "Product designer est aujourd'hui le terme qui concentre la demande — l'écart entre UX pur et UI pur s'est réduit, et les équipes cherchent des profils qui couvrent les deux, plus de la research. Le portfolio reste le vrai CV : un bon CV pour un designer sert surtout à amener au portfolio.",
    recruiterExpectations:
      "Le design lead qui recrute veut voir : (1) des études de cas détaillées avec le problème, la démarche, les arbitrages (pas juste des screens Figma jolis), (2) un process clair — recherche utilisateurs, itérations, handoff dev, (3) la compréhension du produit et du business. Un portfolio avec 15 projets survolés vaut moins qu'un portfolio avec 3 cas étudiés en profondeur.",
    keySkills: [
      "Design de produit (flows, systèmes, composants, états d'erreur)",
      "User research (interviews, usability tests, analyse qualitative)",
      "Design systems (tokens, variants, documentation)",
      "Prototypage interactif (Figma prototypes, Framer)",
      "Handoff développement et collaboration front",
      "Accessibilité (WCAG AA, contrastes, navigation clavier)",
      "Analyse quantitative (Hotjar, heatmaps, funnels)",
      "Copywriting produit (micro-copy, CTA, labels)",
    ],
    toolsTech: [
      "Figma",
      "Figjam / Miro",
      "Notion",
      "Maze / Lookback",
      "Framer",
      "Principle / Protopie",
      "Adobe Creative Suite",
    ],
    accrocheExample:
      "Product designer, 5 ans en B2B SaaS. Je mène les projets en autonomie de la research jusqu'au handoff : recherche terrain (5-8 interviews par discovery), itérations en Figma, design system maintenu avec les devs. Dernier projet : refonte de l'onboarding d'une app fintech → +23 % de complétion après A/B test (6 semaines).",
    keyKpis: [
      "Métriques d'usage avant/après vos livraisons (complétion, activation, rétention)",
      "Taux de conversion ou de complétion d'un funnel redesigné",
      "Nombre de users interviewés sur un projet (3, 8, 15 ?)",
      "Temps de handoff dev divisé par X grâce au design system",
      "NPS ou CSAT sur les écrans que vous avez livrés",
      "Taille du design system (composants, variants, tokens)",
    ],
    commonMistakes: [
      {
        title: "Un CV sans lien vers le portfolio",
        explanation:
          "L'absence de lien vers un portfolio est rédhibitoire. Le recruteur n'ira pas chercher Behance / Dribbble si l'URL n'est pas sur le CV. Mettez le lien en haut, à côté de l'email.",
      },
      {
        title: "Portfolio avec uniquement des visuels, sans process",
        explanation:
          "Un portfolio rempli de screens Figma sans explication du problème, du target et des arbitrages donne l'impression d'un décorateur. Chaque case study doit raconter : problème → research → options → choix → résultat.",
      },
      {
        title: "Se présenter comme UX, UI, graphique et illustrateur",
        explanation:
          "Les designers qui font tout sont rarement bons à chacun. Positionnez-vous : product designer ? UX research ? Brand ? Si vraiment vous êtes hybride, précisez la répartition (« 70 % produit, 30 % brand »).",
      },
      {
        title: "Ne rien dire du collaborationnel avec les devs",
        explanation:
          "« J'ai livré le design » sans parler de handoff, de specs, de tokens ou de QA devs signale un profil qui jette ses Figma au-dessus du mur. Mentionnez explicitement la collaboration avec l'engineering.",
      },
    ],
    hiringCompanies: [
      "Doctolib",
      "Qonto",
      "Alan",
      "Aircall",
      "ManoMano",
      "PayFit",
      "Swile",
      "Lydia",
      "Back Market",
      "Mirakl",
    ],
    salaryRange: "38-50k€ junior, 50-65k€ confirmé, 65-90k€ senior/staff en France",
    typicalCareer:
      "Junior designer → product designer confirmé (3-5 ans) → senior puis staff designer ou design lead → head of design, freelance TJM 500-700€.",
    relatedSlugs: ["product-manager", "developpeur-web", "chef-de-projet"],
    relatedBlogSlugs: ["mots-cles-offre-emploi", "cv-developpeur-2026"],
    relatedPillarSlugs: ["creer-cv", "adapter-cv-offre-emploi"],
    faq: [
      {
        q: "Quel salaire pour un product designer en 2026 ?",
        a: "38 à 50 k€ brut annuel pour un junior à Paris, 35 à 45 k€ en province. Un designer confirmé (3-5 ans) se situe entre 50 et 65 k€, et les seniors ou staff designers atteignent 65-90 k€ dans les scale-ups (Doctolib, Qonto, Alan, Aircall). En freelance, le TJM moyen oscille entre 500 et 700 €/jour ; au-delà, il faut prouver un impact produit très concret (métriques d'activation, refontes chiffrées).",
      },
      {
        q: "Faut-il un diplôme précis pour devenir product designer ?",
        a: "Non, le marché accepte largement les écoles de design (Strate, Gobelins, ENSCI, L'École de design Nantes), les écoles d'art appliqué, mais aussi les reconversions via bootcamps (Ironhack, Le Wagon UX, OpenClassrooms). Ce qui décide, c'est le portfolio et la profondeur du process sur 2-3 case studies. Un diplôme pur graphisme sans culture produit (research, métriques, handoff dev) reste pénalisant sur les postes product design purs.",
      },
      {
        q: "Portfolio Figma suffit-il ou faut-il un site perso ?",
        a: "Un site perso (Framer, Webflow, ou même Notion propre) reste le standard — il permet de raconter le process, pas juste de montrer des écrans. Figma seul est difficile à lire pour un recruteur pressé. Mettez 3 à 5 case studies bien structurés (problème, research, arbitrages, résultat chiffré) plutôt que 15 projets survolés. Lien portfolio cliquable en haut du CV : sans ce lien, la candidature finit direct au rejet.",
      },
      {
        q: "Combien de case studies dans un portfolio design ?",
        a: "Trois cas bien creusés valent mieux que dix vitrines superficielles. Chaque étude doit idéalement couvrir un problème produit, une phase de research (interviews, usability tests), des arbitrages explicites et un résultat mesuré (activation, complétion, NPS). Le CV lui-même tient en une page pour moins de 5 ans d'expérience, deux pages au-delà, et redirige toujours vers le portfolio qui fait 90 % du travail de sélection.",
      },
    ],
  },

  {
    slug: "product-manager",
    name: "Product Manager",
    nameFull: "Product Manager (PM)",
    category: "Tech",
    intro:
      "Le product management français a beaucoup maturé : les scale-ups attendent des PM avec un track record mesurable, pas juste un framework appris en bootcamp. Le gap entre « PM exécutant » et « PM qui priorise » reste la principale fracture — votre CV doit clairement vous situer du bon côté.",
    recruiterExpectations:
      "Head of product ou CTO veut voir : (1) un vrai scope — combien de devs et de designers sous votre responsabilité produit, (2) des décisions de priorisation que vous avez prises et défendues (« j'ai dé-priorisé X pour Y parce que… »), (3) de la data — vous savez lire un funnel, commander une query SQL simple, lire un rapport Mixpanel / Amplitude. Un PM sans data est un chef de projet déguisé.",
    keySkills: [
      "Priorisation produit (RICE, MoSCoW, cost of delay) et dicours client",
      "Discovery (user interviews, problem statement, hypothèses testables)",
      "Analyse quantitative (funnels, cohortes, A/B tests)",
      "Rédaction de specs et de PRD lisibles par engineering",
      "Roadmap communication (OKR, now/next/later, mise à jour stakeholders)",
      "Collaboration design + tech : pas de silo, pas de « passe-plat »",
      "SQL basique pour self-service (joins, groupby, filtres)",
      "Anglais écrit pour les équipes internationales",
    ],
    toolsTech: [
      "Jira / Linear",
      "Notion / Confluence",
      "Figma (lecture)",
      "Amplitude / Mixpanel",
      "Metabase / Looker",
      "Productboard",
      "Slack",
    ],
    accrocheExample:
      "Product Manager avec 6 ans d'expérience, dont 4 en B2B SaaS verticalisé. Je gère une squad de 6 personnes (4 devs, 1 designer, 1 QA) sur le domaine facturation. Dernier impact marquant : refonte du parcours d'upsell → +18 % de conversion trial→paid sur 2 trimestres. Lecture confortable de SQL, discovery hebdo en direct client.",
    keyKpis: [
      "Taille de l'équipe produit que vous orchestrez (devs + designers)",
      "Impact sur des métriques produit nommées (activation, rétention, conversion)",
      "Nombre de features livrées qui ont tenu leur hypothèse (vs killed)",
      "Taille du scope (ARR impacté, nombre d'utilisateurs concernés)",
      "Fréquence de release et lead time feature",
      "Nombre d'interviews utilisateurs menées par trimestre",
    ],
    commonMistakes: [
      {
        title: "Parler de « features livrées » sans parler d'impact",
        explanation:
          "Un PM évalué au nombre de tickets Jira fermés est en danger. Chaque expérience doit citer au moins une feature dont vous avez mesuré l'impact — et, idéalement, une feature que vous avez arrêtée parce que l'hypothèse était fausse.",
      },
      {
        title: "Se cacher derrière « la roadmap a été définie par le CEO »",
        explanation:
          "Un PM qui n'influence pas la roadmap n'est pas un PM. Même en scale-up avec CEO fondateur, précisez votre apport : discovery, arbitrages, challenge des priorités.",
      },
      {
        title: "Mélanger product manager et project manager",
        explanation:
          "Le CV d'un PM qui ne parle que de Gantt, d'alignement stakeholders et de déploiement ressemble à celui d'un PMO. Ajoutez la dimension produit : discovery utilisateur, décisions de priorisation, expérimentation.",
      },
      {
        title: "Ne pas mentionner comment vous prenez des décisions basées data",
        explanation:
          "Sans mention de Mixpanel, Amplitude, Looker, ou d'A/B tests concrets, le recruteur suppose que vous décidez au feeling. Explicitez l'outillage et les analyses types que vous pilotez.",
      },
    ],
    hiringCompanies: [
      "Qonto",
      "Doctolib",
      "Alan",
      "PayFit",
      "Swile",
      "Aircall",
      "Back Market",
      "Spendesk",
      "Lydia",
      "Vinted",
    ],
    salaryRange: "45-60k€ APM/junior, 60-80k€ PM confirmé, 80-120k€ senior/staff PM en France",
    typicalCareer:
      "Associate PM (1-2 ans) → PM confirmé (3-5 ans) → senior PM ou group PM → head of product, VP product ou CPO en scale-up.",
    relatedSlugs: ["data-analyst", "designer-ux-ui", "chef-de-projet"],
    relatedBlogSlugs: ["mots-cles-offre-emploi", "cv-developpeur-2026"],
    relatedPillarSlugs: ["adapter-cv-offre-emploi", "cv-ats"],
    faq: [
      {
        q: "Quel salaire pour un product manager en 2026 ?",
        a: "45 à 60 k€ brut annuel pour un APM ou junior PM à Paris, 40 à 50 k€ en province. Un PM confirmé (3-5 ans) se situe entre 60 et 80 k€, et les seniors ou group PM atteignent 80-120 k€ dans les scale-ups (Qonto, Doctolib, Alan, PayFit). À noter : le package inclut souvent des BSPCE côté scale-up, qui peuvent peser lourd si la boîte lève. En freelance, rare mais existant, le TJM tourne à 600-900 €/jour.",
      },
      {
        q: "Quel parcours pour devenir product manager ?",
        a: "Pas de diplôme officiel. Les parcours classiques : école de commerce + reconversion via une scale-up, école d'ingé + transition depuis dev ou data, bootcamps produit (Noé, Maestro, Product Institute). Les certifications (Reforge, Pragmatic Institute) ne remplacent pas un vrai track record. La voie la plus rapide reste associate PM dans une scale-up qui forme ses juniors (Doctolib, PayFit, Qonto) après 2-3 ans de tech, design ou data.",
      },
      {
        q: "Faut-il savoir coder ou faire du SQL pour être PM ?",
        a: "Coder, non. SQL basique, quasiment obligatoire en B2B SaaS : joins, filtres, group by, lire une table dans Metabase ou Looker. Un PM qui ne peut pas interroger la donnée lui-même dépend du data team pour chaque décision — ce qui ralentit tout. Côté tech, comprendre une archi API, un ticket Jira et lire un PR simple suffit. Le vrai différenciateur, c'est l'aisance à lire Amplitude ou Mixpanel et à challenger une hypothèse produit.",
      },
      {
        q: "Combien de pages pour un CV de product manager ?",
        a: "Une page pour moins de 5 ans, deux pages maximum au-delà. La structure gagnante : accroche chiffrée (scope, impact), 3-4 expériences avec impact business nommé, pas une liste de tickets livrés. Mettez en avant les décisions de priorisation et les features tuées faute de signal — c'est ce qui distingue un vrai PM d'un chef de projet. Listez 2-3 outils data et 2 outils de spec max ; inutile de citer Jira ET Linear ET Asana.",
      },
    ],
  },

  {
    slug: "devops",
    name: "Ingénieur DevOps",
    nameFull: "Ingénieur DevOps / SRE",
    category: "Tech",
    intro:
      "DevOps et SRE sont les métiers tech les mieux payés en France en 2026, et la demande reste structurellement supérieure à l'offre. Le revers : les exigences techniques sont très concrètes (Kubernetes en prod, pas en démo ; Terraform à l'échelle ; un vrai on-call assuré).",
    recruiterExpectations:
      "Le head of infra veut voir : (1) un stack IaC cohérent (Terraform + CI/CD + cloud principal), (2) une vraie expérience prod avec incidents gérés (pas juste des labs), (3) maîtrise de l'observabilité — si vous ne savez pas lire une trace Datadog ou écrire une alerte Prometheus, vous n'êtes pas SRE. Le CV doit montrer l'échelle (nombre de services, uptime, MTTR).",
    keySkills: [
      "Infrastructure-as-Code (Terraform, Pulumi, modules partagés)",
      "Orchestration containers (Kubernetes, Helm, opérateurs custom)",
      "CI/CD pipelines (GitHub Actions, GitLab CI, ArgoCD)",
      "Observabilité (Prometheus, Grafana, Datadog, OpenTelemetry)",
      "Cloud (AWS, GCP ou Azure — profondeur sur un, connaissance des deux autres)",
      "Sécurité (IAM, secrets management, network policies, SBOM)",
      "Scripting (Python, Bash, Go pour petits outils internes)",
      "Incident response (on-call, runbooks, post-mortems blame-free)",
    ],
    toolsTech: [
      "Terraform",
      "Kubernetes",
      "Docker",
      "AWS / GCP",
      "GitHub Actions / ArgoCD",
      "Datadog / Prometheus / Grafana",
      "Vault",
      "Ansible",
    ],
    accrocheExample:
      "SRE avec 6 ans d'expérience, dont 4 sur GCP + Kubernetes (GKE) pour une plateforme SaaS à 2M req/jour. On-call en rotation 7j/mois, MTTR passé de 45 min à 12 min grâce à la refonte des alertes et des runbooks. Spécialité : migration monolithe → microservices avec gestion de cohabitation longue (12+ mois sans downtime).",
    keyKpis: [
      "Uptime / SLO tenus sur les derniers 12 mois (99,9 % ? 99,95 % ?)",
      "MTTR (mean time to recovery) avant/après vos changements",
      "Nombre de services en prod, taille du cluster K8s (nodes, pods)",
      "Fréquence de déploiement (plusieurs fois/jour, hebdo, mensuel)",
      "Réduction de coût cloud (montant ou pourcentage annuel)",
      "Nombre d'incidents majeurs gérés en lead",
    ],
    commonMistakes: [
      {
        title: "Confondre DevOps et sysadmin avec un CV orienté infrastructure passive",
        explanation:
          "Si votre CV parle majoritairement de VMware, d'AD et de tickets ITIL, vous êtes un sysadmin — pas un DevOps au sens 2026. Réorientez vers IaC, CI/CD, cloud et observabilité.",
      },
      {
        title: "Lister des certifs sans projets à l'appui",
        explanation:
          "CKA, CKAD, AWS SAA, HashiCorp Certified sur un CV sans projet prod derrière, c'est du bruit. Les certifs valident des bases, pas l'expérience. Associez chaque certif à une réalisation concrète.",
      },
      {
        title: "Ne pas parler d'on-call",
        explanation:
          "Un DevOps qui n'a jamais été on-call n'a jamais vu ses systèmes échouer sous vraie charge. Mentionnez la rotation, la fréquence, et au moins un incident type que vous avez résolu.",
      },
      {
        title: "Multiplier les technos sans profondeur",
        explanation:
          "Terraform + Pulumi + CloudFormation + Ansible + Chef + Puppet + Salt sur un CV = rouge. Choisissez un outil d'IaC principal et défendez-le.",
      },
    ],
    hiringCompanies: [
      "Doctolib",
      "OVHcloud",
      "Scaleway",
      "Qonto",
      "BlaBlaCar",
      "Datadog France",
      "Criteo",
      "Deezer",
      "Back Market",
      "Mirakl",
    ],
    salaryRange: "50-65k€ confirmé, 65-90k€ senior, 90-130k€ staff/principal SRE en France",
    typicalCareer:
      "Ingé ops/DevOps junior → SRE confirmé (3-5 ans) → senior SRE ou platform engineer → staff engineer, freelance TJM 700-900€ ou head of infra.",
    relatedSlugs: ["developpeur-web", "data-analyst", "chef-de-projet"],
    relatedBlogSlugs: ["cv-developpeur-2026", "10-erreurs-cv-ats"],
    relatedPillarSlugs: ["cv-ats", "adapter-cv-offre-emploi"],
    faq: [
      {
        q: "Quel salaire pour un DevOps ou SRE en 2026 ?",
        a: "50 à 65 k€ brut annuel pour un profil confirmé (3-5 ans) à Paris, 45 à 55 k€ en province. Les seniors atteignent 65-90 k€, et les staff ou principal SRE dépassent 90-130 k€ dans les scale-ups tech (Doctolib, OVHcloud, Datadog, BlaBlaCar). En freelance, le TJM démarre vers 700 €/jour et monte fréquemment à 900-1 100 € pour les profils K8s + Terraform + AWS avec une vraie expérience d'on-call.",
      },
      {
        q: "Faut-il des certifications CKA ou AWS pour un poste DevOps ?",
        a: "Utile mais pas bloquant. Les scale-ups privilégient l'expérience prod (cluster réel, pas de lab) aux certifs. Le combo qui ouvre le plus de portes : CKA ou CKAD pour Kubernetes, Terraform Associate, et AWS Solutions Architect Associate. Si vous venez de l'admin sys classique et visez une bascule, une certif cloud + un projet perso sur GitHub avec du Terraform + GitHub Actions pèse plus qu'un CV qui liste 15 technos sans preuve.",
      },
      {
        q: "Terraform, Ansible, Pulumi : qu'attend vraiment le marché ?",
        a: "Terraform reste le standard de facto en France (90 % des offres). Ansible conserve une niche sur la config management et les boîtes à historique VMware. Pulumi est confidentiel, utile seulement si l'offre le demande explicitement. Sur le CV, mieux vaut une maîtrise profonde de Terraform (modules partagés, workspace, state backend remote) qu'une liste qui empile tous les IaC du marché sans projet derrière chaque ligne.",
      },
      {
        q: "Comment montrer l'on-call et l'incident response sur un CV ?",
        a: "En chiffrant. Rotation (7 j/mois, semaine sur quatre), nombre d'incidents majeurs gérés, MTTR avant/après vos runbooks, SLO tenus sur les 12 derniers mois (99,9 %, 99,95 %). Un DevOps qui n'a jamais été d'astreinte n'a jamais vu ses systèmes échouer sous vraie charge — les bons recruteurs le repèrent en 30 secondes. Mentionnez aussi PagerDuty ou Opsgenie si utilisés, et citez au moins un post-mortem blame-free que vous avez mené.",
      },
    ],
  },

  {
    slug: "data-engineer",
    name: "Data Engineer",
    nameFull: "Data Engineer / Ingénieur Data",
    category: "Tech",
    intro:
      "Le data engineer est devenu le goulot d'étranglement n°1 des organisations data-driven en 2026 : sans pipelines fiables, pas de BI, pas de ML, pas de features produit data. Le métier s'est industrialisé autour d'un stack dominant — Snowflake ou BigQuery, dbt, Airflow ou Dagster, un warehouse couplé à un lakehouse. Le marché paie cher, mais attend une réelle maturité ingé : tests, CI, data contracts, pas des scripts Python éparpillés.",
    recruiterExpectations:
      "Le head of data ou CTO data cherche : (1) une stack warehouse solide (Snowflake, BigQuery, Redshift) avec maîtrise de la facturation compute et des coûts, (2) de vrais pipelines en production — avec orchestration, alerting, SLA de fraîcheur, (3) une approche software engineering (Git, review, tests dbt, CI). Un data engineer qui n'a jamais géré un incident de pipeline à 3h du matin n'a pas encore tout vu.",
    keySkills: [
      "Modélisation warehouse (star schema, dimensions lentement changeantes, grain)",
      "Pipelines ELT avec dbt (tests, snapshots, macros, exposures)",
      "Orchestration (Airflow, Dagster, Prefect — DAGs, sensors, retries)",
      "Streaming (Kafka, Kinesis, Pub/Sub) et CDC (Debezium, Fivetran)",
      "Stockage objet et lakehouse (S3 + Iceberg / Delta Lake)",
      "Python / SQL niveau prod (typage, tests unitaires, packaging)",
      "Data quality (great_expectations, dbt tests, data contracts)",
      "FinOps data (cost monitoring Snowflake / BigQuery, partition, clustering)",
    ],
    toolsTech: [
      "Snowflake / BigQuery / Redshift",
      "dbt Core / dbt Cloud",
      "Airflow / Dagster / Prefect",
      "Kafka / Kinesis",
      "Python (pandas, PyArrow, SQLAlchemy)",
      "Fivetran / Airbyte / Stitch",
      "Terraform",
      "Git / GitHub Actions",
      "Iceberg / Delta Lake",
      "Docker",
    ],
    accrocheExample:
      "Data engineer, 5 ans dont 3 sur un stack Snowflake + dbt + Airflow pour un marketplace e-commerce (12 TB ingérés/mois, 400+ modèles dbt). J'ai refondu la CI data en 2024 (tests dbt bloquants + recette automatisée sur PR), ce qui a divisé par 4 les incidents de prod liés aux breaking changes. Piloté aussi la migration Redshift → Snowflake avec -38 % de coût compute sur le périmètre analytics.",
    keyKpis: [
      "Volume de données traité par jour (lignes, TB, événements)",
      "Nombre de pipelines / DAGs en production et SLA de fraîcheur tenu",
      "Réduction du coût compute warehouse en % (FinOps data)",
      "Couverture de tests dbt sur les modèles critiques",
      "MTTR incident data et fréquence des breaks de pipeline",
      "Nombre de sources de données ingérées et de consumers aval",
    ],
    commonMistakes: [
      {
        title: "Confondre data engineer et data analyst",
        explanation:
          "Mélanger dashboards Looker et pipelines dbt sur le même CV brouille le positionnement. Le data engineer construit et opère l'infra data — il ne crée pas les graphes. Dites clairement ce que vous produisez : modèles, pipelines, infra, pas des visualisations.",
      },
      {
        title: "Survendre Spark / Hadoop sans volume réel",
        explanation:
          "Écrire « Spark, Hadoop, Hive » pour un warehouse Snowflake de quelques TB fait sourire le lead data. Spark se justifie au-delà de certaines volumétries (ou sur du stream). Sinon, dbt + SQL warehouse suffit, et c'est ce qui est demandé aujourd'hui.",
      },
      {
        title: "Ne rien dire sur la gestion des coûts cloud",
        explanation:
          "Un data engineer qui n'a jamais eu le DAF sur le dos pour une facture Snowflake qui explose n'a pas managé un vrai stack. Mentionnez vos actions FinOps : partitioning, clustering, RI, auto-suspend, allocation de warehouses par équipe.",
      },
      {
        title: "Ignorer la dimension data contracts et data quality",
        explanation:
          "Le DE moderne n'est plus seul — il travaille avec des producers applicatifs et des consumers analytiques. Data contracts, schema enforcement, tests de non-régression : sans ces termes, votre CV paraît bloqué en 2019.",
      },
    ],
    hiringCompanies: [
      "Doctolib",
      "BlaBlaCar",
      "Vinted",
      "Back Market",
      "ManoMano",
      "Qonto",
      "Contentsquare",
      "Criteo",
      "Deezer",
      "Pennylane",
    ],
    salaryRange: "45-58k€ junior, 58-78k€ confirmé, 78-110k€ senior / staff en France (source APEC + Robert Half 2026)",
    typicalCareer:
      "Data engineer junior (1-3 ans) → confirmé (3-5 ans) → senior ou lead data engineer → staff / principal data engineer, head of data platform ou freelance TJM 600-850€.",
    relatedSlugs: ["data-analyst", "devops", "developpeur-web"],
    relatedBlogSlugs: ["cv-developpeur-2026", "mots-cles-offre-emploi"],
    relatedPillarSlugs: ["cv-ats", "adapter-cv-offre-emploi"],
    faq: [
      {
        q: "Quel salaire pour un data engineer en 2026 ?",
        a: "45 à 58 k€ brut annuel pour un junior à Paris (0-2 ans), 58 à 78 k€ pour un confirmé, 78 à 110 k€ pour un senior ou staff. Les scale-ups SaaS et les marketplaces (Doctolib, BlaBlaCar, Vinted, Back Market) sont en haut de la fourchette, notamment pour les profils Snowflake + dbt + Airflow. En freelance, le TJM sweet spot est 600-750 € pour un confirmé, 800-900 € pour un senior avec historique FinOps / streaming.",
      },
      {
        q: "Bac+5 obligatoire pour devenir data engineer ?",
        a: "Non, mais quasi majoritaire en scale-up. Les écoles d'ingénieurs généralistes, les masters informatique et les masters data science donnent accès au métier. Les reconversions par bootcamp (DataScientest, Jedha) fonctionnent aussi si le portfolio GitHub est solide — au minimum un projet end-to-end ingestion → warehouse → dbt avec CI. Ce qui pèse le plus sur le CV, c'est la profondeur du stack mis en production.",
      },
      {
        q: "Faut-il maîtriser Spark pour être data engineer en 2026 ?",
        a: "Plus autant qu'avant. La majorité des scale-ups françaises fonctionnent sur un stack warehouse (Snowflake, BigQuery) + dbt, où Spark n'est plus nécessaire. Spark reste utile sur des volumes massifs (>100 TB) ou pour du batch lourd chez les grands groupes (BNP, Renault, Criteo). Priorisez SQL warehouse, dbt, Python data, orchestration — Spark en option.",
      },
      {
        q: "Quel format de CV pour un data engineer ?",
        a: "Une page en dessous de 5 ans, deux pages sinon. Mettez le stack technique en haut (warehouse + orchestrateur + langages), puis une section expérience orientée résultats : volumes, SLA, réduction de coût, migrations. Un lien GitHub avec un projet de pipeline bien documenté (README, tests, CI) pèse lourd, surtout pour un junior ou un profil en reconversion.",
      },
    ],
  },

  {
    slug: "sre-devops",
    name: "Site Reliability Engineer",
    nameFull: "Site Reliability Engineer (SRE) / Platform Engineer",
    category: "Tech",
    intro:
      "Le SRE est né chez Google et s'est diffusé en France à partir des scale-ups vers 2018-2020. En 2026, il se différencie clairement du DevOps : là où le DevOps outille la livraison, le SRE tient la prod. Error budgets, SLO, toil reduction, post-mortems sans blâme — c'est un état d'esprit ingénieur appliqué à la fiabilité, avec un vrai focus coding et pas juste scripting.",
    recruiterExpectations:
      "Le head of platform ou le VP engineering veut : (1) un on-call documenté — combien de rotations, quelle fréquence, quel périmètre, (2) des SLO réels tenus (99,9 % / 99,95 % sur des services nommés) avec gestion d'error budget, (3) une contribution code — le SRE écrit des opérateurs, des contrôleurs, des outils internes en Go ou Python, pas uniquement du Terraform. Un SRE qui ne code pas est suspect.",
    keySkills: [
      "Définition et tenue de SLO / SLI / error budgets",
      "Production d'outils internes (Go, Python) — contrôleurs K8s, CLI, bots",
      "Chaos engineering et fire drills (GameDays, injection de failures)",
      "Post-mortem blame-free et culture de feedback",
      "Observabilité avancée (traces distribuées, RED metrics, USE)",
      "Capacity planning et autoscaling (HPA, VPA, cluster-autoscaler)",
      "Sécurité runtime (Falco, policy engines, mTLS service mesh)",
      "Réduction du toil et automation des tâches répétitives",
    ],
    toolsTech: [
      "Kubernetes (operators, CRDs, Helm)",
      "Terraform + Terragrunt",
      "Go / Python",
      "Prometheus / Thanos",
      "Grafana / Datadog",
      "OpenTelemetry",
      "Istio / Linkerd",
      "ArgoCD / Flux",
      "AWS / GCP",
      "PagerDuty / Opsgenie",
    ],
    accrocheExample:
      "SRE, 7 ans d'expérience dont 4 sur une plateforme Kubernetes multi-tenants (18 clusters, 350+ services, 4M req/min en pic). On-call en rotation hebdo, SLO 99,95 % tenu 11 mois sur 12 en 2024. J'ai écrit en Go un opérateur K8s qui a automatisé la rotation des certs internes (-92 % de toil sur ce poste). Conduite de GameDays mensuels et de post-mortems structurés.",
    keyKpis: [
      "SLO cibles et taux de respect sur 12 mois (99,9 / 99,95 / 99,99)",
      "Error budget burn rate et fréquence d'épuisement",
      "Rotation on-call : périodicité, nombre de pages/semaine moyen",
      "MTTR incidents majeurs (P0/P1) et MTTD (détection)",
      "% de toil réduit via automation (mesuré en heures/semaine)",
      "Volume de requêtes ou de trafic tenu (req/s, QPS en pic)",
    ],
    commonMistakes: [
      {
        title: "Se positionner SRE sans on-call",
        explanation:
          "SRE = responsabilité de la prod, donc on-call. Si votre rôle était « ingé plateforme en heures ouvrées », assumez « platform engineer » ou « ingé cloud » — pas SRE. Les bons head of platform détectent immédiatement les faux SRE.",
      },
      {
        title: "Lister du Terraform sans parler de code applicatif",
        explanation:
          "Un SRE qui n'écrit que du HCL et des scripts Bash n'est pas un SRE au sens Google SRE Book. Le SRE produit des logiciels — opérateurs K8s, contrôleurs, services internes — en Go ou Python. Sans une ligne de code dans votre CV, c'est un drapeau rouge.",
      },
      {
        title: "Parler d'uptime sans mentionner les SLO",
        explanation:
          "« 99,9 % d'uptime » sans préciser le SLO formel, la fenêtre d'observation, les services couverts est du marketing. Mentionnez le framework : SLI choisi, SLO défini contractuellement, comment l'error budget est géré quand il brûle.",
      },
      {
        title: "Ignorer la dimension post-mortem et culture",
        explanation:
          "Le SRE est autant culturel que technique. Un CV qui ne mentionne ni post-mortems blame-free, ni GameDays, ni runbooks co-construits avec les équipes produit oublie la moitié du rôle. Ajoutez au moins une ligne sur la culture.",
      },
    ],
    hiringCompanies: [
      "Doctolib",
      "Datadog France",
      "OVHcloud",
      "Scaleway",
      "BlaBlaCar",
      "Criteo",
      "Back Market",
      "Qonto",
      "Alan",
      "Contentsquare",
    ],
    salaryRange: "55-70k€ confirmé, 70-95k€ senior, 95-140k€ staff / principal SRE en France (Robert Half 2026)",
    typicalCareer:
      "Ingé ops ou DevOps → SRE confirmé (3-5 ans) → senior SRE ou platform engineer → staff / principal SRE, head of reliability, freelance TJM 750-950€.",
    relatedSlugs: ["devops", "developpeur-web", "data-engineer"],
    relatedBlogSlugs: ["cv-developpeur-2026", "10-erreurs-cv-ats"],
    relatedPillarSlugs: ["cv-ats", "adapter-cv-offre-emploi"],
  },

  // ─────────────────────────── COMMERCE ───────────────────────────
  {
    slug: "commercial-b2b",
    name: "Commercial B2B",
    nameFull: "Commercial B2B / Account Executive",
    category: "Commerce",
    intro:
      "Le commercial B2B qui décroche les meilleurs postes en 2026 n'est plus celui qui « aime le contact client ». C'est celui qui sait documenter sa machine : pipeline, taux de conversion par étape, cycle de vente moyen, panier moyen. Un CV sans chiffres est un CV éliminé au tri.",
    recruiterExpectations:
      "Le head of sales qui vous lit va chercher deux choses : (1) l'atteinte de quota sur les trois derniers exercices — trimestre par trimestre si possible, (2) la rigueur CRM (Salesforce ou HubSpot, avec des exemples de stages, de séquences, de reportings). Un commercial qui dit « je suis bon en relation » sans chiffres sonne comme un débutant ou comme quelqu'un qui cache un sous-performance.",
    keySkills: [
      "Prospection multi-canal (cold email, cold call, LinkedIn social selling)",
      "Qualification (BANT, MEDDIC, SPICED selon l'entreprise)",
      "Cycle de vente complet (discovery → demo → proposition → closing)",
      "Négociation commerciale (grilles tarifaires, remises, clauses contractuelles)",
      "Gestion de pipeline (forecast, hygiène CRM, stage-by-stage conversion)",
      "Account management et cross-sell / upsell sur base installée",
      "Reporting commercial (TCV, ARR, win rate, sales cycle)",
      "Anglais professionnel si compte international",
    ],
    toolsTech: [
      "Salesforce",
      "HubSpot Sales",
      "LinkedIn Sales Navigator",
      "Lemlist / Apollo",
      "Gong / Modjo",
      "Aircall",
      "Notion / Slack",
    ],
    accrocheExample:
      "Commercial B2B, 5 ans d'expérience en SaaS mid-market. 112 % d'atteinte de quota moyen sur les 3 derniers exercices (quota annuel 650k€ ARR). Cycle de vente moyen 42 jours, win rate 27 %. Je prospecte en outbound sur HubSpot + Sales Navigator et je ferme en direct, du premier RDV au contrat signé. CRM à jour quotidiennement — pas négociable.",
    keyKpis: [
      "% d'atteinte de quota sur les 3 derniers exercices (annuel + trimestriel)",
      "Valeur de quota (ARR, TCV annuel) et panier moyen deal",
      "Cycle de vente moyen en jours et win rate en %",
      "Volume pipeline créé (en €) et taux de conversion par étape",
      "Nombre de comptes fermés, ramp time à pleine productivité",
      "Croissance YoY de votre portefeuille clients",
    ],
    commonMistakes: [
      {
        title: "Vague sur les chiffres (« j'ai explosé mes objectifs »)",
        explanation:
          "« J'ai dépassé mes objectifs » sans chiffre précis est l'antithèse du CV commercial. Donnez le quota (« quota 500k€, atteint à 118 % ») — si c'est confidentiel, donnez au moins le pourcentage d'atteinte.",
      },
      {
        title: "Mettre le titre exact interne (« Chargé de développement relation »)",
        explanation:
          "Les titres internes à rallonge cassent le matching ATS : personne ne cherche « Chargé de développement relation ». Utilisez les termes standards : « Account Executive », « Commercial terrain », « Sales B2B ».",
      },
      {
        title: "Mentionner un outil CRM sans niveau d'usage",
        explanation:
          "« Salesforce » sur un CV ne dit pas si vous savez bâtir un rapport ou si vous savez cliquer sur « ajouter un contact ». Précisez : reporting pipe, workflow, intégration avec Gong, quota management.",
      },
      {
        title: "Ne pas parler de son ramp time",
        explanation:
          "Un recruteur sales veut savoir combien de temps vous mettez à monter en charge. « Ramp time 4 mois, quota plein atteint au Q3 » est un signal fort. Dans le doute, mentionnez au moins la date de premier deal signé.",
      },
    ],
    hiringCompanies: [
      "Salesforce France",
      "HubSpot",
      "Contentsquare",
      "Qonto",
      "PayFit",
      "Spendesk",
      "Aircall",
      "Doctolib",
      "Pennylane",
      "Swile",
    ],
    salaryRange: "Package total 45-65k€ junior (OTE), 65-90k€ AE confirmé, 90-140k€ senior/major account en France",
    typicalCareer:
      "SDR / BDR (1-2 ans) → Account Executive (3-5 ans) → Senior AE ou enterprise AE → Sales manager, head of sales, VP sales.",
    relatedSlugs: ["business-developer", "account-manager", "ingenieur-commercial"],
    relatedBlogSlugs: ["cv-commercial-structure-gagnante", "mots-cles-offre-emploi"],
    relatedPillarSlugs: ["adapter-cv-offre-emploi", "cv-ats"],
    faq: [
      {
        q: "Quel salaire pour un commercial B2B en 2026 ?",
        a: "Package OTE 45 à 65 k€ pour un AE junior à Paris (1-3 ans), dont 60 à 70 % en fixe et le reste en variable sur quota. Un AE confirmé tourne à 65-90 k€ OTE, et les seniors / enterprise AE montent à 90-140 k€ dans les scale-ups SaaS (Qonto, Doctolib, HubSpot, Salesforce France). En province, compter 15-20 % de moins. Le variable est rarement plafonné, donc un top performer peut dépasser nettement le package affiché.",
      },
      {
        q: "Quel diplôme pour devenir commercial B2B ?",
        a: "École de commerce post-bac ou BTS NDRC / MCO reste la voie classique, mais le marché SaaS accepte massivement les reconversions : lettres, histoire, sport-études, agronomie. Ce qui décide, c'est l'atteinte de quota sur les 2-3 derniers exercices. Les certifications méthodo (Winning by Design, SalesHood) sont un plus, jamais un prérequis. Un bon SDR sorti sans diplôme mais avec 110 % de quota trois trimestres d'affilée passe devant un bac+5 sans résultat.",
      },
      {
        q: "Faut-il maîtriser Salesforce ou HubSpot avant de postuler ?",
        a: "Oui, au moins l'un des deux. Salesforce domine l'enterprise et les licornes, HubSpot domine les PME et scale-ups early-stage. Le CV doit préciser le niveau : « Salesforce utilisateur quotidien, construction de rapports pipeline et dashboards » vs « Salesforce : notions ». Les outils complémentaires attendus en 2026 : LinkedIn Sales Navigator, Gong ou Modjo pour le call review, et Lemlist ou Apollo si le poste touche à l'outbound.",
      },
      {
        q: "Comment chiffrer ses résultats commerciaux sur un CV ?",
        a: "Trois chiffres non-négociables par expérience : montant de quota annuel, % d'atteinte, et nombre de deals fermés ou ARR généré. Si le quota est confidentiel, au minimum le % d'atteinte et la taille moyenne des deals. Mentionnez aussi le ramp time (temps pour atteindre pleine productivité), le win rate et le cycle de vente moyen. Un CV commercial sans chiffres est éliminé au premier tri — c'est le point unique de sélection des heads of sales.",
      },
    ],
  },

  {
    slug: "business-developer",
    name: "Business Developer",
    nameFull: "Business Developer / SDR senior",
    category: "Commerce",
    intro:
      "Le rôle de business developer est devenu flou en France : il recouvre à la fois des postes purement outbound (proche SDR) et des postes mixtes outbound + closing (proche AE). Cette ambiguïté est une opportunité : un CV bien positionné peut postuler aux deux types de poste, à condition d'être limpide sur ce que vous avez fait.",
    recruiterExpectations:
      "Le sales manager veut d'abord savoir où vous vous situez sur le cycle : pure prospection ? qualification seule ? closing sur petits comptes ? Ensuite il regarde les volumes — nombre de meetings générés, conversion meeting→opportunity, ARR influencé. Un bizdev senior sans volume outbound documenté ressemble à un faux bizdev.",
    keySkills: [
      "Cold outreach multi-canal (email automation, LinkedIn, phone)",
      "Construction de séquences (messages A/B testés, cadence optimisée)",
      "Qualification de leads entrants et sortants (fit, intent, budget)",
      "Account-based marketing (ABM) pour cibler des grands comptes nommés",
      "Lead scoring et travail avec marketing sur la génération pipe",
      "Tests de nouveaux segments ou nouvelles offres (méthode expérimentale)",
      "Reporting hebdo : leads générés, meetings bookés, SQL, pipe créé",
      "Coaching et onboarding de nouveaux SDR si poste senior",
    ],
    toolsTech: [
      "Lemlist / Lemwarm",
      "Apollo / LaGrowthMachine",
      "Salesforce / HubSpot",
      "LinkedIn Sales Navigator",
      "Phantombuster",
      "Notion",
      "Slack",
    ],
    accrocheExample:
      "Business developer en scale-up SaaS, 3 ans d'expérience dont 18 mois en bizdev senior. J'ai généré en moyenne 42 meetings qualifiés par mois avec un taux SQL 61 %, pour un pipeline influencé de 2,1M€ ARR sur 2024. Je conçois les séquences outbound et je teste 2-3 angles par trimestre pour ouvrir de nouveaux segments.",
    keyKpis: [
      "Meetings générés par mois (volume moyen sur 12 mois)",
      "Conversion meeting → SQL → opportunity en %",
      "Pipeline influencé (ARR ou TCV) sur l'année",
      "Nombre de deals closés ou assistés (si partie closing)",
      "Taux d'ouverture / réponse des séquences cold email",
      "Nombre d'angles ou segments testés sur la période",
    ],
    commonMistakes: [
      {
        title: "Se vendre comme « senior » avec 12 mois d'expérience",
        explanation:
          "Le marché sait que la séniorité bizdev commence à 2-3 ans avec des résultats documentés. Afficher « senior » trop tôt ferme des portes chez les bons managers, qui préfèrent les profils honnêtes.",
      },
      {
        title: "Ne pas mentionner les outils de séquençage",
        explanation:
          "Un bizdev moderne vit dans Lemlist, Apollo, LaGrowthMachine ou équivalent. Si votre CV ne mentionne aucun de ces outils, on va supposer que vous faites du manuel — donc que vous ne scalez pas.",
      },
      {
        title: "Confondre leads entrants et outbound",
        explanation:
          "« 40 meetings bookés par mois » sans préciser si c'est sur leads entrants (warm) ou outbound (cold) change tout. Le second est 5-10x plus difficile. Précisez toujours la source.",
      },
      {
        title: "Ne pas parler du ratio SDR→AE si transition visée",
        explanation:
          "Si vous visez un passage vers AE, il faut montrer que vous êtes prêt : un ou deux deals closés, une participation à des cycles longs, un shadowing documenté. Sans ça, le recruteur continue de vous voir en SDR.",
      },
    ],
    hiringCompanies: [
      "Spendesk",
      "PayFit",
      "Swile",
      "Pennylane",
      "Qonto",
      "Aircall",
      "Contentsquare",
      "Doctolib",
      "Lemlist",
      "Malt",
    ],
    salaryRange: "Package 38-48k€ junior (OTE), 48-65k€ senior bizdev, 65-80k€ si transition AE en France",
    typicalCareer:
      "SDR (1-2 ans) → Business developer / senior SDR (2-3 ans) → Account Executive ou team lead SDR → head of bizdev.",
    relatedSlugs: ["commercial-b2b", "account-manager", "charge-marketing-digital"],
    relatedBlogSlugs: ["cv-commercial-structure-gagnante", "mots-cles-offre-emploi"],
    relatedPillarSlugs: ["adapter-cv-offre-emploi", "cv-ats"],
    faq: [
      {
        q: "Quel salaire pour un business developer en 2026 ?",
        a: "Package OTE 38 à 48 k€ pour un SDR ou bizdev junior en scale-up SaaS, dont 65-75 % en fixe. Un bizdev senior (2-3 ans de track record) monte à 48-65 k€, et un profil en transition vers AE démarre autour de 65-80 k€. Les scale-ups parisiennes (Spendesk, PayFit, Qonto, Aircall) sont alignées sur ces fourchettes ; les startups early-stage sont 10-15 % en dessous, souvent compensées par des BSPCE. En province, moins de postes mais fourchettes équivalentes à Paris - 10 %.",
      },
      {
        q: "Faut-il un diplôme spécifique pour devenir bizdev ?",
        a: "Non, c'est l'un des métiers les plus ouverts aux reconversions. Écoles de commerce, fac de lettres, sciences po, sport-études, ingénieurs en redirection : tout fonctionne si la motivation est claire et les premiers résultats apparaissent vite. Le marché recrute aujourd'hui sur la rigueur process (respect des séquences, hygiène CRM, reporting) plus que sur le parcours académique. Un bootcamp sales (Launch, Uptoo Academy) peut accélérer une reconversion mais ne remplace pas un vrai premier mandat SDR.",
      },
      {
        q: "Lemlist, Apollo, LaGrowthMachine : quel outil privilégier ?",
        a: "Lemlist domine la scale-up française pour le cold email personnalisé à petite échelle. Apollo s'impose sur les gros volumes avec sa base de contacts intégrée. LaGrowthMachine couvre mieux le multi-canal (LinkedIn + email + téléphone) avec automation. Sur le CV, mentionnez l'outil principal utilisé avec volume de séquences construites et taux d'ouverture / réponse moyens. Un bizdev 2026 sans aucun de ces trois outils sur son CV paraît instantanément à côté du marché.",
      },
      {
        q: "Comment documenter ses résultats de prospection ?",
        a: "Quatre chiffres à donner systématiquement : nombre de meetings générés par mois, taux de conversion meeting → SQL, pipeline influencé en ARR ou TCV, et taux d'ouverture / réponse des séquences cold. Précisez toujours la source (outbound pur vs inbound warm), car les deux n'ont pas la même difficulté. Si vous visez une transition vers AE, ajoutez le nombre de deals shadow ou co-closés. Un CV d'une page reste la norme sous 3 ans d'expérience.",
      },
    ],
  },

  {
    slug: "ingenieur-commercial",
    name: "Ingénieur commercial",
    nameFull: "Ingénieur commercial / Technical Sales",
    category: "Commerce",
    intro:
      "L'ingénieur commercial vend des solutions techniques à des acheteurs techniques — industrie, SaaS infra, équipement, énergie. Le marché reste très tendu sur les profils double compétence (bac+5 ingé ou école de commerce + fibre technique), notamment dans la tech B2B et l'industrie française.",
    recruiterExpectations:
      "Le directeur commercial cherche : (1) la crédibilité technique — pouvoir tenir une conversation avec l'ingénieur client sans lire ses slides, (2) la maîtrise du cycle long (6-18 mois) avec steering committees, RFP, POCs, (3) le track record en €. Contrairement au commercial B2B classique, on attend un panier moyen élevé (souvent >100k€) et une vraie gestion de comptes stratégiques.",
    keySkills: [
      "Découverte technique (architecture client, intégration, contraintes)",
      "Proof of concept (scoping, suivi, critères de succès)",
      "Réponse à appel d'offres (RFP / RFI, aspects techniques et commerciaux)",
      "Négociation grands comptes (masters agreements, SLA, pénalités)",
      "Relation comité de direction et CTO/DSI côté client",
      "Gestion d'un pipeline long (18 mois, steering comité, paliers de décision)",
      "Collaboration solutions engineer / pre-sales / product",
      "Anglais technique (groupes internationaux, docs ingé)",
    ],
    toolsTech: [
      "Salesforce",
      "MEDDIC / MEDDPICC",
      "Lucidchart / draw.io",
      "PowerPoint niveau C-level",
      "Jira",
      "LinkedIn Sales Navigator",
      "Excel avancé (grilles tarifaires)",
    ],
    accrocheExample:
      "Ingénieur commercial avec 8 ans d'expérience, dont 5 en industrie 4.0 et 3 en SaaS infra. Quota annuel 1,8M€ ARR, atteint à 104 % en moyenne sur les 3 derniers exercices. Panier moyen 180k€, cycle 11 mois. Je pilote en autonomie des POCs multi-sites avec l'équipe solutions et je négocie des cadres-contrats multi-annuels avec DSI de grands comptes.",
    keyKpis: [
      "Quota en € et atteinte sur 3 exercices",
      "Panier moyen deal et deal max fermé",
      "Cycle de vente moyen sur grands comptes (mois)",
      "Nombre de POCs pilotés et taux de conversion POC → contrat",
      "Comptes stratégiques développés (volume d'ARR sur le top 5)",
      "Renouvellement / expansion sur base installée",
    ],
    commonMistakes: [
      {
        title: "Trop de jargon technique sans contexte business",
        explanation:
          "Un CV d'ingé commercial qui ressemble à un CV d'ingé étude (« architecture SCADA / OPC UA ») sans mention d'€ ni de cycle vente fait passer le candidat pour un ingénieur qui essaie de basculer. Équilibrez tech et business.",
      },
      {
        title: "Ne pas différencier deals nouveaux et renouvellements",
        explanation:
          "« J'ai fait 1,8M€ » peut cacher 90 % de renouvellement passif. Séparez clairement new business et renewal / expansion — le recruteur veut savoir à quel point vous êtes hunter.",
      },
      {
        title: "Oublier les certifications techniques du secteur",
        explanation:
          "Dans l'industriel et l'IT, les certifications techniques (Siemens, Rockwell, AWS, Cisco selon secteur) sont un gage de crédibilité face au client. Listez-les distinctement des certifs sales.",
      },
      {
        title: "Un CV sans une seule référence client nommée",
        explanation:
          "Si vous pouvez citer des clients connus (sous réserve confidentialité), faites-le. « Comptes stratégiques : Renault, EDF, Saint-Gobain » porte beaucoup plus que « grands comptes industriels ».",
      },
    ],
    hiringCompanies: [
      "Dassault Systèmes",
      "Schneider Electric",
      "Siemens France",
      "SAP France",
      "Orange Business",
      "Capgemini",
      "OVHcloud",
      "Oracle France",
      "Atos",
      "Thales",
    ],
    salaryRange: "Package 55-75k€ junior (OTE), 75-110k€ confirmé, 110-170k€ senior / grands comptes en France",
    typicalCareer:
      "Ingé commercial junior → confirmé (3-6 ans) → senior / major accounts → directeur commercial régional, directeur grands comptes.",
    relatedSlugs: ["commercial-b2b", "account-manager", "consultant"],
    relatedBlogSlugs: ["cv-commercial-structure-gagnante", "mots-cles-offre-emploi"],
    relatedPillarSlugs: ["adapter-cv-offre-emploi", "cv-ats"],
    faq: [
      {
        q: "Quel salaire pour un ingénieur commercial en 2026 ?",
        a: "Package OTE 55 à 75 k€ pour un junior (0-3 ans) à Paris, dont 70 % de fixe. Un ingé commercial confirmé atteint 75-110 k€ OTE, et les seniors ou grands comptes montent à 110-170 k€ dans l'industriel et le SaaS infra (Dassault Systèmes, Schneider Electric, SAP, OVHcloud). Le package est souvent déplafonné chez les éditeurs : un top performer sur enterprise peut dépasser 200 k€ en année pleine. En province (Lyon, Toulouse, Grenoble), même fourchette car les postes sont rares.",
      },
      {
        q: "Faut-il un diplôme d'ingénieur pour le poste ?",
        a: "Pas obligatoire, mais fortement valorisé dans l'industrie (Centrale, Arts et Métiers, INSA, Polytech) et le SaaS infra. Les écoles de commerce avec majeure tech ou un double cursus ingé + ESCP/HEC/EM Lyon sont aussi très cotés. Pour une reconversion depuis ingé étude ou avant-vente (solutions engineer), l'avantage est clair : la crédibilité technique existe déjà, reste à démontrer le side commercial. Sans aucune formation tech, le poste reste accessible uniquement via ramp long en ESN ou éditeur.",
      },
      {
        q: "MEDDIC, MEDDPICC : faut-il maîtriser ces méthodes ?",
        a: "Oui, c'est devenu un quasi-standard chez les éditeurs B2B pour les cycles longs. MEDDIC (Metrics, Economic buyer, Decision criteria, Decision process, Identify pain, Champion) est la base ; MEDDPICC ajoute Paper process et Competition. Mentionnez la méthode sur le CV, avec un exemple concret : « cycle enterprise 11 mois qualifié en MEDDPICC, déal 180k€ fermé en Q3 2024 ». Précisez aussi votre rapport aux RFP / appels d'offres et aux POCs, qui sont les moments qui font basculer les gros deals.",
      },
      {
        q: "Comment présenter les grands comptes confidentiels ?",
        a: "Si la confidentialité est stricte, utilisez des descripteurs génériques : « groupe du CAC 40 secteur énergie », « éditeur SaaS licorne française », « constructeur automobile européen ». Mais citez les clients nommément dès que possible — « comptes développés : Renault, EDF, Saint-Gobain » pèse beaucoup plus que « grands comptes industriels ». Séparez toujours new business et renouvellement dans les chiffres, car le recruteur cherche à savoir si vous êtes hunter ou farmer. CV deux pages toléré à partir de 5 ans d'expérience.",
      },
    ],
  },

  {
    slug: "account-manager",
    name: "Account Manager",
    nameFull: "Account Manager / Key Account Manager",
    category: "Commerce",
    intro:
      "L'account manager est le commercial des clients existants : il protège la base, cherche l'upsell, gère les renouvellements. C'est un métier très chiffré — net revenue retention, churn, expansion — et l'erreur la plus fréquente est de se vendre comme un AE acquisition.",
    recruiterExpectations:
      "Le head of account management veut : (1) des chiffres de rétention et d'expansion (NRR, gross retention, expansion rate), (2) une vraie granularité portefeuille (« 18 comptes, dont 4 stratégiques pesant 60 % de l'ARR »), (3) une maîtrise du QBR (Quarterly Business Review) et des plans de comptes. Le profil doit respirer la relation longue, pas la chasse.",
    keySkills: [
      "Gestion de portefeuille clients (segmentation, priorisation, account planning)",
      "Conduite de QBR et restitutions exécutives",
      "Upsell / cross-sell (identification opportunités, négociation)",
      "Gestion de renouvellement (timing, contract terms, escalation)",
      "Rétention et prévention du churn (health score, early warnings)",
      "Coordination multi-interlocuteurs (sponsor, user, finance, IT)",
      "Négociation d'extension de périmètre et de contrats pluriannuels",
      "Reporting NRR / GRR / expansion rate par segment",
    ],
    toolsTech: [
      "Salesforce",
      "Gainsight / Planhat",
      "ChurnZero",
      "Slack",
      "Notion",
      "Gong",
      "Excel avancé",
    ],
    accrocheExample:
      "Account Manager senior, 6 ans en SaaS B2B mid-market et enterprise. Portefeuille actuel : 22 comptes pour 3,4M€ ARR, dont 5 stratégiques (60 % de l'ARR). Net revenue retention 118 % sur 2024, gross retention 94 %. Je pilote 3 QBR par trimestre sur mes comptes stratégiques et je coordonne CS, produit et tech pour tenir les engagements de renouvellement.",
    keyKpis: [
      "Taille du portefeuille en ARR et nombre de comptes",
      "Net revenue retention (NRR) sur les 12 derniers mois",
      "Gross retention et taux de churn annuel",
      "Expansion / upsell revenue généré",
      "Nombre de QBR menés par trimestre",
      "Répartition top 20 / 80 de l'ARR dans le portefeuille",
    ],
    commonMistakes: [
      {
        title: "Se vendre comme un hunter / chasseur",
        explanation:
          "Un AM qui cherche à se faire passer pour un AE perd sur les deux tableaux : le recruteur AM pense qu'il est lassé de la rétention, le recruteur AE voit qu'il n'a pas fait de vraie prospection froide. Assumez le métier.",
      },
      {
        title: "Ne pas chiffrer la rétention",
        explanation:
          "Un CV d'AM sans NRR, sans gross retention, sans churn est suspect. Même une estimation honnête vaut mieux que rien : « NRR estimé 110 % sur périmètre » est acceptable.",
      },
      {
        title: "Confondre account manager et customer success",
        explanation:
          "AM = responsable commercial du compte, avec quota d'expansion et de renouvellement. CSM = responsable adoption et valeur perçue, sans quota direct d'upsell dans la plupart des orgs. Si vous avez fait du mixte, précisez la répartition.",
      },
      {
        title: "Lister tous les comptes sans hiérarchiser",
        explanation:
          "Citer 30 clients sans hiérarchie (stratégique / mid / tail) donne une impression de volume indifférencié. Structurez : top 5 comptes nommés, puis agrégats.",
      },
    ],
    hiringCompanies: [
      "Salesforce France",
      "HubSpot",
      "Zendesk",
      "Contentsquare",
      "Doctolib",
      "PayFit",
      "Aircall",
      "Akeneo",
      "Mirakl",
      "Algolia",
    ],
    salaryRange: "Package 45-60k€ junior (OTE), 60-85k€ confirmé, 85-130k€ senior / KAM en France",
    typicalCareer:
      "AM junior → AM confirmé (3-5 ans) → Senior AM / Key Account Manager → head of account management, VP customer.",
    relatedSlugs: ["commercial-b2b", "customer-success", "business-developer"],
    relatedBlogSlugs: ["cv-commercial-structure-gagnante", "mots-cles-offre-emploi"],
    relatedPillarSlugs: ["adapter-cv-offre-emploi", "cv-ats"],
    faq: [
      {
        q: "Quel salaire pour un account manager en 2026 ?",
        a: "Package OTE 45 à 60 k€ pour un AM junior en scale-up SaaS, dont 75 % de fixe (la part variable étant plus faible qu'un AE car basée sur la rétention + expansion). Un AM confirmé tourne à 60-85 k€, et les seniors ou Key Account Managers montent à 85-130 k€ OTE chez les éditeurs B2B (Salesforce, HubSpot, Contentsquare, Doctolib). Les profils KAM enterprise gérant plus de 5M€ d'ARR dépassent fréquemment 130 k€ avec bonus d'expansion.",
      },
      {
        q: "Quelle différence concrète AM / CSM / AE sur un CV ?",
        a: "AE chasse du new business sur un quota d'acquisition. AM protège la base installée avec quota de rétention + expansion (NRR, GRR, upsell chiffré). CSM assure adoption et valeur perçue, sans quota commercial direct dans la plupart des orgs. Un CV qui mélange les trois donne l'impression d'un profil flou. Positionnez-vous nettement : si vous avez fait du mixte, donnez la répartition (« 70 % rétention, 30 % upsell structuré avec quota dédié »).",
      },
      {
        q: "Gainsight, Planhat, ChurnZero : lequel maîtriser ?",
        a: "Gainsight reste le standard enterprise et domine aux US, utilisé chez Salesforce France, Contentsquare, Algolia. Planhat est plus léger et en forte croissance dans les scale-ups françaises. ChurnZero se positionne entre les deux. Sur le CV, mentionnez l'outil avec niveau d'usage : « Gainsight — construction des health scores, playbooks d'escalade, dashboards portefeuille ». Précisez aussi Salesforce si utilisé en parallèle pour le pipeline d'expansion.",
      },
      {
        q: "Comment chiffrer la rétention sur un CV d'AM ?",
        a: "Les trois métriques clés : Net Revenue Retention (NRR cible 105-120 % en SaaS B2B), Gross Retention Rate (GRR cible 90-95 %), et expansion revenue en € ou %. Donnez le périmètre : taille portefeuille en ARR, nombre de comptes, segment (mid-market vs enterprise), concentration (« top 5 comptes = 60 % de l'ARR »). Même en estimation honnête, ces chiffres doivent apparaître — un CV d'AM sans NRR ni GRR est systématiquement écarté. Une page pour moins de 5 ans, deux au-delà.",
      },
    ],
  },

  {
    slug: "responsable-commercial",
    name: "Responsable commercial",
    nameFull: "Responsable commercial / Directeur commercial",
    category: "Commerce",
    intro:
      "Responsable commercial est un poste charnière : vous n'êtes plus un vendeur, vous êtes un manager qui porte un chiffre d'équipe. Les recruteurs cherchent en 2026 des profils qui ont déjà construit une équipe, pas seulement performé en individuel. La transition d'AE à responsable est un piège classique : sans preuve de management, le CV reste lu comme un CV de commercial senior.",
    recruiterExpectations:
      "Le CEO ou le VP sales attend : (1) la taille d'équipe managée (AEs, SDRs, AMs), le nombre de recrutements effectués en direct, (2) la responsabilité P&L commercial — quota d'équipe, atteinte collective, contribution ARR, (3) la construction de process — playbooks, onboarding commercial, outils. Un responsable commercial qui se vante uniquement de son quota personnel rate le poste.",
    keySkills: [
      "Management d'équipe commerciale (one-to-ones, coaching, évaluation)",
      "Définition de quota d'équipe et de plan de rémunération variable",
      "Recrutement commercial (brief, sourcing, entretiens techniques sales)",
      "Sales ops basique (forecast pipeline, règles d'attribution, territoires)",
      "Construction de playbooks et d'un onboarding commercial scalable",
      "Reporting P&L commercial au COMEX (bookings, attrition, ramp)",
      "Gestion de la relation marketing (SLA lead generation, SLA qualification)",
      "Coaching sur deals stratégiques (co-pilotage closing gros comptes)",
    ],
    toolsTech: [
      "Salesforce / HubSpot",
      "Gong / Modjo",
      "Clari / InsightSquared",
      "Slack",
      "Notion / Confluence",
      "Excel avancé (comp plan, forecast)",
      "BambooHR / Payfit (RH commerciale)",
      "LinkedIn Sales Navigator",
      "Aircall",
    ],
    accrocheExample:
      "Responsable commercial, 8 ans d'expérience sales dont 3 en management. J'encadre une équipe de 6 personnes (4 AEs + 2 SDRs) sur le mid-market SaaS B2B (quota d'équipe 3,2M€ ARR annuel, atteint à 106 % en 2024). J'ai recruté 4 des 6 membres actuels, redesigné le plan de compensation en 2023 (-22 % de turnover), et mis en place un onboarding commercial de 6 semaines qui a réduit le ramp de 7 à 4,5 mois.",
    keyKpis: [
      "Taille d'équipe managée (AEs, SDRs, répartition senior/junior)",
      "Quota d'équipe en € et atteinte collective sur les 3 derniers exercices",
      "Nombre de recrutements commerciaux réussis (retention 12 mois)",
      "Ramp time moyen des nouveaux vendeurs avant/après vos actions",
      "Turnover équipe commerciale (cible < 15 % annuel)",
      "Croissance YoY du pipeline et du bookings équipe",
    ],
    commonMistakes: [
      {
        title: "Mettre son quota individuel en avant au lieu du quota d'équipe",
        explanation:
          "Un responsable commercial évalué à son quota personnel n'a pas fait la transition. Le chiffre qui compte, c'est l'atteinte du quota d'équipe, pas vos deals perso. Sauf cas explicite de player-coach, le quota individuel doit disparaître du CV au-delà de la mention contextuelle.",
      },
      {
        title: "Ne pas chiffrer le turnover et les recrutements",
        explanation:
          "Une équipe commerciale qui se renouvelle tous les 9 mois est un désastre qui coûte cher. Mentionnez votre taux de rétention et le nombre de recrutements bouclés — c'est souvent ce qui distingue un bon manager d'un super IC promu sans filet.",
      },
      {
        title: "Oublier la partie sales ops",
        explanation:
          "Territoire, quota design, comp plan, rules of engagement avec marketing et CS : un responsable commercial moderne porte ces chantiers, seul ou avec un sales ops. Un CV qui n'en parle pas signale un manager passif qui exécute la stratégie du VP sales.",
      },
      {
        title: "Rester vague sur le coaching",
        explanation:
          "« Manager et accompagner l'équipe » ne dit rien. Précisez : one-to-ones hebdo, call reviews sur Gong, deal reviews mensuelles sur les top 5 opps de chaque AE, plan de formation trimestriel. Le recruteur veut voir un rythme de coaching concret.",
      },
    ],
    hiringCompanies: [
      "Doctolib",
      "Qonto",
      "PayFit",
      "Swile",
      "Spendesk",
      "Pennylane",
      "Contentsquare",
      "Aircall",
      "Akeneo",
      "Mirakl",
      "Malt",
    ],
    salaryRange: "Package 75-100k€ responsable confirmé (OTE), 100-150k€ senior, 140-220k€ VP sales / directeur commercial en France (APEC 2026)",
    typicalCareer:
      "AE confirmé ou team lead (5-7 ans) → responsable commercial / sales manager (2-4 ans) → head of sales → VP sales, CRO en scale-up ou directeur commercial en ETI.",
    relatedSlugs: ["commercial-b2b", "ingenieur-commercial", "account-manager"],
    relatedBlogSlugs: ["cv-commercial-structure-gagnante", "mots-cles-offre-emploi"],
    relatedPillarSlugs: ["adapter-cv-offre-emploi", "cv-ats"],
    faq: [
      {
        q: "Quelle expérience pour postuler responsable commercial ?",
        a: "5 à 7 ans d'expérience sales (AE puis senior AE ou team lead) sont le minimum attendu en scale-up. Les boîtes plus matures exigent 8-10 ans avec au moins 2 ans en management officiel ou player-coach. Un passage par un rôle de team lead SDR ou AE de 12-18 mois, même informel, pèse beaucoup plus qu'un parcours 100 % IC. Les candidatures promues sans passerelle management sont généralement écartées pour les postes à 6 personnes ou plus.",
      },
      {
        q: "Comment montrer qu'on est un bon manager commercial sur un CV ?",
        a: "Par des chiffres d'équipe : quota collectif atteint sur 3 ans, taux de rétention de l'équipe (< 15 % de turnover), nombre de recrutements signés que vous avez menés de A à Z, ramp time réduit, plan de compensation redesigné. Les compétences « soft » (« leader inspirant ») sont inaudibles sans preuves — préférez « j'ai recruté 4 des 6 membres de l'équipe actuelle, 100 % encore en poste 18 mois après ».",
      },
      {
        q: "Faut-il un MBA pour devenir directeur commercial ?",
        a: "Non, sauf pour certains grands groupes industriels qui le valorisent. Dans le SaaS et la tech, le track record opérationnel prime : chiffres d'équipe, recrutements, structure mise en place. Un MBA HEC, ESSEC ou INSEAD ouvre des portes à 40 ans pour un saut CRO / VP sales chez les fonds, mais ne remplace pas 3 ans de management effectif. Les formations courtes (Challenger Sale, MEDDPICC) sont plus lues que les MBAs sur un CV de 35 ans.",
      },
      {
        q: "Une page ou deux pour un CV de responsable commercial ?",
        a: "Deux pages, quasi systématiquement. Un responsable commercial à 8-12 ans d'expérience a besoin d'espace pour exposer les équipes managées, les chiffres, les recrutements, les process. Gardez les deux-tiers de la première page sur le poste actuel et le précédent (les plus lus), et compressez les débuts de carrière sur la seconde. Évitez absolument les trois pages — c'est le signal d'un candidat qui ne sait pas arbitrer.",
      },
    ],
  },

  // ─────────────────────────── MARKETING ───────────────────────────
  {
    slug: "charge-marketing-digital",
    name: "Chargé de marketing digital",
    nameFull: "Chargé·e de marketing digital / Growth Marketer",
    category: "Marketing",
    intro:
      "Le chargé de marketing digital en 2026 couvre un périmètre très large — SEO, SEA, social paid, email, landing pages, analytics. Le marché valorise aujourd'hui les profils qui ont un lead canal de spécialisation (ex : acquisition payante) plutôt que ceux qui font tout en surface.",
    recruiterExpectations:
      "Le head of marketing ou growth cherche : (1) de la maîtrise canal — vous êtes réellement bon sur 1 ou 2 canaux (Meta Ads, Google Ads, SEO, email), (2) de la rigueur data — vous savez construire un tableau de bord acquisition et parler CAC / LTV, (3) de l'exécution — vous avez lancé des campagnes vous-même, pas juste piloté une agence. Les profils « j'ai briefé l'agence » sont en surcapacité.",
    keySkills: [
      "Acquisition payante (Google Ads, Meta Ads, LinkedIn Ads selon cible)",
      "SEO technique et éditorial (audit, ligne éditoriale, netlinking)",
      "Email marketing et automation (séquences, segmentation, A/B)",
      "Landing pages et CRO (tests, hiérarchie, preuve sociale)",
      "Analytics (GA4, events custom, dashboards Looker Studio)",
      "Tracking et attribution (pixels, UTM, server-side tagging)",
      "Copywriting d'accroche et de CTA qui convertit",
      "Budget pilotage (allocation canal, CAC cible)",
    ],
    toolsTech: [
      "Google Ads / Meta Ads",
      "GA4 / Looker Studio",
      "Google Search Console / Ahrefs",
      "HubSpot / Brevo",
      "Webflow / Framer",
      "Notion",
      "Tag Manager",
    ],
    accrocheExample:
      "Chargée de marketing digital en scale-up B2B, 4 ans. Lead sur l'acquisition payante Meta + LinkedIn : budget mensuel géré 45k€, CAC passé de 380€ à 240€ en 6 mois via refonte des audiences et des creatives. Je construis les campagnes moi-même (creative brief → mise en ligne → optimisation), je pilote mes dashboards GA4 et je teste 4-6 hypothèses par mois.",
    keyKpis: [
      "Budget média mensuel géré (en €)",
      "CAC et évolution YoY ou avant/après vos actions",
      "ROAS ou CPA sur campagnes paid",
      "Volume trafic SEO et évolution sur 12 mois",
      "Taux de conversion landing pages (avant/après tests)",
      "Nombre de campagnes lancées et d'A/B tests menés",
    ],
    commonMistakes: [
      {
        title: "Se dire « expert multi-canal » sans preuve sur un canal précis",
        explanation:
          "Dire qu'on maîtrise SEO + SEA + social + email + CRM avec 2 ans d'expérience est peu crédible. Spécifiez votre canal fort (« expertise paid social, notions SEO ») pour crédibiliser.",
      },
      {
        title: "Ne mentionner aucun budget géré",
        explanation:
          "Un marketer sans budget chiffré est un exécutant. Même 5 000€/mois sur Google Ads compte — mentionnez-le. Les recruteurs filtrent souvent sur des seuils de budget.",
      },
      {
        title: "Parler de « leads » sans contexte de qualité",
        explanation:
          "« 500 leads générés en 3 mois » ne dit rien si 450 étaient pourris. Précisez : MQL, SQL, conversion en opportunity ou en client, coût par lead qualifié.",
      },
      {
        title: "Ne pas citer un seul KPI d'acquisition (CAC, LTV, ROAS)",
        explanation:
          "Si votre CV ne contient pas les mots CAC, LTV, ROAS, CPA, CPL, il ne passe pas les filtres ATS marketing digital. C'est le vocabulaire minimum du métier.",
      },
    ],
    hiringCompanies: [
      "BlaBlaCar",
      "Yuka",
      "Back Market",
      "ManoMano",
      "Lydia",
      "Alan",
      "Doctolib",
      "Vinted",
      "PayFit",
      "Swile",
    ],
    salaryRange: "35-45k€ junior, 45-58k€ confirmé, 58-80k€ senior / growth lead en France",
    typicalCareer:
      "Chargé junior → confirmé (2-4 ans) → senior / growth manager → head of growth ou freelance TJM 450-650€.",
    relatedSlugs: ["community-manager", "seo-manager", "business-developer"],
    relatedBlogSlugs: ["mots-cles-offre-emploi", "lettre-motivation-ia-credible"],
    relatedPillarSlugs: ["creer-cv", "adapter-cv-offre-emploi"],
    faq: [
      {
        q: "Quel salaire pour un chargé de marketing digital en 2026 ?",
        a: "35 à 45 k€ brut annuel pour un junior à Paris (0-2 ans), 30 à 40 k€ en province. Un confirmé (3-5 ans) atteint 45-58 k€, et les seniors ou growth managers montent à 58-80 k€ dans les scale-ups (BlaBlaCar, Back Market, Alan, Doctolib). En freelance, le TJM démarre autour de 450 €/jour pour un généraliste et monte à 650 €/jour pour un spécialiste paid ou SEO avec track record. Les licornes tech paient dans le haut de la fourchette.",
      },
      {
        q: "Quel diplôme pour devenir marketer digital ?",
        a: "École de commerce avec majeure marketing (EDHEC, KEDGE, EM Lyon), Sup de Pub, ISCOM, CELSA pour les parcours media, ou fac d'éco. Les bootcamps growth / marketing (Growthmakers, Databird, Le Wagon Marketing) sont bien accueillis en scale-up si le portfolio derrière est solide. Les reconversions passent bien si le candidat arrive avec 1-2 projets concrets chiffrés : compte Instagram monétisé, landing page vendue, campagne Meta Ads gérée pour un side business.",
      },
      {
        q: "Meta Ads, Google Ads : faut-il être certifié ?",
        a: "Les certifications officielles (Google Ads, Meta Blueprint) sont un plus pour un junior mais ne pèsent plus grand-chose au-delà de 2 ans d'expérience. Ce qui compte : le budget géré réel (à partir de 5 000 €/mois sur un canal, c'est significatif), le CAC et ROAS obtenus, et la démonstration que vous pilotez la création des campagnes — pas juste le brief à une agence. Mentionnez aussi GA4 et Looker Studio, car le tracking server-side devient la norme.",
      },
      {
        q: "Combien de canaux mettre en avant sur le CV ?",
        a: "Deux, maximum trois, avec un canal lead clairement identifié. Un marketer qui dit maîtriser SEO + SEA + paid social + email + CRM + content avec trois ans d'expérience perd en crédibilité. Mieux : « expertise paid social Meta / LinkedIn (budget 45k€/mois), notions SEO et email ». Les KPIs à faire apparaître : CAC, LTV, ROAS, CPA, CPL — sans ces mots-clés, votre CV ne passe pas les filtres ATS marketing digital. Une page sous 5 ans d'expérience.",
      },
    ],
  },

  {
    slug: "community-manager",
    name: "Community Manager",
    nameFull: "Community Manager / Social Media Manager",
    category: "Marketing",
    intro:
      "Le community manager en 2026 n'est plus celui qui « gère les réseaux sociaux ». Les postes qui paient bien demandent de la stratégie éditoriale, de la vidéo courte (TikTok, Reels, Shorts), et une lecture fine des algorithmes. Un CV CM se juge d'abord à la qualité des contenus produits, puis aux chiffres de reach.",
    recruiterExpectations:
      "Le head of brand ou de contenu attend : (1) un portfolio accessible (liens vers comptes gérés, assumés), (2) des chiffres de performance — reach, engagement, conversions, pas juste « nombre de followers », (3) une vraie compétence production : vous écrivez, vous cadrez une vidéo, vous montez, vous savez ce qui marche sur chaque plateforme. Le CM pur « planificateur » est dépassé.",
    keySkills: [
      "Stratégie éditoriale multi-plateformes (LinkedIn, Instagram, TikTok, X)",
      "Production vidéo courte (cadrage, montage, hooks, trends)",
      "Copywriting social (hooks, storytelling, CTA natifs plateforme)",
      "Community management (modération, ton de marque, gestion de crise)",
      "Analyse de performance (portée organique, engagement, save rate)",
      "Influence et collaborations créateurs (brief, contrats, suivi)",
      "Social listening (mentions, sentiment, veille concurrentielle)",
      "Photo produit et DA légère (composition, cohérence)",
    ],
    toolsTech: [
      "CapCut / Premiere Rush",
      "Canva",
      "Meta Business Suite",
      "Metricool / Swello / Agorapulse",
      "LinkedIn Creator Tools",
      "Notion",
      "Lightroom mobile",
    ],
    accrocheExample:
      "Community manager, 3 ans chez une DNVB beauté. J'ai porté le TikTok de 0 à 78k followers en 14 mois (22M de vues cumulées sur 2024) via un format interview-produit récurrent que j'ai conçu, cadré et monté moi-même. Sur LinkedIn, j'ai coaché le CEO pour passer de 2k à 18k abonnés en 9 mois. Je produis, j'écris et j'analyse — je ne pilote pas d'agence.",
    keyKpis: [
      "Croissance communauté (followers, vues, engagement) avant/après",
      "Reach organique moyen par post et évolution",
      "Engagement rate spécifique par plateforme (LinkedIn 3-5 %, TikTok 8-15 %)",
      "Volume de contenu produit par mois (vidéos, posts, stories)",
      "Conversions générées si e-commerce (ventes attribuées social)",
      "Nombre de campagnes avec créateurs / influenceurs pilotées",
    ],
    commonMistakes: [
      {
        title: "Mettre « 500k followers » sans préciser l'engagement",
        explanation:
          "Un compte à 500k followers avec 0,2 % d'engagement est moins valorisant qu'un compte à 30k avec 8 %. Mentionnez toujours l'engagement ou le reach moyen, pas seulement le vanity metric.",
      },
      {
        title: "Pas de lien vers les comptes gérés",
        explanation:
          "Un CV CM sans URL vers au moins un compte géré est un CV aveugle. Même si c'est un compte client, indiquez « Instagram de @marque (gestion 2023-2024) ».",
      },
      {
        title: "Se présenter comme « maître des réseaux sociaux »",
        explanation:
          "Le jargon gonflé d'influenceur tue la crédibilité. Les recruteurs sérieux préfèrent « community manager focus vidéo courte, spécialisée e-commerce beauté ».",
      },
      {
        title: "Ne pas distinguer organique et payant",
        explanation:
          "Un CM qui ne dit pas s'il gère aussi du paid social donne un profil flou. Si vous touchez au boost Meta Ads ou au sponsoring LinkedIn, dites-le clairement et chiffrez le budget.",
      },
    ],
    hiringCompanies: [
      "Sézane",
      "Yuka",
      "Lydia",
      "Jimini's",
      "Respire",
      "Typology",
      "Le Slip Français",
      "BlaBlaCar",
      "Vinted",
      "Swile",
    ],
    salaryRange: "28-38k€ junior, 38-48k€ confirmé, 48-65k€ senior / social media manager en France",
    typicalCareer:
      "CM junior → confirmé (2-3 ans) → senior / social media manager → head of social, brand manager, freelance TJM 400-550€.",
    relatedSlugs: ["charge-marketing-digital", "seo-manager", "chef-de-projet"],
    relatedBlogSlugs: ["mots-cles-offre-emploi", "lettre-motivation-ia-credible"],
    relatedPillarSlugs: ["creer-cv", "adapter-cv-offre-emploi"],
    faq: [
      {
        q: "Quel salaire pour un community manager en 2026 ?",
        a: "28 à 35 k€ brut annuel pour un CM junior en France (0-2 ans), 35 à 45 k€ pour un confirmé (3-5 ans), 45 à 60 k€ pour un social media manager senior ou un head of social en scale-up. En freelance, le TJM moyen tourne autour de 400-550 €/jour selon le portefeuille. Les DNVB (Sézane, Respire, Typology) paient un peu mieux que l'agence classique.",
      },
      {
        q: "Faut-il un portfolio pour candidater comme CM ?",
        a: "Oui, c'est quasi-systématique — un CV CM sans lien vers les comptes gérés (Instagram, TikTok, LinkedIn) est inaudible. Même des comptes perso ou bénévoles comptent s'ils démontrent votre angle éditorial et votre courbe de croissance. Rendez les liens cliquables dans le PDF et précisez votre rôle (concepteur, planner, rédacteur, modérateur).",
      },
      {
        q: "TikTok ou Instagram : sur quoi se spécialiser ?",
        a: "Les offres demandent de plus en plus les deux, mais avec une dominante. TikTok est survalorisé par les DNVB et les marques lifestyle ; Instagram reste roi en B2B, food, mode, beauté premium. LinkedIn devient incontournable dans le B2B tech. Plutôt que de choisir, montrez une courbe de progression sur au moins deux plateformes et précisez où vous avez piloté la stratégie.",
      },
      {
        q: "Faut-il chiffrer les résultats sur un CV de CM ?",
        a: "Oui, impérativement : abonnés gagnés, taux d'engagement moyen, reach, vues cumulées, conversions issues du social. Un CV de CM sans chiffre passe pour un profil « exécutant planning », pas pour un profil « pilote de marque ». Donnez la base de départ pour que la croissance soit lisible (ex : « 12k → 45k abonnés en 9 mois »).",
      },
    ],
  },

  {
    slug: "seo-manager",
    name: "SEO Manager",
    nameFull: "SEO Manager / Consultant SEO",
    category: "Marketing",
    intro:
      "Le SEO a traversé deux séismes depuis 2023 : les AI Overviews de Google et la montée des moteurs IA (Perplexity, ChatGPT Search). Résultat : les SEO managers qui s'en sortent sont ceux qui pilotent la visibilité au-delà des SERP classiques, avec du contenu pensé pour être cité par les LLMs autant que pour ranker.",
    recruiterExpectations:
      "Le CMO veut voir : (1) un cas de croissance SEO chiffrée sur 12+ mois (trafic organique, positions, conversions), (2) maîtrise technique — indexation, Core Web Vitals, schema, logs crawl, (3) une approche contenu structurée (cluster topics, maillage interne). Un SEO manager qui ne sait parler que de backlinks est daté.",
    keySkills: [
      "SEO technique (crawl budget, indexation, sitemaps, CWV, schema)",
      "Content SEO (topic clusters, pillar pages, optimisation pages existantes)",
      "Link building (digital PR, partenariats, linkable assets)",
      "SEO international (hreflang, structure multi-pays, duplication)",
      "Analyse de logs serveur et diagnostic de crawl",
      "Data et reporting (GSC, GA4, Looker Studio, API)",
      "GEO / AI SEO (llms.txt, citabilité par AI Overviews)",
      "Management d'agence ou d'équipe contenu interne",
    ],
    toolsTech: [
      "Google Search Console",
      "Ahrefs / Semrush",
      "Screaming Frog",
      "Sitebulb / OnCrawl",
      "Looker Studio",
      "PageSpeed Insights",
      "Clearscope / SurferSEO",
    ],
    accrocheExample:
      "SEO manager, 5 ans en e-commerce et SaaS. Dernier poste : j'ai porté le trafic organique d'un SaaS B2B de 35k à 180k visites mensuelles en 18 mois (+413 %) via une refonte de l'arborescence, une stratégie pillar + clusters (120 articles publiés), et un audit technique sur Core Web Vitals. Je pilote GSC, Ahrefs et Screaming Frog en direct.",
    keyKpis: [
      "Croissance trafic organique en % sur 12-24 mois",
      "Nombre de mots-clés positionnés top 3 / top 10",
      "Conversions attribuées SEO (MQL, demos, ventes)",
      "Core Web Vitals : LCP, INP, CLS avant/après",
      "Nombre de backlinks obtenus ou de digital PR placés",
      "Budget contenu géré (€ investis, nombre d'articles publiés)",
    ],
    commonMistakes: [
      {
        title: "Vendre du SEO « black hat » ou des chiffres trop beaux",
        explanation:
          "« +2 000 % de trafic en 3 mois » sent le farm de liens ou le PBN. Même si c'est vrai, ça fait fuir les recruteurs sérieux qui cherchent de la croissance durable. Contextualisez : base de départ, type de pages, secteur.",
      },
      {
        title: "Parler uniquement de mots-clés sans intention",
        explanation:
          "Le SEO 2026 est intent-first, pas keyword-first. Un CV qui ne parle que de « placements top 3 » sans mentionner le funnel (info / comparatif / transactionnel) est daté.",
      },
      {
        title: "Ignorer l'IA et les nouveaux moteurs",
        explanation:
          "Un CV SEO qui ne mentionne ni AI Overviews, ni Perplexity, ni GEO va paraître hors-sol. Ajoutez une ligne sur votre approche face aux moteurs IA, même si c'est simple.",
      },
      {
        title: "Ne rien dire sur la collaboration avec les devs",
        explanation:
          "90 % des problèmes SEO techniques passent par un ticket dev. Si votre CV ne parle pas de Jira, de specs SEO, ou de collaboration avec l'équipe tech, on suppose que vous êtes un SEO hors-sol.",
      },
    ],
    hiringCompanies: [
      "ManoMano",
      "Back Market",
      "Vinted",
      "Doctolib",
      "Malt",
      "PayFit",
      "Welcome to the Jungle",
      "Leboncoin",
      "BlaBlaCar",
      "Cdiscount",
    ],
    salaryRange: "35-48k€ junior, 48-62k€ confirmé, 62-85k€ senior / SEO lead en France",
    typicalCareer:
      "Chargé SEO → SEO manager (3-5 ans) → senior / head of SEO → freelance consultant TJM 500-700€ ou director of organic growth.",
    relatedSlugs: ["charge-marketing-digital", "community-manager", "data-analyst"],
    relatedBlogSlugs: ["mots-cles-offre-emploi", "10-erreurs-cv-ats"],
    relatedPillarSlugs: ["cv-ats", "adapter-cv-offre-emploi"],
    faq: [
      {
        q: "Quel salaire pour un SEO manager en 2026 ?",
        a: "35 à 48 k€ brut annuel pour un chargé SEO junior à Paris, 32 à 42 k€ en province. Un SEO manager confirmé (3-5 ans) atteint 48-62 k€, et les seniors ou head of SEO montent à 62-85 k€ dans les gros e-commerce (ManoMano, Back Market, Vinted, Cdiscount) ou les scale-ups (Doctolib, Malt, Welcome to the Jungle). En freelance consultant SEO, le TJM démarre à 500 €/jour et atteint couramment 700-900 € sur des missions stratégiques avec track record chiffré.",
      },
      {
        q: "Quelle formation pour devenir SEO manager ?",
        a: "Pas de diplôme officiel — le SEO reste l'un des métiers les plus autodidactes du marketing. Les parcours courants : école de commerce avec majeure digital, master marketing digital, ou reconversion via contenus (blog perso, freelance rédaction SEO). Les certifications Google (Analytics, Search Console) sont basiques et attendues. Les vraies références crédibles côté recruteur : connaissance approfondie d'Ahrefs ou Semrush, Screaming Frog pour l'audit technique, et au moins un cas de croissance organique chiffrée sur 12+ mois.",
      },
      {
        q: "AI Overviews, GEO : comment le mentionner sur un CV ?",
        a: "C'est devenu un vrai différenciateur en 2026. Mentionnez explicitement votre approche face aux moteurs IA : compréhension du llms.txt, structuration de contenu pour citation AI (Perplexity, ChatGPT Search), adaptation des pages aux AI Overviews. Un CV SEO qui ignore ces sujets paraît daté face aux recruteurs CMO des scale-ups. Ajoutez une ligne compétence « GEO / AI SEO » si vous avez réellement optimisé des pages dans ce sens, avec idéalement un exemple de page citée par Perplexity ou dans une AI Overview.",
      },
      {
        q: "Comment chiffrer sa performance SEO sur un CV ?",
        a: "Quatre chiffres clés : croissance trafic organique en % sur 12-24 mois (avec base de départ pour contexte), nombre de mots-clés top 3 / top 10, conversions attribuées SEO (MQL, ventes), et Core Web Vitals avant/après si vous avez porté l'effort technique. Évitez les chiffres farfelus (« +2000 % en 3 mois ») qui sentent le black hat ou le vanity metric. Mentionnez aussi le budget contenu géré et le nombre d'articles publiés ou optimisés. Une page sous 5 ans, deux pages pour un head of SEO.",
      },
    ],
  },

  {
    slug: "brand-manager",
    name: "Brand Manager",
    nameFull: "Brand Manager / Chef·fe de marque",
    category: "Marketing",
    intro:
      "Le brand manager en FMCG ou en DNVB est le gardien de la marque : positionnement, identité, plan media, lancement produit. Le métier reste très codifié dans les grands groupes (L'Oréal, Danone, Unilever) où le poste sert de passerelle vers les directions marketing. En DNVB, le rôle est plus hybride : brand + product + growth. Le CV doit dire clairement dans quel modèle vous jouez.",
    recruiterExpectations:
      "Le senior brand manager ou le directeur marketing cherche : (1) un track record de lancement produit avec chiffres (parts de marché gagnées, CA généré, notoriété évoluée), (2) la maîtrise des études consommateurs — études U&A, tests concept, tracking de marque, (3) la capacité à piloter une agence de création et un plan media 360. Un brand manager qui n'a jamais brief un DA ou piloté un budget TV est suspect dans les grands groupes.",
    keySkills: [
      "Construction de plateforme de marque (mission, promesse, territoire)",
      "Lancement produit (brief concept, packaging, plan de distribution)",
      "Plan media 360 (TV, digital, affichage, influence, retail)",
      "Études consommateurs (U&A, tests concept, brand tracking)",
      "Pricing et architecture de gamme (bon/meilleur, entrée/premium)",
      "Trade marketing et animation retail (GMS, pharmacie, select)",
      "Brief et pilotage d'agences (création, media, production)",
      "Analyse parts de marché et panels (Nielsen, IRI, Kantar)",
    ],
    toolsTech: [
      "Nielsen / IRI / Circana",
      "Kantar WorldPanel",
      "PowerPoint niveau COMEX",
      "Excel avancé (forecast, pricing)",
      "Photoshop / InDesign (relecture créa)",
      "Meltwater / Onclusive (veille)",
      "Meta Business Suite",
      "GA4",
      "Brandwatch",
    ],
    accrocheExample:
      "Brand manager 5 ans dans un groupe FMCG (univers soin du corps). Pilotage de deux marques à 42M€ de CA combiné (part de marché 8,2 %, +1,4 pts YoY). En 2024, j'ai mené le relaunch d'une marque historique : repositionnement consommatrices 25-45, nouveau pack avec studio Parisien, plan media 360 à 3,2M€ (TV + paid social + influence), +14 % de ventes en valeur sur les 6 mois post-launch. Brief agence créa et pilotage COMEX de la roadmap brand.",
    keyKpis: [
      "Part de marché en valeur et en volume, évolution YoY",
      "CA géré et CA généré par lancement (incrémental)",
      "Budget media piloté (en M€) sur A&P annuel",
      "Awareness et attributs d'image (brand tracker avant/après)",
      "Nombre de lancements produit menés (taille, succès / échec)",
      "Distribution numérique (DN) et qualitative (DV) si FMCG",
    ],
    commonMistakes: [
      {
        title: "Confondre brand manager et community manager",
        explanation:
          "Un brand manager pilote la stratégie de marque sur 360, pas les posts Instagram du mois. Si votre CV ne parle que de social media et de collabs influenceurs, vous êtes plutôt content ou social manager — assumez ce positionnement ou montrez l'amont stratégique.",
      },
      {
        title: "Oublier les études consommateurs",
        explanation:
          "Un brand manager sans vocabulaire études (U&A, segmentation, concept test, tracker brand) paraît faible en FMCG. Citez des études que vous avez commandées ou analysées, même en binôme avec un insight manager.",
      },
      {
        title: "Passer sous silence le plan media",
        explanation:
          "Même si une agence media exécute, le brand manager défend le budget et les choix devant le COMEX. Donner le budget A&P annuel et la répartition canal est un signal fort de maturité.",
      },
      {
        title: "Ne parler que de créativité sans business",
        explanation:
          "Un CV centré sur « créativité, storytelling, magie de la marque » sans chiffres de parts de marché ou de CA donne une impression de communicant au lieu de brand owner. Équilibrez émotion et ROI.",
      },
    ],
    hiringCompanies: [
      "L'Oréal",
      "Danone",
      "Unilever France",
      "Pernod Ricard",
      "Sézane",
      "Respire",
      "Typology",
      "Yuka",
      "Michel et Augustin",
      "Bel Group",
      "Bonduelle",
    ],
    salaryRange: "38-48k€ assistant/junior, 48-65k€ brand manager confirmé, 65-90k€ senior BM en France (APEC 2026)",
    typicalCareer:
      "Assistant chef de produit (1-2 ans) → brand manager junior (3-5 ans) → senior brand manager → group brand manager → directeur marketing, CMO en DNVB.",
    relatedSlugs: ["charge-marketing-digital", "community-manager", "seo-manager"],
    relatedBlogSlugs: ["mots-cles-offre-emploi", "lettre-motivation-ia-credible"],
    relatedPillarSlugs: ["creer-cv", "adapter-cv-offre-emploi"],
  },

  {
    slug: "content-manager",
    name: "Content Manager",
    nameFull: "Content Manager / Responsable contenu éditorial",
    category: "Marketing",
    intro:
      "Le content manager de 2026 ne produit plus seul — il orchestre une production hybride humaine + IA générative, avec un cahier des charges éditorial stable. Les offres bien payées cherchent des profils qui savent briefer, éditer et qualifier des contenus, pas seulement les écrire. La spécialisation sectorielle (B2B SaaS, e-commerce, santé, finance) pèse plus que la séniorité pure sur le salaire.",
    recruiterExpectations:
      "Le head of marketing ou de growth veut : (1) un calendrier éditorial réellement tenu sur 12 mois (fréquence de publication, performance moyenne), (2) des process de production documentés — brief, relecture, SEO check, publication, (3) une vraie discipline sur les KPIs — trafic organique, temps de lecture, conversions. Un content manager qui ne parle que de volume de production sans mesure d'impact est en danger.",
    keySkills: [
      "Stratégie éditoriale (piliers de contenu, personas, topic clusters)",
      "Planning éditorial long terme (trimestriel, annuel)",
      "Brief rédacteur et pilotage freelances / agences",
      "SEO on-page (mots-clés, structure Hn, maillage interne)",
      "Usage responsable de l'IA générative (brief, édition, qualité)",
      "Ligne éditoriale et tone of voice (brand guidelines)",
      "Production multi-format (articles, guides, livres blancs, newsletters)",
      "Mesure de performance (GA4, Ahrefs, HubSpot, temps de lecture)",
    ],
    toolsTech: [
      "WordPress / Webflow",
      "HubSpot / Brevo / Mailchimp",
      "Ahrefs / Semrush / Google Search Console",
      "Notion / Airtable (calendrier éditorial)",
      "Grammarly / Antidote",
      "GA4 / Looker Studio",
      "SurferSEO / Clearscope",
      "Canva / Figma (visuels)",
      "Frase / Writesonic (IA éditoriale)",
    ],
    accrocheExample:
      "Content manager, 4 ans en SaaS B2B mid-market. Je pilote un calendrier éditorial de 18 articles et 2 livres blancs par mois avec 3 rédacteurs freelances briefés par mes soins. Trafic organique passé de 22k à 96k visites/mois en 16 mois (+336 %), avec un temps moyen de lecture à 3 min 42 s sur les articles piliers. J'ai structuré en 2024 un process d'édition IA-assisté qui a doublé notre cadence sans perte de qualité (tests A/B sur les titres, SEO check systématique avant publication).",
    keyKpis: [
      "Volume de contenus publiés / mois (articles, vidéos, guides)",
      "Trafic organique total et évolution sur 12 mois",
      "Temps moyen de lecture et taux de rebond articles piliers",
      "Conversions attribuées content (leads, demos, abonnements)",
      "Nombre de mots-clés positionnés top 3 / top 10",
      "Budget éditorial géré (freelances, outils, visuels)",
    ],
    commonMistakes: [
      {
        title: "Se faire passer pour un rédacteur déguisé",
        explanation:
          "Si 90 % de votre temps est d'écrire seul sans piloter de freelance, ni process éditorial, vous êtes rédacteur web — pas content manager. Assumez le bon titre, ou documentez explicitement la partie pilotage, brief, qualité. Les recruteurs démasquent vite.",
      },
      {
        title: "Ne rien dire sur l'IA éditoriale",
        explanation:
          "En 2026, un content manager qui n'explique pas comment il intègre l'IA générative dans sa production (brief, premier jet, édition humaine, QA SEO) paraît en retard. Précisez votre process, idéalement avec un gain de productivité chiffré.",
      },
      {
        title: "Parler de volume sans parler de qualité",
        explanation:
          "« 200 articles publiés en 12 mois » ne dit rien si les articles font 600 mots et ne rankent pas. Mentionnez toujours la performance : trafic, positions, temps de lecture, conversions.",
      },
      {
        title: "Ignorer la dimension SEO",
        explanation:
          "Un content manager sans vocabulaire SEO (cluster, intent, Hn, EEAT) en 2026 est pénalisé. Même si un SEO manager pilote la stratégie, le content manager exécute côté pages — mentionnez votre outillage (Ahrefs, Semrush, SurferSEO).",
      },
    ],
    hiringCompanies: [
      "Qonto",
      "PayFit",
      "Pennylane",
      "Spendesk",
      "Welcome to the Jungle",
      "Lemlist",
      "Aircall",
      "Legalstart",
      "Malt",
      "Doctolib",
      "Alan",
    ],
    salaryRange: "32-42k€ junior, 42-55k€ confirmé, 55-75k€ senior / head of content en France (APEC 2026)",
    typicalCareer:
      "Rédacteur web / content writer → content manager confirmé (3-5 ans) → senior content manager ou editorial lead → head of content, freelance TJM 450-650€.",
    relatedSlugs: ["seo-manager", "community-manager", "charge-marketing-digital"],
    relatedBlogSlugs: ["mots-cles-offre-emploi", "lettre-motivation-ia-credible"],
    relatedPillarSlugs: ["creer-cv", "adapter-cv-offre-emploi"],
  },

  {
    slug: "directeur-artistique",
    name: "Directeur artistique",
    nameFull: "Directeur·rice artistique (DA) / Creative Director",
    category: "Marketing",
    intro:
      "Le directeur artistique porte la vision esthétique d'une marque ou d'une campagne. En agence, c'est un métier exigeant de pitch et d'exécution sous pression ; en interne (in-house) chez une DNVB ou une scale-up, c'est un poste plus stratégique, avec un lien fort au brand manager et au CEO. Le book (portfolio) reste la pièce maîtresse — le CV sert à le présenter, pas à le remplacer.",
    recruiterExpectations:
      "Le directeur de création ou le CMO cherche : (1) un book accessible avec des cas concrets (campagne, identité, plateforme de marque) — pas juste des mocks Behance, (2) la capacité à briefer et à diriger d'autres créatifs (graphistes, motion, photographes), (3) une culture solide — références, typos, design contemporain, histoire de la publicité française. Un DA qui ne cite aucun studio ou directeur de création marquant paraît coupé du métier.",
    keySkills: [
      "Direction artistique globale (identité, campagne, plateforme)",
      "Brief créatif (insight, idée, exécution, argumentation client)",
      "Pilotage de photographes, illustrateurs, motion designers",
      "Maîtrise de la chaîne graphique (impression, print, packaging)",
      "Design digital (landing, social, formats Meta, TikTok)",
      "Art direction photo et vidéo (repérage, cadrage, moodboard)",
      "Présentation client et défense de concept",
      "Culture créative (Cannes Lions, ADC, Stratégies)",
    ],
    toolsTech: [
      "Adobe Creative Suite (InDesign, Photoshop, Illustrator)",
      "Figma",
      "After Effects / Premiere",
      "Keynote (présentation de recommandations créa)",
      "Midjourney / DALL-E (exploration)",
      "Pinterest / Behance / Are.na (veille)",
      "Capture One (photo)",
    ],
    accrocheExample:
      "Directrice artistique 7 ans d'expérience en agence indépendante parisienne puis 2 ans in-house chez une DNVB beauté. Je pilote les campagnes majeures de l'annonceur : moodboard, casting photographe, direction shoot, déclinaison print + digital + retail. Dernier projet : refonte complète de la plateforme de marque (nouveau logo, typographie custom, grille photo, guidelines 52 pages), adoptée par 14 points de vente et 3 agences partenaires. Référence Cannes Lions Shortlist 2024.",
    keyKpis: [
      "Nombre de campagnes menées en lead créatif",
      "Budgets créa pilotés (photo, motion, post-production)",
      "Récompenses et nominations (Cannes Lions, ADC, D&AD, Stratégies)",
      "Équipe créative encadrée (graphistes, motion, junior DA)",
      "Awareness de marque avant/après (quand mesurable)",
      "Nombre d'annonceurs ou de marques portées",
    ],
    commonMistakes: [
      {
        title: "Ne pas mettre le lien vers le book",
        explanation:
          "Un CV de DA sans URL portfolio est disqualifiant. Mettez le lien en haut, cliquable. Même un Dropbox ou un site Framer perso suffit — ce qui compte, c'est l'accès immédiat aux créations.",
      },
      {
        title: "Lister des marques sans préciser le périmètre",
        explanation:
          "Écrire « Nike, Apple, Chanel » dans une ligne agence ne dit pas si vous avez piloté la campagne globale ou juste retouché trois assets. Précisez votre rôle — DA lead, DA exécution, assistant DA — pour chaque grande référence.",
      },
      {
        title: "Oublier la dimension direction d'équipe créative",
        explanation:
          "À partir du niveau senior / creative director, on attend la capacité à diriger d'autres créatifs. Sans mention d'équipe encadrée, de briefs rédigés, de castings menés, votre CV paraît bloqué en exécution solo.",
      },
      {
        title: "Sur-designer son propre CV",
        explanation:
          "Paradoxalement, un CV ultra-designé en colonnes déborde d'images et passe mal les ATS. Pour les candidatures en scale-up ou grand groupe, restez sur un CV sobre + lien portfolio sépare. Le book montre votre direction artistique, pas le CV.",
      },
    ],
    hiringCompanies: [
      "Publicis",
      "Havas Paris",
      "BETC",
      "TBWA Paris",
      "DDB Paris",
      "Sézane",
      "Veja",
      "Respire",
      "Typology",
      "Fleurance Nature",
      "Le Slip Français",
    ],
    salaryRange: "38-50k€ DA junior, 50-70k€ DA confirmé, 70-110k€ DA senior / creative director en France (APEC 2026)",
    typicalCareer:
      "Graphiste / DA junior (1-3 ans) → DA confirmé (3-6 ans) → DA senior → creative director, head of design brand, freelance TJM 500-800€.",
    relatedSlugs: ["designer-ux-ui", "brand-manager", "community-manager"],
    relatedBlogSlugs: ["mots-cles-offre-emploi", "lettre-motivation-ia-credible"],
    relatedPillarSlugs: ["creer-cv", "adapter-cv-offre-emploi"],
  },

  // ─────────────────────────── RH & CUSTOMER ───────────────────────────
  {
    slug: "charge-recrutement",
    name: "Chargé de recrutement",
    nameFull: "Chargé·e de recrutement / Talent Acquisition",
    category: "RH",
    intro:
      "Le métier du recrutement s'est polarisé : d'un côté les équipes talent acquisition structurées en scale-up (full-cycle, sourcing actif, employer brand), de l'autre les cabinets et ESN avec un focus volume. Votre CV doit indiquer clairement de quel côté vous venez — les méthodes et les KPIs diffèrent.",
    recruiterExpectations:
      "La RH head ou le head of TA veut voir : (1) un volume de recrutements bouclés avec des typologies (tech, sales, ops), (2) des chiffres de pipeline — sourcing, temps moyen de recrutement, taux d'acceptation d'offre, (3) une connaissance du marché candidat — salaires, concurrence, signaux. Un recruteur qui ne sait pas répondre à « combien paie un senior React à Paris aujourd'hui » n'a pas la main.",
    keySkills: [
      "Sourcing actif (boolean search, LinkedIn Recruiter, GitHub, Welcome)",
      "Conduite d'entretien (structuré, fit culturel, debrief manager)",
      "Négociation d'offre (package, contre-offre, timing)",
      "Employer branding et contenu recruteur (LinkedIn, careers page)",
      "Conduite d'intake meeting avec les hiring managers",
      "Tests techniques et screening (lire un CV tech, scoring)",
      "Pilotage d'ATS (Greenhouse, Lever, SmartRecruiters, Welcome)",
      "Reporting pipeline (time-to-hire, funnel conversion, diversité)",
    ],
    toolsTech: [
      "LinkedIn Recruiter",
      "Welcome to the Jungle",
      "Greenhouse / Lever",
      "Notion",
      "Slack",
      "HelloWork / APEC",
      "GitHub / Stack Overflow (si tech)",
    ],
    accrocheExample:
      "Talent acquisition en scale-up tech, 4 ans d'expérience. Full-cycle sur les profils tech et produit : 38 recrutements bouclés en 2024 (devs mid et senior, 4 PM, 2 designers). Time-to-hire moyen 34 jours, taux d'acceptation d'offre 78 %. J'utilise Greenhouse, LinkedIn Recruiter et GitHub en sourcing. Je pilote aussi la stratégie employer brand (carrière page + contenu LinkedIn CTO).",
    keyKpis: [
      "Nombre de recrutements bouclés par an, ventilé par famille de poste",
      "Time-to-hire moyen (jours) et time-to-fill",
      "Taux d'acceptation d'offre et taux de conversion par étape",
      "Ratio sourcing actif vs candidatures entrantes",
      "Coût par embauche si pertinent",
      "Taux de rétention des recrutés à 12 mois",
    ],
    commonMistakes: [
      {
        title: "Mélanger nombre de CV reçus et nombre de recrutements",
        explanation:
          "« 5 000 CV traités » ne dit rien sur votre efficacité — c'est souvent une conséquence d'un mauvais ciblage ou d'annonces trop larges. Ce qui compte : combien d'offres acceptées sur des postes difficiles.",
      },
      {
        title: "Ne pas préciser le type de profils recrutés",
        explanation:
          "Recruter des vendeurs en retail et recruter des devs senior à Paris sont deux métiers différents. Spécifiez la famille de postes (tech, sales, ops, support, retail) et le niveau (junior, senior).",
      },
      {
        title: "Ignorer le sourcing actif dans son CV",
        explanation:
          "Un recruteur qui n'a travaillé que sur des candidatures entrantes a un angle mort. Mentionnez explicitement votre pratique du sourcing (outil, ratio sourcé vs spontané) même si c'est modeste.",
      },
      {
        title: "Parler d'« expérience candidat » sans concret",
        explanation:
          "Le buzzword « candidate experience » revient partout. Pour qu'il compte, il faut des exemples : feedback systématique sous 48h, test produit proposé, réduction du nombre d'étapes, NPS candidats.",
      },
    ],
    hiringCompanies: [
      "Doctolib",
      "Qonto",
      "Alan",
      "BlaBlaCar",
      "PayFit",
      "Swile",
      "Welcome to the Jungle",
      "Back Market",
      "Malt",
      "Michael Page",
    ],
    salaryRange: "32-42k€ junior, 42-55k€ confirmé, 55-75k€ senior / lead TA en France",
    typicalCareer:
      "Chargé recrutement junior → confirmé (2-4 ans) → talent acquisition senior / lead → head of talent, HRBP ou freelance TJM 400-550€.",
    relatedSlugs: ["customer-success", "consultant", "chef-de-projet"],
    relatedBlogSlugs: ["10-erreurs-cv-ats", "mots-cles-offre-emploi"],
    relatedPillarSlugs: ["creer-cv", "cv-ats"],
    faq: [
      {
        q: "Quel salaire pour un chargé de recrutement en 2026 ?",
        a: "32 à 42 k€ brut annuel pour un chargé junior à Paris, 28 à 36 k€ en province. Un talent acquisition confirmé (3-5 ans) atteint 42-55 k€, et les leads TA ou head of talent montent à 55-75 k€ dans les scale-ups (Doctolib, Qonto, Alan, PayFit). En cabinet (Michael Page, Robert Walters, Hays), les consultants confirmés touchent souvent une part variable liée aux placements, pouvant doubler le fixe sur les années pleines. En freelance TA, le TJM démarre à 400 €/jour.",
      },
      {
        q: "Quel diplôme pour devenir recruteur ?",
        a: "Master RH (Celsa, CIFFOP, IGS, école de commerce avec spé RH) reste la voie classique, mais le marché tech et scale-ups accepte largement les reconversions via des profils communication, commerce ou psycho. Les bootcamps TA (The Place, Le Wagon RH) ouvrent la porte aux juniors motivés. Ce qui décide au recrutement, c'est la maîtrise du sourcing actif (boolean search, LinkedIn Recruiter) plus que le diplôme. Un bac+3 avec 2 ans en ESN + 2 ans en scale-up tech passe devant un bac+5 RH sans expérience tech.",
      },
      {
        q: "ATS, LinkedIn Recruiter : quels outils maîtriser ?",
        a: "Greenhouse et Lever dominent en scale-up française, SmartRecruiters chez les mid-market. Welcome Kit est l'outil ATS de Welcome to the Jungle, très présent aussi. LinkedIn Recruiter est l'outil n°1 du sourcing actif en 2026. Le CV doit préciser le niveau d'usage : « Greenhouse — full admin, construction des scorecards, reporting funnel » vs « Greenhouse : notions ». Mentionnez aussi GitHub pour le sourcing tech, StackOverflow si pertinent, et Chili Piper ou Calendly pour la planification.",
      },
      {
        q: "Comment chiffrer l'efficacité recrutement sur un CV ?",
        a: "Cinq chiffres clés : nombre de recrutements bouclés par an (ventilé par famille : tech, sales, ops), time-to-hire moyen en jours, taux d'acceptation d'offre, ratio sourcing actif vs candidatures entrantes, et taux de rétention des recrutés à 12 mois si disponible. Précisez toujours le niveau des profils (juniors, senior, C-level) — recruter 20 vendeurs retail n'est pas comparable à recruter 5 VP engineering. Coût par embauche si pertinent en cabinet. Une page sous 5 ans d'expérience.",
      },
    ],
  },

  {
    slug: "customer-success",
    name: "Customer Success Manager",
    nameFull: "Customer Success Manager (CSM)",
    category: "RH",
    intro:
      "Le customer success est devenu un métier central en SaaS B2B : on l'a structuré avec de vrais KPIs, on l'a sorti du support, on lui a donné des objectifs de rétention. Mais le rôle reste flou selon les boîtes — certaines attendent un CSM quasi-commercial (avec quota upsell), d'autres un CSM pur onboarding + adoption. Votre CV doit dire laquelle vous êtes.",
    recruiterExpectations:
      "Le head of customer success attend : (1) un portefeuille chiffré (ARR, nombre de comptes, segment), (2) une maîtrise du parcours adoption — onboarding, formation, suivi usage, (3) de la data — vous savez lire un health score, identifier un compte à risque, prouver la valeur avec des chiffres usage. Un CSM qui ne parle qu'en qualitatif est un support renommé.",
    keySkills: [
      "Onboarding produit (plan 30-60-90, formation, kickoff)",
      "Suivi d'adoption (health score, usage data, early warning)",
      "Rétention et prévention du churn",
      "Business review client (QBR ou EBR, restitution d'usage)",
      "Collaboration produit (remontée feature requests, feedback loop)",
      "Formation et webinars clients (one-to-many scalable)",
      "Playbooks et segmentation de portefeuille (tiering)",
      "Upsell / expansion si orga commerciale donne mandat",
    ],
    toolsTech: [
      "Gainsight / Planhat / ChurnZero",
      "Intercom / Zendesk",
      "Notion",
      "Looker / Metabase",
      "Slack",
      "Zoom / Loom",
      "HubSpot / Salesforce",
    ],
    accrocheExample:
      "Customer Success Manager, 4 ans en SaaS B2B mid-market. Portefeuille actuel : 45 comptes pour 1,8M€ ARR. Je pilote l'onboarding (plan 30-60-90, kickoff managers + users, formation en 3 sessions) et le suivi continu via health score Gainsight. Gross retention 91 % sur mon portefeuille en 2024, expansion 14 %. Je construis aussi les playbooks onboarding avec le produit.",
    keyKpis: [
      "ARR géré et nombre de comptes en portefeuille",
      "Gross retention et net revenue retention",
      "Health score moyen portefeuille (si utilisé)",
      "Time-to-value (délai jusqu'à la première valeur perçue)",
      "Taux d'adoption produit (usage hebdo, features activées)",
      "NPS ou CSAT de votre portefeuille",
    ],
    commonMistakes: [
      {
        title: "Se décrire comme « passionné par la relation client »",
        explanation:
          "C'est la phrase la plus vue en CSM — et la plus vide. Tout le monde dit ça. Remplacez par un exemple concret : un compte sauvé du churn, un onboarding redesigné, un upsell précis.",
      },
      {
        title: "Mélanger CSM et support",
        explanation:
          "Faire du ticketing réactif n'est pas du customer success. Si 80 % de votre temps est en Intercom à répondre à des bugs, vous êtes au support. Assumez-le ou montrez la partie proactive de votre rôle.",
      },
      {
        title: "Ne pas parler de data ni de health score",
        explanation:
          "Un CSM moderne travaille sur des signaux : logins, features utilisées, tickets ouverts. Sans mention de Gainsight, Planhat ou d'un système équivalent (même simple), le profil paraît peu scalable.",
      },
      {
        title: "Ignorer l'expansion et les renouvellements",
        explanation:
          "Même sans quota formel, un CSM influe sur les renouvellements et les upsells. Mentionnez votre rôle dans ces conversations, sinon le recruteur croit que vous êtes déconnecté de la valeur business.",
      },
    ],
    hiringCompanies: [
      "Doctolib",
      "Alan",
      "PayFit",
      "Pennylane",
      "Spendesk",
      "Aircall",
      "Mirakl",
      "Contentsquare",
      "Algolia",
      "Akeneo",
    ],
    salaryRange: "38-48k€ junior, 48-62k€ confirmé, 62-85k€ senior / lead CSM en France",
    typicalCareer:
      "CSM junior → confirmé (2-4 ans) → senior CSM ou team lead → head of customer success, VP customer ou transition AM / product.",
    relatedSlugs: ["account-manager", "charge-recrutement", "product-manager"],
    relatedBlogSlugs: ["mots-cles-offre-emploi", "cv-commercial-structure-gagnante"],
    relatedPillarSlugs: ["adapter-cv-offre-emploi", "cv-ats"],
    faq: [
      {
        q: "Quel salaire pour un customer success manager en 2026 ?",
        a: "38 à 48 k€ brut annuel pour un CSM junior en scale-up SaaS à Paris, 35 à 42 k€ en province. Un CSM confirmé (3-5 ans) atteint 48-62 k€, et les seniors ou leads CSM montent à 62-85 k€ dans les licornes françaises (Doctolib, Alan, PayFit, Pennylane, Spendesk). Attention : certaines scale-ups ajoutent une part variable sur la rétention + expansion (5-15 %) qui rapproche le package d'un AM. En freelance CSM, le marché est mince mais le TJM tourne autour de 500-650 €/jour.",
      },
      {
        q: "Quel parcours pour devenir CSM ?",
        a: "Pas de diplôme officiel. Les parcours courants : école de commerce avec spé customer ou marketing, reconversion depuis support client B2B, transition depuis AM ou consultant junior. Les scale-ups SaaS embauchent régulièrement des profils non-classiques (lettres, sciences humaines) si la personne démontre rigueur process et appétence data. La vraie différenciation se fait sur l'aisance avec les outils type Gainsight / Planhat, et la capacité à lire un health score pour prioriser son portefeuille.",
      },
      {
        q: "Comment différencier un CV CSM d'un CV support ?",
        a: "Trois points durs à traiter : (1) mettre en avant les actions proactives (onboarding structuré, QBR, check-ins programmés) plutôt que le ticketing réactif, (2) chiffrer avec des métriques de rétention (gross retention, NRR) et non de résolution de tickets (MTTR, CSAT ticketing), (3) mentionner les outils customer success modernes (Gainsight, Planhat, ChurnZero) et pas seulement Intercom ou Zendesk. Un CV qui parle de « faire du happy customer » sans playbooks ni data reste perçu comme du support renommé.",
      },
      {
        q: "NPS, health score, NRR : que chiffrer sur un CV CSM ?",
        a: "Les chiffres à donner impérativement : ARR et nombre de comptes en portefeuille, gross retention et NRR sur les 12 derniers mois, time-to-value (délai jusqu'à première valeur perçue), taux d'adoption produit (features activées, usage hebdo). NPS ou CSAT du portefeuille si mesuré. Expansion revenue si vous avez un mandat dessus, même informel. Segmentez le portefeuille (« 8 comptes enterprise, 12 mid-market, 25 tail ») — un CSM qui gère 50 comptes indifférenciés n'a pas les mêmes leviers qu'un KAM qui en gère 10 stratégiques. Une page max sous 5 ans.",
      },
    ],
  },

  {
    slug: "hrbp",
    name: "HR Business Partner",
    nameFull: "HR Business Partner (HRBP)",
    category: "RH",
    intro:
      "Le HRBP est le bras droit RH des directions opérationnelles. En 2026, le métier s'est complexifié : restructurations post-levées, plans de performance, gestion de la charge mentale des équipes tech, négociation des packages dans un marché de l'emploi volatile. Les meilleurs HRBP sont ceux qui portent un rôle business, pas seulement administratif — ils challengent les managers et protègent les équipes.",
    recruiterExpectations:
      "Le CHRO ou le head of people cherche : (1) un périmètre chiffré — nombre de collaborateurs couverts, BU ou directions portées, (2) une vraie épaisseur sur les sujets sensibles — PSE, ruptures conventionnelles, conflits, enquêtes internes, (3) la maîtrise des outils modernes (SIRH, comp benchmarking, outils d'engagement). Un HRBP qui n'a jamais géré un licenciement ou un conflit sérieux reste junior, quel que soit l'intitulé.",
    keySkills: [
      "Business partnering avec directions opérationnelles (COMEX, N-1)",
      "Gestion de cycles RH (reviews de perf, calibrage, bonus)",
      "Rémunération : comp benchmarking, bandes salariales, négociation",
      "Gestion des départs (rupture convent., licenciement, PSE)",
      "Management d'équipe (disputes, plans de performance, médiation)",
      "Développement organisationnel (org design, planification capacitaire)",
      "Droit social français (CSE, durée travail, discrimination)",
      "Engagement et pulse surveys (OfficeVibe, Peakon, 15Five)",
    ],
    toolsTech: [
      "Workday / SuccessFactors / BambooHR",
      "Lucca / Payfit (SIRH scale-up)",
      "Greenhouse / Lever (recrutement)",
      "Figures / Peopledoc / Figures (comp benchmarks)",
      "OfficeVibe / Peakon (engagement)",
      "Notion / Confluence",
      "Excel avancé (workforce planning)",
      "Slack",
    ],
    accrocheExample:
      "HR Business Partner, 7 ans d'expérience dont 4 en scale-up SaaS. Je suis partner des équipes produit et engineering (180 collaborateurs, 4 directeurs). En 2024 : pilotage du cycle de review performance (calibrage 2 jours de COMEX), refonte de la grille salariale tech avec Figures comme benchmark (-19 % d'écart H/F identifié puis réduit à 4 %), gestion de 12 départs sensibles (ruptures conventionnelles, 2 licenciements) sans contentieux prud'homal.",
    keyKpis: [
      "Nombre de collaborateurs couverts et de managers accompagnés",
      "Taux de turnover volontaire et involontaire sur le périmètre",
      "Cycles de perf menés (reviews, calibration, bonus distribués)",
      "Ruptures conventionnelles et licenciements gérés sans contentieux",
      "Engagement score (eNPS, pulse survey) et évolution",
      "Équité salariale H/F mesurée et actions correctrices",
    ],
    commonMistakes: [
      {
        title: "Se présenter comme RH généraliste sans focus business",
        explanation:
          "Un HRBP n'est pas une RH administrative : il est en binôme avec un directeur opérationnel sur des enjeux business (performance équipe, organisation, rémunération). Si votre CV ne cite aucun directeur accompagné ni aucune décision business influencée, vous êtes chargé RH — pas HRBP.",
      },
      {
        title: "Ignorer les sujets difficiles",
        explanation:
          "Les recruteurs HRBP filtrent sur l'expérience des sujets sensibles : conflit, licenciement, PSE, accusation de harcèlement. Un CV qui n'en parle jamais donne l'impression d'un profil qui n'a pas encore vu de vrais dossiers. Vous pouvez rester factuel sans violer la confidentialité.",
      },
      {
        title: "Lister du droit social sans jamais l'avoir appliqué",
        explanation:
          "« Maîtrise du droit social » en compétence sans exemple concret (CSE négocié, accord d'entreprise, rupture conventionnelle) sonne creux. Donnez une action : « préparation et pilotage d'un CSE de 12 élus sur sujet charge de travail ».",
      },
      {
        title: "Oublier la dimension data RH",
        explanation:
          "Un HRBP moderne pilote via la donnée : turnover, pyramide âges, équité salariale H/F, eNPS. Sans outil mentionné (Workday, Lucca, Figures, OfficeVibe) et sans chiffre, le profil paraît déconnecté de la fonction people analytics.",
      },
    ],
    hiringCompanies: [
      "Doctolib",
      "Qonto",
      "BlaBlaCar",
      "Back Market",
      "Alan",
      "PayFit",
      "Spendesk",
      "Contentsquare",
      "Mirakl",
      "Swile",
      "ManoMano",
    ],
    salaryRange: "45-55k€ junior HRBP, 55-75k€ HRBP confirmé, 75-110k€ senior HRBP / head of HRBP en France (APEC 2026)",
    typicalCareer:
      "Chargé RH ou TA (3-5 ans) → HRBP confirmé (4-6 ans) → senior HRBP ou lead HRBP → head of people, VP people, CHRO en scale-up.",
    relatedSlugs: ["charge-recrutement", "customer-success", "consultant"],
    relatedBlogSlugs: ["10-erreurs-cv-ats", "mots-cles-offre-emploi"],
    relatedPillarSlugs: ["creer-cv", "adapter-cv-offre-emploi"],
  },

  // ─────────────────────────── FINANCE ───────────────────────────
  {
    slug: "comptable",
    name: "Comptable",
    nameFull: "Comptable / Responsable comptable",
    category: "Finance",
    intro:
      "Le comptable en 2026 travaille dans un environnement en bascule : dématérialisation de la facturation (obligation facture électronique BtoB reportée puis réactivée), automatisation via OCR et outils type Pennylane, et DRH qui pousse pour un comptable qui sait piloter, pas seulement saisir. Le CV doit refléter cette évolution.",
    recruiterExpectations:
      "Le DAF ou le chef d'entreprise qui recrute cherche : (1) la solidité fondamentale — révision, clôture, liasse fiscale, TVA, (2) la maîtrise d'outils modernes (Sage / Cegid + Pennylane / Dext pour l'automatisation), (3) l'autonomie sur un portefeuille ou une entité. Un comptable qui a bouclé des clôtures en direct sans sous-traitance à un cabinet vaut plus que celui qui a « participé ».",
    keySkills: [
      "Tenue de comptabilité générale (journaux, lettrage, rapprochement)",
      "Clôture mensuelle et annuelle (révision, écritures de cut-off)",
      "Liasse fiscale et déclarations fiscales (IS, TVA, CVAE, CFE)",
      "Gestion de la paie (bases) et déclarations sociales",
      "Consolidation si groupe (IFRS ou normes françaises)",
      "Automatisation facture (OCR, Dext, Pennylane, facturation électronique)",
      "Contrôle interne et procédures (séparation des tâches)",
      "Relation CAC et dossier de contrôle fiscal",
    ],
    toolsTech: [
      "Sage 100 / Sage i7",
      "Cegid Quadra / Loop",
      "EBP / Pennylane",
      "Dext (ex-Receipt Bank)",
      "SAP FI si grand groupe",
      "Excel avancé (TCD, Power Query)",
      "Yousign / DocuSign",
    ],
    accrocheExample:
      "Comptable confirmée, 7 ans d'expérience dont 4 en PME industrielle (CA 18M€, 45 salariés). Clôture mensuelle J+8 sous Sage 100, liasse fiscale annuelle bouclée en autonomie avec l'expert-comptable. Mise en place de Pennylane en 2023 : 70 % des factures fournisseurs en OCR avec pré-comptabilisation. Je forme les nouveaux arrivants et je suis interlocutrice CAC au closing.",
    keyKpis: [
      "Délai de clôture mensuelle (J+3, J+5, J+8, J+15 ?)",
      "Taille du périmètre : CA, nombre d'entités, nombre d'écritures/mois",
      "% de factures automatisées via OCR ou facture électronique",
      "Nombre de déclarations fiscales produites en autonomie par an",
      "Taux d'écarts inventaire / lettrage compte clients et fournisseurs",
      "Jours de DSO gérés et encours fournisseurs",
    ],
    commonMistakes: [
      {
        title: "Lister des logiciels sans niveau d'usage",
        explanation:
          "« Sage, Cegid, SAP, QuickBooks » sans contexte = on suppose que vous avez ouvert le logiciel, pas que vous maîtrisez. Précisez : « Sage 100 : saisie quotidienne, paramétrage plans comptables, clôture » vs « SAP : notions ».",
      },
      {
        title: "Ne pas parler du périmètre géré",
        explanation:
          "Un comptable qui gère la compta complète d'une PME de 5M€ n'est pas comparable à un comptable d'un grand groupe qui gère un poste (immobilisations, par exemple). Donnez le périmètre : CA, effectifs, type d'entité.",
      },
      {
        title: "Ignorer la facture électronique",
        explanation:
          "En 2026-2027, la facture électronique est centrale dans tous les cabinets et DAF. Ne pas en parler sur son CV est un signal d'auto-formation insuffisante.",
      },
      {
        title: "Oublier les relations CAC et administration fiscale",
        explanation:
          "Ce qui distingue un bon comptable : savoir tenir une conversation avec le commissaire aux comptes et, en cas de contrôle, fournir rapidement les pièces. Mentionnez ces expériences si vous en avez.",
      },
    ],
    hiringCompanies: [
      "KPMG",
      "Deloitte",
      "Grant Thornton",
      "EY France",
      "PwC",
      "Mazars",
      "Pennylane",
      "Qonto (finance team)",
      "In Extenso",
      "BDO France",
    ],
    salaryRange: "28-35k€ junior, 35-48k€ confirmé, 48-65k€ responsable comptable / chef compta en France",
    typicalCareer:
      "Comptable junior (1-3 ans) → confirmé (3-7 ans) → responsable comptable ou chef comptable → DAF de PME, expert-comptable diplômé (DEC) ou contrôleur financier.",
    relatedSlugs: ["controleur-gestion", "consultant", "charge-recrutement"],
    relatedBlogSlugs: ["10-erreurs-cv-ats", "mots-cles-offre-emploi"],
    relatedPillarSlugs: ["creer-cv", "cv-ats"],
    faq: [
      {
        q: "Quel salaire pour un comptable en 2026 ?",
        a: "28 à 35 k€ brut annuel pour un comptable junior en PME ou cabinet, 25 à 32 k€ en province. Un comptable confirmé (3-7 ans) atteint 35-48 k€, et un responsable ou chef comptable monte à 48-65 k€ dans une ETI ou un groupe. Dans les Big 4 et les cabinets structurés (KPMG, Deloitte, EY, PwC, Mazars), les grilles sont un peu plus tendues avec des packages qui incluent bonus. Un collaborateur mémorialiste (DSCG + préparation DEC) peut négocier 42-55 k€ en cabinet selon la ville.",
      },
      {
        q: "DCG, DSCG, DEC : quels diplômes compter ?",
        a: "Le DCG (bac+3) est le minimum pour un poste de comptable autonome. Le DSCG (bac+5) ouvre les portes des cabinets structurés et du mémorialiste. Le DEC (diplôme d'expertise comptable, bac+8 avec stage professionnel) est nécessaire pour s'installer ou devenir chef de mission / associé en cabinet. Les reconversions passent souvent par le DCG ou un titre professionnel comptable (AFPA, CNAM). Le BTS Comptabilité-Gestion reste une voie rapide vers un poste d'aide-comptable ou de comptable junior en PME.",
      },
      {
        q: "Sage, Cegid, Pennylane : lequel mettre en avant ?",
        a: "Sage 100 et Cegid Quadra / Loop dominent l'entreprise française et le cabinet classique, à maîtriser impérativement. Pennylane et Tiime s'imposent dans les scale-ups et les PME modernes avec OCR et automatisation facture. SAP FI reste un atout fort pour les postes en grand groupe ou ETI structurée. Précisez sur le CV le niveau réel : « Sage 100 — saisie quotidienne, paramétrage plans comptables, clôture mensuelle autonome » vaut bien plus que « Sage, Cegid, SAP, QuickBooks » en liste sèche.",
      },
      {
        q: "Comment mentionner la facture électronique sur son CV ?",
        a: "Incontournable en 2026, la réforme facture électronique B2B étant désormais en cours de déploiement après plusieurs reports. Mentionnez explicitement : connaissance de la PDP (plateforme de dématérialisation partenaire), maîtrise du format Factur-X, et expérience de migration (« mise en place Pennylane et raccordement PDP en 2024 : 70 % des factures fournisseurs en OCR avec pré-comptabilisation »). Un comptable qui n'en parle pas donne un signal d'auto-formation insuffisante. CV une page pour un junior, deux pages pour un responsable avec périmètre multi-entités.",
      },
    ],
  },

  {
    slug: "controleur-gestion",
    name: "Contrôleur de gestion",
    nameFull: "Contrôleur de gestion / Financial Analyst",
    category: "Finance",
    intro:
      "Le contrôle de gestion a connu une mue importante avec l'essor des outils BI modernes (Looker, Power BI, Tableau) et l'intégration croissante avec la data. Les postes en scale-up et en ETI demandent aujourd'hui un profil qui sait manipuler de la donnée, pas seulement sortir des tableaux Excel mensuels.",
    recruiterExpectations:
      "Le DAF cherche : (1) la rigueur budgétaire — construction de P&L, reforecast, écart réel/budget avec explications, (2) la capacité analytique — vous expliquez pourquoi la marge a bougé, pas juste de combien, (3) un vrai outillage data. Un contrôleur de gestion qui ne sort du P&L qu'en Excel manuel est derrière la marche.",
    keySkills: [
      "Construction budgétaire annuelle et reforecast trimestriel",
      "Analyse d'écarts réel / budget / reforecast avec commentaire business",
      "Modélisation P&L, cash-flow, balance sheet prévisionnels",
      "Contrôle de marge par business unit, produit ou segment",
      "Business partnering (accompagnement des directions opérationnelles)",
      "Maîtrise des ERP et systèmes financiers (SAP, Sage, Oracle)",
      "BI et dataviz (Power BI, Tableau, Looker) et SQL de base",
      "Consolidation de reporting groupe et reporting board",
    ],
    toolsTech: [
      "Excel avancé (Power Query, VBA)",
      "Power BI / Tableau",
      "SAP / Oracle / Sage",
      "Anaplan / Pigment",
      "Looker / Metabase",
      "SQL (basique)",
      "PowerPoint niveau COMEX",
    ],
    accrocheExample:
      "Contrôleur de gestion, 5 ans en ETI industrielle et en scale-up SaaS. Je construis le budget annuel (modèle bottom-up par BU, 6 BU, CA 65M€) et je pilote les reforecasts trimestriels. Mise en place de Power BI sur les KPIs commerciaux en 2024 : le COMEX a gagné 3 jours de reporting mensuel. Je travaille en binôme avec les directeurs de BU pour comprendre les écarts au réel avant restitution CFO.",
    keyKpis: [
      "Taille du périmètre : CA, nombre de BU, nombre d'entités",
      "Nombre de cycles budgétaires portés en autonomie (budget + reforecasts)",
      "Délai de reporting mensuel avant/après vos actions",
      "Nombre de dashboards automatisés en production",
      "Écart absolu réel vs budget expliqué < X %",
      "Nombre de business partners / directions accompagnés",
    ],
    commonMistakes: [
      {
        title: "Se limiter à des tâches répétitives (fermeture, reporting)",
        explanation:
          "Un CV qui ne parle que de « production mensuelle du reporting » donne l'impression d'un exécutant passif. Ajoutez systématiquement la dimension analyse : pourquoi la marge a bougé, quelle action recommandée.",
      },
      {
        title: "Ne pas mentionner d'outil BI moderne",
        explanation:
          "Excel seul ne suffit plus. Même un contrôleur de gestion junior 2026 est attendu sur Power BI, Tableau ou équivalent. Si vous n'en avez pas, formez-vous — et mentionnez la formation.",
      },
      {
        title: "Rester trop vague sur les KPIs suivis",
        explanation:
          "« Je suis les KPIs de l'entreprise » ne dit rien. Précisez : « Marge brute par segment, taux de service logistique, ARR et CAC pour la partie SaaS ».",
      },
      {
        title: "Oublier la dimension business partner",
        explanation:
          "Le contrôle de gestion moderne est un métier de conseil aux opérationnels. Mentionner vos interlocuteurs directs (directeur commercial, directeur industriel, COO) crédibilise la dimension business partnering.",
      },
    ],
    hiringCompanies: [
      "Danone",
      "L'Oréal",
      "LVMH",
      "Capgemini",
      "Doctolib",
      "BlaBlaCar",
      "Michelin",
      "Schneider Electric",
      "Pennylane",
      "Qonto",
    ],
    salaryRange: "38-48k€ junior, 48-65k€ confirmé, 65-90k€ senior / responsable contrôle de gestion en France",
    typicalCareer:
      "Contrôleur junior (1-3 ans) → confirmé (3-6 ans) → senior / responsable contrôle de gestion → DAF, CFO de PME, directeur financier BU.",
    relatedSlugs: ["comptable", "data-analyst", "consultant"],
    relatedBlogSlugs: ["mots-cles-offre-emploi", "10-erreurs-cv-ats"],
    relatedPillarSlugs: ["cv-ats", "adapter-cv-offre-emploi"],
    faq: [
      {
        q: "Quel salaire pour un contrôleur de gestion en 2026 ?",
        a: "38 à 48 k€ brut annuel pour un contrôleur junior (1-3 ans) à Paris, 34 à 42 k€ en province. Un contrôleur confirmé (3-6 ans) atteint 48-65 k€, et les seniors ou responsables contrôle de gestion montent à 65-90 k€ dans les ETI et scale-ups (Danone, L'Oréal, LVMH, Michelin, Doctolib, Pennylane). Les postes FP&A en scale-up tech paient souvent 10-15 % de plus que le contrôle de gestion industriel classique. En freelance FP&A, TJM de 550-750 €/jour.",
      },
      {
        q: "Quel diplôme pour devenir contrôleur de gestion ?",
        a: "Master contrôle de gestion (IAE, écoles de commerce avec majeure finance), DSCG avec mention contrôle de gestion, ou école d'ingé avec spécialisation finance. Les bac+5 finance d'entreprise ou corporate finance conviennent aussi. La certification Anaplan ou Pigment devient un vrai plus en 2026, tout comme une première expérience BI (Power BI, Tableau). Les reconversions depuis l'audit financier (Big 4) vers le contrôle de gestion industrie ou tech sont fréquentes et passent bien.",
      },
      {
        q: "Anaplan, Pigment, Power BI : lequel privilégier ?",
        a: "Excel avancé (Power Query, TCD, VBA léger) reste la compétence dure incontournable. Power BI et Tableau sont devenus le standard dataviz du contrôleur de gestion 2026 — un CV sans l'un des deux paraît dépassé. Anaplan domine les gros groupes pour la planification et le forecast (LVMH, Danone, Michelin). Pigment monte fort chez les scale-ups. SAP ou Oracle selon l'environnement ERP. SQL basique est attendu partout où il y a une vraie intégration data warehouse.",
      },
      {
        q: "Comment chiffrer son impact de contrôleur de gestion ?",
        a: "Cinq chiffres à donner : taille du périmètre (CA géré, nombre de BU, nombre d'entités), nombre de cycles budgétaires portés en autonomie, délai de reporting mensuel avant/après vos actions (J+5 vs J+10), nombre de dashboards automatisés, écart absolu budget vs réel expliqué. Mentionnez vos business partners (directeur commercial, COO, directeur industriel) pour crédibiliser la dimension partnering — le contrôle de gestion 2026 n'est plus une fonction de reporting passif. Une page sous 5 ans, deux au-delà.",
      },
    ],
  },

  {
    slug: "auditeur-financier",
    name: "Auditeur financier",
    nameFull: "Auditeur·rice financier·e (Big 4 / cabinet)",
    category: "Finance",
    intro:
      "L'audit financier en cabinet (Big 4 et cabinets indépendants) reste un premier poste très recherché pour les sortants d'école de commerce ou de master CCA. En 2026, les enjeux se sont élargis : IFRS, CSRD (reporting extra-financier), automatisation des tests substantifs par IA, contrôles sur les revenus SaaS. Le turnover reste élevé — 3 ans en cabinet ouvre la sortie vers l'industrie (contrôle de gestion, trésorerie, audit interne).",
    recruiterExpectations:
      "Le manager ou le senior manager qui vous lit cherche : (1) la solidité comptable (révision, travaux substantifs, tests de contrôle, circularisation), (2) l'expérience sectorielle — un dossier banque n'est pas un dossier industrie n'est pas un dossier SaaS, (3) la prise de responsabilité progressive — conduite de junior en Y+2, section exclusive en Y+3. Un assistant confirmé qui n'a jamais piloté de section lui-même reste junior.",
    keySkills: [
      "Travaux substantifs (circularisations, tests détails, procédures analytiques)",
      "Tests de contrôle interne (walkthrough, évaluation, ITGC)",
      "Normes comptables (normes françaises, IFRS, US GAAP si besoin)",
      "Revenue recognition SaaS (IFRS 15, ASC 606, MRR/ARR)",
      "CSRD et audit extra-financier (ESG, doubles matérialités)",
      "Rédaction de memos et de notes de synthèse (issues log)",
      "Revue des travaux d'un junior (review notes, coaching)",
      "Outils data analytics d'audit (Galvanize, IDEA, Alteryx)",
    ],
    toolsTech: [
      "EY Canvas / Deloitte Omnia / PwC Aura / KPMG Clara",
      "Excel avancé (TCD, Power Query, recherches croisées)",
      "Power BI / Tableau",
      "Alteryx / IDEA (data analytics)",
      "SAP / Oracle (lecture)",
      "Caseware",
      "Yousign / DocuSign",
      "Outils de circularisation (Confirmation.com)",
    ],
    accrocheExample:
      "Assistante confirmée en audit financier, 3 ans chez un Big 4 à Paris (portefeuille mid-cap retail et tech). J'interviens en lead sur les sections revenus, stocks et immobilisations de 4 dossiers récurrents (CA entre 80M€ et 450M€). En 2024 : conduite d'un junior sur ma section revenus, passage d'un dossier SaaS B2B (IFRS 15, revenue recognition abonnements) validé sans point ouvert par l'associé. Diplôme Master CCA Dauphine, cursus DSCG en cours (3 UE validées).",
    keyKpis: [
      "Nombre de dossiers audités par campagne (récurrent + one-shot)",
      "Taille des clients (CA, effectif) — mid-cap, ETI, grand compte",
      "Sections gérées en autonomie (revenus, stocks, immos, trésorerie)",
      "Heures facturables et respect du budget missions",
      "Nombre de juniors encadrés et review notes produites",
      "Certifications en cours ou obtenues (DSCG, DEC, ACCA, CPA)",
    ],
    commonMistakes: [
      {
        title: "Ne pas citer la taille des clients audités",
        explanation:
          "Un CV d'auditeur junior sans mention du segment client (mid-cap 50-200M€, grand compte 500M€+, sectoriel) est illisible. Les managers de cabinet et les responsables audit interne industriels filtrent d'abord sur la taille et le secteur des dossiers.",
      },
      {
        title: "Oublier les sections dont on a eu la responsabilité",
        explanation:
          "« J'ai participé aux travaux d'audit » sans préciser quelles sections (revenus, stocks, immos, provisions) sous-vend systématiquement un profil. Nommez vos sections en propre, c'est ce que le manager d'industrie veut savoir.",
      },
      {
        title: "Ne pas mentionner IFRS 15 / CSRD",
        explanation:
          "En 2026, IFRS 15 (revenu) et la CSRD sont incontournables sur les dossiers mid-cap et plus. Un CV qui ne cite aucune des deux paraît bloqué en audit traditionnel et n'intéresse pas les postes d'audit interne côté entreprise.",
      },
      {
        title: "Tout miser sur l'école sans parcours DSCG / DEC",
        explanation:
          "Un auditeur senior sans DSCG (ou équivalent CCA validé) devient vite plafonné. Même si le Big 4 ne l'exige plus strictement, le passage en industrie (DAF de PME, directeur audit interne) le valorise fortement. Mentionnez vos UE validées, même partielles.",
      },
    ],
    hiringCompanies: [
      "EY France",
      "PwC",
      "Deloitte",
      "KPMG",
      "Mazars",
      "Grant Thornton",
      "BDO France",
      "RSM France",
      "Baker Tilly",
      "Crowe",
      "PKF Audit Conseil",
    ],
    salaryRange: "38-45k€ junior (Y1), 45-55k€ assistant confirmé (Y2-Y3), 55-75k€ senior / chef de mission en France (Big 4 + cabinets indépendants, Robert Half 2026)",
    typicalCareer:
      "Auditeur junior (Y1-Y2) → assistant confirmé (Y2-Y3) → senior / chef de mission (Y4-Y5) → manager (Y6-Y8) → senior manager puis associé OU sortie industrie (contrôle de gestion, audit interne, DAF PME).",
    relatedSlugs: ["comptable", "controleur-gestion", "consultant"],
    relatedBlogSlugs: ["10-erreurs-cv-ats", "mots-cles-offre-emploi"],
    relatedPillarSlugs: ["cv-ats", "adapter-cv-offre-emploi"],
  },

  // ─────────────────────────── SANTÉ ───────────────────────────
  {
    slug: "infirmier",
    name: "Infirmier·e",
    nameFull: "Infirmier·e diplômé·e d'État (IDE)",
    category: "Santé",
    intro:
      "La tension sur les infirmiers reste structurelle en 2026 : postes vacants dans tous les CHU, turn-over élevé, recours à l'intérim massif. Résultat : votre CV est lu en 60 secondes par un cadre de santé qui veut surtout valider trois choses — diplôme d'État, services déjà exercés, disponibilités. Un CV bien structuré évite le pré-rejet.",
    recruiterExpectations:
      "Le cadre de santé ou le DRH hospitalier cherche : (1) le diplôme d'État et le numéro ADELI / RPPS visibles dès l'en-tête, (2) les services fréquentés (urgences, bloc, pédiatrie, réa, EHPAD, médecine interne…) avec durée, (3) les spécialisations ou formations continues (DU douleur, soins palliatifs, gestes d'urgence). Les modalités (temps plein / partiel, nuits, week-ends) comptent presque autant que l'expérience.",
    keySkills: [
      "Soins techniques (pansements complexes, perfusion, chimiothérapie)",
      "Surveillance clinique et transmissions ciblées (IDE-AS-médecin)",
      "Gestion d'une prise en charge complète sur un secteur patient",
      "Urgence vitale (ACR, détresse, gestion de crise)",
      "Éducation thérapeutique du patient (ETP) et accompagnement familles",
      "Gestion des prescriptions, pharmacie du service, traçabilité",
      "Douleur et soins palliatifs (si formation ou expérience)",
      "Hygiène hospitalière et précautions complémentaires",
    ],
    toolsTech: [
      "DPI (Dossier Patient Informatisé) : Orbis, DxCare, Hôpital Manager",
      "Pharmacie : Pharma, Disp'Lib",
      "Pompes à perfusion et PSE (seringues électriques)",
      "Moniteurs multiparamétriques",
      "Logiciel de planning (Octime, Chronos)",
      "Matériel de soins stériles, PICC line / CVP / KTC",
    ],
    accrocheExample:
      "Infirmière diplômée d'État (IDE) depuis 2020, 5 ans d'expérience dont 3 en service de chirurgie viscérale en CHU et 2 en médecine polyvalente. Habituée aux secteurs lourds : 14 à 16 patients en journée. Formation continue en soins palliatifs (DU 2023). Disponible pour nuits, week-ends et remplacements en temps plein. Diplôme d'État n° RPPS 10000xxxxxx.",
    keyKpis: [
      "Nombre de patients gérés par tour (secteur, ratio IDE/patients)",
      "Services et secteurs fréquentés avec durée en mois/années",
      "Formations continues (DU, attestations AFGSU, ETP)",
      "Modalités exercées : jour, nuit, week-ends, temps partiel",
      "Expérience encadrement (nouvelles IDE, étudiants ESI)",
      "Gestes techniques spécifiques (chimiothérapie, PICC, ventilation)",
    ],
    commonMistakes: [
      {
        title: "Oublier le numéro ADELI / RPPS",
        explanation:
          "Un CV IDE sans numéro d'identification professionnelle oblige la DRH à vous relancer. Certains services passent directement au candidat suivant. Mettez-le dans l'en-tête, à côté du diplôme.",
      },
      {
        title: "Ne pas spécifier les services",
        explanation:
          "« Expérience en milieu hospitalier » ne dit rien. Urgences, bloc, réa, chir viscérale, médecine polyvalente, EHPAD : ce sont des métiers différents. Précisez chaque service avec durée.",
      },
      {
        title: "Omettre les disponibilités réelles",
        explanation:
          "Les cadres recrutent en fonction des besoins de cycle. Un CV qui ne dit pas « disponible pour nuits et week-ends » sera écarté pour les postes qui exigent ces horaires. Dites-le si vous l'êtes.",
      },
      {
        title: "Lister formations continues sans année ni organisme",
        explanation:
          "« Formation soins palliatifs » en vrac donne peu d'info. « DU Soins palliatifs, Université de Nantes, 2023 » pèse beaucoup plus, car le cadre peut vérifier.",
      },
    ],
    hiringCompanies: [
      "AP-HP (Assistance Publique - Hôpitaux de Paris)",
      "Ramsay Santé",
      "Vivalto Santé",
      "Elsan",
      "HCL (Hospices Civils de Lyon)",
      "CHU de Bordeaux",
      "CHU de Toulouse",
      "Clariane (Korian)",
      "Orpea (Emeis)",
      "Intérim Appel Médical / Hays Santé",
    ],
    salaryRange: "26-32k€ brut annuel début carrière (public), 28-38k€ expérimenté, 35-55k€ en intérim ou clinique privée",
    typicalCareer:
      "IDE de secteur → IDE spécialisée (bloc, IADE, IBODE, puéricultrice après formation) → cadre de santé ou IPA (infirmier pratique avancée, master).",
    relatedSlugs: ["aide-soignant", "charge-recrutement", "customer-success"],
    relatedBlogSlugs: ["10-erreurs-cv-ats", "lettre-motivation-ia-credible"],
    relatedPillarSlugs: ["creer-cv", "cv-ats"],
    faq: [
      {
        q: "Quel salaire pour une infirmière en début de carrière ?",
        a: "26 à 32 k€ brut annuel dans le public (grille fonction publique hospitalière + primes Ségur), 28 à 38 k€ dans le privé (cliniques, Ramsay, Vivalto). En intérim santé, les missions à 35-55 k€/an deviennent courantes, surtout en Île-de-France et sur les spécialités tendues (bloc, urgences, néonat). Le Ségur a aligné pas mal de grilles ces deux dernières années.",
      },
      {
        q: "Numéro RPPS ou ADELI sur le CV ?",
        a: "Oui, systématiquement — et idéalement les deux si vous les avez (ADELI a été progressivement remplacé par le RPPS depuis 2022). Le cadre santé vérifie ces numéros avant même de lire la suite : un CV IDE sans RPPS reste en bas de la pile. Si vous êtes fraîchement diplômée et que le RPPS n'est pas encore attribué, mentionnez explicitement « RPPS en cours d'attribution, DE obtenu le JJ/MM/AAAA ».",
      },
      {
        q: "Faut-il mettre ses stages d'IFSI sur le CV ?",
        a: "Oui pour un profil IDE junior (moins de 3 ans de diplôme) : les cadres santé veulent voir les services dans lesquels vous avez tourné (chir, médecine, psy, urgences, SSR…). Au-delà de 3 ans d'exercice, ne gardez que les stages dans la spécialité visée ou dans des services marquants (réanimation, bloc, pédiatrie).",
      },
      {
        q: "Quelle longueur pour un CV infirmier ?",
        a: "Une page stricte pour moins de 5 ans de diplôme, deux pages maximum ensuite. Les cadres santé recrutent en lisant très vite : ils cherchent d'abord le diplôme, le numéro RPPS, les services fréquentés et les formations continues (DU). Un CV trop long ou trop design (colonnes graphiques) est souvent rejeté dès le premier tri.",
      },
    ],
  },

  {
    slug: "aide-soignant",
    name: "Aide-soignant·e",
    nameFull: "Aide-soignant·e diplômé·e d'État (DEAS)",
    category: "Santé",
    intro:
      "Les aides-soignants sont aussi recherchés que les infirmiers, avec des conditions similaires en tension. Ce qui distingue un bon CV d'aide-soignant en 2026 : la clarté du diplôme (DEAS), les services connus, et l'aptitude aux tâches techniques de premier niveau (glycémie, prélèvements urinaires, aide transfert).",
    recruiterExpectations:
      "La cadre de santé ou le DRH EHPAD veut savoir en 30 secondes : (1) DEAS validé, date et école, (2) services ou établissements fréquentés (EHPAD, service gériatrie, médecine, post-opératoire, réanimation), (3) disponibilités concrètes. Les aides-soignants expérimentés en médecine lourde (réa, post-opératoire) sont particulièrement recherchés.",
    keySkills: [
      "Soins d'hygiène et de confort (toilettes, transferts, positionnement)",
      "Aide aux repas et surveillance alimentaire",
      "Surveillance des constantes (tension, pouls, SatO2, glycémie capillaire)",
      "Aide aux soins et collaboration avec IDE (préparation matériel, tenue)",
      "Prise en charge globale de la personne âgée (Alzheimer, perte autonomie)",
      "Prévention des escarres et mobilisation",
      "Traçabilité dans le DPI et transmissions écrites",
      "Accompagnement fin de vie et soutien aux familles",
    ],
    toolsTech: [
      "DPI (Orbis, Titan, Netsoins pour EHPAD)",
      "Lève-personne, verticalisateur",
      "Glucomètre, tensiomètre électronique, saturomètre",
      "Matériel de prévention escarres (matelas à air)",
      "Chariot de soin, outillage stérile",
      "Planning (Octime, Chronos)",
    ],
    accrocheExample:
      "Aide-soignante diplômée d'État (DEAS 2019, IFAS Paris-Est), 6 ans d'expérience. 3 ans en EHPAD (résidents GIR 1-4, 12 résidents par tour) puis 3 ans en service de gériatrie aiguë en CHU (18 patients par secteur). Formation prévention des chutes et bientraitance (2022). Disponible en nuits, week-ends et jours fériés. Permis B + véhicule.",
    keyKpis: [
      "Nombre de patients / résidents pris en charge par tour",
      "Types de services fréquentés (EHPAD, médecine, post-op, réa)",
      "Niveau de dépendance des patients (GIR en EHPAD)",
      "Formations complémentaires (bientraitance, escarres, Alzheimer)",
      "Modalités : jour / nuit / week-ends / fériés",
      "Durée de tenure sur chaque poste (stabilité)",
    ],
    commonMistakes: [
      {
        title: "Dire « j'aime le contact humain » sans rien prouver",
        explanation:
          "Tous les aides-soignants disent ça — c'est la base du métier. Mieux : raconter un cas concret (gestion d'un résident Alzheimer difficile, accompagnement fin de vie) ou citer une formation.",
      },
      {
        title: "Ne pas préciser le DEAS",
        explanation:
          "La distinction DEAS vs faisant fonction reste structurante pour les recruteurs. Si vous êtes DEAS, écrivez-le clairement avec l'année et l'école (IFAS). Si vous êtes faisant fonction, assumez et indiquez la durée.",
      },
      {
        title: "Omettre le GIR ou la typologie résidents en EHPAD",
        explanation:
          "Un EHPAD à GIR moyen 2 (très dépendant) est un univers très différent d'une résidence services. Le recruteur veut savoir si vous êtes habitué aux situations lourdes. Précisez-le.",
      },
      {
        title: "CV trop court sans zone missions",
        explanation:
          "Un CV aide-soignant à 2 lignes par poste (« CHU de Lyon — 2021-2023 ») manque d'info. Détaillez : service, ratio patients, gestes techniques autorisés, responsabilités particulières.",
      },
    ],
    hiringCompanies: [
      "AP-HP",
      "Ramsay Santé",
      "Elsan",
      "Vivalto Santé",
      "Clariane (Korian)",
      "Orpea (Emeis)",
      "Colisée",
      "DomusVi",
      "Groupe SOS Santé",
      "Intérim Appel Médical / Medifitjob",
    ],
    salaryRange: "22-26k€ brut annuel début carrière, 24-30k€ expérimenté, 28-38k€ en intérim ou nuit selon prime",
    typicalCareer:
      "DEAS → aide-soignant confirmé → passerelle IDE (concours IFSI ou VAE) ou auxiliaire de puériculture, accompagnant éducatif et social.",
    relatedSlugs: ["infirmier", "charge-recrutement", "customer-success"],
    relatedBlogSlugs: ["10-erreurs-cv-ats", "lettre-motivation-ia-credible"],
    relatedPillarSlugs: ["creer-cv", "cv-ats"],
    faq: [
      {
        q: "Quel salaire pour un aide-soignant en 2026 ?",
        a: "22 à 26 k€ brut annuel début de carrière dans le public (grille fonction publique hospitalière après Ségur), 20 à 24 k€ hors primes en province. Un AS expérimenté atteint 24-30 k€. L'intérim santé ou les nuits poussent facilement le revenu annuel à 28-38 k€ avec primes dimanche / férié / nuit. Les EHPAD privés (Clariane, Colisée, DomusVi) paient légèrement mieux que les publics hors primes, mais avec des rythmes souvent plus tendus. Prime Ségur intégrée dans la plupart des grilles 2026.",
      },
      {
        q: "DEAS ou faisant fonction : quelle différence sur le CV ?",
        a: "Le DEAS (Diplôme d'État d'Aide-Soignant) reste la référence absolue — à mentionner dans l'en-tête avec année et école (IFAS). Faisant fonction d'aide-soignant (FFAS) est une pratique courante en pénurie, surtout en EHPAD, mais à assumer clairement : « FFAS depuis 2022, préparation DEAS en cours » est mieux qu'un flou qui se fait repérer à l'entretien. La passerelle VAE vers DEAS reste accessible après 1 an minimum d'exercice équivalent temps plein.",
      },
      {
        q: "Faut-il mentionner le GIR et le type de service ?",
        a: "Oui, systématiquement. Un EHPAD où la majorité des résidents est en GIR 1-2 (très dépendants, souvent Alzheimer avancé) est un univers très différent d'une résidence services avec GIR 5-6. Le recruteur veut savoir si vous êtes habitué aux situations lourdes : toilettes complexes, prévention escarres, transferts avec lève-personne, fin de vie. En milieu hospitalier, précisez le service (gériatrie aiguë, post-op, médecine polyvalente, réa, SSR) et le ratio moyen (12 patients vs 18 patients par tour).",
      },
      {
        q: "Quelle longueur et quelles disponibilités afficher ?",
        a: "Une page stricte suffit pour un AS sous 10 ans d'expérience. Deux pages au-delà uniquement si formations complémentaires nombreuses (bientraitance, prévention chutes, accompagnement fin de vie, Humanitude). Mettez impérativement vos disponibilités concrètes : temps plein / partiel, nuits, week-ends, jours fériés. Permis B + véhicule est un vrai plus en zone semi-rurale. Un CV AS sans ces infos pratiques est souvent rappelé pour confirmation — autant les donner directement pour passer le premier tri.",
      },
    ],
  },

  {
    slug: "pharmacien-officine",
    name: "Pharmacien d'officine",
    nameFull: "Pharmacien·ne d'officine (titulaire ou adjoint·e)",
    category: "Santé",
    intro:
      "Le pharmacien d'officine exerce dans un secteur en pleine transformation : nouvelles missions (vaccination, entretiens pharmaceutiques, tests TROD, dépistage), groupements qui se concentrent, pression sur les marges et montée des ventes en ligne. En 2026, un bon CV de pharmacien adjoint met en avant les missions cliniques et les compétences managériales autant que la délivrance.",
    recruiterExpectations:
      "Le pharmacien titulaire ou le DRH groupement cherche : (1) le diplôme d'État de docteur en pharmacie clairement mentionné avec l'année et la faculté, (2) le numéro RPPS et l'inscription à l'Ordre (section A pour officine), (3) la connaissance du logiciel officinal principal (LGPI, Winpharma, LGO, Pharmagest Smart), (4) l'expérience des nouvelles missions (vaccination grippe / COVID, entretiens AVK, TROD angine). Les pharmaciens qui ont encadré une équipe de préparateurs sortent du lot.",
    keySkills: [
      "Délivrance sécurisée (validation ordonnance, interactions, posologie)",
      "Conseil officinal (OTC, orthopédie, dermocosmétique, aromathérapie)",
      "Nouvelles missions (vaccination grippe/COVID, entretiens AVK/AOD, TROD)",
      "Gestion des stocks et des commandes (grossistes, directs labos)",
      "Management d'une équipe de préparateurs (planning, formation, montée en compétences)",
      "Préparations magistrales (capsules, pommades, préparations pédiatriques)",
      "Pharmacovigilance et déclaration CRPV",
      "Tiers payant, télétransmission, gestion des rejets",
    ],
    toolsTech: [
      "LGPI (Pharmagest)",
      "Winpharma",
      "LGO (Lemer)",
      "Pharmagest Smart / Smart Rx",
      "OsPharm",
      "Dossier Pharmaceutique (DP)",
      "Mon espace santé / Ségur",
      "Ordypro / e-prescription",
    ],
    accrocheExample:
      "Docteure en pharmacie (Paris-Descartes, 2019), inscrite à l'Ordre section A, RPPS 10200XXXXXX. 6 ans d'expérience dont 4 comme pharmacienne adjointe dans une officine de quartier parisien (CA 2,8M€, 5 préparateurs). Je coordonne la campagne vaccinale annuelle (780 vaccins grippe en 2024, 320 COVID), les entretiens pharmaceutiques AVK/AOD (42 patients suivis), et le circuit du médicament sur LGPI. J'encadre les préparateurs en formation continue (3 sessions internes/an sur les nouveautés réglementaires).",
    keyKpis: [
      "Taille de l'officine : CA annuel, nombre de préparateurs, flux clients/jour",
      "Nombre de vaccinations réalisées (grippe, COVID, autres)",
      "Nombre d'entretiens pharmaceutiques menés (AVK, AOD, asthme)",
      "TROD réalisés (angine, cystite) et télémédecine officinale",
      "Logiciel officinal maîtrisé avec paramétrage avancé",
      "Équipe encadrée (préparateurs en formation initiale ou continue)",
    ],
    commonMistakes: [
      {
        title: "Ne pas afficher le numéro RPPS et l'Ordre",
        explanation:
          "Le RPPS et la section de l'Ordre (A pour officine, E pour industrie, H pour hôpital) sont vérifiés en premier par le titulaire ou la DRH. Un CV sans ces infos dans l'en-tête déclenche souvent un simple rappel pour confirmer — autant les mettre directement.",
      },
      {
        title: "Confondre pharmacien officine et pharmacien hospitalier",
        explanation:
          "Un CV qui mélange expériences hospitalières (PUI, sections pharmacotechnie, stérilisation) et officinales sans hiérarchiser dessert le candidat. Si vous visez l'officine, mettez en haut les expériences officinales, la maîtrise LGPI, les nouvelles missions ; l'hôpital en expérience complémentaire.",
      },
      {
        title: "Oublier les nouvelles missions",
        explanation:
          "Vaccination, entretiens pharmaceutiques, TROD, bilans partagés de médication : un pharmacien qui n'en parle pas sur son CV 2026 paraît figé sur le modèle 2015. Quantifiez vos volumes (vaccinations, entretiens) — c'est un vrai différenciateur dans les groupements.",
      },
      {
        title: "Négliger l'angle managérial pour un poste de titulaire adjoint",
        explanation:
          "Les titulaires cherchent des adjoints qui savent encadrer l'équipe, former les préparateurs, tenir l'officine en leur absence. Un CV qui n'évoque jamais la partie management, planning, formation, est pénalisé sur les postes avec perspective d'association.",
      },
    ],
    hiringCompanies: [
      "Giphar",
      "Pharmacie Lafayette",
      "Leadersanté",
      "Welcoop",
      "Galien",
      "Aprium Pharmacie",
      "Pharmabest",
      "Giropharm",
      "Elsie Santé",
      "Évolupharm",
      "Les Pharmaciens associés",
    ],
    salaryRange: "42-55k€ pharmacien adjoint débutant, 50-70k€ adjoint confirmé, 70-110k€ titulaire selon CA officine en France (Ordre des Pharmaciens + Convention collective 2026)",
    typicalCareer:
      "Pharmacien adjoint (2-5 ans) → adjoint confirmé / remplacement titulaire → titulaire (association ou rachat) → pharmacien consultant groupement ou reconversion industrie pharmaceutique / régulateur santé.",
    relatedSlugs: ["infirmier", "aide-soignant", "customer-success"],
    relatedBlogSlugs: ["10-erreurs-cv-ats", "lettre-motivation-ia-credible"],
    relatedPillarSlugs: ["creer-cv", "cv-ats"],
    faq: [
      {
        q: "Quel salaire pour un pharmacien adjoint en 2026 ?",
        a: "42 à 55 k€ brut annuel pour un adjoint débutant selon la convention collective de la pharmacie d'officine (coefficient 500-600), 50 à 70 k€ pour un adjoint confirmé avec ancienneté et missions cliniques. Les officines à fort CA (> 4M€) et les officines Pharmabest / Lafayette paient davantage. Un titulaire indépendant prélève typiquement 70-120 k€ selon CA et structure (SEL, SELARL).",
      },
      {
        q: "Quels diplômes et inscriptions afficher ?",
        a: "Doctorat en pharmacie (année + faculté), inscription à l'Ordre national des pharmaciens section A pour l'officine (ou E pour industrie, H pour hôpital), numéro RPPS. Les DU valorisés en 2026 : DU orthopédie, DU aromathérapie clinique, DU vaccination (utile même après intégration dans le cursus initial), DU éducation thérapeutique, DU micronutrition. Mentionnez-les avec l'université et l'année.",
      },
      {
        q: "Comment mettre en avant les nouvelles missions ?",
        a: "Créez une section dédiée « Nouvelles missions pharmaceutiques » avec chiffres : nombre de vaccinations réalisées (grippe, COVID, HPV), entretiens pharmaceutiques (AVK, AOD, asthme), TROD (angine, cystite), bilans partagés de médication. En 2026, c'est devenu le vrai différenciateur entre un adjoint technique et un adjoint clinique, surtout pour les officines en groupement qui veulent développer ces activités.",
      },
      {
        q: "Faut-il mentionner le logiciel officinal utilisé ?",
        a: "Oui, systématiquement. LGPI (Pharmagest) domine le marché français, suivi par Winpharma, LGO, et Smart Rx. Un pharmacien qui connaît déjà le logiciel de l'officine qui recrute gagne en général 1-2 mois de montée en compétences — c'est un vrai argument. Précisez aussi les modules maîtrisés : caisse, tiers payant, gestion de stock, paramétrage des ventes croisées.",
      },
    ],
  },

  // ─────────────────────────── MANAGEMENT ───────────────────────────
  {
    slug: "chef-de-projet",
    name: "Chef de projet",
    nameFull: "Chef·fe de projet / Project Manager",
    category: "Management",
    intro:
      "Chef de projet est un titre valise : il recouvre le PMO industriel, le chef de projet digital en agence, le project manager SI en grand groupe. Chaque secteur a ses codes et ses méthodes. Votre CV doit dire clairement dans quelle famille vous jouez, sinon il est mal trié.",
    recruiterExpectations:
      "Le directeur de programme ou le chef d'agence cherche : (1) la taille des projets pilotés (budget, durée, équipe), (2) la méthodologie (Agile, Prince2, PMI, Waterfall selon secteur), (3) des exemples concrets de délivrance avec respect délai/budget/qualité. Un chef de projet qui ne donne ni durée ni budget ressemble à un assistant de projet.",
    keySkills: [
      "Planification (WBS, Gantt, chemin critique, jalons)",
      "Gestion des risques (matrice, plan de contingence, escalade)",
      "Suivi budgétaire (EVM, écart coût/délai, alerte COMEX)",
      "Animation de comité de pilotage et reporting sponsor",
      "Gestion d'équipe projet (ressources internes + prestataires)",
      "Méthodes Agile (Scrum, Kanban) ou classiques (Prince2, PMI)",
      "Cadrage fonctionnel et spécification (besoins, user stories)",
      "Conduite du changement et communication utilisateurs finaux",
    ],
    toolsTech: [
      "MS Project / Smartsheet",
      "Jira / Linear",
      "Confluence / Notion",
      "MS Teams / Slack",
      "PowerPoint niveau COPIL",
      "Excel avancé (budget, suivi)",
      "Miro / Lucidchart",
    ],
    accrocheExample:
      "Chef de projet SI en ETI industrielle, 8 ans d'expérience. J'ai piloté la migration ERP SAP d'une BU (budget 2,3M€, 14 mois, équipe 9 personnes internes + intégrateur), livrée à +4 semaines du jalon initial sur un périmètre confirmé. Certifié PMP et Scrum Master. Je gère simultanément 2-3 projets sur budgets de 300k€ à 2M€, en coordination avec DAF et DSI.",
    keyKpis: [
      "Budget projet géré (en €)",
      "Durée des projets pilotés (mois)",
      "Taille de l'équipe projet encadrée",
      "Respect des jalons (% de livraisons on-time)",
      "Nombre de projets simultanés gérés",
      "ROI ou gains produits par le projet (si mesurables)",
    ],
    commonMistakes: [
      {
        title: "Ne pas indiquer le budget des projets",
        explanation:
          "Un chef de projet sans budget chiffré est invisible dans le filtre ATS et peu crédible pour le recruteur. Mettez une fourchette, même confidentielle (« budget > 500k€ »).",
      },
      {
        title: "Abuser des buzzwords méthodologiques",
        explanation:
          "« SAFe, LeSS, Nexus, Prince2, PMI, DSDM, Scrum, Kanban » listés sans exemple d'application concrète donne l'impression de collection de certifs sans fond. Gardez 2 méthodos réellement pratiquées.",
      },
      {
        title: "Se présenter comme chef de projet quand on est coordinateur",
        explanation:
          "Coordonner une réunion hebdo et piloter un budget avec responsabilité sont deux métiers. Si vous n'avez pas signé de bon de commande ni dirigé une équipe, positionnez-vous comme « coordinateur » ou « assistant chef de projet ».",
      },
      {
        title: "Oublier la conduite du changement",
        explanation:
          "Un projet livré techniquement mais non adopté est un échec. Mentionnez votre approche change management : communication, formation, adoption utilisateurs finaux.",
      },
    ],
    hiringCompanies: [
      "Capgemini",
      "Accenture France",
      "Sopra Steria",
      "Airbus",
      "Thales",
      "Orange Business",
      "EDF",
      "LVMH",
      "Renault",
      "Dassault Systèmes",
    ],
    salaryRange: "40-50k€ junior, 50-70k€ confirmé, 70-95k€ senior / chef de programme en France",
    typicalCareer:
      "Assistant chef de projet → chef de projet confirmé (3-6 ans) → senior / chef de programme → directeur de programme, PMO manager, freelance TJM 650-900€.",
    relatedSlugs: ["product-manager", "consultant", "devops"],
    relatedBlogSlugs: ["mots-cles-offre-emploi", "10-erreurs-cv-ats"],
    relatedPillarSlugs: ["adapter-cv-offre-emploi", "cv-ats"],
    faq: [
      {
        q: "Quel salaire pour un chef de projet en 2026 ?",
        a: "40 à 50 k€ brut annuel pour un CdP junior à Paris, 35 à 42 k€ en province. Un chef de projet confirmé (3-6 ans) atteint 50-70 k€, et les seniors ou chefs de programme montent à 70-95 k€ dans les grands groupes (Capgemini, Sopra, Airbus, Thales, EDF, Renault). Les CdP en scale-up tech sont souvent moins nombreux mais mieux payés (jusqu'à 85 k€ à 5 ans). En freelance, le TJM démarre à 550 €/jour et atteint 650-900 €/jour pour un CdP senior certifié avec un vrai track record multi-projets.",
      },
      {
        q: "PMP, Prince2, Scrum : quelles certifications demandées ?",
        a: "PMP (Project Management Professional, PMI) reste la référence internationale, utile surtout en grand groupe et à l'international. Prince2 domine dans les groupes publics et certains secteurs tradi en France. Scrum Master (PSM, CSM) est le minimum attendu sur un projet Agile ou en transformation digitale. En 2026, le combo gagnant pour un CdP tech : PMP ou Prince2 + Scrum Master + une compétence produit. Attention à ne pas empiler les certifs sans projet concret derrière — le recruteur repère le collectionneur.",
      },
      {
        q: "Comment chiffrer la taille d'un projet sur le CV ?",
        a: "Quatre chiffres incontournables par projet : budget en € (même en fourchette « > 500k€ » si confidentiel), durée totale en mois, taille de l'équipe (internes + prestataires), et respect des jalons (% on-time ou semaines d'écart). Un chef de projet sans budget chiffré est invisible dans le filtre ATS. Mentionnez aussi le nombre de projets simultanés gérés (« 2-3 projets en parallèle, budgets 300k€ à 2M€ ») — c'est le signal de maturité qui distingue un CdP d'un assistant.",
      },
      {
        q: "Agile ou Waterfall : comment positionner son profil ?",
        a: "La réalité 2026 : 70 % des projets en grand groupe restent en mode hybride (cadrage Waterfall + exécution Agile). Positionnez-vous clairement selon le secteur visé. Pour un poste industriel, ERP ou réglementaire (banque, pharma), le Waterfall / Prince2 domine. Pour un poste SI en scale-up ou transformation digitale, l'Agile / SAFe est attendu. Un CV qui mélange « SAFe, LeSS, Nexus, Prince2, PMI, DSDM » sans exemple d'application concrète décrédibilise. Gardez 2 méthodologies réellement pratiquées, avec un projet phare pour chacune. Deux pages tolérées au-delà de 5 ans.",
      },
    ],
  },

  {
    slug: "consultant",
    name: "Consultant",
    nameFull: "Consultant / Consultante en cabinet",
    category: "Management",
    intro:
      "Le consulting reste un aimant à jeunes diplômés d'écoles de commerce et d'ingénieurs — mais le marché s'est refroidi en 2024-2025 avec des plans sociaux chez plusieurs Big 4. En 2026, le recrutement se resserre autour des profils qui arrivent avec une expertise claire (data, transformation, ESG, IA) plutôt qu'avec un pur parcours académique.",
    recruiterExpectations:
      "Le manager ou le partner qui vous lit cherche : (1) des missions précises avec client, problématique, livrable, impact (pas « accompagnement de la direction »), (2) une spécialisation lisible — data & analytics, organisation, stratégie, transfo digitale, ESG, (3) des responsabilités croissantes sur les derniers projets (conduite d'atelier, présentation client, management de juniors).",
    keySkills: [
      "Analyse problématique client (diagnostic, cadrage, structuration)",
      "Conduite d'atelier et d'entretiens qualitatifs",
      "Structuration de livrables (pyramide, rapports, decks)",
      "Modélisation Excel et modeling financier",
      "Restitution client niveau COMEX / CODIR",
      "Gestion de projet mission (jalons, équipe, qualité)",
      "Veille sectorielle et expertise domaine (banque, industrie, santé…)",
      "Business development junior (propale, mise en relation, rédaction)",
    ],
    toolsTech: [
      "PowerPoint niveau top-tier consulting",
      "Excel avancé (modeling, financial)",
      "Tableau / Power BI",
      "Think-cell",
      "Miro",
      "Notion / Confluence",
      "SAP / Salesforce selon mission",
    ],
    accrocheExample:
      "Consultante senior en cabinet de transformation, 4 ans d'expérience, spécialisée en opérations et supply chain. Dernière mission : pilotage d'un chantier d'optimisation des stocks chez un groupe agroalimentaire (CA 1,2Md€), économies identifiées 6,2M€/an sur les lignes critiques. Manage 2 consultants juniors et co-construis les livrables de restitution COMEX. HEC Paris + diplôme d'ingénieur AgroParisTech.",
    keyKpis: [
      "Nombre de missions menées, par typologie et secteur",
      "Impact business mesurable des missions (ROI, économies, revenu)",
      "Taille des clients (CA, effectif, périmètre)",
      "Durée moyenne des missions et diversité des problématiques",
      "Nombre de juniors managés / formés",
      "Contribution business development (propales rédigées, nouveaux comptes)",
    ],
    commonMistakes: [
      {
        title: "Vendre des missions en boîtes noires",
        explanation:
          "« Accompagnement du directeur général dans sa transformation » ne dit rien. Qui ? Quel problème ? Quelle méthode ? Quel livrable ? Quel impact ? Même en respectant la confidentialité, on peut être concret.",
      },
      {
        title: "Empiler les secteurs sans spécialisation",
        explanation:
          "Un consultant qui a fait banque + industrie + santé + énergie + retail en 3 ans sans spécialisation claire passe pour un « remplisseur de slides ». Positionnez un secteur ou une practice.",
      },
      {
        title: "Oublier les chiffres d'impact",
        explanation:
          "Le consulting se paie à l'impact. Sans mention d'économies générées, de revenue généré, de time-to-market réduit, le CV ressemble à de la méthode sans résultat.",
      },
      {
        title: "Trop miser sur l'école",
        explanation:
          "Un diplôme top école ouvre le premier CV, pas les suivants. Si vous êtes à 4 ans d'expérience et que votre CV met encore HEC ou Polytechnique en haut, c'est le signe d'une expérience fragile.",
      },
    ],
    hiringCompanies: [
      "McKinsey France",
      "BCG France",
      "Bain France",
      "Roland Berger",
      "Oliver Wyman",
      "Kearney",
      "Capgemini Invent",
      "EY-Parthenon",
      "Sia Partners",
      "Wavestone",
    ],
    salaryRange: "50-65k€ junior consulting (package), 70-100k€ senior, 110-180k€ manager / senior manager en France",
    typicalCareer:
      "Consultant junior → consultant confirmé → senior consultant (3-4 ans) → manager (5-6 ans) → senior manager → partner ou industrie (directeur stratégie / transfo).",
    relatedSlugs: ["chef-de-projet", "controleur-gestion", "ingenieur-commercial"],
    relatedBlogSlugs: ["mots-cles-offre-emploi", "cv-commercial-structure-gagnante"],
    relatedPillarSlugs: ["adapter-cv-offre-emploi", "cv-ats"],
    faq: [
      {
        q: "Quel salaire pour un consultant en cabinet en 2026 ?",
        a: "Package 50 à 65 k€ pour un junior en sortie d'école de commerce ou d'ingé (stratégie top-tier MBB ou Big 4 Strategy). 70 à 100 k€ pour un senior consultant (3-4 ans), 110 à 180 k€ pour un manager ou senior manager en stratégie. Les cabinets de transfo (Capgemini Invent, Sia Partners, Wavestone) paient 10-20 % de moins que les stratégie pures. Bonus de fin d'année 10-30 % selon la performance. Les packages 2024-2025 ont été revus à la baisse après les plans sociaux Big 4, mais le haut du marché reste attractif.",
      },
      {
        q: "Quel diplôme pour entrer en conseil ?",
        a: "Les portes d'entrée classiques : top 5 écoles de commerce (HEC, ESSEC, ESCP, EM Lyon, EDHEC) ou top écoles d'ingénieur (Polytechnique, Mines, Centrale, ENSAE, AgroParisTech). Les diplômes d'université (M2 stratégie, M2 finance) passent aussi, surtout dans les cabinets sectoriels ou de transfo digitale. Les MBA post-expérience (INSEAD, HEC MBA) restent une voie royale pour intégrer MBB à senior. Le niveau académique décide du premier CV — après, c'est le track record mission qui parle, l'école compte de moins en moins au-delà de 4 ans.",
      },
      {
        q: "PowerPoint, Excel, Think-cell : quel niveau attendu ?",
        a: "PowerPoint niveau top-tier consulting (pyramide, SCR, storyline) est une compétence dure attendue dès le junior. Excel avancé avec modeling financier (P&L, business case, sensitivity analysis) est également non-négociable en stratégie et M&A. Think-cell (plugin PowerPoint pour graphiques waterfall, Gantt, Mekko) est devenu quasi-standard chez MBB et Big 4 Strategy. Power BI ou Tableau selon la practice — data analytics s'est imposée dans toutes les missions transfo. Mentionnez le niveau précis, pas une liste sèche.",
      },
      {
        q: "Comment documenter une mission confidentielle sur le CV ?",
        a: "Même sous NDA, vous pouvez décrire : secteur (banque de détail, agroalimentaire, aéronautique civil), problématique (optimisation supply chain, refonte organisation, stratégie go-to-market), livrable (diagnostic, plan de transformation, business case), et impact chiffré (économies identifiées en €, durée du plan, nombre d'utilisateurs finaux impactés). Exemple : « Groupe agroalimentaire français, CA 1,2Md€ — optimisation des stocks lignes critiques, économies identifiées 6,2M€/an ». Deux pages tolérées à partir de manager. Une spécialisation lisible (practice, secteur) pèse plus qu'un empilement de secteurs.",
      },
    ],
  },

  {
    slug: "scrum-master",
    name: "Scrum Master",
    nameFull: "Scrum Master / Agile Coach",
    category: "Management",
    intro:
      "Le Scrum Master a perdu de sa superbe après 2023 : les scale-ups ont fusionné le rôle avec celui de PM ou de tech lead, et les postes purs Scrum Master se font plus rares. En 2026, les profils qui trouvent preneur sont ceux qui ont élargi à l'agile coaching multi-équipes, ou qui couplent Scrum Master avec une vraie compétence delivery / change management. Le simple « facilitateur de cérémonies » ne suffit plus.",
    recruiterExpectations:
      "Le head of engineering ou le directeur delivery veut : (1) de vrais indicateurs d'équipe — velocity stabilisée, cycle time réduit, predictability améliorée, (2) la capacité à animer plusieurs squads et à coacher des managers, pas juste des devs, (3) une vraie pratique de l'amélioration continue (rétros actionnables, suivi des engagements, pas un tableau qui meurt). Un Scrum Master qui ne cite pas le sujet organisationnel (scaling, dépendances) reste cantonné à un rôle de team.",
    keySkills: [
      "Facilitation Scrum (daily, refinement, planning, review, rétro)",
      "Kanban et gestion du flow (WIP limits, cycle time, throughput)",
      "Coaching de Product Owner et de tech lead",
      "Scaling agile (SAFe, LeSS, Spotify model) — réserves incluses",
      "Animation de rétrospectives qui produisent du changement",
      "Gestion des dépendances inter-squads (teams of teams)",
      "Métriques équipe (velocity, predictability, cycle time, flow efficiency)",
      "Résolution de conflits et dynamique de groupe",
    ],
    toolsTech: [
      "Jira / Linear / Shortcut",
      "Confluence / Notion",
      "Miro / Mural (rétros distribuées)",
      "Slack",
      "Figma (lecture)",
      "Metabase / Looker (métriques delivery)",
      "GitHub (lecture PRs)",
      "Liberating Structures (formats d'ateliers)",
    ],
    accrocheExample:
      "Scrum Master puis Agile Coach, 6 ans d'expérience dont 3 en scale-up SaaS. J'ai accompagné 2 squads simultanément (14 personnes au total : devs, PM, designers) puis suis passée coach multi-squads sur un périmètre de 5 équipes produit. Velocity stabilisée à +/- 8 % après 3 rétros ciblées, cycle time moyen réduit de 9 à 5,5 jours sur 12 mois. Certifications PSM I + II, ICP-ACC. Je travaille aussi sur les dépendances inter-équipes via des Big Room Plannings trimestriels.",
    keyKpis: [
      "Nombre d'équipes accompagnées simultanément",
      "Velocity et predictability (écart forecast vs réel) sur 12 mois",
      "Cycle time / lead time réduits après interventions",
      "Taux d'action items de rétro réellement clôturés",
      "Engagement équipe (eNPS, satisfaction manager)",
      "Nombre d'agile coaches ou de Scrum Masters juniors mentorés",
    ],
    commonMistakes: [
      {
        title: "Lister les certifs comme preuve principale",
        explanation:
          "PSM, PSPO, SAFe, ICP-ACC, CSM, CSPO empilés sans exemple d'application concrète donnent une impression de collectionneur de diplômes. Le marché 2026 cherche des résultats d'équipe, pas un badge CV. Gardez 2-3 certifs pertinentes et étayez chacune par un apport concret.",
      },
      {
        title: "Parler uniquement des cérémonies",
        explanation:
          "Un Scrum Master qui ne parle que de dailies, plannings et rétros sans évoquer les métriques d'équipe (velocity, cycle time, throughput) paraît cantonné au rôle de facilitateur. Ajoutez la dimension delivery performance.",
      },
      {
        title: "Vendre du SAFe comme si c'était partout adopté",
        explanation:
          "SAFe est un framework installé dans les grands groupes (banques, industrie) mais souvent critiqué dans les scale-ups qui préfèrent Spotify ou des modèles maison. Si vous postulez en scale-up avec un CV 100 % SAFe, adaptez : montrez la capacité à simplifier et à retirer de la cérémonie, pas à ajouter.",
      },
      {
        title: "Confondre Scrum Master et chef de projet",
        explanation:
          "Un Scrum Master n'a pas d'autorité hiérarchique ni de budget à piloter. Un CV qui liste « gestion du budget projet, arbitrage COMEX, planning Gantt » sous Scrum Master est mal positionné : soit vous êtes en réalité chef de projet, soit vous brouillez les pistes.",
      },
    ],
    hiringCompanies: [
      "BNP Paribas",
      "Société Générale",
      "Crédit Agricole",
      "Air France",
      "Capgemini",
      "Sopra Steria",
      "Thales",
      "Orange",
      "Doctolib",
      "Decathlon Tech",
      "La Poste Digital",
    ],
    salaryRange: "45-55k€ Scrum Master junior, 55-70k€ confirmé, 70-95k€ senior / agile coach en France (APEC 2026)",
    typicalCareer:
      "Scrum Master junior (1-3 ans) → Scrum Master confirmé (3-5 ans) → Agile Coach (multi-squads) → Head of delivery, head of transformation agile ou freelance TJM 550-750€.",
    relatedSlugs: ["chef-de-projet", "product-manager", "consultant"],
    relatedBlogSlugs: ["mots-cles-offre-emploi", "10-erreurs-cv-ats"],
    relatedPillarSlugs: ["adapter-cv-offre-emploi", "cv-ats"],
  },
];

// Helpers ---------------------------------------------------------------

export function getMetierBySlug(slug: string): CvMetier | undefined {
  return CV_METIERS.find((m) => m.slug === slug);
}

export function getRelatedMetiers(metier: CvMetier): CvMetier[] {
  return metier.relatedSlugs
    .map((s) => getMetierBySlug(s))
    .filter((m): m is CvMetier => Boolean(m));
}

export function getMetiersByCategory(): Record<CvMetierCategory, CvMetier[]> {
  const out = {} as Record<CvMetierCategory, CvMetier[]>;
  for (const m of CV_METIERS) {
    if (!out[m.category]) out[m.category] = [];
    out[m.category].push(m);
  }
  return out;
}

// Category order for the index page (matters for visual balance).
export const CATEGORY_ORDER: CvMetierCategory[] = [
  "Tech",
  "Commerce",
  "Marketing",
  "RH",
  "Finance",
  "Santé",
  "Management",
];
