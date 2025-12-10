from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from .core.config import settings
from .api import auth, projects, dashboard, admin

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Atlas 3+3 API",
    description="API for sustainable development projects platform",
    version="0.1.0",
)

# CORS configuration
cors_kwargs = {
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
    "expose_headers": ["*"],
}

# Add explicit origins if configured
origins_list = settings.cors_origins_list
if origins_list:
    cors_kwargs["allow_origins"] = origins_list
    logger.info(f"CORS allowed origins: {origins_list}")
else:
    logger.warning("No CORS_ORIGINS configured! CORS may not work.")

# Add regex pattern if configured (useful for Vercel preview deployments)
if hasattr(settings, "CORS_ORIGIN_REGEX") and settings.CORS_ORIGIN_REGEX:
    cors_kwargs["allow_origin_regex"] = settings.CORS_ORIGIN_REGEX
    logger.info(f"CORS origin regex: {settings.CORS_ORIGIN_REGEX}")

# Ensure at least one CORS configuration is set
if not origins_list and not (hasattr(settings, "CORS_ORIGIN_REGEX") and settings.CORS_ORIGIN_REGEX):
    logger.error("WARNING: No CORS configuration set! API will reject all cross-origin requests.")
    # Fallback to localhost for safety
    cors_kwargs["allow_origins"] = ["http://localhost:5173"]

logger.info(f"Final CORS configuration: {cors_kwargs}")
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