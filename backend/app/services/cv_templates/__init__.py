from app.services.cv_templates import classic, creative, minimalist, modern

_TEMPLATES = {
    "classic": classic,
    "modern": modern,
    "minimalist": minimalist,
    "creative": creative,
}

TEMPLATE_IDS = tuple(_TEMPLATES.keys())


def generate_cv_pdf(
    template_id: str,
    adapted: dict,
    profile_data: dict,
    photo_bytes: bytes | None = None,
) -> bytes:
    """Generate a CV PDF using the requested template, falling back to 'classic'."""
    module = _TEMPLATES.get(template_id) or _TEMPLATES["classic"]
    return module.generate(adapted, profile_data, photo_bytes)
