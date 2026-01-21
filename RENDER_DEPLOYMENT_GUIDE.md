# Deploy Backend to Render (Recommended!)

## Why Render Instead of Vercel?

**Vercel** is excellent for:
- ✅ Frontend (React, Next.js)
- ✅ Serverless functions
- ❌ Full FastAPI apps (requires complex adapters)

**Render** is excellent for:
- ✅ FastAPI / Python backends (native support!)
- ✅ Free tier (no credit card required)
- ✅ Automatic HTTPS
- ✅ Easy environment variables
- ✅ Works out of the box

---

## 🚀 Deploy to Render in 5 Minutes

### Step 1: Create Render Account

1. Go to https://render.com
2. Click **"Get Started"**
3. Sign up with GitHub (easiest option)

### Step 2: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `aikiesan/atlas_33`
3. Render will auto-detect the `render.yaml` configuration

### Step 3: Configure Service

Render should auto-fill from `render.yaml`, but verify:

- **Name**: `atlas33-backend` (or any name you like)
- **Region**: Oregon (Free) or choose closest to you
- **Branch**: `main`
- **Root Directory**: Leave empty (we specify in commands)
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Plan**: **Free**

### Step 4: Add Environment Variables

Click **"Advanced"** and add these environment variables:

```
DATABASE_URL=postgresql://postgres:iVaTiAoBc0XSSVym@db.ncdwmyovekpjehieonxl.supabase.co:5432/postgres

SECRET_KEY=atlas33-uia-sustainable-architecture-secret-key-2026-change-in-production

CORS_ORIGINS=https://atlas-33.vercel.app

FRONTEND_URL=https://atlas-33.vercel.app

ENVIRONMENT=production
```

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. You'll get a URL like: `https://atlas33-backend.onrender.com`

### Step 6: Update Frontend

1. Go to Vercel → Your frontend project
2. Settings → Environment Variables
3. Update `VITE_API_URL` to: `https://atlas33-backend.onrender.com`
4. Redeploy frontend

---

## ✅ Verify It Works

After deployment, test these URLs:

1. **Health Check**: https://atlas33-backend.onrender.com/health
   - Should return: `{"status": "healthy"}`

2. **API Docs**: https://atlas33-backend.onrender.com/docs
   - Should show Swagger UI

3. **Get Projects**: https://atlas33-backend.onrender.com/api/dashboard/kpis
   - Should return JSON with 22 projects

4. **Frontend**: https://atlas-33.vercel.app/dashboard
   - Should load without CORS errors
   - Map should show 22 project markers

---

## 📊 Architecture

```
┌─────────────────────────────────┐
│  Frontend (Vercel)              │
│  atlas-33.vercel.app           │
└────────────┬────────────────────┘
             │
             │ API Calls
             ▼
┌─────────────────────────────────┐
│  Backend (Render)               │
│  atlas33-backend.onrender.com  │
│  FastAPI + Uvicorn             │
└────────────┬────────────────────┘
             │
             │ SQL Queries
             ▼
┌─────────────────────────────────┐
│  Database (Supabase)            │
│  ncdwmyovekpjehieonxl          │
│  22 Projects Ready!             │
└─────────────────────────────────┘
```

---

## 💰 Cost

- **Frontend (Vercel)**: Free
- **Backend (Render)**: Free
- **Database (Supabase)**: Free

**Total: $0/month** 🎉

---

## ⚡ Free Tier Limits

### Render Free Tier:
- 750 hours/month (enough for 24/7 uptime)
- ⚠️ **Spins down after 15 minutes of inactivity**
- First request after sleep takes ~30 seconds
- 100 GB bandwidth/month
- More than enough for prototype!

### To Keep It Active:
- Use a service like **UptimeRobot** (free) to ping your backend every 5 minutes
- Or upgrade to paid plan ($7/month) for always-on

---

## 🔧 Troubleshooting

### Build Fails

**Check build logs in Render dashboard:**
- Verify `backend/requirements.txt` exists
- Check for Python version issues

**Solution:** Render auto-detects Python version from code

### Service Won't Start

**Check deploy logs:**
- Look for import errors
- Check DATABASE_URL is set correctly

**Solution:** Verify all environment variables are set

### CORS Errors

**Check CORS_ORIGINS environment variable:**
- Should be: `https://atlas-33.vercel.app`
- No trailing slash!

**Test:** Visit `/debug/cors` endpoint to see configuration

### 0 Projects Returned

**Database not connected:**
- Verify DATABASE_URL in environment variables
- Check Supabase is not paused
- Re-run SQL script in Supabase if needed

---

## 🎯 Expected Results

After successful deployment:

### Backend Endpoints Work:
- ✅ `/health` returns `{"status": "healthy"}`
- ✅ `/docs` shows API documentation
- ✅ `/api/dashboard/kpis` returns project data
- ✅ `/api/dashboard/map-markers` returns 22 projects

### Frontend Works:
- ✅ No CORS errors in console
- ✅ Dashboard loads with data
- ✅ Map shows 22 markers
- ✅ Filters work correctly
- ✅ Charts display data

---

## 🚀 Auto-Deploy

Render automatically deploys when you push to `main`:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Render will:
1. Detect the push
2. Rebuild the service
3. Deploy automatically
4. Show logs in real-time

---

## 🔄 Alternative: Keep Using Railway

If you already have Railway set up, you can use that instead:

1. Your backend URL: `https://atlas33-production.up.railway.app`
2. Make sure all environment variables are set in Railway
3. Update frontend `VITE_API_URL` to Railway URL

Both Render and Railway work great with FastAPI!

---

## 📞 Summary

**Recommended Stack:**
- Frontend: Vercel ✅
- Backend: **Render** ✅ (or Railway)
- Database: Supabase ✅

**Why?**
- All free tiers
- FastAPI works natively on Render
- No complex serverless adapters needed
- Automatic deployments
- Easy to use

**Vercel is great for frontend, but use Render/Railway for FastAPI backends!**

---

Ready to deploy? Follow the steps above and your backend will be live in 5 minutes! 🚀
