"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/dashboard/generate");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard/generate");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Link href="/" className="text-2xl font-bold text-slate-900 mb-2 block">
            CV <span className="text-blue-600">Modifier</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mt-8 mb-2">Connexion</h1>
          <p className="text-slate-500 mb-8">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-blue-600 hover:underline font-medium">
              Créer un compte
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
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1.5 h-12"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-base"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </div>
      </div>

      {/* Right - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 items-center justify-center p-12">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold text-white mb-4">
            Adaptez votre CV en quelques clics
          </h2>
          <p className="text-slate-300 text-lg">
            L&apos;IA analyse l&apos;offre d&apos;emploi et réécrit votre CV avec les bons mots-clés
            pour maximiser vos chances.
          </p>
        </div>
      </div>
    </div>
  );
}
