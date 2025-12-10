# Atlas 3+3 - Deployment Guide

Complete guide for deploying Atlas 3+3 to free-tier services.

## Prerequisites

- GitHub account
- Supabase account (database)
- Render account (backend)
- Vercel account (frontend)
- SendGrid or Resend account (email - optional)

---

## 1. Database Setup (Supabase)

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a strong database password
3. Wait for project initialization (~2 minutes)

### Enable PostGIS Extension

1. In Supabase dashboard, go to **Database** → **Extensions**
2. Search for `postgis` and enable it
3. This allows geospatial queries for lat/long coordinates

### Get Connection String

1. Go to **Settings** → **Database**
2. Find **Connection string** → **URI**
3. Copy the connection string (format: `postgresql://postgres:[password]@[host]:5432/postgres`)
4. Save this for backend configuration

---

## 2. Backend Deployment (Render or Railway)

> **Note**: This guide covers both Render and Railway. Railway is recommended for better reliability and faster cold starts.

### Option A: Deploy on Railway (Recommended)

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Railway will auto-detect the backend in the `backend/` folder
5. Configure environment variables (see below)
6. Railway will automatically deploy

**Railway Environment Variables**:
```
DATABASE_URL=<your-supabase-connection-string>
SECRET_KEY=<generate-random-32+-character-string>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=<your-sendgrid-api-key>
SMTP_FROM_EMAIL=noreply@atlas33.org
SMTP_FROM_NAME=Atlas 3+3
ADMIN_EMAIL=admin@uia.org
FRONTEND_URL=<will-add-after-vercel-deployment>
CORS_ORIGINS=http://localhost:5173
CORS_ORIGIN_REGEX=https://.*\.vercel\.app
ENVIRONMENT=production
RECAPTCHA_SECRET_KEY=<your-recaptcha-secret>
```

**Important for CORS**: Set `CORS_ORIGIN_REGEX=https://.*\.vercel\.app` to allow all Vercel preview and production URLs.

### Option B: Deploy on Render

### Prepare Repository

1. Push your code to GitHub
2. Ensure `backend/` folder contains:
   - `requirements.txt`
   - `.env.example`
   - `app/` folder with all code
   - `alembic/` folder

### Create Web Service on Render

1. Go to [render.com](https://render.com) and sign in
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `atlas33-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free

### Add Environment Variables

In Render dashboard, add these environment variables:

```
DATABASE_URL=<your-supabase-connection-string>
SECRET_KEY=<generate-random-32+-character-string>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=<your-sendgrid-api-key>
SMTP_FROM_EMAIL=noreply@atlas33.org
SMTP_FROM_NAME=Atlas 3+3
ADMIN_EMAIL=admin@uia.org
FRONTEND_URL=<will-add-after-vercel-deployment>
CORS_ORIGINS=<will-add-after-vercel-deployment>
ENVIRONMENT=production
```

**Generate SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Deploy

1. Click **Create Web Service**
2. Wait for build and deployment (~5 minutes)
3. Note your backend URL: `https://atlas33-backend.onrender.com`

### Run Database Migrations

After first deployment, you need to run migrations:

**Option 1: Using Render Shell**
1. In Render dashboard, go to your service
2. Click **Shell** tab
3. Run:
   ```bash
   alembic upgrade head
   ```

**Option 2: From Local Machine**
1. Set DATABASE_URL environment variable locally
2. Run:
   ```bash
   cd backend
   alembic upgrade head
   ```

### Create Admin User

Using Render Shell or locally with DATABASE_URL:

```bash
python -c "
from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User, UserRole
import uuid

db = SessionLocal()
admin = User(
    id=uuid.uuid4(),
    email='admin@uia.org',
    hashed_password=get_password_hash('CHANGE_THIS_PASSWORD'),
    role=UserRole.ADMIN
)
db.add(admin)
db.commit()
print('Admin user created!')
"
```

---

## 3. Frontend Deployment (Vercel)

### Configure Environment Variables

1. In your local `frontend/.env`:
   ```
   VITE_API_URL=https://atlas33-backend.onrender.com
   ```

2. Commit and push to GitHub

### Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add **Environment Variables**:
   ```
   VITE_API_URL=https://atlas33-backend.onrender.com
   ```

6. Click **Deploy**
7. Wait for deployment (~2 minutes)
8. Note your frontend URL: `https://atlas33.vercel.app`

### Update Backend CORS

1. Go back to Render dashboard
2. Update environment variables:
   ```
   FRONTEND_URL=https://atlas33.vercel.app
   CORS_ORIGINS=https://atlas33.vercel.app
   ```
3. Render will automatically redeploy

---

## 4. Email Configuration (Optional)

### Option A: SendGrid (Recommended)

1. Create account at [sendgrid.com](https://sendgrid.com)
2. Go to **Settings** → **API Keys**
3. Create API key with "Mail Send" permissions
4. Add to Render environment variables:
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASSWORD=<your-sendgrid-api-key>
   ```
5. Verify sender email in SendGrid dashboard

### Option B: Resend

1. Create account at [resend.com](https://resend.com)
2. Get API key
3. Update environment variables:
   ```
   SMTP_HOST=smtp.resend.com
   SMTP_PORT=587
   SMTP_USER=resend
   SMTP_PASSWORD=<your-resend-api-key>
   ```

---

## 5. Testing Deployment

### Test Backend

Visit: `https://atlas33-backend.onrender.com/docs`

You should see the FastAPI interactive documentation.

### Test Frontend

Visit: `https://atlas33.vercel.app`

You should see the Atlas 3+3 landing page.

### Test Complete Flow

1. Go to frontend → Submit Project
2. Fill out and submit form
3. Check Render logs for email notification
4. Login to admin panel
5. Approve the project
6. Verify it appears on dashboard

---

## 6. Custom Domain (Optional)

### Add Custom Domain to Vercel

1. In Vercel project settings → **Domains**
2. Add your domain (e.g., `atlas33.org`)
3. Update DNS records as instructed by Vercel

### Add Custom Domain to Render

1. In Render service → **Settings** → **Custom Domain**
2. Add `api.atlas33.org`
3. Update DNS with CNAME record

### Update Environment Variables

Update CORS and frontend URLs to use custom domains.

---

## 7. Monitoring & Maintenance

### Render Free Tier Limitations

- Free services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- 750 hours/month (enough for 1 service running 24/7)

**Workaround**: Use a cron job or UptimeRobot to ping your backend every 10 minutes

### Supabase Free Tier

- 500 MB database storage
- 2 GB bandwidth
- Pauses after 7 days of inactivity

### Vercel Free Tier

- 100 GB bandwidth/month
- Unlimited websites
- Automatic HTTPS

### Backups

Set up automated backups in Supabase:
1. Go to **Database** → **Backups**
2. Free tier includes daily backups (7 days retention)

---

## 8. Environment Variables Summary

### Backend (Render)

```bash
DATABASE_URL=postgresql://...
SECRET_KEY=<random-32+-chars>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=<api-key>
SMTP_FROM_EMAIL=noreply@atlas33.org
SMTP_FROM_NAME=Atlas 3+3
ADMIN_EMAIL=admin@uia.org
FRONTEND_URL=https://atlas33.vercel.app
CORS_ORIGINS=https://atlas33.vercel.app
ENVIRONMENT=production
```

### Frontend (Vercel)

```bash
VITE_API_URL=https://atlas33-backend.onrender.com
```

---

## 9. Troubleshooting

### Backend won't start

- Check Render logs for errors
- Verify DATABASE_URL is correct
- Ensure migrations ran successfully

### CORS errors

**Symptoms**: Console shows "blocked by CORS policy: No 'Access-Control-Allow-Origin' header"

**Solutions**:

1. **For single production URL**: Set `CORS_ORIGINS` to include your frontend URL
   ```
   CORS_ORIGINS=https://atlas33.vercel.app
   ```

2. **For multiple URLs** (production + preview deployments): Use comma-separated list
   ```
   CORS_ORIGINS=https://atlas33.vercel.app,https://atlas33-preview.vercel.app
   ```

3. **For all Vercel preview URLs**: Use regex pattern (recommended for Vercel)
   ```
   CORS_ORIGIN_REGEX=https://.*\.vercel\.app
   ```
   This allows all Vercel deployments (production + all preview URLs)

4. **For specific project previews only**:
   ```
   CORS_ORIGIN_REGEX=https://atlas-33-.*\.vercel\.app
   ```

**Important**:
- No trailing slashes in URLs
- Must include protocol (https://)
- Changes require backend redeploy/restart
- Test with browser DevTools → Network tab

### Database connection errors

- Verify Supabase project is active
- Check DATABASE_URL format
- Ensure PostGIS extension is enabled

### Frontend can't reach backend

- Check VITE_API_URL is correct
- Verify backend is running (check Render dashboard)
- Test backend /health endpoint

---

## 10. Production Checklist

- [ ] Database created and PostGIS enabled
- [ ] Backend deployed on Render
- [ ] Alembic migrations run
- [ ] Admin user created
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] Email service configured and tested
- [ ] CORS configured correctly
- [ ] Test project submission flow
- [ ] Test admin review workflow
- [ ] Test dashboard filters
- [ ] Test map markers
- [ ] Set up monitoring (optional)
- [ ] Configure custom domain (optional)

---

## Support

For issues or questions:
- Check logs in Render dashboard
- Check browser console for frontend errors
- Verify all environment variables are set
- Ensure database migrations are up to date

## Estimated Costs

All services on free tier: **$0/month**

Optional upgrades:
- Render Starter: $7/month (no sleep)
- Supabase Pro: $25/month (8 GB storage)
- Vercel Pro: $20/month (more bandwidth)
