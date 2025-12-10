#!/usr/bin/env python3
"""
Update project images with local files.
"""

import sys
from pathlib import Path

# Add app directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.core.database import SessionLocal
from app.models.project import Project, ProjectImage

# Mapping: Project Name -> Image Filename
IMAGE_MAPPING = {
    "Barcelona Superblocks: Urban Regeneration for Livable Streets": "barcelona_super_blocks.jpg",
    "Medellín Urban Acupuncture: Library Parks in Informal Settlements": "medelin_urban_aculpunture.jpg",
    "Kigali Master Plan: Africa's Model Sustainable City": "city_of_kigali.jpg",
    "Curitiba Bus Rapid Transit: Pioneering Sustainable Urban Mobility": "curitiba_brazil_BRT.jpg",
    "Vauban District - Europe's Most Sustainable Urban Community": "Freiburg-green-city-Sonnenschiff-scaled.jpg",
    "Portland Urban Growth Boundary: 50 Years of Smart Growth": "portland_urban_growth_smart.jpg",
    "Bogotá Ciclovía: Weekly Car-Free Streets for 2 Million People": "Ciclovia_bogota.jpg",
    "Tokyo Disaster Preparedness: Resilient Megacity Planning": "Tokyo_resilience_project.jpg",
    "Vancouver Olympic Village: Carbon-Neutral Neighborhood Development": "Vancouver_Olympic_village.jpg",
    "Cape Town Day Zero: Water Crisis Management and Conservation": "capetown_dayzero.jpg",
    "Seoul Digital Media City: Technology Hub and Urban Regeneration": "Seoul_digital_South-Korea-capital.png",
    "Portland Green Streets - Sustainable Stormwater Management": "portland_green_streets.jpg",
    "Cape Town New Water Programme - Overcoming Day Zero Crisis": "capetown_system.jpg",
    "Malmö Western Harbour Bo01 - Climate-Neutral Urban District": "200616_0022_malmo_drone-Vastra-hamnen-Foto-Apeloga-min-scaled.jpg",
    "Addis Ababa Light Rail Transit - Sub-Saharan Africa First LRT": "addis_ababa.jpg",
    "Masdar City - Zero-Carbon Eco-City in the Desert": "masdar-city_1big.jpg",
    "Mexico City Cosecha de Lluvia - Rainwater Harvesting for Water Security": "mexico_women_water_harvest.png"
}

def update_images():
    db = SessionLocal()
    try:
        print("Updating project images...")
        
        for project_name, filename in IMAGE_MAPPING.items():
            project = db.query(Project).filter(Project.project_name == project_name).first()
            
            if not project:
                print(f"Project not found: {project_name}")
                continue
                
            print(f"Updating images for: {project_name}")
            
            # Remove existing images
            # Note: relying on cascade delete would be better if we were deleting the project, 
            # but here we just want to clear images.
            db.query(ProjectImage).filter(ProjectImage.project_id == project.id).delete()
            
            # Add new image
            # The URL path assumes the frontend serves 'public' at root
            image_url = f"/project_images/{filename}"
            
            new_image = ProjectImage(
                project_id=project.id,
                image_url=image_url,
                display_order=0
            )
            db.add(new_image)
            
        db.commit()
        print("Images updated successfully.")

    except Exception as e:
        db.rollback()
        print(f"Error updating images: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    update_images()