#!/usr/bin/env python3
"""
Import 5 specific real-world sustainable urban projects into Atlas 3+3.
Research-verified data for Hammarby Sjöstad, High Line, Bosco Verticale, Cheonggyecheon, and HafenCity.
"""

import sys
from pathlib import Path

# Add app directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.core.database import SessionLocal
from app.models.project import (
    Project, ProjectSDG, ProjectTypology, ProjectRequirement, ProjectImage,
    ProjectStatus, WorkflowStatus, UIARegion
)

NEW_PROJECTS_DATA = [
    {
        "project_name": "Hammarby Sjöstad: The Eco-Cycle Model",
        "funding_needed": 2000000000,  # ~$2 Billion total investment
        "funding_spent": 1950000000,
        "uia_region": "Section I - Western Europe",
        "city": "Stockholm",
        "country": "Sweden",
        "latitude": 59.3015,
        "longitude": 18.1025,
        "organization_name": "City of Stockholm & GlashusEtt",
        "contact_person": "Erik Freudenthal",
        "contact_email": "info@glashusett.se",
        "brief_description": "Former industrial waterfront transformed into a model sustainable district with an integrated waste-water-energy eco-cycle.",
        "detailed_description": "Hammarby Sjöstad transformed a polluted industrial harbour into Stockholm's flagship sustainable district. Its core innovation is the 'Hammarby Model' eco-cycle: waste is vacuum-suctioned to central processing; organic waste generates biogas for buses and heating; wastewater heat is recovered for district heating. The district aims to be twice as environmentally efficient as typical Swedish housing. With 11,000 residences and 35,000 people, it demonstrates how dense, modern urban living can be compatible with rigorous environmental stewardship.",
        "success_factors": "Holistic 'Eco-Cycle' integrating infrastructure systems; Strong public-private partnership between city and 25+ developers; High environmental standards enforced through land allocation agreements; Economies of scale due to project size; Excellent public transit integration (trams/ferries).",
        "project_status": "Implemented",
        "sdgs": [6, 7, 11, 12],
        "typologies": ["Residential", "Infrastructure", "Public Realm & Urban Landscape"],
        "funding_requirements": ["Public Funding / Government Grants", "Private Investment / Corporate Sponsorship"],
        "government_requirements": ["Local / Municipal Support & Endorsement", "Favorable Policies or Regulations"],
        "other_requirements": ["Strong Project Leadership & Management"],
        "image_urls": [
            "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop"
        ]
    },
    {
        "project_name": "The High Line: Park in the Sky",
        "funding_needed": 187000000, # Mix of city, federal, private
        "funding_spent": 153000000,
        "uia_region": "Section V - Americas",
        "city": "New York City",
        "country": "United States",
        "latitude": 40.7480,
        "longitude": -74.0048,
        "organization_name": "Friends of the High Line & NYC Parks",
        "contact_person": "High Line Admin",
        "contact_email": "info@thehighline.org",
        "brief_description": "Adaptive reuse of an abandoned elevated rail line into a globally iconic public park, catalyzing neighborhood revitalization.",
        "detailed_description": "The High Line is a 1.45-mile-long linear public park built on a historic freight rail line elevated above the streets on Manhattan's West Side. Saved from demolition by local residents, it opened in 2009 and became a hybrid public space where nature, art, and design intersect. The project illustrates how obsolete industrial infrastructure can be repurposed to create valuable green space in dense cities. It has generated billions in economic activity and tax revenue, though also raising debates about gentrification.",
        "success_factors": "Grassroots advocacy (Friends of the High Line) saving it from demolition; Design excellence (Diller Scofidio + Renfro / James Corner); Innovative funding model combining heavy private philanthropy with public investment; Zoning changes transferring development rights; Strong programming and art curation.",
        "project_status": "Implemented",
        "sdgs": [11, 3, 8, 9],
        "typologies": ["Public Realm & Urban Landscape", "Cultural & Heritage", "Infrastructure"],
        "funding_requirements": ["Private Investment / Corporate Sponsorship", "Public Funding / Government Grants"],
        "government_requirements": ["Local / Municipal Support & Endorsement", "Favorable Policies or Regulations"],
        "other_requirements": ["Media Coverage & Public Awareness"],
        "image_urls": [
            "https://images.unsplash.com/photo-1534270804882-6b5048b1c1fc?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1555109307-f7d9da25e244?q=80&w=800&auto=format&fit=crop"
        ]
    },
    {
        "project_name": "Bosco Verticale: The Vertical Forest",
        "funding_needed": 85000000, # Est ~$80-90M
        "funding_spent": 80000000,
        "uia_region": "Section I - Western Europe",
        "city": "Milan",
        "country": "Italy",
        "latitude": 45.4858,
        "longitude": 9.1900,
        "organization_name": "Boeri Studio (Stefano Boeri Architetti)",
        "contact_person": "Studio Director",
        "contact_email": "info@stefanoboeriarchitetti.net",
        "brief_description": "Two residential towers hosting 900 trees and 20,000 plants, creating a prototype for urban biodiversity and biological architecture.",
        "detailed_description": "Bosco Verticale (Vertical Forest) is a pair of residential towers in the Porta Nuova district of Milan. It hosts a vegetation equivalent to 20,000 square meters of forest on a 3,000 square meter urban footprint. The vegetation creates a microclimate that produces humidity, absorbs CO2 and dust particles, produces oxygen, and protects against noise pollution. It represents a shift away from technology-driven sustainability toward biological sustainability, integrating living nature directly into the building envelope.",
        "success_factors": "Visionary architectural concept; Intensive botanical research to select wind-resistant species; Specialized structural engineering for soil weight; Maintenance model where condo association manages vegetation centrally (not individual owners); Iconic status driving real estate value.",
        "project_status": "Implemented",
        "sdgs": [11, 13, 15, 3],
        "typologies": ["Residential", "Natural Environment & Ecological Projects"],
        "funding_requirements": ["Private Investment / Corporate Sponsorship"],
        "government_requirements": ["Favorable Policies or Regulations"],
        "other_requirements": ["Technical / Technological Expertise"],
        "image_urls": [
            "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1627223585077-426a94de6be7?q=80&w=800&auto=format&fit=crop"
        ]
    },
    {
        "project_name": "Cheonggyecheon Restoration: Bringing the Stream Back",
        "funding_needed": 384000000,
        "funding_spent": 380000000,
        "uia_region": "Section IV - Asia & Pacific",
        "city": "Seoul",
        "country": "South Korea",
        "latitude": 37.5692,
        "longitude": 127.0064,
        "organization_name": "Seoul Metropolitan Government",
        "contact_person": "Urban Safety Headquarters",
        "contact_email": "english@seoul.go.kr",
        "brief_description": "Demolition of a major elevated highway to uncover and restore a buried historic stream, creating a massive linear park and flood control system.",
        "detailed_description": "In 2003, Seoul Mayor Lee Myung-bak initiated the removal of a 10-lane highway that had covered the Cheonggyecheon stream for decades. The project restored the watercourse, created a 10.9km linear park, and reduced the urban heat island effect (lowering temperatures by up to 3.6°C). It catalyzed a shift in Seoul from car-centric to people-centric planning, increased biodiversity by 639%, and provided vital flood protection for the downtown area.",
        "success_factors": "Strong political will and centralized leadership; Rapid implementation (29 months); Massive public engagement to mitigate merchant concerns; Focus on multiple benefits: flood control, cooling, tourism, and transit shift; Symbol of national modernization shift.",
        "project_status": "Implemented",
        "sdgs": [11, 13, 6, 15],
        "typologies": ["Infrastructure", "Public Realm & Urban Landscape", "Natural Environment & Ecological Projects"],
        "funding_requirements": ["Public Funding / Government Grants"],
        "government_requirements": ["National Government Support & Political Will", "Local / Municipal Support & Endorsement"],
        "other_requirements": ["Strong Project Leadership & Management"],
        "image_urls": [
            "https://images.unsplash.com/photo-1617937223996-47252e44c76c?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1580827868222-47252e44c76c?q=80&w=800&auto=format&fit=crop"
        ]
    },
    {
        "project_name": "HafenCity Hamburg: Flood-Resilient Expansion",
        "funding_needed": 13000000000, # Public + Private total > 13B Euro
        "funding_spent": 5000000000, # In progress
        "uia_region": "Section I - Western Europe",
        "city": "Hamburg",
        "country": "Germany",
        "latitude": 53.5413,
        "longitude": 9.9966,
        "organization_name": "HafenCity Hamburg GmbH",
        "contact_person": "Andreas Kleinau",
        "contact_email": "info@hafencity.com",
        "brief_description": "Europe's largest inner-city development, expanding Hamburg by 40% on a raised flood-resilient plateau without levees.",
        "detailed_description": "HafenCity is revitalizing 157 hectares of former port land. Instead of building dykes that block river views, the district uses a 'warft' model: building bases and roads are raised 8-9 meters above sea level, allowing the promenade to flood occasionally while protecting buildings. It features a strict Ecolabel for buildings, mixed-use zoning to prevent 'ghost' districts at night, and high-quality public spaces. It is a testbed for climate-resilient coastal urbanism.",
        "success_factors": "Innovative flood protection (raised plinths) maintaining water connection; 'Special City and Port Fund' financing model; Master plan flexibility allowing evolution over 20 years; Strict architectural quality competitions; Integration of cultural anchors (Elbphilharmonie).",
        "project_status": "In Progress",
        "sdgs": [11, 13, 9, 8],
        "typologies": ["Residential", "Commercial", "Infrastructure", "Public Realm & Urban Landscape"],
        "funding_requirements": ["Public Funding / Government Grants", "Private Investment / Corporate Sponsorship"],
        "government_requirements": ["Local / Municipal Support & Endorsement", "Favorable Policies or Regulations"],
        "other_requirements": ["Technical / Technological Expertise"],
        "image_urls": [
            "https://images.unsplash.com/photo-1449452198679-05c7fd30f416?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1569661363733-462e2367c42e?q=80&w=800&auto=format&fit=crop"
        ]
    }
]

def import_new_projects():
    """Import 5 new projects into the database"""
    db = SessionLocal()

    try:
        print(f"Starting import of {len(NEW_PROJECTS_DATA)} new projects...")
        
        existing_names = {p.project_name for p in db.query(Project.project_name).all()}
        imported_count = 0

        for idx, project_data in enumerate(NEW_PROJECTS_DATA, 1):
            name = project_data["project_name"]
            if name in existing_names:
                print(f"Skipping existing: {name}")
                continue

            print(f"Importing [{idx}]: {name}")

            # Create project
            project = Project(
                organization_name=project_data["organization_name"],
                contact_person=project_data["contact_person"],
                contact_email=project_data["contact_email"],
                project_name=name,
                project_status=ProjectStatus(project_data["project_status"]),
                workflow_status=WorkflowStatus.APPROVED,
                funding_needed=float(project_data["funding_needed"]),
                funding_spent=float(project_data["funding_spent"]),
                uia_region=UIARegion(project_data["uia_region"]),
                city=project_data["city"],
                country=project_data["country"],
                latitude=project_data["latitude"],
                longitude=project_data["longitude"],
                brief_description=project_data["brief_description"],
                detailed_description=project_data["detailed_description"],
                success_factors=project_data["success_factors"],
            )

            db.add(project)
            db.flush()

            # Add SDGs
            for sdg_num in project_data["sdgs"]:
                sdg = ProjectSDG(project_id=project.id, sdg_number=sdg_num)
                db.add(sdg)

            # Add typologies
            for typology in project_data["typologies"]:
                typ = ProjectTypology(project_id=project.id, typology=typology)
                db.add(typ)

            # Add requirements
            all_reqs = []
            if "funding_requirements" in project_data:
                for r in project_data["funding_requirements"]: all_reqs.append(('funding', r))
            if "government_requirements" in project_data:
                for r in project_data["government_requirements"]: all_reqs.append(('government', r))
            if "other_requirements" in project_data:
                for r in project_data["other_requirements"]: all_reqs.append(('other', r))

            for r_type, r_text in all_reqs:
                requirement = ProjectRequirement(
                    project_id=project.id,
                    requirement_type=r_type,
                    requirement=r_text
                )
                db.add(requirement)

            # Add images
            if "image_urls" in project_data:
                for i, url in enumerate(project_data["image_urls"]):
                    image = ProjectImage(
                        project_id=project.id,
                        image_url=url,
                        display_order=i
                    )
                    db.add(image)
            
            imported_count += 1

        db.commit()
        print(f"\nSuccessfully imported {imported_count} new projects!")

    except Exception as e:
        db.rollback()
        print(f"\nERROR - Error importing projects: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    import_new_projects()
