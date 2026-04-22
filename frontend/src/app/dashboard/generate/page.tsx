"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api, CSRF_HEADER } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { Zap, Download, FileText, Loader2, AlertCircle, CheckCircle2, Crown, Pencil } from "lucide-react";

type Step = "input" | "generating" | "done" | "error" | "no-credits";

export default function GeneratePage() {
  const { credits, refreshUser } = useAuth();
  const [step, setStep] = useState<Step>("input");
  const [url, setUrl] = useState("");
  const [jobText, setJobText] = useState("");
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [result, setResult] = useState<{ job_title?: string; company_name?: string } | null>(null);
  const [error, setError] = useState("");
  const [scraping, setScraping] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handleScrapeAndGenerate = async () => {
    if (!url.trim() && !jobText.trim()) {
      toast.error("Collez un lien ou le texte de l'offre");
      return;
    }

    if (credits <= 0) {
      setStep("no-credits");
      return;
    }

    let text = jobText;

    // If URL provided, scrape first
    if (url.trim() && !jobText.trim()) {
      setScraping(true);
      try {
        const res = await api.scrapeJob(url);
        if (res.success) {
          text = res.text;
        } else {
          toast.error(res.error || "Impossible d'extraire l'offre. Collez le texte manuellement.");
          setScraping(false);
          return;
        }
      } catch {
        toast.error("Erreur lors de l'extraction. Collez le texte manuellement.");
        setScraping(false);
        return;
      }
      setScraping(false);
    }

    // Generate
    setStep("generating");
    setError("");
    try {
      const gen = await api.createGeneration({
        job_url: url || undefined,
        job_text: text || undefined,
      });
      setGenerationId(gen.id);

      pollRef.current = setInterval(async () => {
        try {
          const status = await api.getGeneration(gen.id);
          if (status.status === "completed") {
            if (pollRef.current) clearInterval(pollRef.current);
            setResult({ job_title: status.job_title, company_name: status.company_name });
            setStep("done");
            refreshUser();
          } else if (status.status === "failed") {
            if (pollRef.current) clearInterval(pollRef.current);
            setError(status.error_message || "La génération a échoué");
            setStep("error");
          }
        } catch {
          // Keep polling
        }
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur");
      setStep("error");
    }
  };

  const handleDownload = async (type: "cv" | "letter") => {
    if (!generationId) return;
    try {
      // Cookie auth + CSRF header. We re-implement instead of using
      // api.downloadFile() because we need the Content-Disposition header
      // to recover the server-provided filename.
      const res = await fetch(api.getDownloadUrl(generationId, type), {
        credentials: "include",
        headers: CSRF_HEADER,
      });
      if (!res.ok) throw new Error("Téléchargement échoué");
      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition");
      const match = disposition?.match(/filename="(.+)"/);
      const filename = match?.[1] || (type === "cv" ? "cv.pdf" : "lm.pdf");
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error("Erreur lors du téléchargement");
    }
  };

  const reset = () => {
    setStep("input");
    setUrl("");
    setJobText("");
    setGenerationId(null);
    setResult(null);
    setError("");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Générer un CV</h1>
      <p className="text-slate-500 mb-8">
        Collez le lien d&apos;une offre d&apos;emploi pour obtenir un CV et une lettre adaptés.
      </p>

      {/* Step: Input */}
      {step === "input" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Lien de l&apos;offre d&apos;emploi
          </label>
          <Input
            placeholder="https://www.indeed.fr/offre/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-12 text-base mb-2"
          />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400">ou collez le texte directement</span>
            </div>
          </div>

          <Textarea
            placeholder="Copiez-collez le texte de l'offre d'emploi ici..."
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            rows={6}
            className="text-base"
          />

          <Button
            onClick={handleScrapeAndGenerate}
            disabled={scraping || (!url.trim() && !jobText.trim())}
            className="mt-6 h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
          >
            {scraping ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Extraction en cours...</>
            ) : (
              <><Zap className="w-4 h-4 mr-2" /> Générer mon CV</>
            )}
          </Button>
        </div>
      )}

      {/* Step: Generating */}
      {step === "generating" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 shadow-sm text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Génération en cours...</h3>
          <p className="text-slate-500 mb-4">
            L&apos;IA analyse l&apos;offre et adapte votre CV. Cela prend environ 15 secondes.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Offre analysée
            </span>
            <span className="flex items-center gap-1.5">
              <Loader2 className="w-4 h-4 animate-spin" /> Adaptation du CV
            </span>
            <span className="text-slate-300">Génération PDF</span>
          </div>
        </div>
      )}

      {/* Step: Done */}
      {step === "done" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Documents générés !</h3>
            {result && (
              <p className="text-slate-500">
                {result.job_title}
                {result.company_name && ` chez ${result.company_name}`}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
            <button
              onClick={() => handleDownload("cv")}
              className="flex items-center gap-4 p-5 bg-blue-50 rounded-xl border border-blue-100 hover:border-blue-300 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">CV adapté</div>
                <div className="text-sm text-slate-500">Télécharger le PDF</div>
              </div>
              <Download className="w-5 h-5 text-blue-600 ml-auto" />
            </button>

            <button
              onClick={() => handleDownload("letter")}
              className="flex items-center gap-4 p-5 bg-emerald-50 rounded-xl border border-emerald-100 hover:border-emerald-300 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">Lettre de motivation</div>
                <div className="text-sm text-slate-500">Télécharger le PDF</div>
              </div>
              <Download className="w-5 h-5 text-emerald-600 ml-auto" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            {generationId && (
              <Link href={`/dashboard/generate/${generationId}/edit`}>
                <Button variant="outline" className="border-slate-300">
                  <Pencil className="w-4 h-4 mr-2" />
                  Éditer le CV
                </Button>
              </Link>
            )}
            <Button onClick={reset} variant="outline">
              Générer un autre CV
            </Button>
          </div>
        </div>
      )}

      {/* Step: No Credits */}
      {step === "no-credits" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Plus de crédits</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            Vous avez utilisé tous vos crédits. Rechargez pour continuer à générer des CV adaptés.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/dashboard/upgrade">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                <Crown className="w-4 h-4 mr-2" />
                Voir les offres
              </Button>
            </Link>
            <Button variant="outline" onClick={reset}>
              Retour
            </Button>
          </div>
        </div>
      )}

      {/* Step: Error */}
      {step === "error" && (
        <div className="bg-white rounded-2xl border border-red-200 p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Erreur</h3>
          <p className="text-slate-500 mb-6">{error}</p>
          <Button onClick={reset} variant="outline">
            Réessayer
          </Button>
        </div>
      )}
    </div>
  );
}
