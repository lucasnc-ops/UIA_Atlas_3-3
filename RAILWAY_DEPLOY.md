# Atlas 3+3 — Railway Deployment Guide

## Architecture on Railway

Two separate Railway services, one Supabase database:

```
Railway Project
├── Service: atlas33-backend  (Docker, /backend)
└── Service: atlas33-frontend (Docker, /frontend)

Database: Supabase (PostgreSQL + PostGIS)
```

---

## Step 1 — Supabase Database

Before deploying to Railway, set up (or verify) the Supabase database.

### First-time setup

Run `supabase_setup.sql` in the Supabase SQL Editor:
1. Go to your Supabase project → **SQL Editor**
2. Paste the contents of `supabase_setup.sql`
3. Click **Run**

> The script creates all tables, enums, indexes, and seeds the 22 initial projects.

### Get the connection string

1. Supabase dashboard → **Settings** → **Database**
2. Use the **Transaction pooler** connection string (port **6543**):
   ```
   postgresql://postgres.YOURREF:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
3. Use port **5432** (direct connection) only if Alembic migrations won't run via pooler.

---

## Step 2 — Backend on Railway

### Create the service

1. Railway dashboard → **New Project** → **Deploy from GitHub**
2. Select repo, set **Root Directory** to `backend`
3. Railway auto-detects `Dockerfile`

### Backend environment variables

Set these in Railway → Service → **Variables**:

| Variable | Value | Notes |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres.XXX:PASS@host:6543/postgres` | Supabase Transaction Pooler URL |
| `SECRET_KEY` | 32+ random chars | `python -c "import secrets; print(secrets.token_urlsafe(32))"` |
| `ALGORITHM` | `HS256` | |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | |
| `ENVIRONMENT` | `production` | |
| `CORS_ORIGINS` | `https://your-frontend.railway.app` | Frontend Railway URL |
| `CORS_ORIGIN_REGEX` | `https://.*\.railway\.app` | Covers all Railway preview URLs |
| `FRONTEND_URL` | `https://your-frontend.railway.app` | For email links |
| `ADMIN_EMAIL` | `admin@uia.org` | |
| `SKIP_MIGRATIONS` | `false` | Set `true` after first deploy if migrations already ran |
| `SKIP_DATA_IMPORT` | `false` | Set `true` after first deploy to speed up restarts |
| `SMTP_HOST` | `smtp.sendgrid.net` | Optional — email service |
| `SMTP_PORT` | `587` | |
| `SMTP_USER` | `apikey` | |
| `SMTP_PASSWORD` | `SG.xxxxxxxx` | SendGrid API key |
| `SMTP_FROM_EMAIL` | `noreply@atlas33.org` | |
| `SMTP_FROM_NAME` | `Atlas 3+3` | |
| `RECAPTCHA_SECRET_KEY` | *(your key)* | Optional |

### Startup sequence (automatic)

When the container starts, `start.sh` runs:
1. `alembic upgrade head` — applies any pending migrations
2. `python import_full_dataset.py` — seeds 22 projects (skips duplicates by name)
3. `gunicorn` — starts the API server

---

## Step 3 — Frontend on Railway

### Create the service

1. In the same Railway project → **New Service** → **Deploy from GitHub**
2. Select repo, set **Root Directory** to `frontend`
3. Railway auto-detects `Dockerfile`

### IMPORTANT: VITE_API_URL must be a build variable

Vite bakes `VITE_*` variables into the static bundle at build time.
In Railway, go to **Variables** → **Add Build Variable**:

| Variable | Value | Notes |
|---|---|---|
| `VITE_API_URL` | `https://your-backend.railway.app` | **Build variable** (not runtime) |

Railway passes build variables as Docker `ARG`s, which the multi-stage Dockerfile picks up.

### Runtime variables

| Variable | Value |
|---|---|
| `PORT` | `3000` (Railway sets this automatically) |

---

## Step 4 — After First Deploy

### Create the admin user

Once the backend is running, exec into the Railway shell or run locally with `DATABASE_URL` set:

```bash
cd backend
python create_admin.py
```

Or manually in Supabase SQL Editor:
```sql
-- First hash the password using bcrypt (do this in Python)
-- Then insert:
INSERT INTO users (id, email, hashed_password, role, created_at, updated_at)
VALUES (
  uuid_generate_v4(),
  'admin@uia.org',
  '$2b$12$YOUR_BCRYPT_HASH_HERE',
  'ADMIN',
  NOW(),
  NOW()
);
```

### Speed up subsequent restarts

After data is seeded and migrations have run, set in the backend service:
```
SKIP_MIGRATIONS=true
SKIP_DATA_IMPORT=true
```

---

## Step 5 — Update CORS after Frontend is deployed

1. Get the frontend Railway URL (e.g., `https://atlas33-frontend-production.up.railway.app`)
2. Update backend env vars:
   ```
   CORS_ORIGINS=https://atlas33-frontend-production.up.railway.app
   FRONTEND_URL=https://atlas33-frontend-production.up.railway.app
   ```
3. Redeploy backend (or trigger restart)

---

## Troubleshooting

### Backend won't start
- Check Railway logs for Python errors
- Verify `DATABASE_URL` is the Transaction Pooler URL (port 6543)
- Make sure Supabase project is not paused

### Frontend shows blank page / API errors
- Check browser console — likely `VITE_API_URL` is wrong or empty
- `VITE_API_URL` must be set as a **build variable**, not a runtime variable
- Redeploy frontend after fixing

### CORS errors in browser console
- Add frontend Railway URL to backend `CORS_ORIGINS`
- Regex `https://.*\.railway\.app` covers all Railway URLs

### Database migration errors
- The Transaction Pooler (port 6543) doesn't support `SET` statements used by Alembic
- Use the **Session Pooler** (port 5432) URL for `DATABASE_URL` if migrations fail
- Or run migrations from local machine: `DATABASE_URL=... alembic upgrade head`

### "relation already exists" migration error
- The schema was already created via `supabase_setup.sql`
- Set `SKIP_MIGRATIONS=true` in backend env vars

---

## Environment Variables Quick Reference

### Backend (Railway Service Variables)
```
DATABASE_URL=postgresql://postgres.XXX:PASS@host:6543/postgres
SECRET_KEY=<random-32-chars>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
CORS_ORIGINS=https://your-frontend.railway.app
CORS_ORIGIN_REGEX=https://.*\.railway\.app
FRONTEND_URL=https://your-frontend.railway.app
ADMIN_EMAIL=admin@uia.org
SKIP_MIGRATIONS=false
SKIP_DATA_IMPORT=false
```

### Frontend (Railway Build Variable)
```
VITE_API_URL=https://your-backend.railway.app
```
