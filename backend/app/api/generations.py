import logging
import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from fastapi.responses import Response
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import current_active_user
from app.database import get_db
import re

from app.core.limiter import limiter
from app.models import Generation, Profile, User

logger = logging.getLogger(__name__)


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
    GenerationUpdate,
    ScrapeRequest,
    ScrapeResponse,
)
from app.services.cover_letter import generate_cover_letter_pdf
from app.services.cv_templates import generate_cv_pdf
from app.services.pipeline import run_generation_pipeline
from app.services.scraper import scrape_job_offer
from app.services.storage import get_storage

router = APIRouter(prefix="/generations", tags=["generations"])


@router.post("", response_model=GenerationRead, status_code=201)
@limiter.limit("10/hour")
async def create_generation(
    request: Request,
    payload: GenerationRequest,
    background_tasks: BackgroundTasks,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Start a new CV generation. Runs in background. Requires verified email."""
    if not user.is_verified:
        # Explicit machine-readable code so the frontend can render a dedicated
        # "confirm your email" UI (resend button) instead of a generic error.
        raise HTTPException(403, "EMAIL_NOT_VERIFIED")

    if not payload.job_url and not payload.job_text:
        raise HTTPException(400, "Fournissez une URL ou le texte de l'offre.")

    # Check profile exists
    result = await db.execute(
        select(Profile).where(Profile.user_id == user.id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(400, "Créez d'abord votre profil avant de générer.")

    # Atomic credit claim — prevents race where two concurrent requests both see credits>0.
    claim = await db.execute(
        update(User)
        .where(User.id == user.id, User.credits > 0)
        .values(credits=User.credits - 1)
        .returning(User.credits)
    )
    if claim.first() is None:
        await db.rollback()
        raise HTTPException(402, "Crédits insuffisants.")
    await db.commit()

    # Create generation record
    generation = Generation(
        user_id=user.id,
        job_url=payload.job_url,
        job_text=payload.job_text,
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
        payload.job_url,
        payload.job_text,
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


@router.patch("/{generation_id}", response_model=GenerationDetail)
async def update_generation(
    generation_id: uuid.UUID,
    payload: GenerationUpdate,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Edit the adapted_data of a completed generation and regenerate PDFs. No credit cost."""
    gen = await db.get(Generation, generation_id)
    if not gen or gen.user_id != user.id:
        raise HTTPException(404, "Génération non trouvée")
    if gen.status != "completed":
        raise HTTPException(
            400, "Seules les générations terminées peuvent être éditées."
        )

    new_adapted = payload.adapted_data.model_dump()

    # Compute simple diff metrics for logging (no full diff)
    old_adapted = gen.adapted_data or {}
    old_competences = len(old_adapted.get("competences") or [])
    new_competences = len(new_adapted.get("competences") or [])
    old_atouts = len(old_adapted.get("atouts") or [])
    new_atouts = len(new_adapted.get("atouts") or [])
    old_bullets = sum(
        len((e or {}).get("bullets") or []) for e in (old_adapted.get("experiences") or [])
    )
    new_bullets = sum(
        len((e or {}).get("bullets") or []) for e in (new_adapted.get("experiences") or [])
    )

    # Profile snapshot stored at generation time — preserves original personal data
    profile_snapshot = gen.profile_snapshot or {}
    if not profile_snapshot:
        raise HTTPException(
            400,
            "Snapshot de profil manquant pour cette génération, impossible de régénérer.",
        )

    # Load current profile for template + photo
    profile_result = await db.execute(
        select(Profile).where(Profile.user_id == user.id)
    )
    profile = profile_result.scalar_one_or_none()
    cv_template = (profile.cv_template if profile else None) or "classic"

    storage = get_storage()
    photo_bytes = None
    if profile and profile.photo_path:
        try:
            photo_bytes = await storage.get(profile.photo_path)
        except FileNotFoundError:
            photo_bytes = None

    try:
        cv_bytes = generate_cv_pdf(
            cv_template, new_adapted, profile_snapshot, photo_bytes
        )
        letter_bytes = generate_cover_letter_pdf(
            new_adapted["lettre_motivation"], profile_snapshot, new_adapted
        )

        if gen.cv_pdf_path:
            await storage.put(gen.cv_pdf_path, cv_bytes)
        else:
            cv_key = f"generations/{generation_id}/cv.pdf"
            await storage.put(cv_key, cv_bytes)
            gen.cv_pdf_path = cv_key

        if gen.cover_letter_pdf_path:
            await storage.put(gen.cover_letter_pdf_path, letter_bytes)
        else:
            letter_key = f"generations/{generation_id}/letter.pdf"
            await storage.put(letter_key, letter_bytes)
            gen.cover_letter_pdf_path = letter_key
    except Exception:
        logger.exception(
            f"PDF regeneration failed for generation {generation_id} (user {user.id})"
        )
        raise HTTPException(500, "Échec de la régénération du PDF")

    gen.adapted_data = new_adapted
    if new_adapted.get("titre_poste"):
        gen.job_title = new_adapted["titre_poste"]
    if new_adapted.get("nom_entreprise"):
        gen.company_name = new_adapted["nom_entreprise"]

    await db.commit()
    await db.refresh(gen)

    logger.info(
        "Generation %s edited by user %s (competences %d->%d, atouts %d->%d, bullets %d->%d)",
        generation_id,
        user.id,
        old_competences,
        new_competences,
        old_atouts,
        new_atouts,
        old_bullets,
        new_bullets,
    )

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
@limiter.limit("20/minute")
async def scrape_preview(request: Request, payload: ScrapeRequest):
    """Scrape a job URL and return the text preview (no credit cost)."""
    try:
        result = await scrape_job_offer(payload.url)
    except ValueError as e:
        raise HTTPException(400, str(e))
    return ScrapeResponse(
        text=result.text,
        char_count=result.char_count,
        method=result.method,
        success=result.success,
        error=result.error,
    )
