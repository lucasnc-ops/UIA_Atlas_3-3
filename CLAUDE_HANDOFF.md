# UIA Atlas 33 - Implementation Handoff for Claude

This document summarizes the current project state and provides a clear technical roadmap for four prioritized corrections.

## 1. Map Visualization & Image Connectivity
**Status:** The map uses `react-leaflet` in `Dashboard.tsx`. Project markers are rendered, but images are not currently showing in the popups.
**Goal:** Display project images from the local database on the map.
**Technical Steps:**
- **Backend:** Ensure `dashboardAPI.getProjects` includes `imageUrl` or `images` in the JSON response. Update `backend/app/api/dashboard.py` if needed.
- **Frontend:** Update the `<Popup>` in `frontend/src/pages/public/Dashboard.tsx` to render an `<img>` tag using the project's image URL. Use a fallback placeholder if no image exists.

## 2. UI Z-Index Correction
**Status:** The Leaflet map container (z-index 20) is rendering on top of the filter dropdowns and the sidebar menu.
**Goal:** Ensure filters and selections pop "over" the map.
**Technical Steps:**
- **Frontend:** Add `relative z-30` (or higher) to the `<aside>` container in `Dashboard.tsx`.
- **Frontend:** Ensure the dropdown menus in `frontend/src/components/dashboard/FilterControls.tsx` have a `z-50` class to ensure they are never obscured by map layers or controls.

## 3. Multi-SDG Selection Filter
**Status:** The current filter only allows selecting one SDG at a time via a standard `<select>` element.
**Goal:** Allow "double or triple select" (multiple SDGs) as filters simultaneously.
**Technical Steps:**
- **Frontend:** Update `FilterOptions` in `frontend/src/types/index.ts` to use `sdgs: number[]` instead of a single value.
- **Frontend:** Replace the `<select>` in `FilterControls.tsx` with a **Custom Checkbox Dropdown** UI built with Tailwind.
- **Backend:** Update `backend/app/api/dashboard.py` endpoints to accept a list of SDG IDs: `sdg: Optional[List[int]] = Query(None)`.
- **Backend:** Update SQLAlchemy queries to use `.in_()` for filtering: `query.join(ProjectSDG).filter(ProjectSDG.sdg_number.in_(sdg))`.

## 4. Database 'Unknown' Data Correction
**Status:** The `scripts/excel_to_guidebook_sql.py` script hardcoded "Unknown" for Organization, Contact Person, and Country fields during the initial import.
**Goal:** Repair the database using real data from the project spreadsheets.
**Technical Steps:**
- **Script:** Create `scripts/patch_authors_contacts.py`.
- **Logic:** This script must connect to the database, read the raw project Excel files (found in `data/raw/2026/`), and update the `projects` table rows where data is currently "Unknown". 
- **Mapping:** Correct the column mapping in the script to ensure Organization Name and Contact Email are properly extracted from the Excel source.

## 5. Analytics Page Overhaul ("The Statement")
**Status:** Currently "too basic" with standard bar and pie charts.
**Goal:** Transform it into a high-impact, professional overview of UIA's global work and SDG progression.
**Technical Steps:**
- **UI/Visuals:** 
  - Switch to a "Dark Mode" dashboard aesthetic or a "Clean High-Contrast" look.
  - Implement **KPI Highlight Cards** at the top: `Total Projects`, `Countries Reached`, `Primary SDG Focus`, `Avg. SDGs per Project`.
  - Use `framer-motion` for smooth entrance animations on charts.
- **Temporal Analysis (The "Years" aspect):**
  - Add a **Comparative Timeline** chart (2023 vs 2026 Edition) showing how project volume or SDG priorities have shifted.
  - Backend: Add a `/analytics/edition-comparison` endpoint to return counts grouped by the `external_code` prefix (P% vs ~P%).
- **Advanced Insights:**
  - **SDG x Region Heatmap:** A grid showing which UIA sections focus on which SDGs (e.g., Section V focusing on SDG 11 vs Section III on SDG 6).
  - **Typology Radar Chart:** Show the "DNA" of the guidebook—which urban intervention types are most prevalent globally.
- **Interactivity:**
  - Enable "Drill-down": Clicking a chart element (like an SDG bar) should filter the other charts on the page instantly (Shared State).

---
**Verification Checklist:**
- [ ] Map popups show project images.
- [ ] Filter dropdowns appear above the map.
- [ ] Multiple SDGs can be selected and results filter correctly.
- [ ] Database no longer contains hardcoded "Unknown" authors for rows that have data in the Excel files.
- [ ] Analytics page features KPI cards and a comparative "Years" timeline.
