const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Headers + fetch options required on every authenticated request:
//   - `credentials: "include"` so the httpOnly auth cookie is sent cross-origin
//   - `X-Requested-With: XMLHttpRequest` to satisfy the backend CSRF middleware
// Exported so the handful of callers that still do `fetch(...)` directly
// (e.g. PDF downloads) stay consistent.
export const CSRF_HEADER: Record<string, string> = {
  "X-Requested-With": "XMLHttpRequest",
};
export const AUTH_FETCH_INIT: RequestInit = {
  credentials: "include",
  headers: CSRF_HEADER,
};

class ApiClient {
  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      ...CSRF_HEADER,
      ...(options.headers as Record<string, string>),
    };

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      headers,
    });

    if (res.status === 401) {
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
    // fastapi-users' CookieTransport returns 204 No Content and sets the
    // httpOnly auth cookie; we don't receive or store any token client-side.
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        ...CSRF_HEADER,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.detail || "Email ou mot de passe incorrect");
    }
  }

  async logout() {
    // Backend clears the cookie (Set-Cookie with max-age=0). Swallow errors —
    // a stale session means we are effectively already logged out.
    try {
      await this.request<null>("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
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
    // Cookie auth: `credentials: "include"` lets the browser attach the
    // httpOnly auth cookie; the CSRF header keeps our middleware happy.
    const res = await fetch(this.getDownloadUrl(generationId, type), {
      credentials: "include",
      headers: CSRF_HEADER,
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
