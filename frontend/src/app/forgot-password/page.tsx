"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setSent(true);
    } catch {
      // Always show success to avoid email enumeration
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="text-2xl font-bold text-slate-900 mb-8 block text-center">
          CV <span className="text-blue-600">Modifier</span>
        </Link>

        {sent ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Email envoyé</h1>
            <p className="text-slate-500 mb-6">
              Si un compte existe avec cette adresse, vous recevrez un email pour réinitialiser votre mot de passe.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full">Retour à la connexion</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Mot de passe oublié ?</h1>
            <p className="text-slate-500 mb-6">
              Entrez votre email, nous vous enverrons un lien pour le réinitialiser.
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
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? "Envoi..." : "Envoyer le lien"}
              </Button>
            </form>

            <p className="text-sm text-slate-500 text-center mt-6">
              <Link href="/login" className="text-blue-600 hover:underline">
                Retour à la connexion
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
