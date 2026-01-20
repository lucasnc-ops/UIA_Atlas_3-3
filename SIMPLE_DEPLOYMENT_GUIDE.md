# Simple Deployment Guide - Vercel + Supabase Only

## 🎯 Overview

This guide will help you deploy Atlas 3+3 using only:
- **Supabase**: Database (PostgreSQL)
- **Vercel**: Frontend + Backend (serverless functions)

**No Railway needed!** Everything in one place.

---

## ✅ Prerequisites

1. Supabase account (https://supabase.com) - ✅ Already done
2. Vercel account (https://vercel.com) - ✅ Already have frontend deployed
3. GitHub repository - ✅ Already have it

---

## 📋 Step 1: Supabase Setup (Already Done!)

✅ You've already completed this:
- SQL script ran successfully
- Database has 22 projects
- Tables created with 4 images

---

## 📋 Step 2: Deploy Backend to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click **"Add New..."** → **"Project"**

2. **Import Repository**
   - Select your GitHub repository: `aikiesan/atlas_33`
   - Click **"Import"**

3. **Configure Project**
   - **Project Name**: `atlas33-backend` (or any name you like)
   - **Framework Preset**: Select "Other"
   - **Root Directory**: Click **"Edit"** → Set to `backend`
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty

4. **Add Environment Variables**

   Click **"Environment Variables"** and add these:

   ```bash
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.ncdwmyovekpjehieonxl.supabase.co:5432/postgres
   SECRET_KEY=atlas33-uia-sustainable-architecture-secret-key-2026-change-in-production
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASSWORD=your_sendgrid_api_key
   SMTP_FROM_EMAIL=noreply@atlas33.org
   SMTP_FROM_NAME=Atlas 3+3
   ADMIN_EMAIL=admin@uia.org
   FRONTEND_URL=https://atlas-33.vercel.app
   CORS_ORIGINS=http://localhost:5173,http://localhost:3000,https://atlas-33.vercel.app
   CORS_ORIGIN_REGEX=https://.*\.vercel\.app
   ENVIRONMENT=production
   ```

   **Don't forget to replace:**
   - `[YOUR-PASSWORD]` with your Supabase password

5. **Deploy**
   - Click **"Deploy"**
   - Wait 2-3 minutes for deployment
   - You'll get a URL like: `https://atlas33-backend.vercel.app`

### Option B: Deploy via Vercel CLI (Advanced)

```bash
# Install Vercel CLI
npm i -g vercel

# Go to backend directory
cd backend

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Follow prompts and add environment variables when asked
```

---

## 📋 Step 3: Update Frontend Configuration

### 3.1 Update Frontend Environment Variables

1. **Go to Frontend Project in Vercel**
   - Visit: https://vercel.com/dashboard
   - Find your frontend project: `atlas-33`
   - Go to **Settings** → **Environment Variables**

2. **Update VITE_API_URL**
   - Find the `VITE_API_URL` variable
   - Change it to your new backend URL: `https://atlas33-backend.vercel.app`
   - Or whatever URL Vercel gave you for the backend

3. **Redeploy Frontend**
   - Go to **Deployments** tab
   - Click on latest deployment
   - Click **"Redeploy"**
   - Or just push a new commit to trigger auto-deploy

### 3.2 Alternative: Update via GitHub

1. **Update `.env` file in repository** (Optional - for local development)
   ```bash
   # frontend/.env
   VITE_API_URL=https://atlas33-backend.vercel.app
   ```

2. **Push changes**
   ```bash
   git add frontend/.env
   git commit -m "Update API URL to Vercel backend"
   git push
   ```

---

## 📋 Step 4: Verify Everything Works

### 4.1 Test Backend

1. **Health Check**
   - Visit: `https://atlas33-backend.vercel.app/health`
   - Should return: `{"status": "healthy"}`

2. **API Documentation**
   - Visit: `https://atlas33-backend.vercel.app/docs`
   - Should show Swagger UI with all endpoints

3. **CORS Configuration**
   - Visit: `https://atlas33-backend.vercel.app/debug/cors`
   - Should show your CORS settings

4. **Test KPIs Endpoint**
   - Visit: `https://atlas33-backend.vercel.app/api/dashboard/kpis`
   - Should return JSON with 22 projects

### 4.2 Test Frontend

1. **Open Dashboard**
   - Visit: https://atlas-33.vercel.app/dashboard
   - Open DevTools (F12) → Console tab

2. **Check for Errors**
   - ✅ No CORS errors
   - ✅ No 404 errors
   - ✅ Map loads with markers
   - ✅ Filters work

3. **Verify Data Loads**
   - KPI cards show numbers (not zeros)
   - Map has 22 project markers
   - Charts display data
   - Filters update the map

---

## 🎉 Success Checklist

- [ ] Supabase database has 22 projects
- [ ] Backend deployed to Vercel successfully
- [ ] Backend health check returns "healthy"
- [ ] Backend API docs accessible at `/docs`
- [ ] Frontend environment updated with backend URL
- [ ] Frontend redeployed
- [ ] Dashboard loads without CORS errors
- [ ] Map shows 22 project markers
- [ ] Filters work correctly
- [ ] Admin login works (`admin@uia.org` / `admin123`)

---

## 🔧 Troubleshooting

### Issue: CORS Error Still Appears

**Solution:**
1. Check backend environment variable `CORS_ORIGINS` includes `https://atlas-33.vercel.app`
2. Redeploy backend after adding variables
3. Clear browser cache and hard refresh (Ctrl+Shift+R)
4. Check backend `/debug/cors` endpoint

### Issue: Backend Returns 0 Projects

**Solution:**
1. Check `DATABASE_URL` in backend Vercel environment variables
2. Verify it matches your Supabase credentials
3. Re-run SQL script in Supabase SQL Editor
4. Check Supabase is not paused (free tier pauses after inactivity)

### Issue: Frontend Can't Connect to Backend

**Solution:**
1. Verify `VITE_API_URL` in frontend Vercel environment variables
2. Check backend URL is correct (no trailing slash)
3. Test backend URL directly in browser
4. Redeploy frontend after updating variables

### Issue: Vercel Build Fails

**Solution:**
1. Check build logs in Vercel dashboard
2. Verify `backend/requirements.txt` exists
3. Ensure `backend/vercel_app.py` exists
4. Check Python version compatibility (3.11)

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  User Browser                                   │
│                                                 │
└────────────────┬────────────────────────────────┘
                 │
                 │ HTTPS
                 ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│  Vercel - Frontend (React + TypeScript)        │
│  https://atlas-33.vercel.app                   │
│                                                 │
└────────────────┬────────────────────────────────┘
                 │
                 │ API Calls
                 ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│  Vercel - Backend (FastAPI Serverless)         │
│  https://atlas33-backend.vercel.app            │
│                                                 │
└────────────────┬────────────────────────────────┘
                 │
                 │ PostgreSQL
                 ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│  Supabase - PostgreSQL Database                │
│  https://ncdwmyovekpjehieonxl.supabase.co      │
│                                                 │
│  - 22 Projects                                  │
│  - SDGs, Typologies, Requirements              │
│  - PostGIS for geographic queries              │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 💰 Cost Breakdown

### Free Tier Limits

**Supabase (Free)**
- 500 MB database
- 2 GB bandwidth/month
- Pauses after 1 week of inactivity
- **Current usage**: ~5 MB (22 projects)
- ✅ Well within limits!

**Vercel (Free)**
- 100 GB bandwidth/month
- Unlimited serverless functions
- 100 builds/month
- Commercial use allowed
- **Current usage**: Minimal
- ✅ Perfect for prototype!

**Total Monthly Cost**: $0.00 🎉

---

## 🚀 Optional Improvements

Once your prototype is working:

### 1. Custom Domain
- Add custom domain in Vercel settings
- Update CORS_ORIGINS to include new domain

### 2. SendGrid Email
- Sign up for SendGrid free tier
- Add SendGrid API key to environment variables
- Test email notifications

### 3. Google reCAPTCHA
- Create reCAPTCHA keys at https://www.google.com/recaptcha
- Add keys to environment variables
- Protect project submission form

### 4. Analytics
- Add Google Analytics or PostHog
- Track user engagement
- Monitor project submissions

### 5. Monitoring
- Set up Sentry for error tracking
- Configure Vercel analytics
- Monitor API performance

---

## 📞 Need Help?

**Backend URL Format:**
- Should be: `https://your-backend-name.vercel.app`
- No `/api` at the end
- No trailing slash

**Frontend Environment Variable:**
```bash
VITE_API_URL=https://atlas33-backend.vercel.app
```

**Backend CORS Variable:**
```bash
CORS_ORIGINS=https://atlas-33.vercel.app,https://your-custom-domain.com
```

---

## ✅ Final Checklist Before Going Live

- [ ] Change admin password from `admin123`
- [ ] Add Google reCAPTCHA (optional but recommended)
- [ ] Configure SendGrid for emails (optional)
- [ ] Test all features thoroughly
- [ ] Test on mobile devices
- [ ] Check accessibility
- [ ] Verify all 22 projects display correctly
- [ ] Test filters and search
- [ ] Test project submission form
- [ ] Test admin review workflow

---

**You're all set! Your Atlas 3+3 platform is now live on Vercel + Supabase! 🌍🏗️✨**
