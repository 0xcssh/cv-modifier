import asyncio
import logging
import re
import time
import uuid

import sentry_sdk
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import async_session
from app.models import CreditTransaction, Generation, Profile, User
from app.services.ai_engine import generate_adapted_cv
from app.services.cover_letter import generate_cover_letter_pdf
from app.services.cv_templates import generate_cv_pdf
from app.services.scraper import scrape_job_offer
from app.services.sse_bus import publish, publish_terminal
from app.services.storage import get_storage

logger = logging.getLogger(__name__)


# User-facing error messages we raise ourselves and that are safe to display.
# Any exception whose str() starts with one of these prefixes is surfaced verbatim
# to the client; everything else is replaced with a generic message to avoid
# leaking stack traces, file paths, DB connection strings, or SDK internals.
_SAFE_ERROR_PREFIXES: tuple[str, ...] = (
    "Scraping échoué",
    "Aucun texte d'offre fourni.",
    "Impossible d'obtenir une réponse JSON valide",
    "Échec de la génération.",
    "Clés manquantes",
    "PDF trop long",
    "Impossible d'extraire le texte du PDF",
    "URL non autorisée.",
)

_GENERIC_ERROR_MESSAGE = (
    "Une erreur est survenue lors de la génération. "
    "Notre équipe a été notifiée."
)


def _sanitize_error(exc: Exception) -> str:
    """Return a user-safe error message.

    Preserves messages we raised ourselves (see `_SAFE_ERROR_PREFIXES`) and
    replaces anything else with a generic message to avoid leaking internals.
    """
    message = str(exc)
    if message.startswith(_SAFE_ERROR_PREFIXES):
        return message
    return _GENERIC_ERROR_MESSAGE


def _slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[àáâãäå]", "a", text)
    text = re.sub(r"[èéêë]", "e", text)
    text = re.sub(r"[ìíîï]", "i", text)
    text = re.sub(r"[òóôõö]", "o", text)
    text = re.sub(r"[ùúûü]", "u", text)
    text = re.sub(r"[ç]", "c", text)
    text = re.sub(r"[^a-z0-9]+", "_", text)
    return text.strip("_")[:40]


def _profile_to_dict(profile: Profile) -> dict:
    """Convert a Profile ORM model to the dict format expected by services."""
    return {
        "full_name": profile.full_name,
        "email": profile.email,
        "phone": profile.phone,
        "address": profile.address,
        "city": profile.city,
        "age": profile.age,
        "permis": profile.permis,
        "vehicule": profile.vehicule,
        "gender": profile.gender,
        "cv_template": profile.cv_template,
        "skills": profile.skills or [],
        "languages": profile.languages or [],
        "soft_skills": profile.soft_skills or [],
        "education": [
            {
                "title": e.title,
                "school": e.school,
                "location": e.location,
                "dates": e.dates,
            }
            for e in profile.education
        ],
        "experiences": [
            {
                "title": e.title,
                "company": e.company,
                "location": e.location,
                "dates": e.dates,
                "bullets": e.bullets or [],
                "is_locked": e.is_locked,
            }
            for e in profile.experiences
        ],
    }


async def run_generation_pipeline(
    generation_id: uuid.UUID,
    user_id: uuid.UUID,
    job_url: str | None,
    job_text: str | None,
):
    """Background task that runs the full generation pipeline."""
    storage = get_storage()

    async with async_session() as db:
        generation = await db.get(Generation, generation_id)
        user = await db.get(User, user_id)
        profile = (
            await db.execute(select(Profile).where(Profile.user_id == user_id))
        ).scalar_one_or_none()

        if not generation or not user or not profile:
            logger.error(f"Generation {generation_id}: missing data")
            return

        pipeline_start = time.perf_counter()
        try:
            # Step 1: Scrape if no job text provided.
            if not job_text and job_url:
                generation.status = "processing"
                await db.commit()

                await publish(generation_id, {"step": "scraping_started"})
                t0 = time.perf_counter()
                result = await scrape_job_offer(job_url)
                scrape_ms = int((time.perf_counter() - t0) * 1000)
                if not result.success:
                    raise RuntimeError(f"Scraping échoué : {result.error}")
                job_text = result.text
                logger.info(
                    "Scraping done in %d ms via %s (%d chars)",
                    scrape_ms,
                    result.method,
                    result.char_count,
                )
                await publish(
                    generation_id,
                    {
                        "step": "scraping_done",
                        "duration_ms": scrape_ms,
                        "method": result.method,
                    },
                )

            if not job_text:
                raise RuntimeError("Aucun texte d'offre fourni.")

            generation.job_text = job_text
            generation.status = "processing"
            await db.commit()

            # Step 2: Generate CV + cover letter via Claude (split + parallel).
            await publish(generation_id, {"step": "ai_started"})
            t0 = time.perf_counter()
            profile_data = _profile_to_dict(profile)
            adapted, usage = await generate_adapted_cv(
                job_text=job_text,
                profile_data=profile_data,
                custom_instructions=profile.custom_instructions,
                gender=profile.gender,
            )
            ai_ms = int((time.perf_counter() - t0) * 1000)
            logger.info(
                "AI done in %d ms (%d input + %d output tokens, model=%s)",
                ai_ms,
                usage.input_tokens,
                usage.output_tokens,
                settings.claude_model,
            )
            await publish(
                generation_id,
                {
                    "step": "ai_done",
                    "duration_ms": ai_ms,
                    "tokens": usage.total_tokens,
                },
            )

            generation.adapted_data = adapted
            generation.job_title = adapted.get("titre_poste", "")
            generation.company_name = adapted.get("nom_entreprise", "")
            generation.tokens_used = usage.total_tokens
            generation.cost_estimate = usage.estimated_cost
            generation.model_used = settings.claude_model
            generation.profile_snapshot = profile_data

            # Step 3: Generate PDFs in parallel (CV + cover letter).
            t0 = time.perf_counter()
            photo_bytes = None
            if profile.photo_path:
                try:
                    photo_bytes = await storage.get(profile.photo_path)
                except FileNotFoundError:
                    pass

            cv_template = profile.cv_template or "classic"
            cv_bytes, letter_bytes = await asyncio.gather(
                asyncio.to_thread(
                    generate_cv_pdf,
                    cv_template,
                    adapted,
                    profile_data,
                    photo_bytes,
                ),
                asyncio.to_thread(
                    generate_cover_letter_pdf,
                    adapted["lettre_motivation"],
                    profile_data,
                    adapted,
                ),
            )
            pdf_ms = int((time.perf_counter() - t0) * 1000)
            logger.info("PDFs done in %d ms", pdf_ms)
            await publish(
                generation_id, {"step": "pdfs_done", "duration_ms": pdf_ms}
            )

            # Step 4: Store PDFs in parallel.
            t0 = time.perf_counter()
            cv_key = f"generations/{generation_id}/cv.pdf"
            letter_key = f"generations/{generation_id}/letter.pdf"
            await asyncio.gather(
                storage.put(cv_key, cv_bytes),
                storage.put(letter_key, letter_bytes),
            )
            upload_ms = int((time.perf_counter() - t0) * 1000)
            logger.info("R2 uploads done in %d ms", upload_ms)
            await publish(
                generation_id, {"step": "uploads_done", "duration_ms": upload_ms}
            )

            generation.cv_pdf_path = cv_key
            generation.cover_letter_pdf_path = letter_key
            generation.status = "completed"

            # Ledger entry only — credit was already atomically claimed by the API endpoint.
            db.add(
                CreditTransaction(
                    user_id=user_id,
                    amount=-1,
                    reason="generation",
                    generation_id=generation_id,
                )
            )

            await db.commit()
            total_ms = int((time.perf_counter() - pipeline_start) * 1000)
            logger.info(
                "Generation %s completed in %d ms: %s @ %s",
                generation_id,
                total_ms,
                adapted.get("titre_poste", "?"),
                adapted.get("nom_entreprise", "?"),
            )
            await publish_terminal(
                generation_id,
                {
                    "step": "completed",
                    "generation_id": str(generation_id),
                    "duration_ms": total_ms,
                    "job_title": adapted.get("titre_poste", ""),
                    "company_name": adapted.get("nom_entreprise", ""),
                },
            )

            # Referral reward — if this was the referee's first successful
            # generation and they have a pending Referral row, grant +3 credits
            # to the referrer. Idempotent; skipped if already granted.
            try:
                from app.services.referrals import maybe_grant_referrer_reward
                await maybe_grant_referrer_reward(db, user_id)
            except Exception:
                logger.exception(
                    "Referral reward grant failed for referee=%s", user_id
                )

            # Credit-level notifications — fire-and-forget, failures must not block the pipeline.
            try:
                await db.refresh(user, ["credits"])
                if user.credits == 1:
                    from app.services.email_service import send_low_credits_email
                    send_low_credits_email(user.email, 1)
                elif user.credits == 0:
                    from app.services.email_service import send_no_credits_email
                    send_no_credits_email(user.email)
            except Exception:
                logger.exception(
                    f"Failed to send credit notification for user {user_id}"
                )

        except Exception as e:
            generation.status = "failed"
            generation.error_message = _sanitize_error(e)
            await db.commit()
            logger.exception(f"Generation {generation_id} failed")
            await publish_terminal(
                generation_id,
                {"step": "failed", "error": generation.error_message},
            )
            # Send the FULL exception to Sentry — the sanitized message above
            # is only for the client response. No-op if Sentry isn't init'd.
            sentry_sdk.capture_exception(e)

            # Refund the credit atomically so a failed generation doesn't cost the user.
            try:
                await db.execute(
                    update(User)
                    .where(User.id == user_id)
                    .values(credits=User.credits + 1)
                )
                db.add(
                    CreditTransaction(
                        user_id=user_id,
                        amount=1,
                        reason="generation_refund",
                        generation_id=generation_id,
                    )
                )
                await db.commit()
            except Exception:
                logger.exception(
                    f"Refund failed for generation {generation_id} (user {user_id})"
                )
