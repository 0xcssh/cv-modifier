# CV Modifier — SaaS

## Project overview
SaaS web app that adapts CVs and cover letters to job offers using Claude AI. Users upload their CV (auto-extracted by AI), paste a job URL, and get tailored PDF documents.

## Architecture
- **Backend**: FastAPI (Python) at `backend/app/` — async, SQLAlchemy 2.0, SQLite (dev) / PostgreSQL (prod)
- **Frontend**: Next.js 16 + shadcn/ui + Tailwind at `frontend/` — App Router, TypeScript
- **AI**: Anthropic Claude Sonnet 4 via `anthropic` SDK (async)
- **PDF**: FPDF2 with Carlito fonts (bundled in `backend/app/assets/fonts/`)
- **Auth**: FastAPI-Users with JWT

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

## Key directories
- `backend/app/services/` — Core business logic (ai_engine, scraper, cv_generator, cover_letter, pipeline, cv_extractor, storage)
- `backend/app/api/` — REST endpoints (auth, profiles, generations)
- `backend/app/models/` — SQLAlchemy models (User, Profile, Education, Experience, Generation, CreditTransaction)
- `frontend/src/app/` — Next.js pages (landing, login, register, dashboard/*)
- `frontend/src/lib/api.ts` — API client with all backend calls
- `frontend/src/contexts/auth-context.tsx` — Auth state management

## Important conventions
- Backend services return `bytes` for PDFs, not file paths
- AI prompts are in French, in `backend/app/services/ai_engine.py` — the SYSTEM_PROMPT and rules are the product's core IP
- Gender is configurable per user (`profile.gender`) for grammatical agreement
- Custom AI instructions per user (`profile.custom_instructions`) replace hardcoded rules
- Credits system: 1 credit = 1 generation (CV + cover letter)
- File naming: `{nom}-{prenom}-{entreprise}-cv.pdf` / `{nom}-{prenom}-{entreprise}-lm.pdf`
- Photo is uploaded separately via profile, stored in `storage/photos/{user_id}/`

## Design
- **Brand**: "CV Modifier" — cvmodifier.fr
- **Palette**: Slate dark (#1E293B) + Blue vif (#2563EB) + Emerald accent (#059669)
- **Tone**: Décontracté startup
- **Style**: Inspired by moncvparfait.fr — dark hero, white cards, blue CTAs

## Original CLI tool
The root-level Python files (main.py, ai_engine.py, scraper.py, etc.) are the original CLI tool. The SaaS version is in `backend/` and `frontend/`.
