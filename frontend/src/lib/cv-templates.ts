import type { CvTemplateId } from "@/lib/api";

export interface CvTemplate {
  id: CvTemplateId;
  name: string;
  description: string;
  gradient: string;
}

export const CV_TEMPLATES: readonly CvTemplate[] = [
  {
    id: "classic",
    name: "Classique",
    description: "Sidebar sombre, photo à gauche. Sobre et corporate.",
    gradient: "from-slate-800 to-slate-600",
  },
  {
    id: "modern",
    name: "Moderne",
    description: "Pleine largeur, header coloré. Style LinkedIn.",
    gradient: "from-blue-600 to-blue-400",
  },
  {
    id: "minimalist",
    name: "Minimaliste",
    description: "Noir & blanc, typographique et aéré.",
    gradient: "from-slate-200 to-slate-100",
  },
  {
    id: "creative",
    name: "Créatif",
    description: "Sidebar colorée, timeline verticale.",
    gradient: "from-emerald-600 to-emerald-400",
  },
] as const;

export const DEFAULT_CV_TEMPLATE: CvTemplateId = "classic";
