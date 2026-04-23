import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Réinitialiser mot de passe",
  robots: { index: false, follow: true },
  alternates: { canonical: "/reset-password" },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
