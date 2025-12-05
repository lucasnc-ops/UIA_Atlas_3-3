from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.project import Project, ProjectSDG, ProjectTypology, ProjectRequirement, WorkflowStatus, UIARegion, ProjectStatus, ProjectImage
import uuid

def create_dummy_project():
    db = SessionLocal()
    try:
        # Check if dummy exists
        existing = db.query(Project).filter(Project.project_name == "Green Urban Oasis").first()
        if existing:
            print("Dummy project already exists.")
            return

        project = Project(
            id=uuid.uuid4(),
            project_name="Green Urban Oasis",
            organization_name="Sustainable Cities Initiative",
            contact_person="Jane Doe",
            contact_email="jane@example.com",
            project_status=ProjectStatus.IN_PROGRESS,
            workflow_status=WorkflowStatus.APPROVED,  # Important: APPROVED
            funding_needed=500000.0,
            funding_spent=150000.0,
            uia_region=UIARegion.SECTION_I,
            city="Paris",
            country="France",
            latitude=48.8566,
            longitude=2.3522,
            brief_description="A project to transform an abandoned lot into a community garden and solar park.",
            detailed_description="This project aims to revitalize the northern district by creating a green space that serves both as a recreational area and a renewable energy source. We will install 500 solar panels and plant over 200 native tree species.",
            success_factors="Community engagement, government grants, and technical expertise.",
        )

        db.add(project)
        db.flush()

        # Add SDGs (11: Cities, 13: Climate, 7: Energy)
        for sdg in [7, 11, 13]:
            db.add(ProjectSDG(project_id=project.id, sdg_number=sdg))

        # Add Typologies
        for typ in ["Urban Regeneration", "Green Infrastructure", "Public Spaces"]:
            db.add(ProjectTypology(project_id=project.id, typology=typ))
            
        # Add Images
        db.add(ProjectImage(project_id=project.id, image_url="https://images.unsplash.com/photo-1596237563267-94020be11868?q=80&w=2070&auto=format&fit=crop", display_order=0))
        db.add(ProjectImage(project_id=project.id, image_url="https://images.unsplash.com/photo-1497436072909-60f360e1d4b0?q=80&w=2560&auto=format&fit=crop", display_order=1))

        db.commit()
        print("Successfully created dummy project: Green Urban Oasis (Paris)")
        
        # Create a second project in Asia
        project2 = Project(
            id=uuid.uuid4(),
            project_name="Bangkok Canal Cleanup",
            organization_name="Clean Water Asia",
            contact_person="John Smith",
            contact_email="john@example.com",
            project_status=ProjectStatus.PLANNED,
            workflow_status=WorkflowStatus.APPROVED,
            funding_needed=200000.0,
            uia_region=UIARegion.SECTION_IV,
            city="Bangkok",
            country="Thailand",
            latitude=13.7563,
            longitude=100.5018,
            brief_description="Restoring the historic canals of Bangkok for transportation and tourism.",
            detailed_description="A comprehensive plan to dredge and clean the major canals, install water filtration systems, and build new electric boat docks.",
            success_factors="Government partnership, tourist revenue potential.",
        )
        db.add(project2)
        db.flush()
        for sdg in [6, 9, 11, 14]:
            db.add(ProjectSDG(project_id=project2.id, sdg_number=sdg))
        db.add(ProjectTypology(project_id=project2.id, typology="Transportation Hubs"))
        db.add(ProjectTypology(project_id=project2.id, typology="Heritage Conservation"))
        db.add(ProjectImage(project_id=project2.id, image_url="https://images.unsplash.com/photo-1563783232224-774d8c2c4c24?q=80&w=2070&auto=format&fit=crop", display_order=0))

        db.commit()
        print("Successfully created dummy project: Bangkok Canal Cleanup")

    except Exception as e:
        print(f"Error creating dummy project: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_dummy_project()
