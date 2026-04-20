import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import current_active_user
from app.database import get_db
from app.models import Education, Experience, Profile, User
from app.schemas.profile import (
    EducationCreate,
    EducationRead,
    ExperienceCreate,
    ExperienceRead,
    ProfileCreate,
    ProfileRead,
    ProfileUpdate,
    ReorderRequest,
)
from app.services.cv_extractor import extract_profile_from_pdf, extract_photo_from_pdf
from app.services.storage import get_storage

router = APIRouter(prefix="/profile", tags=["profile"])


async def _get_profile(user: User, db: AsyncSession) -> Profile:
    result = await db.execute(
        select(Profile).where(Profile.user_id == user.id)
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(404, "Profil non trouvé. Créez d'abord votre profil.")
    return profile


# --- Profile CRUD ---

@router.get("", response_model=ProfileRead)
async def get_profile(
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
):
    return await _get_profile(user, db)


@router.post("", response_model=ProfileRead, status_code=201)
async def create_profile(
    data: ProfileCreate,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
):
    # Check if profile already exists
    existing = await db.execute(
        select(Profile).where(Profile.user_id == user.id)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(409, "Un profil existe déjà.")

    profile = Profile(
        user_id=user.id,
        full_name=data.full_name,
        email=data.email,
        phone=data.phone,
        address=data.address,
        city=data.city,
        age=data.age,
        permis=data.permis,
        vehicule=data.vehicule,
        gender=data.gender,
        skills=data.skills,
        languages=data.languages,
        soft_skills=data.soft_skills,
        custom_instructions=data.custom_instructions,
    )
    db.add(profile)
    await db.flush()

    for i, edu in enumerate(data.education):
        edu_data = edu.model_dump()
        edu_data["sort_order"] = i
        db.add(Education(profile_id=profile.id, **edu_data))
    for i, exp in enumerate(data.experiences):
        exp_data = exp.model_dump()
        exp_data["sort_order"] = i
        db.add(Experience(profile_id=profile.id, **exp_data))

    await db.commit()
    await db.refresh(profile)
    return profile


@router.put("", response_model=ProfileRead)
async def update_profile(
    data: ProfileUpdate,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
):
    profile = await _get_profile(user, db)
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(profile, key, value)
    await db.commit()
    await db.refresh(profile)
    return profile


# --- Photo ---

@router.post("/photo")
async def upload_photo(
    file: UploadFile = File(...),
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
):
    if file.size and file.size > 5 * 1024 * 1024:
        raise HTTPException(413, "Photo trop volumineuse (max 5 Mo)")

    # Get or create profile
    result = await db.execute(select(Profile).where(Profile.user_id == user.id))
    profile = result.scalar_one_or_none()
    if not profile:
        profile = Profile(user_id=user.id, full_name="")
        db.add(profile)
        await db.flush()

    content = await file.read()
    key = f"photos/{user.id}/{file.filename}"
    storage = get_storage()
    await storage.put(key, content)

    profile.photo_path = key
    await db.commit()
    return {"photo_path": key}


@router.get("/photo")
async def get_photo(
    token: str | None = None,
    user: User | None = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
):
    profile = await _get_profile(user, db)
    if not profile.photo_path:
        raise HTTPException(404, "Aucune photo")

    storage = get_storage()
    try:
        data = await storage.get(profile.photo_path)
    except FileNotFoundError:
        raise HTTPException(404, "Photo introuvable")

    ext = profile.photo_path.rsplit(".", 1)[-1].lower()
    media_type = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "webp": "image/webp"}.get(ext, "image/jpeg")

    return Response(
        content=data,
        media_type=media_type,
        headers={"Cache-Control": "private, max-age=3600"},
    )


# --- Education CRUD ---

@router.post("/education", response_model=EducationRead, status_code=201)
async def add_education(
    data: EducationCreate,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
):
    profile = await _get_profile(user, db)
    edu = Education(profile_id=profile.id, **data.model_dump())
    db.add(edu)
    await db.commit()
    await db.refresh(edu)
    return edu


@router.put("/education/{edu_id}", response_model=EducationRead)
async def update_education(
    edu_id: uuid.UUID,
    data: EducationCreate,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
):
    profile = await _get_profile(user, db)
    edu = await db.get(Education, edu_id)
    if not edu or edu.profile_id != profile.id:
        raise HTTPException(404, "Formation non trouvée")
    for key, value in data.model_dump().items():
        setattr(edu, key, value)
    await db.commit()
    await db.refresh(edu)
    return edu


@router.delete("/education/{edu_id}", status_code=204)
async def delete_education(
    edu_id: uuid.UUID,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
):
    profile = await _get_profile(user, db)
    edu = await db.get(Education, edu_id)
    if not edu or edu.profile_id != profile.id:
        raise HTTPException(404, "Formation non trouvée")
    await db.delete(edu)
    await db.commit()


# --- Experience CRUD ---

@router.post("/experiences", response_model=ExperienceRead, status_code=201)
async def add_experience(
    data: ExperienceCreate,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
):
    profile = await _get_profile(user, db)
    exp = Experience(profile_id=profile.id, **data.model_dump())
    db.add(exp)
    await db.commit()
    await db.refresh(exp)
    return exp


@router.put("/experiences/{exp_id}", response_model=ExperienceRead)
async def update_experience(
    exp_id: uuid.UUID,
    data: ExperienceCreate,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
):
    profile = await _get_profile(user, db)
    exp = await db.get(Experience, exp_id)
    if not exp or exp.profile_id != profile.id:
        raise HTTPException(404, "Expérience non trouvée")
    for key, value in data.model_dump().items():
        setattr(exp, key, value)
    await db.commit()
    await db.refresh(exp)
    return exp


@router.delete("/experiences/{exp_id}", status_code=204)
async def delete_experience(
    exp_id: uuid.UUID,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
):
    profile = await _get_profile(user, db)
    exp = await db.get(Experience, exp_id)
    if not exp or exp.profile_id != profile.id:
        raise HTTPException(404, "Expérience non trouvée")
    await db.delete(exp)
    await db.commit()


# --- CV Upload + Extraction ---

@router.post("/extract")
async def extract_profile_from_cv(
    file: UploadFile = File(...),
    user: User = Depends(current_active_user),
):
    """Upload a PDF CV and extract structured profile data using Claude."""
    if file.size and file.size > 10 * 1024 * 1024:
        raise HTTPException(413, "Fichier trop volumineux (max 10 Mo)")

    content = await file.read()

    try:
        extracted = await extract_profile_from_pdf(content)
    except ValueError as e:
        raise HTTPException(422, str(e))
    except Exception as e:
        raise HTTPException(500, f"Erreur lors de l'extraction : {e}")

    # Try to extract photo from PDF
    try:
        photo_data = extract_photo_from_pdf(content)
        if photo_data:
            storage = get_storage()
            photo_key = f"photos/{user.id}/cv_photo.jpg"
            await storage.put(photo_key, photo_data)
            extracted["_photo_path"] = photo_key
    except Exception:
        pass

    return extracted


@router.post("/extract/confirm", response_model=ProfileRead, status_code=201)
async def confirm_extracted_profile(
    data: ProfileCreate,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Save the confirmed/edited extracted profile data."""
    # Preserve existing photo_path if any
    existing_photo_path = None

    # Delete existing profile if any
    result = await db.execute(
        select(Profile).where(Profile.user_id == user.id)
    )
    existing = result.scalar_one_or_none()
    if existing:
        existing_photo_path = existing.photo_path
        await db.delete(existing)
        await db.flush()

    # Check if a photo was extracted from a CV upload
    storage = get_storage()
    photo_path = existing_photo_path
    if not photo_path:
        try:
            photo_key = f"photos/{user.id}/cv_photo.jpg"
            await storage.get(photo_key)
            photo_path = photo_key
        except FileNotFoundError:
            pass

    # Create new profile
    profile = Profile(
        user_id=user.id,
        full_name=data.full_name,
        email=data.email,
        phone=data.phone,
        address=data.address,
        city=data.city,
        age=data.age,
        permis=data.permis,
        vehicule=data.vehicule,
        gender=data.gender,
        skills=data.skills,
        languages=data.languages,
        soft_skills=data.soft_skills,
        custom_instructions=data.custom_instructions,
        photo_path=photo_path,
    )
    db.add(profile)
    await db.flush()

    for i, edu in enumerate(data.education):
        edu_data = edu.model_dump()
        edu_data["sort_order"] = i
        db.add(Education(profile_id=profile.id, **edu_data))
    for i, exp in enumerate(data.experiences):
        exp_data = exp.model_dump()
        exp_data["sort_order"] = i
        db.add(Experience(profile_id=profile.id, **exp_data))

    await db.commit()
    await db.refresh(profile)
    return profile
