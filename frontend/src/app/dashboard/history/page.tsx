"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, GenerationData } from "@/lib/api";
import { toast } from "sonner";
import { Download, FileText, Pencil, Trash2, Clock, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Module-level cache: survives route changes within the same tab/session.
// Invalidated when the user deletes a generation or when the tab is reloaded.
let cachedGenerations: GenerationData[] | null = null;

export default function HistoryPage() {
  const [generations, setGenerations] = useState<GenerationData[]>(
    cachedGenerations ?? []
  );
  const [loading, setLoading] = useState(cachedGenerations === null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await api.listGenerations();
        if (cancelled) return;
        cachedGenerations = data;
        setGenerations(data);
      } catch {
        if (!cancelled) toast.error("Erreur lors du chargement");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    // Always revalidate in background, but don't show loader if we already have cached data
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDownload = async (id: string, type: "cv" | "letter") => {
    try {
      const blob = await api.downloadFile(id, type);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = type === "cv" ? "cv.pdf" : "lettre.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Erreur lors du téléchargement");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteGeneration(id);
      setGenerations((prev) => {
        const next = prev.filter((g) => g.id !== id);
        cachedGenerations = next;
        return next;
      });
      toast.success("Génération supprimée");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Terminé</Badge>;
      case "processing":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">En cours</Badge>;
      case "failed":
        return <Badge className="bg-red-50 text-red-700 border-red-200">Échoué</Badge>;
      default:
        return <Badge className="bg-slate-50 text-slate-700 border-slate-200">En attente</Badge>;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Historique</h1>
      <p className="text-slate-500 mb-8">Retrouvez tous vos CV et lettres générés.</p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      ) : generations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucune génération</h3>
          <p className="text-slate-500">
            Vos CV et lettres générés apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {generations.map((gen) => (
            <div
              key={gen.id}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 truncate">
                    {gen.job_title || "Sans titre"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    {gen.company_name && (
                      <>
                        <Building2 className="w-3.5 h-3.5" />
                        <span className="truncate">{gen.company_name}</span>
                        <span>·</span>
                      </>
                    )}
                    <span className="truncate">
                      {gen.created_at
                        ? new Date(gen.created_at).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : ""}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0">{statusBadge(gen.status)}</div>
              </div>

              <div className="flex items-center gap-1 w-full sm:w-auto justify-end sm:justify-start">
                {gen.status === "completed" && (
                  <>
                    <Link href={`/dashboard/generate/${gen.id}/edit`} title="Éditer">
                      <Button variant="ghost" size="sm">
                        <Pencil className="w-4 h-4 text-slate-600" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(gen.id, "cv")}
                      title="Télécharger le CV"
                    >
                      <Download className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(gen.id, "letter")}
                      title="Télécharger la lettre"
                    >
                      <FileText className="w-4 h-4 text-emerald-600" />
                    </Button>
                  </>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(gen.id)}
                  className="text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
