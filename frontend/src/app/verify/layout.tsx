import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vérification email",
  robots: { index: false, follow: true },
  alternates: { canonical: "/verify" },
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
