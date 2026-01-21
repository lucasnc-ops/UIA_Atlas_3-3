# 🚀 Atlas 3+3 - Complete Vercel + Supabase Deployment

## ✅ What You Have

- ✅ **Database**: Supabase with 22 projects loaded
- ✅ **Frontend**: Deployed on Vercel at `https://atlas-33.vercel.app`
- ✅ **Backend**: Ready to deploy on Vercel with Mangum adapter

---

## 🔧 **CRITICAL FIX APPLIED**

I just added **Mangum** - the adapter that makes FastAPI work in Vercel serverless!

The backend will now work properly. Just need to **merge and redeploy**.

---

## 📋 Step-by-Step Deployment

### Step 1: Merge the Fix to Main

```bash
git checkout main
git merge claude/supabase-integration-c7PqO
git push origin main
```

Or create a PR on GitHub and merge it.

### Step 2: Redeploy Backend

1. **Go to Vercel**: https://vercel.com/dashboard
2. **Find your backend project**: `atlas33-backend`
3. **Go to Deployments**
4. **Wait for auto-deploy** (it triggers when you push to main)
   - OR click **"Redeploy"** manually

### Step 3: Verify Backend Works

After deployment (2-3 minutes), test these URLs:

1. **Health**: https://atlas33-backend.vercel.app/health
   - Should return: `{"status": "healthy"}`

2. **API Docs**: https://atlas33-backend.vercel.app/docs
   - Should show Swagger UI

3. **Get Projects**: https://atlas33-backend.vercel.app/api/dashboard/kpis
   - Should return JSON with `total_projects: 22`

### Step 4: Update Frontend Environment

1. **Go to frontend project** in Vercel: `atlas-33`
2. **Settings** → **Environment Variables**
3. **Find or Add** `VITE_API_URL`:
   ```
   VITE_API_URL=https://atlas33-backend.vercel.app
   ```
4. **Redeploy** frontend

### Step 5: Test Complete Stack

Visit: https://atlas-33.vercel.app/dashboard

**Expected Results:**
- ✅ No CORS errors in console (F12)
- ✅ Map loads with 22 project markers
- ✅ Filters work
- ✅ KPI cards show correct numbers
- ✅ Charts display data

---

## ⚡ What Changed

### Before (Broken):
```python
# vercel_app.py
from app.main import app
handler = app  # ❌ Doesn't work in serverless!
```

### After (Fixed):
```python
# vercel_app.py
from mangum import Mangum
from app.main import app
handler = Mangum(app, lifespan="off")  # ✅ Works in serverless!
```

**Mangum** wraps FastAPI to work with serverless platforms like Vercel.

---

## 📊 Your Complete Stack

```
┌─────────────────────────────────────┐
│  User Browser                       │
└────────────┬────────────────────────┘
             │
             │ HTTPS
             ▼
┌─────────────────────────────────────┐
│  Vercel - Frontend                  │
│  atlas-33.vercel.app               │
│  React + TypeScript + Leaflet Maps │
└────────────┬────────────────────────┘
             │
             │ API Calls
             ▼
┌─────────────────────────────────────┐
│  Vercel - Backend (Serverless)     │
│  atlas33-backend.vercel.app        │
│  FastAPI + Mangum + Python 3.12    │
└────────────┬────────────────────────┘
             │
             │ PostgreSQL
             ▼
┌─────────────────────────────────────┐
│  Supabase - Database                │
│  ncdwmyovekpjehieonxl.supabase.co  │
│  PostgreSQL + PostGIS               │
│  22 Projects Ready!                 │
└─────────────────────────────────────┘
```

---

## ✅ Required Environment Variables

### Backend (Vercel - atlas33-backend)

**Minimum Required:**
```bash
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.ncdwmyovekpjehieonxl.supabase.co:5432/postgres
SECRET_KEY=atlas33-uia-sustainable-architecture-secret-key-2026
CORS_ORIGINS=https://atlas-33.vercel.app
FRONTEND_URL=https://atlas-33.vercel.app
ENVIRONMENT=production
```

**Optional (have defaults):**
```bash
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
RECAPTCHA_SECRET_KEY=placeholder
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=placeholder
SMTP_FROM_EMAIL=noreply@atlas33.org
SMTP_FROM_NAME=Atlas 3+3
ADMIN_EMAIL=admin@uia.org
```

### Frontend (Vercel - atlas-33)

```bash
VITE_API_URL=https://atlas33-backend.vercel.app
VITE_SUPABASE_URL=https://ncdwmyovekpjehieonxl.supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
VITE_RECAPTCHA_SITE_KEY=your-site-key
```

---

## 🎯 Quick Checklist

- [ ] Merge `claude/supabase-integration-c7PqO` to `main`
- [ ] Backend auto-deploys on Vercel
- [ ] Test backend: `/health`, `/docs`, `/api/dashboard/kpis`
- [ ] Update frontend `VITE_API_URL` env variable
- [ ] Redeploy frontend
- [ ] Test dashboard at https://atlas-33.vercel.app/dashboard
- [ ] Verify no CORS errors in console
- [ ] Verify map shows 22 projects
- [ ] Test filters and search
- [ ] Ready to present! 🎉

---

## 🚨 Troubleshooting

### Backend Still Crashes

**Check:**
1. Did you merge and push to `main`?
2. Did Vercel redeploy? (Check deployments tab)
3. Are `DATABASE_URL` and `SECRET_KEY` set in Vercel env vars?
4. Check logs in Vercel deployment

**Solution:** Redeploy backend manually in Vercel

### CORS Errors Still Appear

**Check:**
1. Backend `CORS_ORIGINS` includes `https://atlas-33.vercel.app`
2. No trailing slash in URL
3. Backend is responding (test `/health` endpoint)

**Solution:** Update `CORS_ORIGINS` and redeploy

### Frontend Can't Connect

**Check:**
1. `VITE_API_URL` in frontend Vercel env vars
2. Backend URL is correct
3. No trailing slash in `VITE_API_URL`

**Solution:** Update env var and redeploy frontend

### 0 Projects Showing

**Check:**
1. Did you run the SQL script in Supabase?
2. Is `DATABASE_URL` correct in backend?
3. Test: https://atlas33-backend.vercel.app/api/dashboard/kpis

**Solution:** Re-run `supabase_setup.sql` in Supabase SQL Editor

---

## 💰 Cost

- **Vercel Frontend**: Free (100 GB bandwidth/month)
- **Vercel Backend**: Free (100 GB bandwidth, serverless functions)
- **Supabase**: Free (500 MB database, 2 GB bandwidth)

**Total: $0/month** 🎉

---

## 🎨 Features

- ✅ Interactive world map with 22 sustainable architecture projects
- ✅ SDG-based color-coded markers
- ✅ Advanced filtering (region, SDG, city, country)
- ✅ Smart search
- ✅ Project details with images
- ✅ Analytics dashboard with charts
- ✅ KPI cards with animated counters
- ✅ Admin review workflow
- ✅ Public project submission form
- ✅ Responsive design
- ✅ Dark/Light map modes
- ✅ Export to CSV/Excel

---

## 📞 Support

**Stuck?** Check:
1. **Vercel logs**: Deployment → Click deployment → View logs
2. **Browser console**: F12 → Console tab
3. **Network tab**: F12 → Network → Check API calls

**Backend URL format:**
- ✅ Correct: `https://atlas33-backend.vercel.app`
- ❌ Wrong: `https://atlas33-backend.vercel.app/`
- ❌ Wrong: `https://atlas33-backend.vercel.app/api`

---

## 🎉 Success!

Once everything is deployed:

1. **Share the link**: https://atlas-33.vercel.app
2. **Admin login**: `admin@uia.org` / `admin123`
3. **Show off your 22 worldwide projects**!
4. **Present with confidence** 💪

---

**Your Atlas 3+3 platform is ready to showcase sustainable architecture around the world! 🌍🏗️✨**
