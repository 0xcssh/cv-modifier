# CV Modifier — SaaS

## Project overview
SaaS web app that adapts CVs and cover letters to job offers using Claude AI. Users upload their CV (auto-extracted by AI), paste a job URL, and get tailored PDF documents.

## Live URLs (production)
- **Frontend**: https://cvmodifier.com (+ Vercel preview: https://cv-modifier-seven.vercel.app)
- **Backend (Railway)**: https://cv-modifier-production.up.railway.app
- **Database**: Neon PostgreSQL (eu-central-1)
- **File storage**: Cloudflare R2 (bucket `cv-modifier`)
- **Email sender**: hello@cvmodifier.com (Resend, domain verified)
- **Error monitoring**: Sentry (EU region, `ingest.de.sentry.io`)
- **GitHub**: https://github.com/0xcssh/cv-modifier

## Architecture
- **Backend**: FastAPI (Python 3.12) at `backend/app/` — async, SQLAlchemy 2.0, SQLite (dev) / PostgreSQL Neon (prod)
- **Frontend**: Next.js 16 + shadcn/ui + Tailwind at `frontend/` — App Router, TypeScript
- **AI**: Anthropic Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) via `anthropic` SDK — prompt caching activé sur system prompt + profil + règles
- **PDF**: FPDF2 with Carlito fonts, 4 templates visuels (`backend/app/services/cv_templates/`)
- **Auth**: FastAPI-Users + JWT en cookie httpOnly (SameSite=None + Secure en prod, Lax en dev)
- **Storage**: S3-compatible (Cloudflare R2 prod + URL signées photos, local dev)

## Running locally
```powershell
# Backend (terminal 1)
cd backend
python -m uvicorn app.main:app --reload

# Frontend (terminal 2)
cd frontend
npx next dev
```
Backend: http://localhost:8000 (Swagger `/docs` uniquement si `DEBUG=true`)
Frontend: http://localhost:3000

## Tests backend
```powershell
cd backend
python -m pytest tests/ -x --tb=short -q
```
33 tests couvrent : credit atomic claim + refund + race, IDOR, SSRF validator, generation edit endpoint.

## Deployment
- **Backend**: Railway auto-deploys from `main` branch (Dockerfile-based, Python 3.12.8-slim, non-root user `appuser`)
- **Frontend**: Vercel auto-deploys from `main` branch (Root Directory = `frontend`)
- See [DEPLOY.md](DEPLOY.md) for setup details.

### ⚠️ Après toute modification de `backend/pyproject.toml`
Il faut régénérer le lock file ou Railway échoue au boot (`ModuleNotFoundError`) :
```powershell
cd backend
uv pip compile pyproject.toml --extra prod --output-file requirements.lock.txt
```
Commit + push → Railway rebuild avec les nouvelles deps.

## Env vars requises en prod
**Railway (backend)** — toutes obligatoires sauf Sentry :
`SECRET_KEY` (≥32 chars, fail-closed au boot sinon), `DATABASE_URL`, `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `EMAIL_FROM`, `FRONTEND_URL`, `CORS_ORIGINS`, `STORAGE_BACKEND=s3`, `S3_BUCKET`, `S3_ENDPOINT_URL`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_REGION`, `SENTRY_DSN` (optionnel).

**Vercel (frontend)** : `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SENTRY_DSN` (optionnel). Pour source maps Sentry : `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`.

## Key directories
- `backend/app/services/` — Core business logic (ai_engine, scraper, cv_templates/, cover_letter, pipeline, cv_extractor, storage, email_service)
- `backend/app/api/` — REST endpoints (auth, profiles, generations)
- `backend/app/models/` — SQLAlchemy models (User, Profile, Education, Experience, Generation, CreditTransaction)
- `backend/app/core/` — security (fastapi-users auth), limiter (slowapi)
- `backend/scripts/` — One-shot scripts (generate_template_previews, send_monthly_recaps)
- `backend/tests/` — pytest suite (conftest + 4 test files)
- `backend/Dockerfile` — Python 3.12.8-slim + Playwright chromium, non-root user
- `frontend/src/app/` — Next.js pages (landing, login, register, forgot-password, reset-password, verify, dashboard/*, legal/*)
- `frontend/src/lib/api.ts` — API client avec cookie auth + CSRF header
- `frontend/src/contexts/auth-context.tsx` — Auth state
- `frontend/src/components/cookie-consent.tsx` — Banner consent cookies
- `frontend/public/templates/` — Previews PNG des 4 templates CV
- `frontend/sentry.*.config.ts` + `instrumentation.ts` — Sentry setup
- `legacy_cli/` — Ancien CLI (archivé)

## Important conventions
- Backend services return `bytes` for PDFs, not file paths
- AI prompts sont en français dans `backend/app/services/ai_engine.py` — le SYSTEM_PROMPT + règles sont l'IP produit
- Prompt caching Anthropic : `cache_control: ephemeral` sur system prompt et bloc profil+règles (dans l'user message). Logs `Prompt cache — read/write tokens` pour monitoring.
- Gender is configurable per user (`profile.gender`) for grammatical agreement
- Custom AI instructions per user (`profile.custom_instructions`) replace hardcoded rules
- Credits system: 1 credit = 1 generation (CV + cover letter). New users get 3 free. Claim atomique en DB dans `POST /generations` (`UPDATE ... WHERE credits > 0 RETURNING`). Refund automatique en cas d'échec pipeline.
- File naming downloads: `{nom}-{prenom}-{entreprise}-cv.pdf` / `{nom}-{prenom}-{entreprise}-lm.pdf`
- Photo upload : filename UUID server-side (anti path-traversal), re-encode JPEG via Pillow, strip EXIF, max 4000x4000.
- `confirmExtraction` endpoint preserves existing `photo_path` when rebuilding profile
- CV template choisi dans le profil (`profile.cv_template`), dispatché par `generate_cv_pdf(template_id, ...)` dans `cv_templates/`

## Sécurité
- JWT en cookie httpOnly `cv_modifier_auth` (24h). SameSite=None+Secure en prod, Lax en dev.
- CSRF protection via header `X-Requested-With: XMLHttpRequest` requis sur POST/PUT/PATCH/DELETE (sauf `/health`).
- CORS regex strict : `(cv-modifier*-0xcsshs-projects.vercel.app|(www.)?cvmodifier.com)`
- Rate limiting slowapi : `/generations` 10/h, `/generations/scrape` 20/min, `/profile/extract` 5/h. Routes `/auth/*` à limiter au niveau edge.
- Swagger `/docs` désactivé en prod (`debug=False`).
- SSRF validator sur scraper (blocklist IPs privées/loopback/link-local via `socket.getaddrinfo`).
- Error messages sanitizés : seules les erreurs à préfixes safe (`_SAFE_ERROR_PREFIXES` dans `pipeline.py`) sont renvoyées ; sinon message générique + `logger.exception` + `sentry_sdk.capture_exception`.
- User `is_verified` requis pour `POST /generations` (email de vérif envoyé au register via `request_verify`).
- CSP strict côté frontend (voir `next.config.ts`).

## Scraping quirks
- **Indeed** blocks scraping (Cloudflare). Detected via `BLOCK_PATTERNS` in `scraper.py` → returns clear error to user.
- **LinkedIn collections URLs** (`/jobs/collections/?currentJobId=X`) auto-transformed to `/jobs/view/X/` in `_normalize_url()`.
- Scraper tries `httpx` first, falls back to Playwright chromium for SPA sites.
- URL validée par `_validate_url` (SSRF) AVANT chaque appel httpx/Playwright.

## Design
- **Brand**: "CV Modifier" — cvmodifier.com
- **Palette**: Slate dark (#1E293B) + Blue vif (#2563EB) + Emerald accent (#059669)
- **Tone**: Décontracté startup
- **Style**: Inspired by moncvparfait.fr — dark hero, white cards, blue CTAs
- **Cursor**: `cursor: pointer` forced on all buttons (Base UI defaults to `default`)
- **4 templates CV** : Classique (slate sidebar), Moderne (header bleu pleine largeur), Minimaliste (mono-chrome), Créatif (sidebar emerald + timeline)

## Emails transactionnels (Resend)
Tous définis dans `backend/app/services/email_service.py` :
- Bienvenue (register)
- Vérification email (register auto-trigger + bouton "Renvoyer" dans dashboard)
- Mot de passe oublié / Mot de passe modifié (confirmation sécurité)
- 1 crédit restant / Crédits épuisés (fin pipeline si seuil)
- Récapitulatif mensuel (script manuel `scripts/send_monthly_recaps.py`)

## What's done
- Phase 1-3 ✓ Backend API + DB + auth, Frontend MVP, CV upload/extraction
- Phase 4 ✓ Deploy Railway + Vercel + Neon + R2 + domain cvmodifier.com
- Phase 5 ✓ 4 templates CV visuels + édition post-génération
- Phase 6 ✓ Sécurité (2 sprints : JWT cookies, CSRF, is_verified, rate limit, SSRF, upload hardening, error sanitize, Dockerfile non-root, prompt caching Haiku 4.5)
- Phase 7 ✓ Emails transactionnels complets (Resend verified)
- Phase 8 ✓ Pages légales RGPD + cookie consent + Sentry + tests backend critiques

## What's next
- **Stripe** intégration (plans Starter/Pro + pay-as-you-go)
- Rate limiting edge (Cloudflare/Vercel) devant `/auth/*`
- Google OAuth (signup 1-click)
- Analytics (PostHog / Plausible)
- Script de retention (suppression comptes inactifs 24+ mois)
- Remplir les `[À COMPLÉTER]` dans pages légales (SIRET, siège, etc.)
