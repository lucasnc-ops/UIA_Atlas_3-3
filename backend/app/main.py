from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api import auth, projects, dashboard, admin, debug

app = FastAPI(
    title="Atlas 3+3 API",
    description="API for sustainable development projects platform",
    version="0.1.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(debug.router, prefix="/api/debug", tags=["Debug"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Atlas 3+3 API",
        "version": "0.1.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
