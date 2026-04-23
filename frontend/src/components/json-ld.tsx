const SITE_URL = "https://cvmodifier.com";

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "CV Modifier",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  email: "hello@cvmodifier.com",
  areaServed: ["FR", "BE", "CH", "LU", "CA"],
  inLanguage: "fr-FR",
};

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "CV Modifier",
  description:
    "Adaptez votre CV et votre lettre de motivation à chaque offre d'emploi en 30 secondes.",
  inLanguage: "fr-FR",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

const softwareApplication = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  name: "CV Modifier",
  url: SITE_URL,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Application SaaS qui adapte CV et lettres de motivation à chaque offre d'emploi grâce à l'IA Claude. Extraction automatique, 4 templates PDF, optimisation ATS.",
  inLanguage: "fr-FR",
  publisher: { "@id": `${SITE_URL}/#organization` },
  offers: [
    {
      "@type": "Offer",
      name: "Gratuit",
      price: "0",
      priceCurrency: "EUR",
      description: "3 générations offertes",
    },
    {
      "@type": "Offer",
      name: "Starter",
      price: "9.99",
      priceCurrency: "EUR",
      description: "20 générations par mois",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: "19.99",
      priceCurrency: "EUR",
      description: "50 générations par mois",
    },
    {
      "@type": "Offer",
      name: "Pack 10 crédits",
      price: "4.99",
      priceCurrency: "EUR",
    },
    {
      "@type": "Offer",
      name: "Pack 30 crédits",
      price: "12.99",
      priceCurrency: "EUR",
    },
  ],
};

export function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplication) }}
      />
    </>
  );
}
