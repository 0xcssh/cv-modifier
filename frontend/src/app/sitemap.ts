import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog-posts";
import { CV_METIERS } from "@/lib/cv-metiers";

// Dates réelles de dernière mise à jour significative par route.
// Ne pas utiliser `new Date()` sur toutes les URLs : Google finit par
// ignorer les lastmod qui varient à chaque déploiement.
// Update manuellement quand le contenu d'une page change vraiment.
const LASTMOD: Record<string, string> = {
  "/": "2026-04-23",
  "/adapter-cv-offre-emploi": "2026-04-23",
  "/cv-ats": "2026-04-23",
  "/creer-cv": "2026-03-14",
  "/lettre-motivation-ia": "2026-03-14",
  "/blog": "2026-04-22",
  "/cv-par-metier": "2026-04-20",
  "/a-propos": "2026-03-05",
  "/legal/mentions-legales": "2026-04-22",
  "/legal/cgu": "2026-04-22",
  "/legal/confidentialite": "2026-04-22",
  "/legal/cookies": "2026-04-22",
};

// Les métiers ont été tous créés lors du Sprint programmatic (2026-04-20).
// Si un métier est réécrit, override ici.
const METIER_LASTMOD: Record<string, string> = {};
const METIER_DEFAULT = "2026-04-20";

function lastMod(path: string, fallback = "2026-04-20"): Date {
  return new Date(LASTMOD[path] ?? fallback);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://cvmodifier.com";

  const blogPosts = getAllPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const metiersPages = CV_METIERS.map((metier) => ({
    url: `${base}/cv-par-metier/${metier.slug}`,
    lastModified: new Date(
      METIER_LASTMOD[metier.slug] ?? METIER_DEFAULT,
    ),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    // Landing — priorité max
    {
      url: `${base}/`,
      lastModified: lastMod("/"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    // Pillar pages SEO — haute priorité, keywords à fort volume
    {
      url: `${base}/adapter-cv-offre-emploi`,
      lastModified: lastMod("/adapter-cv-offre-emploi"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/cv-ats`,
      lastModified: lastMod("/cv-ats"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/creer-cv`,
      lastModified: lastMod("/creer-cv"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/lettre-motivation-ia`,
      lastModified: lastMod("/lettre-motivation-ia"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // Blog
    {
      url: `${base}/blog`,
      lastModified: lastMod("/blog"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...blogPosts,
    // CV par métier (programmatic)
    {
      url: `${base}/cv-par-metier`,
      lastModified: lastMod("/cv-par-metier"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...metiersPages,
    // Page institutionnelle
    {
      url: `${base}/a-propos`,
      lastModified: lastMod("/a-propos"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // Pages légales RGPD
    {
      url: `${base}/legal/mentions-legales`,
      lastModified: lastMod("/legal/mentions-legales"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/legal/cgu`,
      lastModified: lastMod("/legal/cgu"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/legal/confidentialite`,
      lastModified: lastMod("/legal/confidentialite"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/legal/cookies`,
      lastModified: lastMod("/legal/cookies"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
