# Deploying Images to Production

## Problem
Production database has external Unsplash URLs, but we want to use local images from `/project_images/` folder.

## Solution

### Step 1: Upload Images to Frontend
The images in `frontend/public/project_images/` need to be deployed with your frontend on Vercel.

✅ **Already done!** When you deploy to Vercel, all files in `public/` are automatically served.

Images will be accessible at:
```
https://your-app.vercel.app/project_images/barcelona_super_blocks.jpg
https://your-app.vercel.app/project_images/city_of_kigali.jpg
```

### Step 2: Update Production Database

You have two options:

#### Option A: Run Script Locally (Recommended)

1. **Update your backend `.env` to use production database:**
```bash
# Temporarily change DATABASE_URL to production (Supabase)
DATABASE_URL=postgresql://postgres.xyz:password@aws.pooler.supabase.com:5432/postgres
```

2. **Run the seeding script:**
```bash
cd backend
python scripts/seed_production_images.py
```

3. **Verify results:**
```bash
# Check that images were added
python -c "
from app.core.database import SessionLocal
from app.models.project import Project, ProjectImage

db = SessionLocal()
count = db.query(Project).join(ProjectImage).distinct().count()
total = db.query(Project).count()
print(f'Projects with images: {count}/{total}')
db.close()
"
```

4. **Restore local DATABASE_URL:**
```bash
# Change back to local SQLite
DATABASE_URL=sqlite:///./projects.db
```

#### Option B: Run Script on Railway

1. **SSH into Railway container:**
```bash
railway shell
```

2. **Run the script:**
```bash
python scripts/seed_production_images.py
```

### Step 3: Verify in Production

1. Visit your deployed app
2. Click on any project marker
3. Images should now load from `/project_images/`

## Project → Image Mapping

The script maps projects to images based on keywords:

| Project Keyword | Image File |
|----------------|-----------|
| Barcelona | barcelona_super_blocks.jpg |
| Medellín | medelin_urban_aculpunture.jpg |
| Kigali | city_of_kigali.jpg |
| Curitiba | curitiba_brazil_BRT.jpg |
| Portland Urban Growth | portland_urban_growth_smart.jpg |
| Portland Green | portland_green_streets.jpg |
| Bogotá | Ciclovia_bogota.jpg |
| Tokyo | Tokyo_resilience_project.jpg |
| Vancouver | Vancouver_Olympic_village.jpg |
| Seoul | Seoul_digital_South-Korea-capital.png |
| Cape Town Water | capetown_system.jpg |
| Cape Town Day Zero | capetown_dayzero.jpg |
| Malmö | 200616_0022_malmo_drone-Vastra-hamnen-Foto-Apeloga-min-scaled.jpg |
| Addis Ababa | addis_ababa.jpg |
| Masdar | masdar-city_1big.jpg |
| Mexico City | mexico_women_water_harvest.png |
| Freiburg | Freiburg-green-city-Sonnenschiff-scaled.jpg |

## Troubleshooting

### Images still not showing?

**Check 1: Are images deployed?**
```
Open: https://your-app.vercel.app/project_images/barcelona_super_blocks.jpg
Expected: Image displays
```

**Check 2: Are image URLs in database?**
```bash
# Connect to production DB and check
SELECT p.project_name, pi.image_url
FROM projects p
LEFT JOIN project_images pi ON p.id = pi.project_id
LIMIT 10;
```

**Check 3: Browser console**
Open DevTools (F12) → Console tab
Look for errors like:
- `404 Not Found` - Image file missing from deployment
- `Failed to load image` - Wrong URL format

**Check 4: Network tab**
DevTools → Network tab → Click a project
Look at the image request:
- Request URL should be: `https://your-app.vercel.app/project_images/filename.jpg`
- Status should be: `200 OK`

### Database has wrong URLs?

Re-run the seeding script:
```bash
python scripts/seed_production_images.py
```

### Need to add more images?

1. Add image file to `frontend/public/project_images/`
2. Update `PROJECT_IMAGE_MAPPING` in `seed_production_images.py`
3. Re-run the script
4. Redeploy frontend to Vercel

## Quick Fix Commands

**Update all images at once:**
```bash
cd backend
python scripts/seed_production_images.py
```

**Check image count:**
```bash
python scripts/map_project_images.py
```

**Update single project manually:**
```sql
UPDATE project_images
SET image_url = '/project_images/barcelona_super_blocks.jpg'
WHERE project_id = 'project-uuid-here';
```

## For Future Submissions

When new projects are submitted:
1. Admin uploads image during review
2. Image is stored in Vercel Blob or S3
3. URL is automatically saved to database
4. No manual mapping needed!

(This requires implementing image upload in admin panel)
