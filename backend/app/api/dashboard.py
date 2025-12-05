from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct
from typing import Optional, List
from ..core.database import get_db
from ..models.project import Project, ProjectSDG, ProjectTypology, WorkflowStatus
from ..schemas.project import ProjectListResponse, DashboardKPIs, ProjectResponse
from .projects import _format_project_response

router = APIRouter()


@router.get("/kpis", response_model=DashboardKPIs)
async def get_dashboard_kpis(
    region: Optional[str] = Query(None),
    sdg: Optional[int] = Query(None),
    city: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get dashboard KPIs with optional filters"""

    # Base query for approved projects
    query = db.query(Project).filter(Project.workflow_status == WorkflowStatus.APPROVED)

    # Apply filters
    if region and region != "All Regions":
        query = query.filter(Project.uia_region == region)
    if city and city != "All Cities":
        query = query.filter(Project.city == city)
    if sdg:
        query = query.join(ProjectSDG).filter(ProjectSDG.sdg_number == sdg)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Project.project_name.ilike(search_term)) |
            (Project.city.ilike(search_term)) |
            (Project.country.ilike(search_term))
        )

    # Calculate metrics
    total_projects = query.count()
    cities_engaged = query.with_entities(func.count(distinct(Project.city))).scalar() or 0
    countries_represented = query.with_entities(func.count(distinct(Project.country))).scalar() or 0
    total_funding_needed = query.with_entities(func.sum(Project.funding_needed)).scalar() or 0.0
    total_funding_spent = query.with_entities(func.sum(Project.funding_spent)).scalar() or 0.0

    return {
        "total_projects": total_projects,
        "cities_engaged": cities_engaged,
        "countries_represented": countries_represented,
        "total_funding_needed": float(total_funding_needed),
        "total_funding_spent": float(total_funding_spent),
    }


@router.get("/projects", response_model=ProjectListResponse)
async def get_dashboard_projects(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    region: Optional[str] = Query(None),
    sdg: Optional[int] = Query(None),
    city: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: str = Query("created_at", pattern="^(project_name|created_at|funding_needed)$"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    db: Session = Depends(get_db)
):
    """Get paginated list of approved projects with filters"""

    # Base query
    query = db.query(Project).filter(Project.workflow_status == WorkflowStatus.APPROVED)

    # Apply filters
    if region and region != "All Regions":
        query = query.filter(Project.uia_region == region)
    if city and city != "All Cities":
        query = query.filter(Project.city == city)
    if sdg:
        query = query.join(ProjectSDG).filter(ProjectSDG.sdg_number == sdg)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Project.project_name.ilike(search_term)) |
            (Project.city.ilike(search_term)) |
            (Project.country.ilike(search_term))
        )

    # Get total count
    total = query.count()

    # Apply sorting
    sort_column = getattr(Project, sort_by)
    if sort_order == "desc":
        sort_column = sort_column.desc()
    query = query.order_by(sort_column)

    # Apply pagination
    offset = (page - 1) * page_size
    projects = query.offset(offset).limit(page_size).all()

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "projects": [_format_project_response(p) for p in projects]
    }


@router.get("/map-markers")
async def get_map_markers(
    region: Optional[str] = Query(None),
    sdg: Optional[int] = Query(None),
    city: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get project markers for map (lightweight data)"""

    query = db.query(
        Project.id,
        Project.project_name,
        Project.city,
        Project.country,
        Project.latitude,
        Project.longitude,
        Project.uia_region
    ).filter(
        Project.workflow_status == WorkflowStatus.APPROVED,
        Project.latitude.isnot(None),
        Project.longitude.isnot(None)
    )

    # Apply filters
    if region and region != "All Regions":
        query = query.filter(Project.uia_region == region)
    if city and city != "All Cities":
        query = query.filter(Project.city == city)
    if sdg:
        query = query.join(ProjectSDG).filter(ProjectSDG.sdg_number == sdg)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Project.project_name.ilike(search_term)) |
            (Project.city.ilike(search_term)) |
            (Project.country.ilike(search_term))
        )

    markers = query.all()

    return [
        {
            "id": str(m.id),
            "project_name": m.project_name,
            "city": m.city,
            "country": m.country,
            "latitude": m.latitude,
            "longitude": m.longitude,
            "region": m.uia_region.value,
        }
        for m in markers
    ]


@router.get("/analytics/sdg-distribution")
async def get_sdg_distribution(
    region: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get SDG distribution for charts"""

    query = db.query(
        ProjectSDG.sdg_number,
        func.count(distinct(ProjectSDG.project_id)).label('count')
    ).join(Project).filter(
        Project.workflow_status == WorkflowStatus.APPROVED
    )

    if region and region != "All Regions":
        query = query.filter(Project.uia_region == region)
    if city and city != "All Cities":
        query = query.filter(Project.city == city)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Project.project_name.ilike(search_term)) |
            (Project.city.ilike(search_term)) |
            (Project.country.ilike(search_term))
        )

    results = query.group_by(ProjectSDG.sdg_number).order_by(ProjectSDG.sdg_number).all()

    return [{"sdg": r.sdg_number, "count": r.count} for r in results]


@router.get("/analytics/regional-distribution")
async def get_regional_distribution(
    sdg: Optional[int] = Query(None),
    city: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get project count by region"""

    query = db.query(
        Project.uia_region,
        func.count(Project.id).label('count'),
        func.sum(Project.funding_needed).label('funding_needed')
    ).filter(
        Project.workflow_status == WorkflowStatus.APPROVED
    )

    if sdg:
        query = query.join(ProjectSDG).filter(ProjectSDG.sdg_number == sdg)
    if city and city != "All Cities":
        query = query.filter(Project.city == city)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Project.project_name.ilike(search_term)) |
            (Project.city.ilike(search_term)) |
            (Project.country.ilike(search_term))
        )

    results = query.group_by(Project.uia_region).all()

    return [
        {
            "region": r.uia_region.value,
            "project_count": r.count,
            "funding_needed": float(r.funding_needed or 0.0)
        }
        for r in results
    ]


@router.get("/analytics/typology-distribution")
async def get_typology_distribution(
    region: Optional[str] = Query(None),
    sdg: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get project typology distribution"""

    query = db.query(
        ProjectTypology.typology,
        func.count(distinct(ProjectTypology.project_id)).label('count')
    ).join(Project).filter(
        Project.workflow_status == WorkflowStatus.APPROVED
    )

    if region and region != "All Regions":
        query = query.filter(Project.uia_region == region)
    if sdg:
        query = query.join(ProjectSDG).filter(ProjectSDG.sdg_number == sdg)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Project.project_name.ilike(search_term)) |
            (Project.city.ilike(search_term)) |
            (Project.country.ilike(search_term))
        )

    results = query.group_by(ProjectTypology.typology).order_by(func.count(distinct(ProjectTypology.project_id)).desc()).all()

    return [{"typology": r.typology, "count": r.count} for r in results]
