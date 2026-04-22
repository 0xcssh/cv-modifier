import type { CvTemplateId } from "@/lib/api";

export interface CvTemplate {
  id: CvTemplateId;
  name: string;
  description: string;
}

export const CV_TEMPLATES: readonly CvTemplate[] = [
  {
    id: "classic",
    name: "Classique",
    description: "Sidebar sombre, photo à gauche. Sobre et corporate.",
  },
  {
    id: "modern",
    name: "Moderne",
    description: "Pleine largeur, header coloré. Style LinkedIn.",
  },
  {
    id: "minimalist",
    name: "Minimaliste",
    description: "Noir & blanc, typographique et aéré.",
  },
  {
    id: "creative",
    name: "Créatif",
    description: "Sidebar colorée, timeline verticale.",
  },
] as const;

export const DEFAULT_CV_TEMPLATE: CvTemplateId = "classic";
