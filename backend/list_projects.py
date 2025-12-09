import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from app.core.database import SessionLocal
from app.models.project import Project

def list_projects_and_images():
    db = SessionLocal()
    try:
        projects = db.query(Project).all()
        project_data = []
        for p in projects:
            images = [img.image_url for img in p.images]
            project_data.append({
                "name": p.project_name,
                "id": str(p.id),
                "image_urls": images
            })
        
        # Sort projects alphabetically by name
        project_data.sort(key=lambda x: x["name"])

        print("--- Projects in Database ---")
        for project in project_data:
            print(f"Name: {project['name']}")
            print(f"  ID: {project['id']}")
            if project['image_urls']:
                print(f"  Current Images ({len(project['image_urls'])}):")
                for url in project['image_urls']:
                    print(f"    - {url}")
            else:
                print("  No images currently assigned.")
            print("-" * 20)

    except Exception as e:
        print(f"Error listing projects: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    list_projects_and_images()
