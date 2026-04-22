import uuid
from datetime import datetime
from pydantic import BaseModel


class GenerationRequest(BaseModel):
    job_url: str | None = None
    job_text: str | None = None


class ScrapeRequest(BaseModel):
    url: str


class ScrapeResponse(BaseModel):
    text: str
    char_count: int
    method: str  # "requests", "playwright"
    success: bool
    error: str | None = None


class GenerationRead(BaseModel):
    id: uuid.UUID
    job_url: str | None = None
    job_title: str | None = None
    company_name: str | None = None
    status: str
    tokens_used: int | None = None
    cost_estimate: float | None = None
    created_at: datetime | None = None

    model_config = {"from_attributes": True}


class GenerationDetail(GenerationRead):
    job_text: str | None = None
    adapted_data: dict | None = None
    cv_pdf_path: str | None = None
    cover_letter_pdf_path: str | None = None
    error_message: str | None = None

    model_config = {"from_attributes": True}


class ExperienceUpdate(BaseModel):
    title: str
    company: str
    location: str | None = None
    dates: str | None = None
    bullets: list[str] = []


class AdaptedDataUpdate(BaseModel):
    nom_entreprise: str
    titre_poste: str
    resume_professionnel: str
    competences: list[str] = []
    atouts: list[str] = []
    experiences: list[ExperienceUpdate] = []
    lettre_motivation: str


class GenerationUpdate(BaseModel):
    adapted_data: AdaptedDataUpdate
