// Schema.org JSON-LD helpers.
//
// Return plain JS objects that pages serialize inline via
// <Script type="application/ld+json">. Content is always fully
// controlled by us, so dangerouslySetInnerHTML is safe here.

const SITE_URL = "https://cvmodifier.com";

export type BreadcrumbTrail = { name: string; url: string }[];

export function breadcrumbLd(trail: BreadcrumbTrail) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((entry, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: entry.name,
      item: entry.url.startsWith("http") ? entry.url : `${SITE_URL}${entry.url}`,
    })),
  };
}

export type FaqItem = { q: string; a: string };

export function faqPageLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export type CollectionItem = { url: string; name: string };

export function collectionPageLd(opts: {
  url: string;
  name: string;
  description: string;
  items: CollectionItem[];
}) {
  const absoluteUrl = opts.url.startsWith("http")
    ? opts.url
    : `${SITE_URL}${opts.url}`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl}#collection`,
    url: absoluteUrl,
    name: opts.name,
    description: opts.description,
    inLanguage: "fr-FR",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
        name: item.name,
      })),
    },
  };
}

export function aboutPageLd(opts: {
  url: string;
  name: string;
  description: string;
}) {
  const absoluteUrl = opts.url.startsWith("http")
    ? opts.url
    : `${SITE_URL}${opts.url}`;
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${absoluteUrl}#about`,
    url: absoluteUrl,
    name: opts.name,
    description: opts.description,
    inLanguage: "fr-FR",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    mainEntity: { "@id": `${SITE_URL}/#organization` },
  };
}
