#!/usr/bin/env python3
"""
Update specific projects with local images from the frontend/public/project_images folder.
"""

import sys
from pathlib import Path

# Add app directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.core.database import SessionLocal
from app.models.project import Project, ProjectImage

# Mapping of project names to LOCAL image paths (relative to frontend public URL)
# The frontend serves "frontend/public" at root "/"
IMAGE_UPDATES = {
    "Addis Ababa Light Rail Transit - Sub-Saharan Africa First LRT": [
        "/project_images/addis_ababa.jpg"
    ],
    "Bogotá Ciclovía: Weekly Car-Free Streets for 2 Million People": [
        "/project_images/Ciclovia_bogota.jpg"
    ],
    "Cape Town Day Zero: Water Crisis Management and Conservation": [
        "/project_images/capetown_dayzero.jpg"
    ],
    "Cape Town New Water Programme - Overcoming Day Zero Crisis": [
        "/project_images/capetown_system.jpg"
    ],
    "Freiburg Solar City: Germany's Renewable Energy Showcase": [
        "/project_images/Freiburg-green-city-Sonnenschiff-scaled.jpg"
    ],
    "Malmö Western Harbour Bo01 - Climate-Neutral Urban District": [
        "/project_images/200616_0022_malmo_drone-Vastra-hamnen-Foto-Apeloga-min-scaled.jpg"
    ],
    "Masdar City - Zero-Carbon Eco-City in the Desert": [
        "/project_images/masdar-city_1big.jpg"
    ],
    "Mexico City Cosecha de Lluvia - Rainwater Harvesting for Water Security": [
        "/project_images/mexico_women_water_harvest.png"
    ],
    "Portland Green Streets - Sustainable Stormwater Management": [
        "/project_images/portland_green_streets.jpg"
    ],
    "Portland Urban Growth Boundary: 50 Years of Smart Growth": [
        "/project_images/portland_urban_growth_smart.jpg"
    ],
    "Seoul Digital Media City: Technology Hub and Urban Regeneration": [
        "/project_images/Seoul_digital_South-Korea-capital.png"
    ],
    "Tokyo Disaster Preparedness: Resilient Megacity Planning": [
        "/project_images/Tokyo_resilience_project.jpg"
    ],
    "Vancouver Olympic Village: Carbon-Neutral Neighborhood Development": [
        "/project_images/Vancouver_Olympic_village.jpg"
    ]
}

def update_local_images():
    db = SessionLocal()
    try:
        print("Starting local image update...")
        updated_count = 0

        for project_name, urls in IMAGE_UPDATES.items():
            project = db.query(Project).filter(Project.project_name == project_name).first()
            
            if not project:
                print(f"Skipping: '{project_name}' not found.")
                continue

            # Clear existing images first to avoid duplicates or to replace old placeholders
            for img in project.images:
                db.delete(img)
            
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
    update_local_images()
