# Guide de déploiement — CV Modifier

Objectif : mettre le SaaS en ligne sur un domaine accessible au public.

## Stack de déploiement

| Service | Rôle | Plan | Coût |
|---------|------|------|------|
| [Neon.tech](https://neon.tech) | PostgreSQL | Free | 0€ |
| [Railway](https://railway.app) | Backend FastAPI | Hobby | ~5€/mois |
| [Vercel](https://vercel.com) | Frontend Next.js | Hobby | Gratuit |
| Domaine .fr (optionnel) | DNS | - | ~10€/an |

**Total : ~5€/mois** (hors coûts API Claude).

---

## Étape 1 — GitHub

Push le repo sur GitHub :

```powershell
# Créer un repo vide sur github.com, puis :
cd c:\Users\awdia\cv_modifier
git remote add origin https://github.com/TON_USER/cv-modifier.git
git branch -M main
git push -u origin main
```

---

## Étape 2 — Base de données (Neon.tech)

1. Créer un compte sur https://neon.tech
2. Créer un projet → choisir région `Europe (Frankfurt)`
3. Copier la **Connection string** (format `postgresql://user:pass@host/db?sslmode=require`)
4. **Deux modifications à faire** pour notre backend :
   - Remplacer `postgresql://` par `postgresql+asyncpg://`
   - Remplacer `sslmode=require` par `ssl=require` (asyncpg n'accepte pas `sslmode`)

Exemple final :
```
postgresql+asyncpg://user:pass@host/db?ssl=require
```

Garde cette URL pour l'étape suivante.

---

## Étape 3 — Backend (Railway)

1. Compte sur https://railway.app → "New Project" → "Deploy from GitHub repo"
2. Sélectionne ton repo, choisis le dossier **`backend/`** comme root
3. Railway détecte le `Dockerfile` automatiquement
4. Dans l'onglet **Variables**, ajoute :
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-...
   SECRET_KEY=(génère avec : python -c "import secrets; print(secrets.token_urlsafe(32))")
   DATABASE_URL=postgresql+asyncpg://...  (l'URL Neon)
   CORS_ORIGINS=https://cvmodifier.vercel.app,https://cvmodifier.fr
   STORAGE_LOCAL_DIR=/data/storage
   ```
5. Ajoute un **Volume** sur Railway (tab Settings → Volumes) monté sur `/data` pour persister les PDF et photos
6. Railway te donne une URL publique type `https://cv-modifier.up.railway.app`

Test : `curl https://cv-modifier.up.railway.app/health` → `{"status":"ok"}`

---

## Étape 4 — Frontend (Vercel)

1. Compte sur https://vercel.com → "Add New Project" → importer le repo GitHub
2. Root Directory : **`frontend`**
3. Framework : Next.js (auto-détecté)
4. Variables d'environnement :
   ```
   NEXT_PUBLIC_API_URL=https://cv-modifier.up.railway.app
   ```
5. Deploy → Vercel te donne une URL `https://cvmodifier.vercel.app`

---

## Étape 5 — Mettre à jour CORS

Une fois Vercel déployé, copie l'URL Vercel dans `CORS_ORIGINS` sur Railway :
```
CORS_ORIGINS=https://cvmodifier.vercel.app,http://localhost:3000
```
Railway redéploiera automatiquement.

---

## Étape 6 — Domaine custom (optionnel)

### Acheter le domaine
- OVH, Gandi, Namecheap, Cloudflare — ~10€/an pour `.fr`

### Configuration
**Vercel (frontend)** :
- Project → Settings → Domains → ajouter `cvmodifier.fr`
- Vercel te donne les DNS à configurer (CNAME ou A records)
- Ajouter aussi `www.cvmodifier.fr`

**Railway (backend)** :
- Service → Settings → Networking → Custom Domain → `api.cvmodifier.fr`
- Ajouter un CNAME dans ton DNS pointant vers l'URL Railway

Puis mets à jour les env vars :
- Vercel : `NEXT_PUBLIC_API_URL=https://api.cvmodifier.fr`
- Railway : `CORS_ORIGINS=https://cvmodifier.fr,https://www.cvmodifier.fr`

---

## Checklist post-déploiement

- [ ] Créer un compte test sur l'app en prod
- [ ] Uploader un CV → vérifier l'extraction
- [ ] Générer un CV avec une vraie URL d'offre
- [ ] Télécharger les PDF → vérifier le nom et le contenu
- [ ] Checker les logs Railway pour les erreurs
- [ ] Configurer Sentry (optionnel) pour le monitoring

## Maintenance

**Mettre à jour l'app** : push sur GitHub → Railway et Vercel redéploient automatiquement.

**Logs** :
- Railway : dashboard → service → Logs
- Vercel : dashboard → project → Logs

**Stopper/redémarrer** :
- Railway : service → Settings → Restart

---

## Coûts mensuels estimés

- Railway Hobby : **5€/mois**
- Claude API : ~**0.08€ par CV généré** (facturé à l'usage)
- Vercel + Neon + GitHub : **0€** sur les plans gratuits

**Break-even** : ~2 abonnés Starter (9.99€/mois) couvrent tous les coûts fixes.
