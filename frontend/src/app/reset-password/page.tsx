"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { CheckCircle2, AlertCircle } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Lien invalide ou expiré. Redemandez un nouveau lien.");
    }
  }, [token]);

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
      await api.resetPassword(token, password);
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lien invalide ou expiré");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Mot de passe mis à jour</h1>
        <p className="text-slate-500">Redirection vers la connexion...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Lien invalide</h1>
        <p className="text-slate-500 mb-6">{error}</p>
        <Link href="/forgot-password">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Demander un nouveau lien
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Nouveau mot de passe</h1>
      <p className="text-slate-500 mb-6">Choisissez un nouveau mot de passe pour votre compte.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="password">Nouveau mot de passe</Label>
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
          <Label htmlFor="confirm">Confirmer</Label>
          <Input
            id="confirm"
            type="password"
            placeholder="Retapez le mot de passe"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="mt-1.5 h-12"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="text-2xl font-bold text-slate-900 mb-8 block text-center">
          CV <span className="text-blue-600">Modifier</span>
        </Link>
        <Suspense fallback={<div className="text-center text-slate-400">Chargement...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
