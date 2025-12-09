import os
import sys
from dotenv import load_dotenv

# Force load .env
load_dotenv()

# Add to path
sys.path.insert(0, os.getcwd())

print("Attempting to import app.main...")
try:
    from app.main import app
    print("SUCCESS: App imported.")
except Exception as e:
    print(f"FAILURE: {e}")
    import traceback
    traceback.print_exc()
