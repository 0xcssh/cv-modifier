"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

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
      await register(email, password);
      toast.success("Compte créé ! 3 générations offertes.");
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
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
