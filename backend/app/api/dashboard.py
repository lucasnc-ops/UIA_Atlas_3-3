from fastapi import APIRouter, Depends, Query, Request, Response
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct, select
from typing import Optional, List
from ..core.database import get_db
from ..core.limiter import limiter
from ..models.project import Project, ProjectSDG, ProjectTypology, ProjectRequirement, WorkflowStatus, ProjectImage
from ..schemas.project import ProjectListResponse, DashboardKPIs, ProjectResponse
from .projects import _format_project_response

router = APIRouter()


@router.get("/filters")
async def get_dashboard_filters(response: Response, db: Session = Depends(get_db)):
    response.headers["Cache-Control"] = "public, max-age=300"
    """Get available filter options"""
    
    # Cities (only from approved projects)
    cities = db.query(distinct(Project.city))\
        .filter(Project.workflow_status == WorkflowStatus.APPROVED)\
        .order_by(Project.city).all()
        
    # Funding types (from ProjectRequirement where type='funding', only approved projects)
    funding_sources = db.query(distinct(ProjectRequirement.requirement))\
        .join(Project)\
        .filter(
            Project.workflow_status == WorkflowStatus.APPROVED,
            ProjectRequirement.requirement_type == 'funding'
        )\
        .order_by(ProjectRequirement.requirement).all()
        
    return {
        "cities": [c[0] for c in cities if c[0]],
        "funding_sources": [f[0] for f in funding_sources if f[0]]
    }


@router.get("/kpis", response_model=DashboardKPIs)
@limiter.limit("60/minute")
async def get_dashboard_kpis(
    request: Request,
    response: Response,
    region: Optional[str] = Query(None),
    sdg: Optional[int] = Query(None),
    city: Optional[str] = Query(None),
    funded_by: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    edition: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    response.headers["Cache-Control"] = "public, max-age=30"
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
    if funded_by and funded_by != "All":
        query = query.join(ProjectRequirement).filter(
            ProjectRequirement.requirement_type == 'funding',
            ProjectRequirement.requirement == funded_by
        )
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Project.project_name.ilike(search_term)) |
            (Project.city.ilike(search_term)) |
            (Project.country.ilike(search_term))
        )
    if edition == "2026":
        query = query.filter(Project.external_code.like("P%"))
    elif edition == "2023":
        query = query.filter(~Project.external_code.like("P%"))

    # Calculate metrics
    stats = query.with_entities(
        func.count(Project.id).label('total_projects'),
        func.count(distinct(Project.city)).label('cities_engaged'),
        func.count(distinct(Project.country)).label('countries_represented'),
    ).first()

    return {
        "total_projects": stats.total_projects or 0,
        "cities_engaged": stats.cities_engaged or 0,
        "countries_represented": stats.countries_represented or 0,
    }


@router.get("/projects", response_model=ProjectListResponse)
async def get_dashboard_projects(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    region: Optional[str] = Query(None),
    sdg: Optional[int] = Query(None),
    city: Optional[str] = Query(None),
    funded_by: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: str = Query("created_at", pattern="^(project_name|created_at)$"),
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
    if funded_by and funded_by != "All":
        query = query.join(ProjectRequirement).filter(
            ProjectRequirement.requirement_type == 'funding',
            ProjectRequirement.requirement == funded_by
        )
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
@limiter.limit("60/minute")
async def get_map_markers(
    request: Request,
    region: Optional[str] = Query(None),
    sdg: Optional[int] = Query(None),
    city: Optional[str] = Query(None),
    funded_by: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    edition: Optional[str] = Query(None),
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
        Project.uia_region,
        Project.project_status,
        ProjectImage.image_url
    ).outerjoin(
        ProjectImage, (ProjectImage.project_id == Project.id) & (ProjectImage.display_order == 0)
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
    if funded_by and funded_by != "All":
        query = query.join(ProjectRequirement).filter(
            ProjectRequirement.requirement_type == 'funding',
            ProjectRequirement.requirement == funded_by
        )
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Project.project_name.ilike(search_term)) |
            (Project.city.ilike(search_term)) |
            (Project.country.ilike(search_term))
        )
    if edition == "2026":
        query = query.filter(Project.external_code.like("P%"))
    elif edition == "2023":
        query = query.filter(~Project.external_code.like("P%"))

    # Correlated subquery: min SDG number per project (one DB round trip total)
    primary_sdg_subq = (
        select(func.min(ProjectSDG.sdg_number))
        .where(ProjectSDG.project_id == Project.id)
        .correlate(Project)
        .scalar_subquery()
    )

    query = query.add_columns(primary_sdg_subq.label("primary_sdg"))

    markers = query.all()

    return [
        {
            "id": str(m.id),
            "project_name": m.project_name,
            "city": m.city,
            "country": m.country,
            "latitude": m.latitude,
            "longitude": m.longitude,
            "region": m.uia_region.value if m.uia_region else None,
            "status": m.project_status.value if m.project_status else None,
            "primary_sdg": m.primary_sdg,
            "image_url": m.image_url
        }
        for m in markers
    ]


@router.get("/analytics/sdg-distribution")
async def get_sdg_distribution(
    region: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    funded_by: Optional[str] = Query(None),
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
    if funded_by and funded_by != "All":
        query = query.join(ProjectRequirement).filter(
            ProjectRequirement.project_id == Project.id,
            ProjectRequirement.requirement_type == 'funding',
            ProjectRequirement.requirement == funded_by
        )
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
    funded_by: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get project count by region"""

    query = db.query(
        Project.uia_region,
        func.count(Project.id).label('count')
    ).filter(
        Project.workflow_status == WorkflowStatus.APPROVED
    )

    if sdg:
        query = query.join(ProjectSDG).filter(ProjectSDG.sdg_number == sdg)
    if city and city != "All Cities":
        query = query.filter(Project.city == city)
    if funded_by and funded_by != "All":
        query = query.join(ProjectRequirement).filter(
            ProjectRequirement.project_id == Project.id,
            ProjectRequirement.requirement_type == 'funding',
            ProjectRequirement.requirement == funded_by
        )
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Project.project_name.ilike(search_term)) |
            (Project.city.ilike(search_term)) |
            (Project.country.ilike(search_term))
        )

    results = query.group_by(Project.uia_region).all()

    return [
        {"region": r.uia_region.value, "project_count": r.count}
        for r in results
    ]


@router.get("/analytics/typology-distribution")
async def get_typology_distribution(
    region: Optional[str] = Query(None),
    sdg: Optional[int] = Query(None),
    funded_by: Optional[str] = Query(None),
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
    if funded_by and funded_by != "All":
        query = query.join(ProjectRequirement).filter(
            ProjectRequirement.project_id == Project.id,
            ProjectRequirement.requirement_type == 'funding',
            ProjectRequirement.requirement == funded_by
        )
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Project.project_name.ilike(search_term)) |
            (Project.city.ilike(search_term)) |
            (Project.country.ilike(search_term))
        )

    results = query.group_by(ProjectTypology.typology).order_by(func.count(distinct(ProjectTypology.project_id)).desc()).all()

    return [{"typology": r.typology, "count": r.count} for r in results]


@router.get("/analytics/country-distribution")
async def get_country_distribution(
    region: Optional[str] = Query(None),
    sdg: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(15, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Get top countries by project count"""

    query = db.query(
        Project.country,
        func.count(Project.id).label('count')
    ).filter(Project.workflow_status == WorkflowStatus.APPROVED)

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

    results = query.group_by(Project.country)\
        .order_by(func.count(Project.id).desc())\
        .limit(limit).all()

    return [{"country": r.country, "count": r.count} for r in results]


@router.get("/analytics/status-distribution")
async def get_status_distribution(
    region: Optional[str] = Query(None),
    sdg: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get project count by project_status"""

    query = db.query(
        Project.project_status,
        func.count(Project.id).label('count')
    ).filter(Project.workflow_status == WorkflowStatus.APPROVED)

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

    results = query.group_by(Project.project_status).all()

    return [
        {"status": r.project_status.value if r.project_status else "Unknown", "count": r.count}
        for r in results
    ]
