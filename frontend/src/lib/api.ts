const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
    }
    return this.token;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      this.setToken(null);
      throw new Error("Non authentifié");
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.detail || `Erreur ${res.status}`);
    }

    if (res.status === 204) return null as T;
    return res.json();
  }

  // Auth
  async register(email: string, password: string) {
    return this.request<{ id: string; email: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async login(email: string, password: string) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.detail || "Email ou mot de passe incorrect");
    }
    const data = await res.json();
    this.setToken(data.access_token);
    return data;
  }

  logout() {
    this.setToken(null);
  }

  async forgotPassword(email: string) {
    return this.request<null>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string) {
    return this.request<null>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  }

  // Profile
  async getProfile() {
    return this.request<ProfileData>("/api/profile");
  }

  async createProfile(data: ProfileCreateData) {
    return this.request<ProfileData>("/api/profile", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProfile(data: Partial<ProfileCreateData>) {
    return this.request<ProfileData>("/api/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return this.request<{ photo_path: string }>("/api/profile/photo", {
      method: "POST",
      body: formData,
    });
  }

  async extractCV(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return this.request<ExtractedProfile>("/api/profile/extract", {
      method: "POST",
      body: formData,
    });
  }

  async confirmExtraction(data: ProfileCreateData) {
    return this.request<ProfileData>("/api/profile/extract/confirm", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Education
  async addEducation(data: EducationData) {
    return this.request<EducationData & { id: string }>("/api/profile/education", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteEducation(id: string) {
    return this.request<null>(`/api/profile/education/${id}`, { method: "DELETE" });
  }

  // Experiences
  async addExperience(data: ExperienceData) {
    return this.request<ExperienceData & { id: string }>("/api/profile/experiences", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteExperience(id: string) {
    return this.request<null>(`/api/profile/experiences/${id}`, { method: "DELETE" });
  }

  // Generations
  async createGeneration(data: { job_url?: string; job_text?: string }) {
    return this.request<GenerationData>("/api/generations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getGeneration(id: string) {
    return this.request<GenerationDetail>(`/api/generations/${id}`);
  }

  async listGenerations(limit = 20) {
    return this.request<GenerationData[]>(`/api/generations?limit=${limit}`);
  }

  async updateGeneration(id: string, payload: { adapted_data: AdaptedData }) {
    return this.request<GenerationDetail>(`/api/generations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  async deleteGeneration(id: string) {
    return this.request<null>(`/api/generations/${id}`, { method: "DELETE" });
  }

  getDownloadUrl(generationId: string, type: "cv" | "letter") {
    return `${API_URL}/api/generations/${generationId}/${type}`;
  }

  async downloadFile(generationId: string, type: "cv" | "letter") {
    const token = this.getToken();
    const res = await fetch(this.getDownloadUrl(generationId, type), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Téléchargement échoué");
    return res.blob();
  }

  // Scraping
  async scrapeJob(url: string) {
    return this.request<ScrapeResult>("/api/generations/scrape", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
  }

  // User info
  async getMe() {
    return this.request<UserData>("/api/auth/me");
  }
}

// Types
export interface UserData {
  id: string;
  email: string;
  credits: number;
  subscription_tier: string;
}

export interface EducationData {
  id?: string;
  title: string;
  school: string;
  location?: string;
  dates?: string;
  sort_order?: number;
}

export interface ExperienceData {
  id?: string;
  title: string;
  company: string;
  location?: string;
  dates?: string;
  bullets: string[];
  is_locked?: boolean;
  custom_note?: string;
  sort_order?: number;
}

export type CvTemplateId = "classic" | "modern" | "minimalist" | "creative";

export interface ProfileData {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city: string;
  age?: string;
  permis?: string;
  vehicule?: string;
  gender: string;
  photo_path?: string;
  photo_url?: string | null;
  skills: string[];
  languages: string[];
  soft_skills: string[];
  custom_instructions?: string;
  cv_template?: CvTemplateId;
  education: EducationData[];
  experiences: ExperienceData[];
}

export interface ProfileCreateData {
  full_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  age?: string;
  permis?: string;
  vehicule?: string;
  gender?: string;
  skills?: string[];
  languages?: string[];
  soft_skills?: string[];
  custom_instructions?: string;
  cv_template?: CvTemplateId;
  education?: EducationData[];
  experiences?: ExperienceData[];
}

export type ExtractedProfile = ProfileCreateData;

export interface GenerationData {
  id: string;
  job_url?: string;
  job_title?: string;
  company_name?: string;
  status: string;
  tokens_used?: number;
  cost_estimate?: number;
  created_at?: string;
}

export interface AdaptedExperience {
  title: string;
  company: string;
  location?: string;
  dates?: string;
  bullets: string[];
}

export interface AdaptedData {
  nom_entreprise: string;
  titre_poste: string;
  resume_professionnel: string;
  competences: string[];
  atouts: string[];
  experiences: AdaptedExperience[];
  lettre_motivation: string;
}

export interface GenerationDetail extends GenerationData {
  job_text?: string;
  adapted_data?: AdaptedData;
  cv_pdf_path?: string;
  cover_letter_pdf_path?: string;
  error_message?: string;
}

export interface ScrapeResult {
  text: string;
  char_count: number;
  method: string;
  success: boolean;
  error?: string;
}

export const api = new ApiClient();
