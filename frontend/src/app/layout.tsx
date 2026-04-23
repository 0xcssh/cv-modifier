import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsent } from "@/components/cookie-consent";
import { JsonLd } from "@/components/json-ld";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cvmodifier.com"),
  title: {
    default:
      "CV Modifier — Adapter son CV à une offre d'emploi avec l'IA | Gratuit",
    template: "%s | CV Modifier",
  },
  description:
    "Adaptez votre CV et lettre de motivation à chaque offre en 30s grâce à l'IA. ATS-compatible. 3 générations offertes sans carte bancaire.",
  applicationName: "CV Modifier",
  keywords: [
    "CV",
    "adapter CV",
    "cv offre emploi",
    "lettre de motivation IA",
    "cv ATS",
    "candidature",
    "générateur CV IA",
    "modèle CV",
  ],
  authors: [{ name: "CV Modifier" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://cvmodifier.com",
    siteName: "CV Modifier",
    title: "CV Modifier — Adaptez votre CV à chaque offre en 30 secondes",
    description:
      "CV + lettre de motivation parfaitement adaptés à chaque offre grâce à l'IA générative. Optimisé ATS. 3 générations offertes sans carte bancaire.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "CV Modifier — Adaptez votre CV en 30 secondes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CV Modifier — Adaptez votre CV en 30 secondes",
    description:
      "CV + lettre de motivation adaptés par l'IA à chaque offre d'emploi.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-FR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <JsonLd />
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
        <CookieConsent />
      </body>
    </html>
  );
}
