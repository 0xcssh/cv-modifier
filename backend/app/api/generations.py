import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import current_active_user
from app.database import get_db
import re

from app.models import Generation, Profile, User


def _slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[àáâãäå]", "a", text)
    text = re.sub(r"[èéêë]", "e", text)
    text = re.sub(r"[ìíîï]", "i", text)
    text = re.sub(r"[òóôõö]", "o", text)
    text = re.sub(r"[ùúûü]", "u", text)
    text = re.sub(r"[ç]", "c", text)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")
from app.schemas.generation import (
    GenerationDetail,
    GenerationRead,
    GenerationRequest,
    ScrapeRequest,
    ScrapeResponse,
)
from app.services.pipeline import run_generation_pipeline
from app.services.scraper import scrape_job_offer
from app.services.storage import get_storage

router = APIRouter(prefix="/generations", tags=["generations"])


@router.post("", response_model=GenerationRead, status_code=201)
async def create_generation(
    request: GenerationRequest,
    background_tasks: BackgroundTasks,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Start a new CV generation. Runs in background."""
    if not request.job_url and not request.job_text:
        raise HTTPException(400, "Fournissez une URL ou le texte de l'offre.")

    # Check credits
    if user.credits <= 0:
        raise HTTPException(402, "Crédits insuffisants.")

    # Check profile exists
    result = await db.execute(
        select(Profile).where(Profile.user_id == user.id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(400, "Créez d'abord votre profil avant de générer.")

    # Create generation record
    generation = Generation(
        user_id=user.id,
        job_url=request.job_url,
        job_text=request.job_text,
        status="pending",
    )
    db.add(generation)
    await db.commit()
    await db.refresh(generation)

    # Launch background task
    background_tasks.add_task(
        run_generation_pipeline,
        generation.id,
        user.id,
        request.job_url,
        request.job_text,
    )

    return generation


@router.get("", response_model=list[GenerationRead])
async def list_generations(
    limit: int = 20,
    offset: int = 0,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Generation)
        .where(Generation.user_id == user.id)
        .order_by(Generation.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    return result.scalars().all()


@router.get("/{generation_id}", response_model=GenerationDetail)
async def get_generation(
    generation_id: uuid.UUID,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
):
    gen = await db.get(Generation, generation_id)
    if not gen or gen.user_id != user.id:
        raise HTTPException(404, "Génération non trouvée")
    return gen


@router.get("/{generation_id}/cv")
async def download_cv(
    generation_id: uuid.UUID,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
):
    gen = await db.get(Generation, generation_id)
    if not gen or gen.user_id != user.id:
        raise HTTPException(404, "Génération non trouvée")
    if not gen.cv_pdf_path:
        raise HTTPException(404, "CV non encore généré")

    storage = get_storage()
    data = await storage.get(gen.cv_pdf_path)

    # nom-prenom-entreprise-cv.pdf
    profile_result = await db.execute(
        select(Profile).where(Profile.user_id == user.id)
    )
    profile = profile_result.scalar_one_or_none()
    name = _slugify(profile.full_name) if profile else "candidat"
    company = _slugify(gen.company_name) if gen.company_name else ""
    filename = f"{name}-{company}-cv.pdf" if company else f"{name}-cv.pdf"

    return Response(
        content=data,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/{generation_id}/letter")
async def download_letter(
    generation_id: uuid.UUID,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
):
    gen = await db.get(Generation, generation_id)
    if not gen or gen.user_id != user.id:
        raise HTTPException(404, "Génération non trouvée")
    if not gen.cover_letter_pdf_path:
        raise HTTPException(404, "Lettre non encore générée")

    storage = get_storage()
    data = await storage.get(gen.cover_letter_pdf_path)

    # nom-prenom-entreprise-lm.pdf
    profile_result = await db.execute(
        select(Profile).where(Profile.user_id == user.id)
    )
    profile = profile_result.scalar_one_or_none()
    name = _slugify(profile.full_name) if profile else "candidat"
    company = _slugify(gen.company_name) if gen.company_name else ""
    filename = f"{name}-{company}-lm.pdf" if company else f"{name}-lm.pdf"

    return Response(
        content=data,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.delete("/{generation_id}", status_code=204)
async def delete_generation(
    generation_id: uuid.UUID,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
):
    gen = await db.get(Generation, generation_id)
    if not gen or gen.user_id != user.id:
        raise HTTPException(404, "Génération non trouvée")

    # Clean up files
    storage = get_storage()
    for path in [gen.cv_pdf_path, gen.cover_letter_pdf_path]:
        if path:
            try:
                await storage.delete(path)
            except FileNotFoundError:
                pass

    await db.delete(gen)
    await db.commit()


# --- Scraping preview ---

@router.post("/scrape", response_model=ScrapeResponse, tags=["jobs"])
async def scrape_preview(request: ScrapeRequest):
    """Scrape a job URL and return the text preview (no credit cost)."""
    result = await scrape_job_offer(request.url)
    return ScrapeResponse(
        text=result.text,
        char_count=result.char_count,
        method=result.method,
        success=result.success,
        error=result.error,
    )
