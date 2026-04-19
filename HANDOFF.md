# Panorama SDG — Docker Handoff Guide

Self-contained stack: PostgreSQL + MinIO (image storage) + FastAPI backend + React frontend.
No cloud accounts required. Everything runs locally via Docker Desktop.

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Git (to clone the repository)
- The database export file `seed.sql` (provided separately — contains all project data)
- The WebP image folder (provided separately — `webp_output/` from the 8GB archive)

---

## Step 1 — Configure environment

```bash
cp .env.docker.example backend/.env
```

Open `backend/.env` and set:
- `POSTGRES_PASSWORD` → a strong password
- `MINIO_ROOT_PASSWORD` and `MINIO_SECRET_KEY` → same strong password
- `SECRET_KEY` → run `openssl rand -hex 32` and paste the output
- `ADMIN_EMAIL` → your organization's admin email

---

## Step 2 — Load the database seed

Place the provided `seed.sql` file at:
```
data/seed/seed.sql
```

The PostgreSQL container will automatically execute it on first startup.

---

## Step 3 — Start the stack

```bash
docker compose up -d
```

This starts 5 services:
| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| API Docs (Swagger) | http://localhost:8080/docs |
| MinIO console | http://localhost:9001 |
| PostgreSQL | localhost:5432 |

Wait ~30 seconds for all containers to become healthy:
```bash
docker compose ps
```

---

## Step 4 — Apply database migrations

```bash
docker compose exec backend alembic upgrade head
```

---

## Step 5 — Upload project images

Run this once after the stack is up. The `webp_output/` folder contains per-project WebP images
named by external code (e.g., `IFF1/`, `LDP6/`).

**On Windows (PowerShell):**
```powershell
docker compose exec backend python scripts/upload_guidebook_images.py `
  --source-dir "C:\path\to\webp_output" `
  --minio
```

**On Linux/Mac:**
```bash
docker compose exec backend python scripts/upload_guidebook_images.py \
  --source-dir /path/to/webp_output \
  --minio
```

To test without uploading first:
```bash
... --minio --dry-run
```

---

## Step 6 — Create admin user

```bash
docker compose exec backend python scripts/create_admin.py
```

Default credentials: `admin@panorama-sdg.org` / `Panorama2030!`
Change the password immediately after first login.

---

## Verification

1. Open http://localhost:5173 → map loads with all projects and pins
2. Open http://localhost:9001 → MinIO console → bucket `project-images` contains images
3. Click a project on the map → images display in the detail panel
4. Log in at `/admin` → review workflow works

---

## Useful commands

```bash
# View logs
docker compose logs -f backend

# Stop everything
docker compose down

# Stop and wipe all data (destructive)
docker compose down -v

# Restart a single service
docker compose restart backend

# Access PostgreSQL directly
docker compose exec db psql -U postgres -d panorama_sdg
```

---

## Notes

- Image URLs in the database point to `http://localhost:9000/project-images/...` (MinIO).
  If deploying behind a domain, update `MINIO_PUBLIC_URL` in `backend/.env` and re-run the
  image upload script to regenerate the URLs.
- The `data/seed/seed.sql` file contains personally identifiable information (contact emails).
  Do not commit it to version control — it is listed in `.gitignore`.
- MinIO data persists in the `minio_data` Docker volume. PostgreSQL data persists in `postgres_data`.
