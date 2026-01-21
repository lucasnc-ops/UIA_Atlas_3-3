# Environment Variables Setup

## 🔐 Vercel Backend Environment Variables

Add these in **Vercel Dashboard** → Your Backend Project → **Settings** → **Environment Variables**

### ✅ Required Variables

```bash
DATABASE_URL
postgresql://postgres:[YOUR-SUPABASE-PASSWORD]@db.ncdwmyovekpjehieonxl.supabase.co:5432/postgres

SECRET_KEY
atlas33-uia-sustainable-architecture-secret-key-2026-change-in-production

CORS_ORIGINS
https://atlas-33.vercel.app

FRONTEND_URL
https://atlas-33.vercel.app

ENVIRONMENT
production
```

### 📝 Optional Variables (have defaults)

```bash
ALGORITHM
HS256

ACCESS_TOKEN_EXPIRE_MINUTES
30

ADMIN_EMAIL
admin@uia.org
```

---

## 🎯 Vercel Frontend Environment Variables

Add these in **Vercel Dashboard** → Your Frontend Project → **Settings** → **Environment Variables**

```bash
VITE_API_URL
https://atlas33-backend.vercel.app

VITE_SUPABASE_URL
https://ncdwmyovekpjehieonxl.supabase.co

VITE_SUPABASE_ANON_KEY
[YOUR-SUPABASE-ANON-KEY]
```

---

## 📋 Where to Find Values

### DATABASE_URL Password
- Go to Supabase Dashboard → Settings → Database
- Find your database password
- Or reset it if you don't have it

### VITE_SUPABASE_ANON_KEY
- Go to Supabase Dashboard → Settings → API
- Copy the "anon public" key

### Backend URL
- After deploying backend to Vercel, you'll get a URL like:
- `https://atlas33-backend.vercel.app`
- Use this for `VITE_API_URL` in frontend

---

## ✅ Deployment Checklist

- [ ] Add all required backend env vars to Vercel
- [ ] Add all frontend env vars to Vercel
- [ ] Redeploy both backend and frontend in Vercel
- [ ] Test backend: https://atlas33-backend.vercel.app/health
- [ ] Test frontend: https://atlas-33.vercel.app
- [ ] Verify no CORS errors in browser console
- [ ] Verify map shows 22 projects

---

## 🔧 Quick Setup Commands

### Copy Environment Variables (Local Development)

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env and add your credentials

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env and add your API URL
```

---

## 📞 Support

If you get stuck:
1. Check Vercel deployment logs
2. Check browser console (F12) for errors
3. Verify all env vars are set correctly
4. Make sure no trailing slashes in URLs

---

**Security Note:** Never commit `.env` files or share credentials publicly!
