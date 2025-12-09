# Atlas 3+3 - Global Sustainable Architecture Database

The definitive global atlas of architectural projects contributing to the UN 2030 Sustainable Development Goals (SDGs). Curated by the **Union of International Architects (UIA)**.

![Atlas 3+3 Dashboard](frontend/public/vite.svg)

## 🚀 Overview

Atlas 3+3 is a full-stack web application designed to map, track, and showcase sustainable architecture projects worldwide.

### Key Features
- **Interactive Map:** Global visualization of projects using Leaflet & CartoDB.
- **Deep Analytics:** Real-time stats on SDGs, funding, and regional distribution.
- **Project Submission:** Public portal for architects to submit projects for review.
- **Admin Dashboard:** Secure workflow for UIA administrators to review, approve, or reject submissions.
- **Deep Linking:** Shareable URLs for specific projects.

## 🛠️ Tech Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS, Leaflet Maps, Recharts.
- **Backend:** Python (FastAPI), SQLAlchemy, Pydantic.
- **Database:** PostgreSQL (with PostGIS extension).
- **Deployment:** Vercel (Frontend) + Render (Backend) + Supabase (DB).

## 📖 Deployment

For detailed production deployment instructions, please read **[DEPLOYMENT.md](DEPLOYMENT.md)**.

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js & npm
- Python 3.11+
- PostgreSQL (local or cloud)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt

# Create .env file (see .env.example) and set DATABASE_URL
cp .env.example .env

# Run migrations
alembic upgrade head

# Start Server
uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to view the application.

## 📂 Project Structure

- `frontend/`: React application.
- `backend/`: FastAPI application.
- `backend/app/models`: Database models.
- `backend/app/api`: API endpoints.
- `backend/alembic`: Database migrations.

## 📝 License

Union of International Architects (UIA) - All Rights Reserved.