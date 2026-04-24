"use client";

import Link from "next/link";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

// useSearchParams() opt-outs the route from static prerender unless wrapped
// in <Suspense>. We keep the page statically renderable + hydrate with the
// query param on the client.
function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  // ?ref=ABC123 → active le bonus filleul. On normalise en upper-case côté
  // client pour afficher un code propre ; le backend gère lui-même les
  // espaces et la casse.
  const rawRef = searchParams.get("ref") ?? "";
  const referralCode = rawRef.trim().toUpperCase().slice(0, 10) || undefined;

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/dashboard/generate");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    if (password.length < 8) {
      toast.error("Le mot de passe doit faire au moins 8 caractères");
      return;
    }
    setLoading(true);
    try {
      await register(email, password, referralCode);
      toast.success(
        referralCode
          ? "Compte créé ! 4 générations offertes (3 + 1 bonus parrainage)."
          : "Compte créé ! 3 générations offertes.",
      );
      router.push("/dashboard/generate");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 items-center justify-center p-12">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold text-white mb-4">
            3 générations gratuites
          </h2>
          <p className="text-slate-300 text-lg mb-6">
            Créez votre compte et testez CV Modifier immédiatement.
            Aucune carte bancaire requise.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400">&#10003;</span> CV adapté
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400">&#10003;</span> Lettre de motivation
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400">&#10003;</span> PDF prêt
            </span>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Link href="/" className="text-2xl font-bold text-slate-900 mb-2 block">
            CV <span className="text-blue-600">Modifier</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mt-8 mb-2">Créer un compte</h1>
          <p className="text-slate-500 mb-8">
            Déjà inscrit ?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Se connecter
            </Link>
          </p>

          {referralCode && (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 mb-6">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                <Gift className="w-4 h-4" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-900">
                  +1 crédit bonus activé
                </p>
                <p className="text-slate-600">
                  Tu as été invité via le lien{" "}
                  <span className="font-mono text-xs bg-white border border-emerald-200 rounded px-1.5 py-0.5">
                    {referralCode}
                  </span>{" "}
                  — 4 générations offertes au lieu de 3.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="vous@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1.5 h-12"
              />
            </div>
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Minimum 8 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1.5 h-12"
              />
            </div>
            <div>
              <Label htmlFor="confirm">Confirmer le mot de passe</Label>
              <Input
                id="confirm"
                type="password"
                autoComplete="new-password"
                placeholder="Retapez votre mot de passe"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="mt-1.5 h-12"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-base"
            >
              {loading ? "Création..." : "Créer mon compte gratuitement"}
            </Button>
            <p className="text-xs text-slate-400 text-center">
              En créant un compte, vous acceptez nos conditions d&apos;utilisation.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <RegisterForm />
    </Suspense>
  );
}
