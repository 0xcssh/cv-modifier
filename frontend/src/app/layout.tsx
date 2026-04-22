import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsent } from "@/components/cookie-consent";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CV Modifier — Adaptez votre CV en 30 secondes",
  description:
    "Collez une offre d'emploi, obtenez un CV et une lettre de motivation parfaitement adaptés. Propulsé par l'IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
        <CookieConsent />
      </body>
    </html>
  );
}
