Atlas 3+3 web description
Example done by Nabil Mohareb:
https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221WCFcb6BVNF2o3m
-N5qP2c0Jp4x8YeKwe%22%5D,%22action%22:%22open%22,%22userId%22:%
979339209436%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing

Atlas 3+3 – Web Application Specification
1) Purpose & Scope
Atlas 3+3 is a curated atlas of sustainable-development projects managed by the UIA. The
application has two public functions:

Communicate Atlas 3+3’s vision and mission on a general landing interface.
Operate a submission → review → publication pipeline in which partners submit
projects that, once approved, appear on a global dashboard with a map, analytics, and
a tabular database.
This document translates the attached screens into implementable requirements. It covers
information architecture, UX behaviour, data model, workflow, permissions, validation, and
non-functional requirements.

2) Core Users & Roles
● Public visitor (anonymous): Reads the dashboard, filters data, opens project details.
● Submitter (authenticated or guest with email verification): Completes the “Submit
Project” form.
● UIA Key Person (Admin/Reviewer): Receives notifications, reviews entries,
approves/rejects/edits, publishes to the dashboard.
Optional: add a Manager role (can edit any published item without full admin
privileges) and an Editor role (can edit own submissions prior to approval).
3) Information Architecture
3.1 Primary navigation (left sidebar, per screenshots)
● Dashboard (default data view)
● Submit Project (form)
● Back to Home (returns to landing page with vision/mission)
3.2 Landing Page (General Interface)
Goal: State what Atlas 3+3 is, why it matters, and how to participate.
Content blocks:

● Banner (project name, strapline)
● Vision and Mission text blocks
● “How it works” (3 steps: Submit → Review → Publish)
● CTAs: View Dashboard , Submit Project
● Footer: contact, privacy, terms
4) Dashboard (Public)
4.1 Header widgets (KPIs)
● Total Projects (count of published projects)
● Cities Engaged
● Countries Represented
● Total Funding Needed (USD)
● Total Funding Spent (USD)
All five KPIs are filter-aware (update as filters change).
4.2 Global Filters (top row)
● Region : All Regions | UIA Sections I–V (naming as per screenshot)
● SDGs : All SDGs or single SDG
● Cities : All Cities or specific city
● Funded by : categorical (mirror existing categories, can be multi-select in future)
● Clear Filters (resets all)
Filters apply to maps, charts, lists, and KPIs.
4.3 Map
● Leaflet + OSM tiles (as shown), with clustered markers if counts are high.
● Marker click opens a right-hand slide-over panel.
● Map bounds sync with filters; optional “Fit to results.”
4.4 Project Slide-Over (Detail Drawer)
Right-anchored panel with:

● Title; City, Country
● Cover image carousel (from submitted image URLs)
● Meta: UIA Region , Status (Planned / In Progress / Implemented)
● Funding Needed (USD) , Contact (link or email)
● Organization
● Brief Description
● Detailed Description
● Project Typology (badges)
● Key Requirements (grouped badges)
● Linked SDGs (chips 1–17)
Panel invoked from map marker or table row.
4.5 Analytics (charts, filter-aware)
● SDG Distribution (bar)
● Top 3 Most Used SDGs (bar)
● Top 3 SDGs by Funding Need (bar)
● Projects by Region (donut)
● Funding Needed by Region (bar)
● Project Typology Distribution (bar)
Use a single charting library (e.g., Chart.js or Recharts). All charts must respect
active filters.
4.6 Projects Overview (table)
Columns (as shown):

● Project Name (click opens slide-over)
● UIA Region
● Funding Needed (USD)
● Status (pill: Planned / In Progress / Implemented)
Table behaviours:

● Pagination (server-side), sorting by column, CSV/Excel Export (top-right button mirrors
screenshots; export respects filters).
5) Submit Project (Form)
Match the multi-section form in the screenshots. The form can be linear (single page) or
multi-step; maintain section headers and fields.

5.1 Project Status
● Project Status *: Planned | In Progress | Implemented
5.2 Submitter Information
● Organization/Municipality/University Name * (text)
● Contact Person * (text)
● Contact Email * (email; verification recommended)
5.3 Project Details
● Project Name * (text)
● Funding Needed (USD) (number ≥ 0)
● UIA Region * (select: Section I–V)
● City (text)
● Country (text)
● Latitude (decimal; −90 to 90)
● Longitude (decimal; −180 to 180)
5.4 Project Typology (multi-select checkboxes)
● Residential
● Commercial & Mixed-Use
● Hospitality & Tourism
● Educational
● Healthcare
● Civic & Government
● Cultural & Heritage
● Sports & Recreation
● Industrial & Logistics
● Infrastructure & Utilities
● Public Realm & Urban Landscape
● Natural Environment & Ecological Projects
● Traditional Markets & Bazaars
● Other (with optional free-text)
5.5 Project Media & Description
● Project Image URLs (multiple; validate URL; optional upload in v2)
● Brief Description (short text, ~1–2 sentences)
● Detailed Description (long text / markdown)
5.6 Key Requirements for Realization (checkbox groups)
Funding & Financial

● Private Investment / Corporate Sponsorship
● Public Funding / Government Grants
● International Aid / Development Grants
● Community Funding / Crowdfunding
● Philanthropic Support
Government & Regulatory

● National Government Support & Political Will
● Regional / Gubernatorial Support
● Local / Municipal Support & Endorsement
● Favorable Policies or Regulations
● Streamlined Permitting & Approval Process
Other

● Strong Project Leadership & Management
● Media Coverage & Public Awareness
● Availability of Land / Site
● Other (free-text)
5.7 Success Factors/needed Factors
● Why is the project (potentially) successful/needed? (long text)
5.8 SDGs (multi-select)
1 No Poverty; 2 Zero Hunger; 3 Good Health and Well-being; 4 Quality Education;
5 Gender Equality; 6 Clean Water and Sanitation; 7 Affordable and Clean Energy;
8 Decent Work and Economic Growth; 9 Industry, Innovation and Infrastructure;
10 Reduced Inequality; 11 Sustainable Cities and Communities;
12 Responsible Consumption and Production; 13 Climate Action;
14 Life Below Water; 15 Life on Land; 16 Peace and Justice Strong Institutions;
17 Partnerships to achieve the Goal.

5.9 Form behaviours
● Required fields marked *. Inline validation; numeric and coordinate validation.
● Submit triggers:
Create a Project with status submitted (not public).
Send a notification to the UIA Key Person.
Show a confirmation to the user (with reference ID).
The UIA key person should have access on the entire database including all
images and text uploaded.
6) Review & Publication Workflow
6.1 States
submitted → in_review → approved/published or rejected or

changes_requested.

● submitted : created by form.
● in_review : opened by admin.
● approved/published : appears on dashboard/map/table.
● rejected : not shown; admin can include a reason.
● changes_requested : email to submitter with editable link.
6.2 Reviewer UI (Admin area)
● Queue list of Pending submissions with search/sort.
● Detail view with the same fields as public drawer plus moderation controls.
● Actions: Approve & Publish , Reject (with reason) , Request Changes (email with
secure edit link), Edit (admin can correct typos), Unpublish.
● Have access to the database components.
6.3 Notifications (configurable)
● On submission : email to UIA Key Person (and optional Slack webhook).
● On approve/reject/changes : email to submitter.
● Email service: SMTP/SendGrid; use templated messages with project title, organization,
and deep link.
7) Derived Metrics & Queries (for KPIs & Charts)
● Total Projects : count of status_workflow = approved.
● Cities Engaged : count distinct city (approved).
● Countries Represented : count distinct country (approved).
● Funding Needed/Spent : sum across approved projects (respect filters).
● SDG Distribution : histogram over SDG links.
● Top 3 Most Used SDGs : top-k of SDG histogram.
● Top 3 by Funding Need : sum funding by SDG, show top-3.
● Projects by Region : count/group by uia_region.
● Funding Needed by Region : sum funding by uia_region.
● Typology Distribution : histogram of typology links.
All queries accept filter parameters (region, SDG, city, and funded_by, if applicable).
8) Security, Privacy, and Quality
● Server-side validation of all form inputs; sanitize HTML; length limits.
● reCAPTCHA (v3) on submission to deter spam.
● Role-based access control on admin endpoints.
● Audit logging for moderation actions.
● Rate limiting on submission endpoints.
● GDPR-style consent checkbox for using submitted content on the public site.
● Accessibility: semantic headings, focus states, keyboard navigation, alt text for images,
WCAG-AA color contrast on charts and badges.
9) Exporting & Interoperability
● Export (CSV/XLSX) for filtered project lists and a separate export for aggregated
metrics.
● Each project has a shareable deep link ; include an optional ?project=<id> query
that opens the right-hand drawer on load.
10) Error States & Empty States
● Dashboard: show “No projects match your filters” with a quick Clear Filters action.
● Map: if no coordinates, pin is omitted and a soft warning appears in the drawer.
● Form: field-level messages; on submit failure, preserve data and show retry.
11) Acceptance Criteria (high-level)
A submitted project does not appear publicly until approved.
On approval, the item immediately appears on the dashboard map, charts, KPIs, and
table and is clickable to open the right-hand drawer with images and metadata.
Global filters consistently affect map, charts, KPIs, and table.
The Export button produces a CSV/XLSX reflecting the currently filtered dataset.
The UIA Key Person receives an email on every new submission , and submitters
receive emails on status changes.
Coordinates from the form correctly position the marker; drawer content matches the
screenshots’ structure.
All required fields are validated; spam is mitigated (reCAPTCHA).
App is responsive (desktop → tablet), and accessible (keyboard navigable headings,
labels, alt text).
Summary
The application comprises a public dashboard (map + analytics + table) and a structured
submission form feeding a moderated review workflow. Once approved, projects render as
interactive map markers and tabular rows, and contribute to aggregated
SDG/region/typology/funding analytics—exactly as shown in the attached images.

Dashboard
Submit a Project