"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api, ProfileData, ProfileCreateData } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { Upload, Save, Plus, X, Loader2, FileText, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [form, setForm] = useState<ProfileCreateData>({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "Toulouse",
    age: "",
    permis: "",
    vehicule: "",
    gender: "male",
    skills: [],
    languages: [],
    soft_skills: [],
    custom_instructions: "",
    education: [],
    experiences: [],
  });
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newLang, setNewLang] = useState("");
  const [newSoft, setNewSoft] = useState("");

  // Load photo on mount
  useEffect(() => {
    if (profile?.photo_path) {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const token = api.getToken();
      fetch(`${API_URL}/api/profile/photo`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then((res) => (res.ok ? res.blob() : null))
        .then((blob) => {
          if (blob) setPhotoUrl(URL.createObjectURL(blob));
        })
        .catch(() => {});
    }
  }, [profile?.photo_path]);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name,
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "Toulouse",
        age: profile.age || "",
        permis: profile.permis || "",
        vehicule: profile.vehicule || "",
        gender: profile.gender || "male",
        skills: profile.skills || [],
        languages: profile.languages || [],
        soft_skills: profile.soft_skills || [],
        custom_instructions: profile.custom_instructions || "",
        education: profile.education || [],
        experiences: profile.experiences || [],
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!form.full_name.trim()) {
      toast.error("Le nom est obligatoire");
      return;
    }
    setLoading(true);
    try {
      await api.confirmExtraction(form);
      await refreshProfile();
      toast.success("Profil sauvegardé");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image (JPG, PNG)");
      return;
    }
    setUploadingPhoto(true);
    try {
      // Show local preview immediately
      const localUrl = URL.createObjectURL(file);
      setPhotoUrl(localUrl);
      await api.uploadPhoto(file);
      await refreshProfile();
      toast.success("Photo mise à jour");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'upload");
      setPhotoUrl(null);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleExtractCV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExtracting(true);
    try {
      const extracted = await api.extractCV(file);
      setForm((prev) => ({
        ...prev,
        ...extracted,
        education: extracted.education || prev.education,
        experiences: extracted.experiences || prev.experiences,
      }));
      toast.success("CV extrait ! Vérifiez les informations puis sauvegardez.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'extraction");
    } finally {
      setExtracting(false);
    }
  };

  // Education CRUD (local state)
  const addEducation = () => {
    setForm((prev) => ({
      ...prev,
      education: [
        ...(prev.education || []),
        { title: "", school: "", location: "", dates: "" },
      ],
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      education: (prev.education || []).map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (index: number) => {
    setForm((prev) => ({
      ...prev,
      education: (prev.education || []).filter((_, i) => i !== index),
    }));
  };

  // Experience CRUD (local state)
  const addExperience = () => {
    setForm((prev) => ({
      ...prev,
      experiences: [
        ...(prev.experiences || []),
        { title: "", company: "", location: "", dates: "", bullets: [] },
      ],
    }));
  };

  const updateExperience = (index: number, field: string, value: string | string[]) => {
    setForm((prev) => ({
      ...prev,
      experiences: (prev.experiences || []).map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (index: number) => {
    setForm((prev) => ({
      ...prev,
      experiences: (prev.experiences || []).filter((_, i) => i !== index),
    }));
  };

  const addTag = (field: "skills" | "languages" | "soft_skills", value: string, setter: (v: string) => void) => {
    if (!value.trim()) return;
    setForm((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()],
    }));
    setter("");
  };

  const removeTag = (field: "skills" | "languages" | "soft_skills", index: number) => {
    setForm((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Mon profil</h1>
          <p className="text-slate-500">Vos informations utilisées pour générer les CV.</p>
        </div>
        <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Sauvegarder
        </Button>
      </div>

      {/* Upload CV */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">Importer votre CV existant</h3>
            <p className="text-sm text-slate-500">
              Uploadez un PDF et l&apos;IA extraira automatiquement vos informations.
            </p>
          </div>
          <label className="cursor-pointer">
            <input type="file" accept=".pdf" onChange={handleExtractCV} className="hidden" />
            <span className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              {extracting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Extraction...</>
              ) : (
                <><FileText className="w-4 h-4" /> Choisir un PDF</>
              )}
            </span>
          </label>
        </div>
      </div>

      <div className="space-y-8">
        {/* Photo de profil */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Photo de profil</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              {photoUrl ? (
                <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrl}
                    alt="Photo de profil"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-slate-400" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-3">
                Cette photo apparaîtra sur vos CV générés. Format JPG ou PNG, max 5 Mo.
              </p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleUploadPhoto}
                  className="hidden"
                />
                <span className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors border border-slate-200">
                  {uploadingPhoto ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Upload...</>
                  ) : (
                    <><Upload className="w-4 h-4" /> {profile?.photo_path ? "Changer la photo" : "Ajouter une photo"}</>
                  )}
                </span>
              </label>
            </div>
          </div>
        </section>

        {/* Info perso */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Informations personnelles</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Nom complet *</Label>
              <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Téléphone</Label>
              <Input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Ville</Label>
              <Input value={form.city || ""} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Adresse</Label>
              <Input value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Âge</Label>
              <Input value={form.age || ""} onChange={(e) => setForm({ ...form, age: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Permis</Label>
              <Input value={form.permis || ""} onChange={(e) => setForm({ ...form, permis: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Genre (pour l&apos;accord grammatical)</Label>
              <select
                value={form.gender || "male"}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option value="male">Masculin</option>
                <option value="female">Féminin</option>
              </select>
            </div>
          </div>
        </section>

        {/* Compétences */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Compétences</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {(form.skills || []).map((s, i) => (
              <Badge key={i} variant="secondary" className="text-sm py-1 px-3 gap-1">
                {s}
                <button onClick={() => removeTag("skills", i)}><X className="w-3 h-3" /></button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Ajouter une compétence"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("skills", newSkill, setNewSkill))}
            />
            <Button variant="outline" size="sm" onClick={() => addTag("skills", newSkill, setNewSkill)}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* Langues */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Langues</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {(form.languages || []).map((l, i) => (
              <Badge key={i} variant="secondary" className="text-sm py-1 px-3 gap-1">
                {l}
                <button onClick={() => removeTag("languages", i)}><X className="w-3 h-3" /></button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Ajouter une langue"
              value={newLang}
              onChange={(e) => setNewLang(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("languages", newLang, setNewLang))}
            />
            <Button variant="outline" size="sm" onClick={() => addTag("languages", newLang, setNewLang)}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* Soft skills */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Atouts / Soft Skills</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {(form.soft_skills || []).map((s, i) => (
              <Badge key={i} variant="secondary" className="text-sm py-1 px-3 gap-1">
                {s}
                <button onClick={() => removeTag("soft_skills", i)}><X className="w-3 h-3" /></button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Ajouter un atout"
              value={newSoft}
              onChange={(e) => setNewSoft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("soft_skills", newSoft, setNewSoft))}
            />
            <Button variant="outline" size="sm" onClick={() => addTag("soft_skills", newSoft, setNewSoft)}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* Formations */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Formations</h2>
            <Button variant="outline" size="sm" onClick={addEducation}>
              <Plus className="w-4 h-4 mr-1" /> Ajouter
            </Button>
          </div>
          {(form.education || []).length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">
              Aucune formation. Cliquez sur &quot;Ajouter&quot; pour en créer une.
            </p>
          ) : (
            <div className="space-y-4">
              {(form.education || []).map((edu, i) => (
                <div key={i} className="p-4 border border-slate-200 rounded-lg relative group">
                  <button
                    onClick={() => removeEducation(i)}
                    className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors"
                    title="Supprimer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="grid md:grid-cols-2 gap-3 pr-8">
                    <div>
                      <Label className="text-xs">Diplôme</Label>
                      <Input
                        value={edu.title}
                        onChange={(e) => updateEducation(i, "title", e.target.value)}
                        placeholder="Master en Management"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">École</Label>
                      <Input
                        value={edu.school}
                        onChange={(e) => updateEducation(i, "school", e.target.value)}
                        placeholder="ISTEF"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Lieu</Label>
                      <Input
                        value={edu.location || ""}
                        onChange={(e) => updateEducation(i, "location", e.target.value)}
                        placeholder="Toulouse"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Dates</Label>
                      <Input
                        value={edu.dates || ""}
                        onChange={(e) => updateEducation(i, "dates", e.target.value)}
                        placeholder="Sept. 2023 - Sept. 2024"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Expériences */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Expériences professionnelles</h2>
            <Button variant="outline" size="sm" onClick={addExperience}>
              <Plus className="w-4 h-4 mr-1" /> Ajouter
            </Button>
          </div>
          {(form.experiences || []).length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">
              Aucune expérience. Cliquez sur &quot;Ajouter&quot; pour en créer une.
            </p>
          ) : (
            <div className="space-y-4">
              {(form.experiences || []).map((exp, i) => (
                <div key={i} className="p-4 border border-slate-200 rounded-lg relative">
                  <button
                    onClick={() => removeExperience(i)}
                    className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors"
                    title="Supprimer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="grid md:grid-cols-2 gap-3 pr-8 mb-3">
                    <div>
                      <Label className="text-xs">Intitulé du poste</Label>
                      <Input
                        value={exp.title}
                        onChange={(e) => updateExperience(i, "title", e.target.value)}
                        placeholder="Chef de projet"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Entreprise</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(i, "company", e.target.value)}
                        placeholder="Devoteam"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Lieu</Label>
                      <Input
                        value={exp.location || ""}
                        onChange={(e) => updateExperience(i, "location", e.target.value)}
                        placeholder="Toulouse"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Dates</Label>
                      <Input
                        value={exp.dates || ""}
                        onChange={(e) => updateExperience(i, "dates", e.target.value)}
                        placeholder="Sept. 2023 - Sept. 2024"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Missions / Responsabilités (une par ligne)</Label>
                    <Textarea
                      value={(exp.bullets || []).join("\n")}
                      onChange={(e) =>
                        updateExperience(
                          i,
                          "bullets",
                          e.target.value.split("\n").filter((b) => b.trim())
                        )
                      }
                      placeholder={"Pilotage du projet X\nCoordination de l'équipe de 5 personnes\nAnalyse des KPIs"}
                      rows={4}
                      className="mt-1 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Instructions custom */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-2">Instructions spéciales pour l&apos;IA</h2>
          <p className="text-sm text-slate-500 mb-4">
            Donnez des consignes particulières pour la génération de vos CV (ex: &quot;AY CLEAN est une société de nettoyage, pas une entreprise tech&quot;).
          </p>
          <Textarea
            value={form.custom_instructions || ""}
            onChange={(e) => setForm({ ...form, custom_instructions: e.target.value })}
            rows={4}
            placeholder="Instructions optionnelles..."
          />
        </section>
      </div>
    </div>
  );
}
