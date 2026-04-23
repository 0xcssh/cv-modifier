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
44 tests couvrent : credit atomic claim + refund + race, IDOR, SSRF validator, generation edit endpoint, Stripe billing (checkout, portal, webhook events + idempotency).

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
**Railway (backend)** — obligatoires :
`SECRET_KEY` (≥32 chars, fail-closed au boot sinon), `DATABASE_URL`, `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `EMAIL_FROM`, `FRONTEND_URL`, `CORS_ORIGINS`, `STORAGE_BACKEND=s3`, `S3_BUCKET`, `S3_ENDPOINT_URL`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_REGION`.

Stripe (pour billing) : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_PACK_10`, `STRIPE_PRICE_PACK_30`, `STRIPE_CHECKOUT_SUCCESS_URL`, `STRIPE_CHECKOUT_CANCEL_URL`.

Optionnel : `SENTRY_DSN`, `CLAUDE_MODEL` (override du défaut Haiku 4.5).

**Vercel (frontend)** : `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SENTRY_DSN` (optionnel). Pour source maps Sentry : `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`.

## Key directories
- `backend/app/services/` — Core business logic (ai_engine, scraper, cv_templates/, cover_letter, pipeline, cv_extractor, storage, email_service)
- `backend/app/api/` — REST endpoints (auth, profiles, generations, billing)
- `backend/app/models/` — SQLAlchemy models (User, Profile, Education, Experience, Generation, CreditTransaction, StripeEvent)
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

## Connexion Neon
SQLAlchemy engine configuré avec `pool_pre_ping=True` + `pool_recycle=1800` car Neon ferme les connexions inactives après quelques minutes. Sans ça → `InterfaceError: connection is closed` sur requête après idle. Ne pas retirer.

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

## Billing Stripe
- 4 plans : Starter 9.99€/mois (20 cr), Pro 19.99€/mois (50 cr), Pack 10 (4.99€), Pack 30 (12.99€)
- Checkout Session hébergée Stripe (PCI scope = 0). Customer Portal pour gérer l'abo.
- Webhook sur `/api/billing/webhook` — signé, idempotent via table `stripe_events` (PK event_id).
- Events traités : `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.updated`, `customer.subscription.deleted`.
- Crédits ADDITIONNÉS à chaque paiement (pas reset). Unused credits restent après cancel.
- CSRF middleware exempt sur `/api/billing/webhook` (Stripe ne peut pas set X-Requested-With).
- `_sget(obj, key, default)` helper dans `billing.py` parce que stripe-python v15 StripeObject n'expose plus `.get()` fiablement.

## What's done
- Phase 1-3 ✓ Backend API + DB + auth, Frontend MVP, CV upload/extraction
- Phase 4 ✓ Deploy Railway + Vercel + Neon + R2 + domain cvmodifier.com
- Phase 5 ✓ 4 templates CV visuels + édition post-génération
- Phase 6 ✓ Sécurité (2 sprints : JWT cookies, CSRF, is_verified, rate limit, SSRF, upload hardening, error sanitize, Dockerfile non-root, prompt caching Haiku 4.5)
- Phase 7 ✓ Emails transactionnels complets (Resend verified)
- Phase 8 ✓ Pages légales RGPD + cookie consent + Sentry + tests backend critiques
- Phase 9 ✓ Stripe billing end-to-end (Checkout + Customer Portal + webhook) en mode TEST
- Phase 10 ✓ SEO Sprint 1 (technique) : robots.ts, sitemap.ts, opengraph-image.tsx (dynamique via next/og), JSON-LD (Organization + WebSite + SoftwareApplication), llms.txt, proxy Next 16 qui noindex les previews *.vercel.app, lang="fr-FR", canonical apex, noindex sur /login/register/verify/forgot-password/reset-password, redirect www→apex 308
- Phase 11 ✓ SEO Sprint 2 (contenu) : landing enrichie 520→1400 mots (trust bar, 3 personas, 4 badges, 4 témoignages, FAQ 8 Q), /a-propos créée, 4 pillar pages (/adapter-cv-offre-emploi, /cv-ats, /lettre-motivation-ia, /creer-cv) ~1500-2000 mots chacune avec FAQ et internal linking
- Phase 12 ✓ SEO Sprint 3 (blog) : /blog + 5 articles MVP (1200-1500 mots chacun, design inspiré Legalstart — breadcrumbs, ligne auteur, sommaire inline, callouts bordure gauche colorée, sidebar sticky, FAQ <details>, articles liés). Images hero via Unsplash. Données dans `lib/blog-posts.ts`, rendu statique (generateStaticParams). Auteur unique "Équipe CV Modifier" pour la v1.
- Phase 13 ✓ SEO Sprint 4 (programmatic) : /cv-par-metier + 20 pages métier (~650-800 mots chacune, contenu unique par métier — pas de template-fill). 7 catégories (Tech, Commerce, Marketing, RH, Finance, Santé, Management). Données dans `lib/cv-metiers.ts`. Chaque page : accroche exemple, compétences clés, outils spécifiques, KPIs métier, erreurs communes, entreprises qui recrutent (FR scale-ups + gros groupes), fourchette salaire, liens métiers connexes. Maillage interne depuis /creer-cv et /adapter-cv-offre-emploi.

## SEO notes
- Canonical domain = apex (cvmodifier.com sans www). Vercel dashboard : cvmodifier.com = Production, www.cvmodifier.com = Redirect 308 permanent.
- Sitemap soumis sur Google Search Console + Bing Webmaster Tools. 10 URLs (landing + 4 pillars + /a-propos + 4 legal).
- Témoignages landing = placeholders crédibles (fake it till you make it) à remplacer par vrais avis quand ils arrivent.
- Stats landing (+2500 CV, 4.7/5, 92% ATS) = placeholders marketing.
- **Pas de mention publique du fournisseur IA** (Claude/Anthropic) sur le site côté marketing/produit. Retiré volontairement pour renforcer l'identité de marque, éviter perception wrapper, et préserver la flexibilité de changer de fournisseur sans impact SEO/marketing. Formulations génériques utilisées : "IA générative", "notre IA", "IA propriétaire". Unique exception : `/legal/confidentialite` liste Anthropic comme sous-traitant (obligation RGPD Art. 30, transfert UE→US).

## What's next
- **Switch Stripe en mode LIVE** : recréer produits/webhook en live, remplacer env vars Railway par `sk_live_...`
- Remplir les `[À COMPLÉTER]` dans pages légales (SIRET, siège, raison sociale, juridiction)
- Compléter /a-propos avec bio fondateur + photo + LinkedIn
- **Google Analytics 4 + Google Ads** (pour lancer des campagnes) :
  1. Prérequis RGPD : upgrade cookie banner en 3 boutons (Accepter / Refuser / Personnaliser) + Consent Mode v2 (defaults `denied`, granted après accept)
  2. Comptes Google (user) : créer property GA4 → `G-XXXXXXXX` ; créer compte Google Ads → `AW-XXXXXXXXX` ; créer 3 conversions dans Ads (sign_up, first_generation, purchase) ; linker GA4 ↔ Ads
  3. Code : installer gtag via Next `<Script>`, fire events frontend (`sign_up`, `begin_checkout`), events server-side via Measurement Protocol (`purchase` depuis webhook Stripe, `first_generation` depuis pipeline), pixel remarketing Google Ads
  4. Campagnes (user) : importer conversions GA4 dans Ads, activer Enhanced Conversions (email hashé), créer PMax ou Search avec goal = "Achat"
- **Extension blog** : 5-10 articles supplémentaires pour enrichir le blog existant (photo CV, CV junior, soft skills 2026, reconversion, CV anglais vs FR, etc.)
- **Extension programmatic** : si on dépasse 20 métiers, rester sous 30 (seuil quality gate). Au-delà → exiger 60%+ contenu unique par page (warning sub-skill `seo-programmatic`) pour éviter pénalité thin content Google.
- Google OAuth (signup 1-click)
- Rate limiting edge (Cloudflare/Vercel) devant `/auth/*`
- Script de retention (suppression comptes inactifs 24+ mois)
