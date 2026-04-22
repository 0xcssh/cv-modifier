"use client";

import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Loader2,
  Lock,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api, AdaptedData, AdaptedExperience } from "@/lib/api";

const MAX_EXPERIENCES = 6;
const MAX_BULLETS = 4;

const emptyAdapted: AdaptedData = {
  nom_entreprise: "",
  titre_poste: "",
  resume_professionnel: "",
  competences: [],
  atouts: [],
  experiences: [],
  lettre_motivation: "",
};

type PreviewTab = "cv" | "letter";

export default function EditGenerationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<AdaptedData>(emptyAdapted);
  const [initialJson, setInitialJson] = useState<string>("");
  const [previewTab, setPreviewTab] = useState<PreviewTab>("cv");
  const [cvUrl, setCvUrl] = useState<string>("");
  const [letterUrl, setLetterUrl] = useState<string>("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [openExp, setOpenExp] = useState<number | null>(0);
  const [skillInput, setSkillInput] = useState("");
  const [atoutInput, setAtoutInput] = useState("");

  const cvUrlRef = useRef<string>("");
  const letterUrlRef = useRef<string>("");

  // Keep refs in sync for cleanup
  useEffect(() => {
    cvUrlRef.current = cvUrl;
  }, [cvUrl]);
  useEffect(() => {
    letterUrlRef.current = letterUrl;
  }, [letterUrl]);

  const isDirty = useMemo(
    () => initialJson !== "" && JSON.stringify(data) !== initialJson,
    [data, initialJson]
  );

  const loadPreview = useCallback(async () => {
    setPreviewLoading(true);
    try {
      const [cvBlob, letterBlob] = await Promise.all([
        api.downloadFile(id, "cv"),
        api.downloadFile(id, "letter"),
      ]);
      const nextCvUrl = URL.createObjectURL(cvBlob);
      const nextLetterUrl = URL.createObjectURL(letterBlob);
      if (cvUrlRef.current) URL.revokeObjectURL(cvUrlRef.current);
      if (letterUrlRef.current) URL.revokeObjectURL(letterUrlRef.current);
      setCvUrl(nextCvUrl);
      setLetterUrl(nextLetterUrl);
    } catch {
      toast.error("Impossible de charger l'aperçu PDF");
    } finally {
      setPreviewLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setPreviewLoading(true);
      const [genResult, cvResult, letterResult] = await Promise.allSettled([
        api.getGeneration(id),
        api.downloadFile(id, "cv"),
        api.downloadFile(id, "letter"),
      ]);
      if (cancelled) return;

      if (genResult.status !== "fulfilled") {
        const msg =
          genResult.reason instanceof Error
            ? genResult.reason.message
            : "Erreur de chargement";
        toast.error(msg);
        router.replace("/dashboard/generate");
        return;
      }

      const gen = genResult.value;
      if (gen.status !== "completed" || !gen.adapted_data) {
        toast.error("Cette génération n'est pas encore prête à être éditée");
        router.replace("/dashboard/generate");
        return;
      }

      const normalized: AdaptedData = {
        nom_entreprise: gen.adapted_data.nom_entreprise ?? "",
        titre_poste: gen.adapted_data.titre_poste ?? "",
        resume_professionnel: gen.adapted_data.resume_professionnel ?? "",
        competences: Array.isArray(gen.adapted_data.competences)
          ? gen.adapted_data.competences
          : [],
        atouts: Array.isArray(gen.adapted_data.atouts)
          ? gen.adapted_data.atouts
          : [],
        experiences: Array.isArray(gen.adapted_data.experiences)
          ? gen.adapted_data.experiences.map((exp) => ({
              title: exp.title ?? "",
              company: exp.company ?? "",
              location: exp.location ?? "",
              dates: exp.dates ?? "",
              bullets: Array.isArray(exp.bullets) ? exp.bullets : [],
            }))
          : [],
        lettre_motivation: gen.adapted_data.lettre_motivation ?? "",
      };
      setData(normalized);
      setInitialJson(JSON.stringify(normalized));

      if (cvResult.status === "fulfilled") {
        const nextCvUrl = URL.createObjectURL(cvResult.value);
        if (cvUrlRef.current) URL.revokeObjectURL(cvUrlRef.current);
        setCvUrl(nextCvUrl);
      }
      if (letterResult.status === "fulfilled") {
        const nextLetterUrl = URL.createObjectURL(letterResult.value);
        if (letterUrlRef.current) URL.revokeObjectURL(letterUrlRef.current);
        setLetterUrl(nextLetterUrl);
      }
      if (cvResult.status === "rejected" && letterResult.status === "rejected") {
        toast.error("Impossible de charger l'aperçu PDF");
      }

      setPreviewLoading(false);
      setLoading(false);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (cvUrlRef.current) URL.revokeObjectURL(cvUrlRef.current);
      if (letterUrlRef.current) URL.revokeObjectURL(letterUrlRef.current);
    };
  }, []);

  // Unsaved-changes guard
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const updateField = <K extends keyof AdaptedData>(key: K, value: AdaptedData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // Chips
  const addChip = (key: "competences" | "atouts", value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setData((prev) =>
      prev[key].includes(trimmed) ? prev : { ...prev, [key]: [...prev[key], trimmed] }
    );
  };

  const removeChip = (key: "competences" | "atouts", index: number) => {
    setData((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  // Experiences
  const updateExperience = (
    index: number,
    patch: Partial<AdaptedExperience>
  ) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) =>
        i === index ? { ...exp, ...patch } : exp
      ),
    }));
  };

  const updateBullet = (expIndex: number, bulletIndex: number, value: string) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) =>
        i === expIndex
          ? {
              ...exp,
              bullets: exp.bullets.map((b, bi) => (bi === bulletIndex ? value : b)),
            }
          : exp
      ),
    }));
  };

  const addBullet = (expIndex: number) => {
    setData((prev) => {
      const exp = prev.experiences[expIndex];
      if (!exp) return prev;
      if (exp.bullets.length >= MAX_BULLETS) {
        toast.warning(`Plus de ${MAX_BULLETS} bullets recommandées`);
      }
      return {
        ...prev,
        experiences: prev.experiences.map((e, i) =>
          i === expIndex ? { ...e, bullets: [...e.bullets, ""] } : e
        ),
      };
    });
  };

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) =>
        i === expIndex
          ? { ...exp, bullets: exp.bullets.filter((_, bi) => bi !== bulletIndex) }
          : exp
      ),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await api.updateGeneration(id, { adapted_data: data });
      if (updated.adapted_data) {
        setInitialJson(JSON.stringify(updated.adapted_data));
      } else {
        setInitialJson(JSON.stringify(data));
      }
      toast.success("Modifications enregistrées. PDF regénéré.");
      await loadPreview();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de l'enregistrement";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  const activePreviewUrl = previewTab === "cv" ? cvUrl : letterUrl;

  return (
    <div className="-mx-4 lg:-mx-8 -my-6 lg:-my-8">
      {/* Top bar */}
      <div className="sticky top-0 lg:top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200 px-4 lg:px-8 py-3 flex items-center gap-3">
        <Link
          href="/dashboard/generate"
          className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-base lg:text-lg font-semibold text-slate-900 truncate">
            Édition
            {data.titre_poste ? ` — ${data.titre_poste}` : ""}
            {data.nom_entreprise ? ` chez ${data.nom_entreprise}` : ""}
          </h1>
        </div>
        {isDirty && (
          <span className="hidden sm:inline text-xs text-amber-600">
            Modifications non enregistrées
          </span>
        )}
        <Button
          onClick={handleSave}
          disabled={saving || !isDirty}
          className="relative bg-blue-600 hover:bg-blue-700 text-white h-9 px-3 sm:px-4"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 sm:mr-1.5 animate-spin" />
              <span className="hidden sm:inline">Enregistrement...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Enregistrer et regénérer</span>
              <span className="sm:hidden">Enregistrer</span>
            </>
          )}
          {isDirty && !saving && (
            <span className="sm:hidden absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white" />
          )}
        </Button>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6 px-4 lg:px-8 py-6">
        {/* LEFT: Form */}
        <div className="space-y-6">
          {/* Poste & entreprise */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Poste & entreprise</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Titre du poste
                </label>
                <Input
                  className="h-10"
                  value={data.titre_poste}
                  onChange={(e) => updateField("titre_poste", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Entreprise
                </label>
                <Input
                  className="h-10"
                  value={data.nom_entreprise}
                  onChange={(e) => updateField("nom_entreprise", e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Résumé */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Résumé professionnel</h2>
            <Textarea
              value={data.resume_professionnel}
              onChange={(e) => updateField("resume_professionnel", e.target.value)}
              rows={5}
              className="text-sm"
            />
          </section>

          {/* Compétences */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Compétences</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {data.competences.length === 0 && (
                <span className="text-xs text-slate-400 italic">Aucune compétence</span>
              )}
              {data.competences.map((s, i) => (
                <span
                  key={`${s}-${i}`}
                  className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-3 py-1 text-xs"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => removeChip("competences", i)}
                    className="text-blue-500 hover:text-blue-800 cursor-pointer"
                    aria-label={`Retirer ${s}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                className="h-9 flex-1"
                placeholder="Ajouter une compétence (Entrée)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addChip("competences", skillInput);
                    setSkillInput("");
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  addChip("competences", skillInput);
                  setSkillInput("");
                }}
                className="h-9"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </section>

          {/* Atouts */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Atouts</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {data.atouts.length === 0 && (
                <span className="text-xs text-slate-400 italic">Aucun atout</span>
              )}
              {data.atouts.map((s, i) => (
                <span
                  key={`${s}-${i}`}
                  className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-3 py-1 text-xs"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => removeChip("atouts", i)}
                    className="text-emerald-600 hover:text-emerald-900 cursor-pointer"
                    aria-label={`Retirer ${s}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                className="h-9 flex-1"
                placeholder="Ajouter un atout (Entrée)"
                value={atoutInput}
                onChange={(e) => setAtoutInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addChip("atouts", atoutInput);
                    setAtoutInput("");
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  addChip("atouts", atoutInput);
                  setAtoutInput("");
                }}
                className="h-9"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </section>

          {/* Expériences */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-900">Expériences</h2>
              <span
                className={`text-xs ${
                  data.experiences.length > MAX_EXPERIENCES ? "text-amber-600" : "text-slate-400"
                }`}
              >
                {data.experiences.length}/{MAX_EXPERIENCES} max recommandé
              </span>
            </div>
            <div className="space-y-2">
              {data.experiences.length === 0 && (
                <p className="text-xs text-slate-400 italic">Aucune expérience</p>
              )}
              {data.experiences.map((exp, i) => {
                const isOpen = openExp === i;
                return (
                  <div
                    key={i}
                    className="border border-slate-200 rounded-xl overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenExp(isOpen ? null : i)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 cursor-pointer"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-slate-900 truncate">
                          {exp.title || "Sans titre"}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {exp.company}
                          {exp.dates ? ` · ${exp.dates}` : ""}
                        </div>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/40">
                        {/* Title - readonly */}
                        <div>
                          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-1.5">
                            <Lock className="w-3 h-3" />
                            Intitulé (figé)
                            <span
                              className="text-slate-400 cursor-help"
                              title="Le titre est figé par l'IA pour rester fidèle à votre parcours"
                            >
                              ?
                            </span>
                          </label>
                          <Input
                            className="h-9 bg-slate-100 text-slate-500"
                            value={exp.title}
                            readOnly
                            disabled
                          />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
                              Entreprise
                            </label>
                            <Input
                              className="h-9"
                              value={exp.company}
                              onChange={(e) =>
                                updateExperience(i, { company: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
                              Lieu
                            </label>
                            <Input
                              className="h-9"
                              value={exp.location ?? ""}
                              onChange={(e) =>
                                updateExperience(i, { location: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1.5">
                            Dates
                          </label>
                          <Input
                            className="h-9"
                            value={exp.dates ?? ""}
                            onChange={(e) =>
                              updateExperience(i, { dates: e.target.value })
                            }
                            placeholder="2020 — 2023"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-medium text-slate-600">
                              Bullets
                            </label>
                            <span
                              className={`text-xs ${
                                exp.bullets.length > MAX_BULLETS
                                  ? "text-amber-600"
                                  : "text-slate-400"
                              }`}
                            >
                              {exp.bullets.length}/{MAX_BULLETS} max
                            </span>
                          </div>
                          <div className="space-y-2">
                            {exp.bullets.map((b, bi) => (
                              <div key={bi} className="flex gap-2 items-start">
                                <Textarea
                                  value={b}
                                  onChange={(e) => updateBullet(i, bi, e.target.value)}
                                  rows={2}
                                  className="text-sm flex-1 min-h-[2.5rem]"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => removeBullet(i, bi)}
                                  className="text-slate-400 hover:text-red-600 flex-shrink-0"
                                  aria-label="Supprimer la bullet"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addBullet(i)}
                            className="mt-2 h-8"
                          >
                            <Plus className="w-3.5 h-3.5 mr-1" />
                            Ajouter une bullet
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Lettre */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              Lettre de motivation
            </h2>
            <Textarea
              value={data.lettre_motivation}
              onChange={(e) => updateField("lettre_motivation", e.target.value)}
              rows={15}
              className="text-sm leading-relaxed"
            />
          </section>
        </div>

        {/* RIGHT: Preview */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center border-b border-slate-200">
              <button
                type="button"
                onClick={() => setPreviewTab("cv")}
                className={`flex-1 px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
                  previewTab === "cv"
                    ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                CV
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab("letter")}
                className={`flex-1 px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
                  previewTab === "letter"
                    ? "bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                Lettre
              </button>
            </div>
            <div className="relative bg-slate-100" style={{ height: "calc(100vh - 8rem)" }}>
              {previewLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
              )}
              {activePreviewUrl ? (
                <iframe
                  key={activePreviewUrl}
                  src={`${activePreviewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                  title={previewTab === "cv" ? "Aperçu CV" : "Aperçu lettre"}
                  className="w-full h-full bg-white"
                />
              ) : (
                !previewLoading && (
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
                    Aperçu indisponible
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
