from supabase import create_client, Client
from ..core.config import settings

def get_supabase_client() -> Client:
    """Initialize and return the Supabase client"""
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
