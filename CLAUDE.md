# CV Modifier — SaaS

## Project overview
SaaS web app that adapts CVs and cover letters to job offers using Claude AI. Users upload their CV (auto-extracted by AI), paste a job URL, and get tailored PDF documents.

## Live URLs (production)
- **Frontend (Vercel)**: https://cv-modifier-seven.vercel.app
- **Backend (Railway)**: https://cv-modifier-production.up.railway.app
- **Database**: Neon PostgreSQL (eu-central-1)
- **File storage**: Cloudflare R2 (bucket `cv-modifier`)
- **GitHub**: https://github.com/0xcssh/cv-modifier

## Architecture
- **Backend**: FastAPI (Python) at `backend/app/` — async, SQLAlchemy 2.0, SQLite (dev) / PostgreSQL (prod)
- **Frontend**: Next.js 16 + shadcn/ui + Tailwind at `frontend/` — App Router, TypeScript
- **AI**: Anthropic Claude Sonnet 4 via `anthropic` SDK (async)
- **PDF**: FPDF2 with Carlito fonts (bundled in `backend/app/assets/fonts/`)
- **Auth**: FastAPI-Users with JWT
- **Storage**: S3-compatible (Cloudflare R2 in prod, local in dev)

## Running locally
```powershell
# Backend (terminal 1)
cd backend
python -m uvicorn app.main:app --reload

# Frontend (terminal 2)
cd frontend
npx next dev
```
Backend: http://localhost:8000 (Swagger: /docs)
Frontend: http://localhost:3000

## Deployment
- **Backend**: Railway auto-deploys from `main` branch (Dockerfile-based)
- **Frontend**: Vercel auto-deploys from `main` branch (Root Directory = `frontend`)
- See [DEPLOY.md](DEPLOY.md) for setup details.

## Key directories
- `backend/app/services/` — Core business logic (ai_engine, scraper, cv_generator, cover_letter, pipeline, cv_extractor, storage)
- `backend/app/api/` — REST endpoints (auth, profiles, generations)
- `backend/app/models/` — SQLAlchemy models (User, Profile, Education, Experience, Generation, CreditTransaction)
- `backend/Dockerfile` — Python 3.12 image with Playwright chromium
- `frontend/src/app/` — Next.js pages (landing, login, register, dashboard/*)
- `frontend/src/lib/api.ts` — API client with all backend calls
- `frontend/src/contexts/auth-context.tsx` — Auth state management
- `frontend/vercel.json` — Forces Next.js framework detection
- `legacy_cli/` — Original CLI tool (kept for reference)

## Important conventions
- Backend services return `bytes` for PDFs, not file paths
- AI prompts are in French, in `backend/app/services/ai_engine.py` — the SYSTEM_PROMPT and rules are the product's core IP
- Gender is configurable per user (`profile.gender`) for grammatical agreement
- Custom AI instructions per user (`profile.custom_instructions`) replace hardcoded rules
- Credits system: 1 credit = 1 generation (CV + cover letter). New users get 3 free.
- File naming: `{nom}-{prenom}-{entreprise}-cv.pdf` / `{nom}-{prenom}-{entreprise}-lm.pdf`
- Photo upload auto-creates minimal profile if none exists
- `confirmExtraction` endpoint preserves existing `photo_path` when rebuilding profile

## Scraping quirks
- **Indeed** blocks scraping (Cloudflare). Detected via `BLOCK_PATTERNS` in `scraper.py` → returns clear error to user.
- **LinkedIn collections URLs** (`/jobs/collections/?currentJobId=X`) auto-transformed to `/jobs/view/X/` in `_normalize_url()`.
- Scraper tries `httpx` first, falls back to Playwright chromium for SPA sites.

## CORS config
`backend/app/config.py` uses both `cors_origins` (env var, comma-separated) and a regex in `main.py` that matches all Vercel preview deploys under `0xcsshs-projects`.

## Design
- **Brand**: "CV Modifier" — cvmodifier.fr (domaine non encore acheté)
- **Palette**: Slate dark (#1E293B) + Blue vif (#2563EB) + Emerald accent (#059669)
- **Tone**: Décontracté startup
- **Style**: Inspired by moncvparfait.fr — dark hero, white cards, blue CTAs
- **Cursor**: `cursor: pointer` forced on all buttons (Base UI defaults to `default`)

## What's done
- Phase 1 ✓ Backend API + DB + auth
- Phase 2 ✓ Frontend MVP (landing, dashboard, auth)
- Phase 3 ✓ CV upload + auto-extraction (Claude reads PDF text)
- Phase 4 partial: Deployed to Railway + Vercel + Neon + R2

## What's next
- **Stripe** integration for paid plans (Starter 9.99€, Pro 19.99€, pay-as-you-go packs)
- **Email** verification and password reset via Resend/Brevo
- **Google OAuth** for 1-click signup
- **Custom domain** cvmodifier.fr
- **Rate limiting** + Sentry monitoring
