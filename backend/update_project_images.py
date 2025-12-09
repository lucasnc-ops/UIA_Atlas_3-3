#!/usr/bin/env python3
"""
Update existing projects with missing images using representative Unsplash URLs.
"""

import sys
from pathlib import Path

# Add app directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.core.database import SessionLocal
from app.models.project import Project, ProjectImage

# Mapping of project names to Unsplash Image URLs
IMAGE_UPDATES = {
    "Barcelona Superblocks: Urban Regeneration for Livable Streets": [
        "https://images.unsplash.com/photo-1583422409516-2895a77efbed?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?q=80&w=800&auto=format&fit=crop"
    ],
    "Medellín Urban Acupuncture: Library Parks in Informal Settlements": [
        "https://images.unsplash.com/photo-1599593252174-2795c64f69e6?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1591604129939-f1efa4d4f7e8?q=80&w=800&auto=format&fit=crop"
    ],
    "Copenhagen District Heating: City-Wide Renewable Energy Distribution": [
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1520699049698-acd2fcc51056?q=80&w=800&auto=format&fit=crop"
    ],
    "Singapore Vertical Farming: 30x30 Food Security Initiative": [
        "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1591543620704-3700b6561148?q=80&w=800&auto=format&fit=crop"
    ],
    "Kigali Master Plan: Africa's Model Sustainable City": [
        "https://images.unsplash.com/photo-1620662768165-4d5c1a8d0529?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?q=80&w=800&auto=format&fit=crop"
    ],
    "Vienna Social Housing: 100 Years of Inclusive Urban Development": [
        "https://images.unsplash.com/photo-1516550893923-42d2e8e56034c?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1554515560-6f296c09852f?q=80&w=800&auto=format&fit=crop"
    ],
    "Curitiba Bus Rapid Transit: Pioneering Sustainable Urban Mobility": [
        "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop"
    ]
}

def update_images():
    db = SessionLocal()
    try:
        print("Starting image update...")
        updated_count = 0

        for project_name, urls in IMAGE_UPDATES.items():
            project = db.query(Project).filter(Project.project_name == project_name).first()
            
            if not project:
                print(f"Skipping: '{project_name}' not found.")
                continue

            # Check if project already has images
            if project.images:
                print(f"Skipping: '{project_name}' already has images.")
                continue

            print(f"Updating: '{project_name}'")
            
            for idx, url in enumerate(urls):
                img = ProjectImage(
                    project_id=project.id,
                    image_url=url,
                    display_order=idx
                )
                db.add(img)
            
            updated_count += 1

        db.commit()
        print(f"\nSuccessfully updated images for {updated_count} projects!")

    except Exception as e:
        db.rollback()
        print(f"Error updating images: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    update_images()
