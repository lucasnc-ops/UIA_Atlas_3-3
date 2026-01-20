# Atlas 3+3 - Supabase Setup Guide

## 🎯 Quick Start

Your Atlas 3+3 project is ready to connect to Supabase! Follow these steps to set up your database with 22 real-world sustainable architecture projects from around the globe.

---

## 📊 Database Information

- **Project ID**: ncdwmyovekpjehieonxl
- **Database URL**: `https://ncdwmyovekpjehieonxl.supabase.co`
- **Region**: Configured
- **Connection**: Direct PostgreSQL connection on port 5432

---

## 🚀 Step-by-Step Setup

### Step 1: Run SQL Script in Supabase

1. **Open Supabase SQL Editor**
   - Go to your Supabase Dashboard: https://supabase.com/dashboard
   - Navigate to your project: `ncdwmyovekpjehieonxl`
   - Click on **SQL Editor** in the left sidebar

2. **Copy the SQL Script**
   - Open the file: `supabase_setup.sql` in this repository
   - Copy the entire contents (it's a large file with all 22 projects!)

3. **Paste and Execute**
   - Paste the SQL into the Supabase SQL Editor
   - Click **Run** or press `Ctrl/Cmd + Enter`
   - Wait for execution to complete (should take 10-30 seconds)

4. **Verify Success**
   - You should see success messages at the bottom
   - Check the summary showing:
     - 22 projects created
     - 1 admin user created
     - SDGs, typologies, requirements, and images inserted

### Step 2: Verify Database Tables

Go to **Table Editor** in Supabase and verify these tables exist:
- ✅ `projects` (22 rows)
- ✅ `users` (1 row - admin)
- ✅ `project_sdgs`
- ✅ `project_typologies`
- ✅ `project_requirements`
- ✅ `project_images`

### Step 3: Test Admin Login

**Default Admin Credentials:**
- **Email**: `admin@uia.org`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change this password after first login!

---

## 📁 What's Included in the Database

### 22 Worldwide Sustainable Architecture Projects

1. **Barcelona Superblocks** - Urban regeneration for livable streets (Spain)
2. **Medellín Library Parks** - Urban acupuncture in informal settlements (Colombia)
3. **Copenhagen District Heating** - City-wide renewable energy distribution (Denmark)
4. **Singapore Vertical Farming** - 30x30 food security initiative (Singapore)
5. **Kigali Master Plan** - Africa's model sustainable city (Rwanda)
6. **Vienna Social Housing** - 100 years of inclusive development (Austria)
7. **Curitiba BRT** - Pioneering sustainable urban mobility (Brazil)
8. **Freiburg Solar City** - Germany's renewable energy showcase (Germany)
9. **Portland Urban Growth Boundary** - 50 years of smart growth (USA)
10. **Bogotá Ciclovía** - Weekly car-free streets for 2M people (Colombia)
11. **Tokyo Disaster Preparedness** - Resilient megacity planning (Japan)
12. **Vancouver Olympic Village** - Carbon-neutral neighborhood (Canada)
13. **Cape Town Day Zero** - Water crisis management (South Africa)
14. **Seoul Digital Media City** - Technology hub regeneration (South Korea)
15. **Curitiba Green Exchange** - Waste-for-food program (Brazil)
16. **Vauban District** - Europe's most sustainable urban community (Germany)
17. **Portland Green Streets** - Sustainable stormwater management (USA)
18. **Cape Town New Water Programme** - Overcoming Day Zero crisis (South Africa)
19. **Malmö Western Harbour Bo01** - Climate-neutral urban district (Sweden)
20. **Addis Ababa Light Rail** - Sub-Saharan Africa's first LRT (Ethiopia)
21. **Masdar City** - Zero-carbon eco-city in the desert (UAE)
22. **Mexico City Rainwater Harvesting** - Cosecha de Lluvia program (Mexico)

### Project Data Includes:
- ✅ Complete project information (organization, contacts, location)
- ✅ Geographic coordinates (latitude/longitude) for mapping
- ✅ Funding details (needed and spent in USD)
- ✅ Brief and detailed descriptions
- ✅ Success factors
- ✅ Multiple SDGs (1-17) per project
- ✅ Project typologies (Infrastructure, Residential, etc.)
- ✅ Requirements (funding, government support, etc.)
- ✅ Project images (for select projects)
- ✅ UIA Region classification (Sections I-V)
- ✅ Workflow status (all APPROVED for immediate display)

---

## 🔧 Configuration Files

### Backend Configuration (`backend/.env`)
Already configured with:
```bash
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.ncdwmyovekpjehieonxl.supabase.co:5432/postgres
```

### Frontend Configuration (`frontend/.env`)
Already configured with:
```bash
VITE_SUPABASE_URL=https://ncdwmyovekpjehieonxl.supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
```

**Note:** The actual credentials are stored securely in the `.env` files (not committed to git).

✅ **No changes needed** - your environment files are ready!

---

## 🗺️ UIA Region Mapping

The database uses the UIA's 5 regional sections:

- **Section I**: Western Europe (Barcelona, Vienna, Copenhagen, Freiburg, Malmö)
- **Section II**: Eastern Europe
- **Section III**: Middle East & Africa (Kigali, Cape Town, Addis Ababa, Masdar City)
- **Section IV**: Asia & Pacific (Singapore, Tokyo, Seoul)
- **Section V**: Americas (Medellín, Curitiba, Portland, Vancouver, Bogotá, Mexico City)

---

## 🎨 Database Schema

### Main Tables

#### `projects`
Core project information including:
- Basic info (name, organization, contacts)
- Status (project_status, workflow_status)
- Location (city, country, lat/long, UIA region)
- Funding (needed, spent)
- Descriptions (brief, detailed, success factors)
- Timestamps (created_at, updated_at)

#### `project_sdgs`
Many-to-many relationship linking projects to UN SDGs (1-17)

#### `project_typologies`
Project categories: Infrastructure, Residential, Educational, etc.

#### `project_requirements`
What the project needs: funding, government support, technical expertise, etc.

#### `project_images`
Project photos with display order

#### `users`
Admin and reviewer accounts with role-based access

---

## 🧪 Testing the Setup

### 1. Test Database Connection

```bash
cd backend
python -c "from app.core.database import SessionLocal; db = SessionLocal(); print('✅ Connected to Supabase!'); db.close()"
```

### 2. List All Projects

```bash
cd backend
python list_projects.py
```

### 3. Start the Backend

```bash
cd backend
uvicorn app.main:app --reload
```

Visit: http://localhost:8000/docs

### 4. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit: http://localhost:5173

---

## 📈 Next Steps

### Immediate Actions:
1. ✅ Run the SQL script in Supabase SQL Editor
2. ✅ Verify tables and data in Supabase dashboard
3. ✅ Test admin login with `admin@uia.org` / `admin123`
4. ⚠️ Change the default admin password
5. ✅ Start the backend and frontend applications

### Optional Improvements:
- Set up Google reCAPTCHA keys for form protection
- Configure SendGrid for email notifications
- Add custom domain to Supabase project
- Enable Row Level Security (RLS) policies if needed
- Set up automated backups

---

## 🔒 Security Notes

1. **Change Default Password**: The admin password `admin123` should be changed immediately
2. **Environment Variables**: Never commit `.env` files to git (they are already in `.gitignore`)
3. **API Keys**: Keep your Supabase credentials secure and never expose them in public repositories
4. **Database Password**: Consider rotating your database password periodically for security
5. **Supabase Security**: Enable Row Level Security (RLS) policies for additional protection

---

## 🆘 Troubleshooting

### Connection Issues
- Verify the DATABASE_URL in `backend/.env`
- Check Supabase project status in dashboard
- Ensure your IP is not blocked (Supabase allows all IPs by default)

### SQL Script Errors
- If you see enum type errors, uncomment the DROP statements at the top of `supabase_setup.sql`
- Run the script again after dropping existing types

### Missing Projects
- Check the projects table: `SELECT COUNT(*) FROM projects;`
- Should return 22 rows
- If empty, re-run the SQL script

---

## 📞 Support

- **GitHub Issues**: https://github.com/aikiesan/atlas_33/issues
- **UIA Contact**: admin@uia.org
- **Supabase Docs**: https://supabase.com/docs

---

## 🌍 About Atlas 3+3

Atlas 3+3 is a global sustainable architecture mapping and database platform curated by the **Union of International Architects (UIA)**. The platform showcases architectural projects contributing to UN 2030 Sustainable Development Goals (SDGs) and enables public project submissions with an admin review workflow.

**Built with**:
- Frontend: React + TypeScript + Leaflet Maps
- Backend: FastAPI + Python
- Database: PostgreSQL (Supabase) + PostGIS
- Deployment: Vercel + Render + Supabase

---

**Ready to make architecture sustainable? Let's go! 🌱🏗️**
