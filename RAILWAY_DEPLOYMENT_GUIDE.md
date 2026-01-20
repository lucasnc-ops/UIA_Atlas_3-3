# Railway Deployment Configuration Guide

## 🚨 URGENT: Fix CORS Error

Your frontend is being blocked by CORS because Railway doesn't have the environment variables configured.

---

## 🔧 Step-by-Step Fix

### 1. Go to Railway Dashboard

1. Visit: https://railway.app/dashboard
2. Find your project: `atlas33-production`
3. Click on your backend service

### 2. Add Environment Variables

Go to **Variables** tab and add ALL of these:

#### Required Variables:

```bash
# Database - Supabase
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.ncdwmyovekpjehieonxl.supabase.co:5432/postgres

# Security
SECRET_KEY=atlas33-uia-sustainable-architecture-secret-key-2026-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# Email Configuration
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
SMTP_FROM_EMAIL=noreply@atlas33.org
SMTP_FROM_NAME=Atlas 3+3

# Admin
ADMIN_EMAIL=admin@uia.org

# Frontend URL
FRONTEND_URL=https://atlas-33.vercel.app

# CORS - CRITICAL FOR FIXING THE ERROR!
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,https://atlas-33.vercel.app
CORS_ORIGIN_REGEX=https://.*\.vercel\.app

# Environment
ENVIRONMENT=production
```

### 3. Replace Placeholders

- Replace `[YOUR-PASSWORD]` with your actual Supabase password
- Update `RECAPTCHA_SECRET_KEY` if you have one
- Update `SMTP_PASSWORD` if you're using SendGrid

### 4. Deploy

After adding variables:
1. Railway will automatically redeploy
2. Wait 2-3 minutes for deployment to complete
3. Test your frontend at https://atlas-33.vercel.app/dashboard

---

## ✅ Verify CORS Configuration

After deployment, test the CORS configuration:

### Method 1: Debug Endpoint
Visit: https://atlas33-production.up.railway.app/debug/cors

You should see:
```json
{
  "cors_origins": [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://atlas-33.vercel.app"
  ],
  "cors_origin_regex": "https://.*\\.vercel\\.app",
  "environment": "production"
}
```

### Method 2: Health Check
Visit: https://atlas33-production.up.railway.app/health

Should return:
```json
{
  "status": "healthy"
}
```

### Method 3: Test API Docs
Visit: https://atlas33-production.up.railway.app/docs

You should see the FastAPI Swagger documentation.

---

## 🗄️ Verify Database Connection

After configuring Railway, verify the database has data:

### Check Projects Count

Visit: https://atlas33-production.up.railway.app/api/dashboard/kpis

Should return something like:
```json
{
  "total_projects": 22,
  "approved_projects": 22,
  "countries_count": 18,
  "cities_count": 20,
  ...
}
```

If you get 0 projects, the DATABASE_URL might be incorrect.

---

## 🎯 Expected Results

After fixing Railway configuration:

### Frontend (https://atlas-33.vercel.app/dashboard)
- ✅ No more CORS errors in console
- ✅ Map loads with 22 project markers
- ✅ Filters work (regions, SDGs, cities)
- ✅ Dashboard KPIs show correct numbers
- ✅ Charts display data

### Backend (https://atlas33-production.up.railway.app)
- ✅ `/health` endpoint returns healthy
- ✅ `/docs` shows API documentation
- ✅ `/debug/cors` shows correct CORS config
- ✅ `/api/dashboard/kpis` returns project data

---

## 🚨 Common Issues

### Issue 1: Still Getting CORS Errors

**Solution:**
1. Verify `CORS_ORIGINS` includes: `https://atlas-33.vercel.app` (exact match!)
2. Check Railway deployment logs for errors
3. Ensure Railway redeployed after adding variables
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue 2: Database Connection Error

**Solution:**
1. Verify `DATABASE_URL` in Railway matches your Supabase credentials
2. Check Supabase is not paused (free tier pauses after inactivity)
3. Verify Supabase firewall allows Railway's IP (usually allowed by default)

### Issue 3: 0 Projects Returned

**Solution:**
1. Re-run the SQL script in Supabase SQL Editor
2. Verify tables exist in Supabase Table Editor
3. Check `SELECT COUNT(*) FROM projects;` in Supabase SQL Editor
4. Should return 22

---

## 📊 Environment Variables Checklist

Use this to verify all variables are set in Railway:

- [ ] `DATABASE_URL` - Supabase PostgreSQL connection string
- [ ] `SECRET_KEY` - For JWT token generation
- [ ] `ALGORITHM` - HS256
- [ ] `ACCESS_TOKEN_EXPIRE_MINUTES` - 30
- [ ] `RECAPTCHA_SECRET_KEY` - reCAPTCHA key (or placeholder)
- [ ] `SMTP_HOST` - smtp.sendgrid.net
- [ ] `SMTP_PORT` - 587
- [ ] `SMTP_USER` - apikey
- [ ] `SMTP_PASSWORD` - SendGrid API key (or placeholder)
- [ ] `SMTP_FROM_EMAIL` - noreply@atlas33.org
- [ ] `SMTP_FROM_NAME` - Atlas 3+3
- [ ] `ADMIN_EMAIL` - admin@uia.org
- [ ] `FRONTEND_URL` - https://atlas-33.vercel.app
- [ ] `CORS_ORIGINS` - **CRITICAL** - Must include https://atlas-33.vercel.app
- [ ] `CORS_ORIGIN_REGEX` - https://.*\\.vercel\\.app
- [ ] `ENVIRONMENT` - production

---

## 🔍 Testing After Fix

### 1. Open Browser Console
1. Go to https://atlas-33.vercel.app/dashboard
2. Open DevTools (F12)
3. Go to Console tab
4. Refresh page (Ctrl+R)

**Expected:** No CORS errors, data loads successfully

### 2. Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Filter by "XHR" or "Fetch"

**Expected:** All API calls return 200 OK status

### 3. Verify Map
1. Dashboard should show map with markers
2. Click on markers to see project details
3. Use filters to filter by region/SDG

---

## 🎉 Success Indicators

You'll know it's working when:

1. ✅ Dashboard loads without errors
2. ✅ Map shows 22 project markers around the world
3. ✅ KPI cards show numbers (not 0)
4. ✅ Filters work
5. ✅ Charts display data
6. ✅ No red errors in browser console

---

## 📞 Still Having Issues?

If you're still seeing CORS errors after following this guide:

1. **Check Railway Logs:**
   - Go to Railway dashboard
   - Click on your service
   - View "Deployments" tab
   - Check latest deployment logs
   - Look for CORS configuration messages

2. **Verify Environment Variables:**
   - Go to Variables tab in Railway
   - Ensure all variables are present
   - Check for typos (especially in CORS_ORIGINS)

3. **Test Backend Directly:**
   - Visit: https://atlas33-production.up.railway.app/debug/cors
   - Should show your CORS configuration

4. **Hard Refresh Frontend:**
   - Clear browser cache
   - Hard refresh (Ctrl+Shift+F5)
   - Try incognito/private window

---

## 🔄 Alternative: Render Deployment

If Railway continues to have issues, you can also deploy to Render (mentioned in your repo):

The backend URL in `.env` files is:
- Current: `https://atlas33-production.up.railway.app`
- Alternative: `https://atlas-33.onrender.com`

Same environment variables apply to Render.

---

**Good luck! Your Atlas 3+3 platform will be live soon! 🌍🏗️**
