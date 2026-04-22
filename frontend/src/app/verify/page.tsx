"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type Status = "verifying" | "success" | "error";

function VerifyContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<Status>("verifying");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("Lien de vérification invalide — aucun token fourni.");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        await api.verifyEmail(token);
        if (!cancelled) setStatus("success");
      } catch (err: unknown) {
        if (cancelled) return;
        setStatus("error");
        setError(
          err instanceof Error
            ? err.message
            : "Le lien de vérification est invalide ou expiré."
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm max-w-md w-full text-center">
        {status === "verifying" && (
          <>
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
            <h1 className="text-lg font-semibold text-slate-900 mb-2">
              Vérification en cours...
            </h1>
            <p className="text-slate-500">
              Nous confirmons votre adresse email.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">
              Email confirmé !
            </h1>
            <p className="text-slate-500 mb-6">
              Vous pouvez maintenant générer des CV adaptés.
            </p>
            <Link href="/dashboard/generate">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                Aller au dashboard
              </Button>
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-lg font-semibold text-slate-900 mb-2">
              Vérification impossible
            </h1>
            <p className="text-slate-500 mb-6">{error}</p>
            <Link href="/dashboard/generate">
              <Button variant="outline">Retour au dashboard</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
