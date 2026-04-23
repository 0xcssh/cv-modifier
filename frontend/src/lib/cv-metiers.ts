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
