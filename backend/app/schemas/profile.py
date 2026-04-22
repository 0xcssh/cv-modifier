import uuid
from typing import Literal

from pydantic import BaseModel

CvTemplateId = Literal["classic", "modern", "minimalist", "creative"]


# --- Education ---
class EducationBase(BaseModel):
    title: str
    school: str
    location: str | None = None
    dates: str | None = None
    sort_order: int = 0


class EducationCreate(EducationBase):
    pass


class EducationRead(EducationBase):
    id: uuid.UUID

    model_config = {"from_attributes": True}


# --- Experience ---
class ExperienceBase(BaseModel):
    title: str
    company: str
    location: str | None = None
    dates: str | None = None
    bullets: list[str] = []
    is_locked: bool = False
    custom_note: str | None = None
    sort_order: int = 0


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceRead(ExperienceBase):
    id: uuid.UUID

    model_config = {"from_attributes": True}


# --- Profile ---
class ProfileBase(BaseModel):
    full_name: str
    email: str | None = None
    phone: str | None = None
    address: str | None = None
    city: str = "Toulouse"
    age: str | None = None
    permis: str | None = None
    vehicule: str | None = None
    gender: str = "male"
    cv_template: CvTemplateId = "classic"
    skills: list[str] = []
    languages: list[str] = []
    soft_skills: list[str] = []
    custom_instructions: str | None = None


class ProfileCreate(ProfileBase):
    education: list[EducationCreate] = []
    experiences: list[ExperienceCreate] = []


class ProfileUpdate(BaseModel):
    full_name: str | None = None
    email: str | None = None
    phone: str | None = None
    address: str | None = None
    city: str | None = None
    age: str | None = None
    permis: str | None = None
    vehicule: str | None = None
    gender: str | None = None
    cv_template: CvTemplateId | None = None
    skills: list[str] | None = None
    languages: list[str] | None = None
    soft_skills: list[str] | None = None
    custom_instructions: str | None = None


class ProfileRead(ProfileBase):
    id: uuid.UUID
    photo_path: str | None = None
    education: list[EducationRead] = []
    experiences: list[ExperienceRead] = []

    model_config = {"from_attributes": True}


class ReorderRequest(BaseModel):
    ids: list[uuid.UUID]
