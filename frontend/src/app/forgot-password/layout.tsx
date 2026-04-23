import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  robots: { index: false, follow: true },
  alternates: { canonical: "/forgot-password" },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
