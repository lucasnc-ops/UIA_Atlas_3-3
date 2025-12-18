# Project Image Loading Setup

## Summary

Successfully configured the Atlas 3+3 application to load project images from the local `frontend/public/project_images/` folder when users click on map markers.

## What Was Done

### 1. Frontend Updates

**File: `frontend/src/components/dashboard/ProjectDetailPanel.tsx`**

Added a helper function `getImageUrl()` that intelligently handles different image URL formats:

- Full URLs (http/https) - keeps as is
- Root-relative paths (starting with `/`) - keeps as is
- Filenames only - prepends `/project_images/`
- Other relative paths - keeps as is

This ensures images display correctly regardless of how they're stored in the database.

### 2. Backend Scripts

Created two utility scripts in `backend/scripts/`:

#### `update_image_urls.py`
- Updates all project image URLs in the database
- Extracts filenames from various URL formats
- Converts them to the standard `/project_images/{filename}` format
- Shows summary of updated records

#### `map_project_images.py`
- Lists all projects and their current image URLs
- Shows available images in the project_images folder
- Helps identify which projects need image mapping

### 3. Database Updates

Ran the update script which:
- Found 22 projects in the database
- Most projects already had correct local image paths
- Updated 2 URLs that were using external Unsplash links

## Current Status

### Projects with Images (17/22)

✅ **Projects with correctly mapped images:**
- Barcelona Superblocks → `barcelona_super_blocks.jpg`
- Medellín Urban Acupuncture → `medelin_urban_aculpunture.jpg`
- Kigali Master Plan → `city_of_kigali.jpg`
- Curitiba BRT → `curitiba_brazil_BRT.jpg`
- Portland Urban Growth → `portland_urban_growth_smart.jpg`
- Bogotá Ciclovía → `Ciclovia_bogota.jpg`
- Tokyo Disaster Preparedness → `Tokyo_resilience_project.jpg`
- Vancouver Olympic Village → `Vancouver_Olympic_village.jpg`
- Seoul Digital City → `Seoul_digital_South-Korea-capital.png`
- Portland Green Streets → `portland_green_streets.jpg`
- Cape Town Water Management → `capetown_system.jpg`
- Malmö Sustainable District → `200616_0022_malmo_drone-Vastra-hamnen-Foto-Apeloga-min-scaled.jpg`
- Addis Ababa LRT → `addis_ababa.jpg`
- Masdar City → `masdar-city_1big.jpg`
- Mexico City Rainwater Harvesting → `mexico_women_water_harvest.png`

⚠️ **Projects without images (5/22):**
- Copenhagen District Heating
- Singapore Vertical Farming
- Vienna Social Housing
- Freiburg Solar City
- Cape Town Day Zero Response

### Available Unused Images

These images are in the folder but not assigned to projects:
- `Freiburg-green-city-Sonnenschiff-scaled.jpg` (can be assigned to Freiburg Solar City)
- `capetown_dayzero.jpg` (can be assigned to Cape Town Day Zero)

## How to Test

### 1. Start the Backend

```bash
cd backend

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Start the server
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### 2. Start the Frontend

```bash
cd frontend

# Install dependencies if needed
npm install

# Start the development server
npm run dev
```

The app will open at `http://localhost:5173`

### 3. Test Image Loading

1. **Navigate to the Dashboard** - Go to the main dashboard page
2. **Click on any map marker** - This will open the ProjectDetailPanel
3. **Verify images load** - You should see:
   - Main project image (large) at the top
   - Thumbnail images below (if project has multiple images)
   - "No Images Available" placeholder for projects without images
4. **Click on images** - Should open the lightbox for full-screen viewing
5. **Check browser console** - Look for any error messages about failed image loads

### Expected Behavior

✅ **Success indicators:**
- Project images appear when clicking map markers
- Images are sharp and properly sized
- Thumbnails are visible for multi-image projects
- Lightbox opens when clicking images
- No console errors about missing images

❌ **If images don't load:**
- Check browser console for 404 errors
- Verify the image filename in database matches the actual file
- Ensure `frontend/public/project_images/` folder exists
- Check that the image files are actually in the folder

## Troubleshooting

### Images showing "No Image" placeholder

**Check the database:**
```bash
cd backend
python scripts/map_project_images.py
```

This will show which projects have images and their URLs.

### Images returning 404 errors

1. Verify the image exists in `frontend/public/project_images/`
2. Check the filename matches exactly (case-sensitive on some systems)
3. Look at the browser Network tab to see the actual URL being requested

### Need to update image URLs

**Option 1: Run the update script**
```bash
cd backend
python scripts/update_image_urls.py
```

**Option 2: Use SQL to update specific projects**
```sql
-- Update a specific project's image
UPDATE project_images
SET image_url = '/project_images/new_image.jpg'
WHERE project_id = 'project-uuid-here';
```

**Option 3: Use the admin panel (when implemented)**
The admin panel will have a UI to upload and assign images to projects.

## Next Steps

### For Development

1. **Test all map markers** - Click each one to verify images load correctly
2. **Add missing images** - Assign images to the 5 projects that don't have them yet
3. **Test responsive design** - Verify images look good on mobile devices
4. **Implement image upload** - Add ability for admins to upload images directly

### For Missing Images

Projects that need images:
1. Copenhagen District Heating
2. Singapore Vertical Farming
3. Vienna Social Housing
4. Freiburg Solar City - Can use `Freiburg-green-city-Sonnenschiff-scaled.jpg`
5. Cape Town Day Zero - Can use `capetown_dayzero.jpg`

To assign these images, you can:
1. Update the database manually
2. Use SQL commands
3. Wait for the admin panel image upload feature

## Files Modified

- ✅ `frontend/src/components/dashboard/ProjectDetailPanel.tsx` - Added image URL helper
- ✅ `backend/scripts/update_image_urls.py` - Created database update script
- ✅ `backend/scripts/map_project_images.py` - Created mapping helper script
- ✅ `backend/scripts/README.md` - Documentation for scripts
- ✅ `backend/projects.db` - Updated image URLs in database

## Notes

- Images are served from the frontend's public folder, so they're accessible at `/project_images/{filename}`
- The `getImageUrl()` helper in ProjectDetailPanel handles various URL formats gracefully
- All image URLs in the database should use the `/project_images/{filename}` format
- The lightbox component receives properly formatted URLs
- Images are lazy-loaded and have error handling built in
