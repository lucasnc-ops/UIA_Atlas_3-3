from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api import auth, projects, dashboard, admin
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Atlas 3+3 API",
    description="API for sustainable development projects platform",
    version="0.1.0",
)

# CORS middleware
cors_kwargs = {
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}

# Add explicit origins if configured
if settings.cors_origins_list:
    cors_kwargs["allow_origins"] = settings.cors_origins_list
    logger.info(f"CORS allowed origins: {settings.cors_origins_list}")

# Add regex pattern if configured (useful for Vercel preview deployments)
if settings.CORS_ORIGIN_REGEX:
    cors_kwargs["allow_origin_regex"] = settings.CORS_ORIGIN_REGEX
    logger.info(f"CORS origin regex: {settings.CORS_ORIGIN_REGEX}")

logger.info(f"CORS configuration: {cors_kwargs}")
app.add_middleware(CORSMiddleware, **cors_kwargs)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])


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


@app.get("/debug/cors")
async def debug_cors():
    """Debug endpoint to check CORS configuration"""
    return {
        "cors_origins": settings.cors_origins_list,
        "cors_origin_regex": settings.CORS_ORIGIN_REGEX,
        "environment": settings.ENVIRONMENT,
    }
