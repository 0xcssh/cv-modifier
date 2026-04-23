import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://cvmodifier.com";
  const now = new Date();
  return [
    // Landing — priorité max
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    // Pillar pages SEO — haute priorité, keywords à fort volume
    { url: `${base}/adapter-cv-offre-emploi`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/cv-ats`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/creer-cv`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/lettre-motivation-ia`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    // Page institutionnelle
    { url: `${base}/a-propos`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    // Pages légales RGPD
    { url: `${base}/legal/mentions-legales`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/legal/cgu`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/legal/confidentialite`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/legal/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
