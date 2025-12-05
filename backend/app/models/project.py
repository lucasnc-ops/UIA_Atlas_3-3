from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum
from ..core.database import Base

# For SQLite compatibility, use String for UUID
try:
    from sqlalchemy.dialects.postgresql import UUID as PGUUID
    UUID = PGUUID
except:
    UUID = String(36)


class ProjectStatus(str, enum.Enum):
    """Project implementation status"""
    PLANNED = "Planned"
    IN_PROGRESS = "In Progress"
    IMPLEMENTED = "Implemented"


class WorkflowStatus(str, enum.Enum):
    """Project workflow/review status"""
    SUBMITTED = "submitted"
    IN_REVIEW = "in_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    CHANGES_REQUESTED = "changes_requested"


class UIARegion(str, enum.Enum):
    """UIA Regional sections"""
    SECTION_I = "Section I - Western Europe"
    SECTION_II = "Section II - Eastern Europe & Central Asia"
    SECTION_III = "Section III - Middle East & Africa"
    SECTION_IV = "Section IV - Asia & Pacific"
    SECTION_V = "Section V - Americas"


class Project(Base):
    """Main project model"""

    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Submitter information
    organization_name = Column(String(255), nullable=False)
    contact_person = Column(String(255), nullable=False)
    contact_email = Column(String(255), nullable=False, index=True)

    # Project basic info
    project_name = Column(String(500), nullable=False, index=True)
    project_status = Column(Enum(ProjectStatus), nullable=False)
    workflow_status = Column(
        Enum(WorkflowStatus),
        default=WorkflowStatus.SUBMITTED,
        nullable=False,
        index=True
    )

    # Financial
    funding_needed = Column(Float, default=0.0)
    funding_spent = Column(Float, default=0.0)

    # Location
    uia_region = Column(Enum(UIARegion), nullable=False, index=True)
    city = Column(String(255), nullable=False, index=True)
    country = Column(String(255), nullable=False, index=True)

    # Coordinates
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    # Note: PostGIS Geography column removed for SQLite compatibility
    # For production with PostgreSQL, uncomment:
    # location = Column(Geography(geometry_type='POINT', srid=4326), nullable=True)

    # Descriptions
    brief_description = Column(Text, nullable=False)
    detailed_description = Column(Text, nullable=False)
    success_factors = Column(Text, nullable=False)

    # Other requirement text (for custom "Other" option)
    other_requirement_text = Column(Text, nullable=True)

    # Review/moderation
    rejection_reason = Column(Text, nullable=True)
    reviewer_notes = Column(Text, nullable=True)
    edit_token = Column(String(255), nullable=True, index=True)
    
    # Compliance
    gdpr_consent = Column(Boolean, default=False, nullable=False)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    sdgs = relationship("ProjectSDG", back_populates="project", cascade="all, delete-orphan")
    typologies = relationship("ProjectTypology", back_populates="project", cascade="all, delete-orphan")
    requirements = relationship("ProjectRequirement", back_populates="project", cascade="all, delete-orphan")
    images = relationship("ProjectImage", back_populates="project", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Project {self.project_name}>"


class ProjectSDG(Base):
    """Many-to-many relationship for SDGs (1-17)"""

    __tablename__ = "project_sdgs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    sdg_number = Column(Integer, nullable=False)  # 1-17

    project = relationship("Project", back_populates="sdgs")


class ProjectTypology(Base):
    """Many-to-many relationship for project typologies"""

    __tablename__ = "project_typologies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    typology = Column(String(255), nullable=False)

    project = relationship("Project", back_populates="typologies")


class ProjectRequirement(Base):
    """Many-to-many relationship for key requirements"""

    __tablename__ = "project_requirements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    requirement_type = Column(String(50), nullable=False)  # 'funding', 'government', 'other'
    requirement = Column(String(500), nullable=False)

    project = relationship("Project", back_populates="requirements")


class ProjectImage(Base):
    """Project image URLs"""

    __tablename__ = "project_images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String(1000), nullable=False)
    display_order = Column(Integer, default=0)

    project = relationship("Project", back_populates="images")
