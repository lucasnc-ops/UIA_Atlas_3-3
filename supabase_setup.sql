-- =====================================================
-- Atlas 3+3 - Complete Supabase Database Setup
-- Union of International Architects (UIA)
-- Sustainable Architecture Mapping Platform
-- =====================================================
-- This script creates the entire database schema and
-- populates it with 22 real-world SDG projects
-- =====================================================

-- Enable PostGIS extension for geographic queries
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- DROP EXISTING TABLES (if any) - CAREFUL!
-- =====================================================
-- Uncomment the following lines if you want to start fresh
-- DROP TABLE IF EXISTS project_images CASCADE;
-- DROP TABLE IF EXISTS project_requirements CASCADE;
-- DROP TABLE IF EXISTS project_typologies CASCADE;
-- DROP TABLE IF EXISTS project_sdgs CASCADE;
-- DROP TABLE IF EXISTS projects CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TYPE IF EXISTS projectstatus CASCADE;
-- DROP TYPE IF EXISTS workflowstatus CASCADE;
-- DROP TYPE IF EXISTS uiaregion CASCADE;
-- DROP TYPE IF EXISTS userrole CASCADE;

-- =====================================================
-- CREATE ENUM TYPES
-- =====================================================

CREATE TYPE projectstatus AS ENUM ('PLANNED', 'IN_PROGRESS', 'IMPLEMENTED');
CREATE TYPE workflowstatus AS ENUM ('SUBMITTED', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED');
CREATE TYPE uiaregion AS ENUM ('SECTION_I', 'SECTION_II', 'SECTION_III', 'SECTION_IV', 'SECTION_V');
CREATE TYPE userrole AS ENUM ('ADMIN', 'REVIEWER', 'MANAGER');

-- =====================================================
-- CREATE TABLES
-- =====================================================

-- USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR NOT NULL UNIQUE,
    hashed_password VARCHAR NOT NULL,
    role userrole NOT NULL DEFAULT 'REVIEWER',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_users_email ON users(email);

-- PROJECTS TABLE
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    project_name VARCHAR(500) NOT NULL,
    project_status projectstatus NOT NULL DEFAULT 'PLANNED',
    workflow_status workflowstatus NOT NULL DEFAULT 'SUBMITTED',
    funding_needed FLOAT,
    funding_spent FLOAT,
    uia_region uiaregion NOT NULL,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    latitude FLOAT,
    longitude FLOAT,
    brief_description TEXT NOT NULL,
    detailed_description TEXT NOT NULL,
    success_factors TEXT NOT NULL,
    other_requirement_text TEXT,
    rejection_reason TEXT,
    reviewer_notes TEXT,
    edit_token VARCHAR(255),
    gdpr_consent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_projects_city ON projects(city);
CREATE INDEX ix_projects_contact_email ON projects(contact_email);
CREATE INDEX ix_projects_country ON projects(country);
CREATE INDEX ix_projects_project_name ON projects(project_name);
CREATE INDEX ix_projects_uia_region ON projects(uia_region);
CREATE INDEX ix_projects_workflow_status ON projects(workflow_status);
CREATE INDEX ix_projects_edit_token ON projects(edit_token);

-- PROJECT SDGS (Many-to-Many)
CREATE TABLE project_sdgs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    sdg_number INTEGER NOT NULL CHECK (sdg_number >= 1 AND sdg_number <= 17)
);

CREATE INDEX ix_project_sdgs_sdg_number ON project_sdgs(sdg_number);
CREATE INDEX ix_project_sdgs_project_id ON project_sdgs(project_id);

-- PROJECT TYPOLOGIES (Many-to-Many)
CREATE TABLE project_typologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    typology VARCHAR(255) NOT NULL
);

CREATE INDEX ix_project_typologies_typology ON project_typologies(typology);
CREATE INDEX ix_project_typologies_project_id ON project_typologies(project_id);

-- PROJECT REQUIREMENTS (Many-to-Many)
CREATE TABLE project_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    requirement_type VARCHAR(50) NOT NULL,
    requirement VARCHAR(500) NOT NULL
);

CREATE INDEX ix_project_requirements_type ON project_requirements(requirement_type);
CREATE INDEX ix_project_requirements_project_id ON project_requirements(project_id);

-- PROJECT IMAGES (One-to-Many)
CREATE TABLE project_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    image_url VARCHAR(1000) NOT NULL,
    display_order INTEGER
);

CREATE INDEX ix_project_images_project_id ON project_images(project_id);

-- =====================================================
-- INSERT ADMIN USER
-- =====================================================
-- Password: admin123 (hashed with bcrypt)
-- IMPORTANT: Change this password after first login!
INSERT INTO users (email, hashed_password, role) VALUES
('admin@uia.org', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5aeOlWCt7.vVe', 'ADMIN');

-- =====================================================
-- INSERT 22 WORLDWIDE PROJECTS
-- =====================================================

-- Project 1: Barcelona Superblocks
DO $$
DECLARE
    project_id UUID := uuid_generate_v4();
BEGIN
    INSERT INTO projects (id, organization_name, contact_person, contact_email, project_name, project_status, workflow_status, funding_needed, funding_spent, uia_region, city, country, latitude, longitude, brief_description, detailed_description, success_factors, gdpr_consent)
    VALUES (project_id, 'Barcelona City Council - Urban Ecology Agency', 'Pere Martínez', 'pmartinez@bcn.cat', 'Barcelona Superblocks: Urban Regeneration for Livable Streets', 'IMPLEMENTED', 'APPROVED', 12500000, 11200000, 'SECTION_I', 'Barcelona', 'Spain', 41.3851, 2.1734, 'Transforming city blocks into pedestrian-priority zones to reduce traffic, improve air quality, and create vibrant community spaces.', 'The Barcelona Superblocks (Superilles) initiative reclaims street space from cars and returns it to residents. Each superblock encompasses nine city blocks where through-traffic is restricted, speed limits are reduced to 10-20 km/h, and streets are redesigned as shared spaces with greenery, play areas, and community gathering spots. The project has dramatically reduced air pollution, noise levels, and traffic accidents while increasing walking, cycling, and community interaction. Since implementation began in 2016, the city has created over 6 superblocks with plans for 500+ across Barcelona by 2030.', 'Strong political leadership from Barcelona City Council; Co-design process with local residents; Phased implementation starting with low-cost tactical interventions; Integration with broader sustainable mobility strategy; Robust data collection showing measurable benefits; International recognition bringing additional funding and technical support.', TRUE);

    INSERT INTO project_sdgs (project_id, sdg_number) VALUES (project_id, 11), (project_id, 13), (project_id, 3);
    INSERT INTO project_typologies (project_id, typology) VALUES (project_id, 'Public Realm & Urban Landscape'), (project_id, 'Infrastructure');
    INSERT INTO project_requirements (project_id, requirement_type, requirement) VALUES
        (project_id, 'other', 'Local Community Support'),
        (project_id, 'government', 'Strong Political Leadership'),
        (project_id, 'funding', 'Public Sector Funding'),
        (project_id, 'other', 'Community Engagement Framework');
END $$;

-- Project 2: Medellín Library Parks
DO $$
DECLARE
    project_id UUID := uuid_generate_v4();
BEGIN
    INSERT INTO projects (id, organization_name, contact_person, contact_email, project_name, project_status, workflow_status, funding_needed, funding_spent, uia_region, city, country, latitude, longitude, brief_description, detailed_description, success_factors, gdpr_consent)
    VALUES (project_id, 'Municipality of Medellín - Urban Innovation Department', 'Carlos Restrepo', 'crestrepo@medellin.gov.co', 'Medellín Urban Acupuncture: Library Parks in Informal Settlements', 'IMPLEMENTED', 'APPROVED', 8750000, 8200000, 'SECTION_V', 'Medellín', 'Colombia', 6.2442, -75.5812, 'Strategic placement of world-class library parks in marginalized neighborhoods to catalyze social transformation and urban renewal.', 'Medellín''s Library Parks (Parques Biblioteca) represent urban acupuncture at its finest - placing exceptional public architecture and programming in the city''s most challenged neighborhoods. Each library park combines a state-of-the-art library with community spaces, educational programs, and public realm improvements. The España Library Park, built in a former conflict zone, has become a symbol of urban transformation. These projects have reduced violence, increased educational attainment, and sparked complementary investments in public space, housing, and transportation infrastructure throughout surrounding communities.', 'Political commitment to equity-focused urban investment; Architectural excellence creating neighborhood pride; Comprehensive programming beyond just books; Strategic location selection in areas of greatest need; Integration with broader urban mobility projects; Strong partnerships with local community organizations; Sustained investment in programming and maintenance.', TRUE);

    INSERT INTO project_sdgs (project_id, sdg_number) VALUES (project_id, 4), (project_id, 10), (project_id, 11), (project_id, 16);
    INSERT INTO project_typologies (project_id, typology) VALUES (project_id, 'Educational'), (project_id, 'Public Realm & Urban Landscape'), (project_id, 'Cultural');
    INSERT INTO project_requirements (project_id, requirement_type, requirement) VALUES
        (project_id, 'government', 'Strong Political Leadership'),
        (project_id, 'funding', 'Public Sector Funding'),
        (project_id, 'other', 'Community Engagement Framework'),
        (project_id, 'other', 'Local Community Support');
END $$;

-- Project 3: Copenhagen District Heating
DO $$
DECLARE
    project_id UUID := uuid_generate_v4();
BEGIN
    INSERT INTO projects (id, organization_name, contact_person, contact_email, project_name, project_status, workflow_status, funding_needed, funding_spent, uia_region, city, country, latitude, longitude, brief_description, detailed_description, success_factors, gdpr_consent)
    VALUES (project_id, 'Copenhagen District Heating (HOFOR)', 'Morten Stobbe', 'mstobbe@hofor.dk', 'Copenhagen District Heating: City-Wide Renewable Energy Distribution', 'IMPLEMENTED', 'APPROVED', 2100000000, 1950000000, 'SECTION_I', 'Copenhagen', 'Denmark', 55.6761, 12.5683, 'Comprehensive district heating network serving 98% of Copenhagen with renewable energy, eliminating individual heating systems and dramatically reducing carbon emissions.', 'Copenhagen operates one of the world''s most comprehensive district heating systems, providing space heating and hot water to 98% of the city through an underground network of insulated pipes carrying hot water from centralized renewable energy plants. The system has evolved from waste-to-energy incineration plants to incorporate geothermal, biomass, solar thermal, and heat pumps. This infrastructure eliminates the need for individual heating systems in buildings, creates massive efficiency gains, and has been crucial to Copenhagen''s goal of carbon neutrality by 2025. The system demonstrates how cities can retrofit existing urban areas with clean energy infrastructure at scale.', 'Long-term municipal ownership and planning (started in 1920s); Gradual expansion and technology evolution; Strong regulatory framework requiring connection; Heat price stability and consumer benefit; Integration with waste management and renewable energy strategy; Continuous innovation in heat sources and efficiency; Replicable model being exported globally.', TRUE);

    INSERT INTO project_sdgs (project_id, sdg_number) VALUES (project_id, 7), (project_id, 11), (project_id, 13);
    INSERT INTO project_typologies (project_id, typology) VALUES (project_id, 'Infrastructure');
    INSERT INTO project_requirements (project_id, requirement_type, requirement) VALUES
        (project_id, 'government', 'Strong Political Leadership'),
        (project_id, 'funding', 'Public Sector Funding'),
        (project_id, 'other', 'Technical Expertise'),
        (project_id, 'government', 'Favorable Policy Environment');
END $$;

-- Project 4: Singapore Vertical Farming
DO $$
DECLARE
    project_id UUID := uuid_generate_v4();
BEGIN
    INSERT INTO projects (id, organization_name, contact_person, contact_email, project_name, project_status, workflow_status, funding_needed, funding_spent, uia_region, city, country, latitude, longitude, brief_description, detailed_description, success_factors, gdpr_consent)
    VALUES (project_id, 'Singapore Food Agency & Sky Greens Pte Ltd', 'Dr. Lim Wei Ming', 'wei_ming.lim@sfa.gov.sg', 'Singapore Vertical Farming: 30x30 Food Security Initiative', 'IN_PROGRESS', 'APPROVED', 45000000, 38000000, 'SECTION_IV', 'Singapore', 'Singapore', 1.3521, 103.8198, 'Pioneering vertical farming technologies to achieve 30% domestic food production by 2030 in land-scarce Singapore.', 'Singapore''s 30x30 initiative aims to produce 30% of the nation''s nutritional needs locally by 2030, despite having less than 1% of land available for agriculture. The program focuses on high-tech vertical farming, aquaponics, and controlled environment agriculture. Sky Greens operates the world''s first commercial vertical farm, producing vegetables in A-frame aluminum towers that use 95% less water and pesticides than traditional farming. The government provides grants, technical support, and regulatory frameworks to scale urban farming technologies. This addresses food security, reduces carbon footprint from imports, and creates new green economy jobs.', 'Government-led strategic planning and financial support; Strong R&D partnerships with universities; Regulatory sandbox for food technology innovation; Focus on high-value crops suited to urban farming; Consumer education and market development; Integration with broader smart city initiatives; Technology transfer and export potential.', TRUE);

    INSERT INTO project_sdgs (project_id, sdg_number) VALUES (project_id, 2), (project_id, 9), (project_id, 11), (project_id, 12);
    INSERT INTO project_typologies (project_id, typology) VALUES (project_id, 'Industrial'), (project_id, 'Infrastructure');
    INSERT INTO project_requirements (project_id, requirement_type, requirement) VALUES
        (project_id, 'government', 'Strong Political Leadership'),
        (project_id, 'other', 'Technical Expertise'),
        (project_id, 'other', 'Research Institution Partnership'),
        (project_id, 'other', 'Private Sector Partnership');
END $$;

-- Project 5: Kigali Master Plan
DO $$
DECLARE
    project_id UUID := uuid_generate_v4();
BEGIN
    INSERT INTO projects (id, organization_name, contact_person, contact_email, project_name, project_status, workflow_status, funding_needed, funding_spent, uia_region, city, country, latitude, longitude, brief_description, detailed_description, success_factors, gdpr_consent)
    VALUES (project_id, 'City of Kigali & Rwanda Development Board', 'Pudence Rubingisa', 'prubingisa@kigalicity.gov.rw', 'Kigali Master Plan: Africa''s Model Sustainable City', 'IN_PROGRESS', 'APPROVED', 3200000000, 1800000000, 'SECTION_III', 'Kigali', 'Rwanda', -1.9441, 30.0619, 'Comprehensive urban master plan transforming Kigali into a green, inclusive, and resilient model city for Africa.', 'Kigali''s 2040 Master Plan represents comprehensive urban transformation, building on Rwanda''s remarkable post-genocide recovery. The plan emphasizes green building standards, mixed-use development, public transportation, affordable housing, and preservation of the city''s unique hillside topography. Key initiatives include: mandatory green building certification, BRT system, wetland conservation, waste-to-energy plants, and affordable housing cooperatives. The plan balances rapid urbanization (5% annual population growth) with environmental protection and social inclusion. Kigali has become a model for sustainable African urbanism, hosting UN-Habitat conferences and sharing expertise across the continent.', 'Strong national political commitment and governance; Clear vision and long-term planning; Integration of environmental protection with development; Emphasis on citizen participation and transparency; Strategic partnerships with international development organizations; Focus on building local capacity and institutions; Zero tolerance for corruption enabling effective implementation.', TRUE);

    INSERT INTO project_sdgs (project_id, sdg_number) VALUES (project_id, 11), (project_id, 13), (project_id, 16), (project_id, 10);
    INSERT INTO project_typologies (project_id, typology) VALUES (project_id, 'Infrastructure'), (project_id, 'Public Realm & Urban Landscape'), (project_id, 'Residential');
    INSERT INTO project_requirements (project_id, requirement_type, requirement) VALUES
        (project_id, 'government', 'Strong Political Leadership'),
        (project_id, 'funding', 'International Funding'),
        (project_id, 'other', 'Community Engagement Framework'),
        (project_id, 'other', 'Environmental Assessment');
END $$;

-- Project 6: Vienna Social Housing
DO $$
DECLARE
    project_id UUID := uuid_generate_v4();
BEGIN
    INSERT INTO projects (id, organization_name, contact_person, contact_email, project_name, project_status, workflow_status, funding_needed, funding_spent, uia_region, city, country, latitude, longitude, brief_description, detailed_description, success_factors, gdpr_consent)
    VALUES (project_id, 'Wiener Wohnen (Vienna Housing Authority)', 'Kathrin Gaál', 'kathrin.gaal@wien.gv.at', 'Vienna Social Housing: 100 Years of Inclusive Urban Development', 'IMPLEMENTED', 'APPROVED', 850000000, 820000000, 'SECTION_I', 'Vienna', 'Austria', 48.2082, 16.3738, 'Century-long municipal housing program providing affordable, high-quality homes to 60% of Vienna''s population.', 'Vienna''s social housing program, dating to the 1920s, provides affordable rental housing to approximately 600,000 residents - nearly 60% of the city''s population. Unlike public housing in many cities, Vienna''s Gemeindebau includes middle-class residents and maintains high architectural and environmental standards. Recent projects emphasize energy efficiency, community facilities, and mixed-income integration. The program is funded through a housing tax on all residents and employers, creating a sustainable financing model. Vienna consistently ranks as the world''s most livable city, with housing affordability being a key factor. The model demonstrates how cities can provide quality housing as a public good rather than commodity.', 'Century of consistent political commitment across different governments; Sustainable financing through dedicated housing tax; High architectural and construction standards; Mixed-income integration preventing stigmatization; Strong tenant rights and security; Continuous innovation in sustainable building practices; Integration with public transportation and community facilities.', TRUE);

    INSERT INTO project_sdgs (project_id, sdg_number) VALUES (project_id, 11), (project_id, 10), (project_id, 1);
    INSERT INTO project_typologies (project_id, typology) VALUES (project_id, 'Residential');
    INSERT INTO project_requirements (project_id, requirement_type, requirement) VALUES
        (project_id, 'government', 'Strong Political Leadership'),
        (project_id, 'funding', 'Public Sector Funding'),
        (project_id, 'government', 'Favorable Policy Environment'),
        (project_id, 'other', 'Community Engagement Framework');
END $$;

-- Project 7: Curitiba BRT
DO $$
DECLARE
    project_id UUID := uuid_generate_v4();
BEGIN
    INSERT INTO projects (id, organization_name, contact_person, contact_email, project_name, project_status, workflow_status, funding_needed, funding_spent, uia_region, city, country, latitude, longitude, brief_description, detailed_description, success_factors, gdpr_consent)
    VALUES (project_id, 'URBS (Urbanização de Curitiba)', 'Roberto Gregório', 'rgregorio@urbs.curitiba.pr.gov.br', 'Curitiba Bus Rapid Transit: Pioneering Sustainable Urban Mobility', 'IMPLEMENTED', 'APPROVED', 125000000, 118000000, 'SECTION_V', 'Curitiba', 'Brazil', -25.4284, -49.2733, 'World''s first Bus Rapid Transit system, serving 85% of commuters and reducing car dependency while spurring sustainable urban development.', 'Curitiba pioneered Bus Rapid Transit (BRT) in the 1970s, creating a metro-quality bus system that has become a global model. The system features dedicated bus lanes, metro-style stations, articulated buses, and integrated fare payment. BRT serves 2.3 million passengers daily - 85% of the metropolitan area''s public transport users. The system has reduced car dependency, improved air quality, and guided urban development along transit corridors. Curitiba''s model has been replicated in over 200 cities worldwide. The success stems from integrated urban planning that combined transportation with land use, environmental protection, and social equity considerations.', 'Visionary planning leadership (Mayor Jamie Lerner); Integration of transportation with urban development policy; Phased implementation allowing system refinement; Strong political continuity enabling long-term investment; Innovative design making bus travel aspirational rather than stigmatized; Environmental integration including flood management; Cost-effectiveness compared to rail alternatives; Global knowledge sharing and technical assistance.', TRUE);

    INSERT INTO project_sdgs (project_id, sdg_number) VALUES (project_id, 11), (project_id, 13), (project_id, 9);
    INSERT INTO project_typologies (project_id, typology) VALUES (project_id, 'Infrastructure');
    INSERT INTO project_requirements (project_id, requirement_type, requirement) VALUES
        (project_id, 'government', 'Strong Political Leadership'),
        (project_id, 'funding', 'Public Sector Funding'),
        (project_id, 'other', 'Technical Expertise'),
        (project_id, 'other', 'Community Engagement Framework');
END $$;

-- Project 8: Freiburg Solar City
DO $$
DECLARE
    project_id UUID := uuid_generate_v4();
BEGIN
    INSERT INTO projects (id, organization_name, contact_person, contact_email, project_name, project_status, workflow_status, funding_needed, funding_spent, uia_region, city, country, latitude, longitude, brief_description, detailed_description, success_factors, gdpr_consent)
    VALUES (project_id, 'City of Freiburg & Fraunhofer Institute', 'Dieter Salomon', 'dsalomon@stadt.freiburg.de', 'Freiburg Solar City: Germany''s Renewable Energy Showcase', 'IMPLEMENTED', 'APPROVED', 2800000000, 2650000000, 'SECTION_I', 'Freiburg', 'Germany', 47.9990, 7.8421, 'Comprehensive renewable energy transformation making Freiburg Germany''s solar capital and global sustainable city model.', 'Freiburg has transformed from a traditional German city to the country''s renewable energy capital, generating more solar power per capita than almost anywhere in the world. The city''s comprehensive approach includes: mandatory solar installations on new buildings, district heating from renewable sources, energy-efficient building standards (Passivhaus), extensive cycling infrastructure, car-free neighborhoods, and strong environmental education programs. The Vauban and Rieselfeld eco-districts showcase sustainable urban living with energy-positive buildings, car-sharing systems, and extensive green space. Freiburg demonstrates how mid-sized cities can achieve carbon neutrality while maintaining economic prosperity and high quality of life.', 'Strong environmental movement and citizen engagement since 1970s; Integration of university research with municipal policy; Early adoption of feed-in tariffs for renewable energy; Comprehensive building energy standards; Transportation planning prioritizing cycling and public transit; Green economic development attracting clean-tech companies; International networking and knowledge sharing; Long-term political commitment across party lines.', TRUE);

    INSERT INTO project_sdgs (project_id, sdg_number) VALUES (project_id, 7), (project_id, 11), (project_id, 13);
    INSERT INTO project_typologies (project_id, typology) VALUES (project_id, 'Infrastructure'), (project_id, 'Residential');
    INSERT INTO project_requirements (project_id, requirement_type, requirement) VALUES
        (project_id, 'government', 'Strong Political Leadership'),
        (project_id, 'other', 'Technical Expertise'),
        (project_id, 'other', 'Research Institution Partnership'),
        (project_id, 'other', 'Community Engagement Framework');
END $$;

-- Project 9: Portland Urban Growth Boundary
DO $$
DECLARE
    project_id UUID := uuid_generate_v4();
BEGIN
    INSERT INTO projects (id, organization_name, contact_person, contact_email, project_name, project_status, workflow_status, funding_needed, funding_spent, uia_region, city, country, latitude, longitude, brief_description, detailed_description, success_factors, gdpr_consent)
    VALUES (project_id, 'Metro Portland Regional Government', 'Lynn Peterson', 'lynn.peterson@oregonmetro.gov', 'Portland Urban Growth Boundary: 50 Years of Smart Growth', 'IMPLEMENTED', 'APPROVED', 95000000, 89000000, 'SECTION_V', 'Portland', 'United States', 45.5152, -122.6784, 'Nation''s first urban growth boundary containing sprawl, protecting farmland, and creating vibrant, walkable neighborhoods.', 'Portland''s Urban Growth Boundary (UGB), established in 1973, contains urban development within a defined area, forcing denser development and protecting surrounding farmland and natural areas. The UGB covers Portland''s metro area (1.5 million people) and is adjusted only through rigorous analysis showing need for additional land. This has created: vibrant downtown and neighborhood centers, extensive public transit including streetcars and light rail, preserved agricultural land, reduced infrastructure costs, and increased walkability. Portland demonstrates how regional planning can balance growth with environmental protection while creating economic opportunities and livable communities.', 'State-level planning mandate providing legal framework; Regional government structure enabling metropolitan coordination; Strong public participation in planning processes; Integration with transportation and environmental planning; Flexible implementation allowing boundary adjustments based on data; Political culture valuing environmental protection and urbanism; Economic benefits demonstrating policy effectiveness; Continuous monitoring and adaptive management.', TRUE);

    INSERT INTO project_sdgs (project_id, sdg_number) VALUES (project_id, 11), (project_id, 15), (project_id, 2);
    INSERT INTO project_typologies (project_id, typology) VALUES (project_id, 'Infrastructure'), (project_id, 'Public Realm & Urban Landscape');
    INSERT INTO project_requirements (project_id, requirement_type, requirement) VALUES
        (project_id, 'government', 'Strong Political Leadership'),
        (project_id, 'government', 'Favorable Policy Environment'),
        (project_id, 'other', 'Community Engagement Framework'),
        (project_id, 'other', 'Environmental Assessment');
END $$;

-- Project 10: Bogotá Ciclovía
DO $$
DECLARE
    project_id UUID := uuid_generate_v4();
BEGIN
    INSERT INTO projects (id, organization_name, contact_person, contact_email, project_name, project_status, workflow_status, funding_needed, funding_spent, uia_region, city, country, latitude, longitude, brief_description, detailed_description, success_factors, gdpr_consent)
    VALUES (project_id, 'Instituto Distrital de Recreación y Deporte (IDRD)', 'Blanca Durán', 'bduran@idrd.gov.co', 'Bogotá Ciclovía: Weekly Car-Free Streets for 2 Million People', 'IMPLEMENTED', 'APPROVED', 12000000, 11500000, 'SECTION_V', 'Bogotá', 'Colombia', 4.7110, -74.0721, 'World''s largest weekly car-free event, opening 121km of streets to 2 million cyclists, walkers, and families every Sunday.', 'Bogotá''s Ciclovía transforms the city every Sunday and holiday, closing 121 kilometers of streets to cars and opening them to cyclists, pedestrians, and families. Started in 1976, the program now attracts over 2 million participants weekly - making it the world''s largest car-free street event. Ciclovía includes not just cycling but aerobics classes, cultural events, and community activities throughout the city. The program has inspired similar initiatives in 400+ cities worldwide and demonstrates how cities can reclaim street space for people. Research shows significant health, social, and economic benefits, including increased physical activity, social cohesion, and local business revenue along Ciclovía routes.', 'Simple concept with massive participation enabling political support; Strong safety protocols and community policing; Integration with broader cycling infrastructure development; Cultural programming beyond just cycling; Free participation ensuring inclusive access; International recognition bringing tourism and investment; Measurable health and economic benefits; Replication support helping spread globally.', TRUE);

    INSERT INTO project_sdgs (project_id, sdg_number) VALUES (project_id, 3), (project_id, 11), (project_id, 10);
    INSERT INTO project_typologies (project_id, typology) VALUES (project_id, 'Public Realm & Urban Landscape'), (project_id, 'Sports & Recreation');
    INSERT INTO project_requirements (project_id, requirement_type, requirement) VALUES
        (project_id, 'government', 'Strong Political Leadership'),
        (project_id, 'other', 'Community Engagement Framework'),
        (project_id, 'other', 'Local Community Support');
END $$;

-- Project 11: Tokyo Disaster Preparedness
DO $$
DECLARE
    project_id UUID := uuid_generate_v4();
BEGIN
    INSERT INTO projects (id, organization_name, contact_person, contact_email, project_name, project_status, workflow_status, funding_needed, funding_spent, uia_region, city, country, latitude, longitude, brief_description, detailed_description, success_factors, gdpr_consent)
    VALUES (project_id, 'Tokyo Metropolitan Government - Bureau of Urban Development', 'Hiroshi Nakamura', 'hnakamura@metro.tokyo.lg.jp', 'Tokyo Disaster Preparedness: Resilient Megacity Planning', 'IMPLEMENTED', 'APPROVED', 4500000000, 4200000000, 'SECTION_IV', 'Tokyo', 'Japan', 35.6762, 139.6503, 'Comprehensive urban resilience planning preparing 37 million people for earthquakes, floods, and climate change impacts.', 'Tokyo''s comprehensive disaster preparedness system protects the world''s largest urban agglomeration (37 million people) from earthquakes, tsunamis, floods, and climate change impacts. The system includes: strict seismic building codes, underground flood tunnels, early warning systems, neighborhood emergency supplies, evacuation planning, and resilient infrastructure design. The massive Underground Discharge Channel protects the city from flooding during typhoons. Community-level disaster preparedness includes neighborhood associations, emergency supply distribution, and regular drills. Tokyo demonstrates how megacities can build resilience through integrated planning combining infrastructure, technology, community preparation, and governance systems.', 'Historical experience with disasters driving political commitment; Integration of disaster planning with urban development; Strong building codes and enforcement; Community-level preparation and social capital; Advanced technology for early warning and communication; Continuous learning and system updating after each event; International cooperation and knowledge sharing; Long-term investment in resilient infrastructure.', TRUE);

    INSERT INTO project_sdgs (project_id, sdg_number) VALUES (project_id, 11), (project_id, 13), (project_id, 1);
    INSERT INTO project_typologies (project_id, typology) VALUES (project_id, 'Infrastructure'), (project_id, 'Civic');
    INSERT INTO project_requirements (project_id, requirement_type, requirement) VALUES
        (project_id, 'government', 'Strong Political Leadership'),
        (project_id, 'other', 'Technical Expertise'),
        (project_id, 'other', 'Community Engagement Framework'),
        (project_id, 'funding', 'Public Sector Funding');
END $$;

-- Project 12: Vancouver Olympic Village
DO $$
DECLARE
    project_id UUID := uuid_generate_v4();
BEGIN
    INSERT INTO projects (id, organization_name, contact_person, contact_email, project_name, project_status, workflow_status, funding_needed, funding_spent, uia_region, city, country, latitude, longitude, brief_description, detailed_description, success_factors, gdpr_consent)
    VALUES (project_id, 'City of Vancouver & Canada Mortgage and Housing Corporation', 'Sean Pander', 'sean.pander@vancouver.ca', 'Vancouver Olympic Village: Carbon-Neutral Neighborhood Development', 'IMPLEMENTED', 'APPROVED', 1200000000, 1150000000, 'SECTION_V', 'Vancouver', 'Canada', 49.2827, -123.1207, 'First carbon-neutral neighborhood in North America, showcasing sustainable building design and urban planning innovations.', 'Vancouver''s Olympic Village, built for the 2010 Winter Olympics, became North America''s first carbon-neutral neighborhood and a showcase for sustainable urban development. The 16-hectare waterfront community features LEED Platinum buildings, district energy system, extensive green infrastructure, affordable housing integration, and car-sharing systems. The neighborhood energy utility uses sewage heat recovery and other renewable sources. The project demonstrates how cities can achieve carbon neutrality while creating vibrant, mixed-income communities. Post-Olympics, the village has become a model for sustainable neighborhood development, influencing Vancouver''s broader climate action goals and green building requirements.', 'Olympic momentum creating political will and international attention; Integration of social, environmental, and economic sustainability goals; Public-private partnerships enabling innovation; Comprehensive planning including energy, transportation, and social infrastructure; Strong green building standards and certification; Mixed-income housing preventing gentrification; Waterfront location providing development premium; Knowledge transfer and replication support.', TRUE);

    INSERT INTO project_sdgs (project_id, sdg_number) VALUES (project_id, 7), (project_id, 11), (project_id, 13);
    INSERT INTO project_typologies (project_id, typology) VALUES (project_id, 'Residential'), (project_id, 'Infrastructure');
    INSERT INTO project_requirements (project_id, requirement_type, requirement) VALUES
        (project_id, 'government', 'Strong Political Leadership'),
        (project_id, 'funding', 'Public Sector Funding'),
        (project_id, 'other', 'Private Sector Partnership'),
        (project_id, 'other', 'Technical Expertise');
END $$;

-- Project 13: Cape Town Day Zero
DO $$
DECLARE
    project_id UUID := uuid_generate_v4();
BEGIN
    INSERT INTO projects (id, organization_name, contact_person, contact_email, project_name, project_status, workflow_status, funding_needed, funding_spent, uia_region, city, country, latitude, longitude, brief_description, detailed_description, success_factors, gdpr_consent)
    VALUES (project_id, 'City of Cape Town Water and Sanitation Department', 'Xanthea Limberg', 'xanthea.limberg@capetown.gov.za', 'Cape Town Day Zero: Water Crisis Management and Conservation', 'IMPLEMENTED', 'APPROVED', 375000000, 340000000, 'SECTION_III', 'Cape Town', 'South Africa', -33.9249, 18.4241, 'Emergency water conservation program that averted ''Day Zero'' and transformed Cape Town into a water-resilient city.', 'Cape Town faced ''Day Zero'' - the day taps would run dry - during the 2015-2018 drought, the worst in 400 years. The city implemented aggressive demand management, reducing consumption from 1.2 billion to 500 million liters daily through: strict water restrictions, household quotas, pressure management, leak repair, greywater recycling, and intensive public communication. Emergency desalination plants and groundwater extraction provided additional supply. Citizens reduced consumption by 50%+ through behavior change. The crisis was averted, and Cape Town emerged as a global leader in urban water resilience. The experience demonstrates how cities can mobilize collective action during emergencies while building long-term sustainability.', 'Crisis-driven political leadership and citizen mobilization; Transparent communication about severity and progress; Comprehensive demand and supply management strategy; Strong technical capacity in water management; Social solidarity across economic divides; Innovative pricing and restriction mechanisms; Investment in alternative water sources; Learning and adaptation during implementation; International support and knowledge sharing.', TRUE);

    INSERT INTO project_sdgs (project_id, sdg_number) VALUES (project_id, 6), (project_id, 11), (project_id, 13);
    INSERT INTO project_typologies (project_id, typology) VALUES (project_id, 'Infrastructure');
    INSERT INTO project_requirements (project_id, requirement_type, requirement) VALUES
        (project_id, 'government', 'Strong Political Leadership'),
        (project_id, 'other', 'Community Engagement Framework'),
        (project_id, 'other', 'Technical Expertise'),
        (project_id, 'funding', 'Public Sector Funding');
END $$;

-- Project 14: Seoul Digital Media City
DO $$
DECLARE
    project_id UUID := uuid_generate_v4();
BEGIN
    INSERT INTO projects (id, organization_name, contact_person, contact_email, project_name, project_status, workflow_status, funding_needed, funding_spent, uia_region, city, country, latitude, longitude, brief_description, detailed_description, success_factors, gdpr_consent)
    VALUES (project_id, 'Seoul Digital Media City Development Corporation', 'Kim Jung-ho', 'jkim@sdmcdc.com', 'Seoul Digital Media City: Technology Hub and Urban Regeneration', 'IMPLEMENTED', 'APPROVED', 18000000000, 16800000000, 'SECTION_IV', 'Seoul', 'South Korea', 37.5665, 126.8956, 'Comprehensive redevelopment of industrial area into Asia''s leading digital media and technology cluster.', 'Seoul Digital Media City (DMC) transformed a 135-hectare industrial waste site into Northeast Asia''s largest digital media cluster, hosting 1,000+ companies and 25,000+ workers. The project combines technology infrastructure, sustainable urban design, cultural facilities, and mixed-use development. DMC houses major broadcasting companies, gaming studios, digital content creators, and R&D centers. The development features smart city technologies, district cooling/heating, extensive green space, and integrated transportation. DMC demonstrates how cities can regenerate post-industrial areas through strategic clustering of knowledge industries while creating sustainable, livable urban environments.', 'Strategic government planning and investment in digital economy; Comprehensive infrastructure including fiber optic networks; Integration of public and private sector development; Focus on clustering related industries creating synergies; High-quality urban design and environmental standards; Strong transportation connections to broader Seoul region; Educational partnerships with universities; International marketing and business attraction.', TRUE);

    INSERT INTO project_sdgs (project_id, sdg_number) VALUES (project_id, 8), (project_id, 9), (project_id, 11);
    INSERT INTO project_typologies (project_id, typology) VALUES (project_id, 'Commercial'), (project_id, 'Infrastructure'), (project_id, 'Industrial');
    INSERT INTO project_requirements (project_id, requirement_type, requirement) VALUES
        (project_id, 'government', 'Strong Political Leadership'),
        (project_id, 'funding', 'Public Sector Funding'),
        (project_id, 'other', 'Private Sector Partnership'),
        (project_id, 'other', 'Technical Expertise');
END $$;

-- Project 15: Curitiba Green Exchange
DO $$
DECLARE
    project_id UUID := uuid_generate_v4();
BEGIN
    INSERT INTO projects (id, organization_name, contact_person, contact_email, project_name, project_status, workflow_status, funding_needed, funding_spent, uia_region, city, country, latitude, longitude, brief_description, detailed_description, success_factors, gdpr_consent)
    VALUES (project_id, 'Curitiba Municipal Environment Secretariat (SMMA)', 'SMMA Administration', 'smma@curitiba.pr.gov.br', 'Curitiba Câmbio Verde - Green Exchange Waste-for-Food Program', 'IMPLEMENTED', 'APPROVED', 2500000, 2500000, 'SECTION_V', 'Curitiba', 'Brazil', -25.4284, -49.2733, 'City-wide initiative where residents trade recyclable materials for fresh produce - 4kg recyclables for 1kg fruits/vegetables, supporting 70,000+ families.', 'Running since June 1991, Curitiba''s Green Exchange (Câmbio Verde) enables any citizen to exchange recyclable materials (paper, cardboard, glass, metals, used cooking oil) for fresh fruits and vegetables without registration. Every 4kg recyclables = 1kg produce. Monthly collection: 290 tons recyclables + 3,500 liters cooking oil diverted from incorrect disposal becoming food on tables. By 2007, recovered 45,000+ tons from landfills. Special Green Exchange operates city-wide in schools. Program employs ~600 workers. Guarantees sale of surplus crop production from small farmers while making fresh produce accessible/affordable for low-income residents in areas without conventional waste collection. Won 2010 Globe Sustainable City Award for excellence in sustainable urban development. Addresses multiple SDGs simultaneously: waste management, food security, poverty, farmer livelihoods, environmental education.', 'Innovative solution addressing multiple challenges simultaneously: waste, poverty, nutrition, farmer income; Simple accessible model requiring no registration encouraging wide participation; Partnership between Municipal Environment (SMMA) and Supply (SMAB) Secretariats; Serving vehicle-inaccessible communities (favelas) where conventional waste collection impractical; Creating circular economy connecting urban waste to agricultural surplus; Employment generation (600 workers) in waste-to-food value chain; Education component through Special Green Exchange in schools building youth environmental awareness; Recognition attracting international attention and replication; Cost-effectiveness compared to conventional waste programs; Dignity-preserving approach trading rather than charity; Over 30 years sustained political commitment across administrations; Measurable impact: 290 tons/month recyclables, 70,000+ families benefited.', TRUE);

    INSERT INTO project_sdgs (project_id, sdg_number) VALUES (project_id, 1), (project_id, 2), (project_id, 11), (project_id, 12);
    INSERT INTO project_typologies (project_id, typology) VALUES (project_id, 'Infrastructure'), (project_id, 'Public Realm & Urban Landscape'), (project_id, 'Markets & Exchange');
    INSERT INTO project_requirements (project_id, requirement_type, requirement) VALUES
        (project_id, 'other', 'Local Community Support'),
        (project_id, 'government', 'Strong Political Leadership'),
        (project_id, 'funding', 'Public Sector Funding'),
        (project_id, 'other', 'Community Engagement Framework');

    INSERT INTO project_images (project_id, image_url, display_order) VALUES
        (project_id, 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b', 0),
        (project_id, 'https://images.unsplash.com/photo-1542838132-92c53300491e', 1);
END $$;

-- Project 16: Vauban District
DO $$
DECLARE
    project_id UUID := uuid_generate_v4();
BEGIN
    INSERT INTO projects (id, organization_name, contact_person, contact_email, project_name, project_status, workflow_status, funding_needed, funding_spent, uia_region, city, country, latitude, longitude, brief_description, detailed_description, success_factors, gdpr_consent)
    VALUES (project_id, 'City of Freiburg - Vauban Development Office', 'Vauban Planning Department', 'stadtplanung@freiburg.de', 'Vauban District - Europe''s Most Sustainable Urban Community', 'IMPLEMENTED', 'APPROVED', 158000000, 158000000, 'SECTION_I', 'Freiburg', 'Germany', 47.9990, 7.8421, 'Car-reduced solar district with 5,500 residents in passive/plus-energy buildings, producing more renewable energy than consumed, with 100% locally renewable energy.', 'Vauban district transformed former military barracks (187 hectares) into Europe''s most sustainable urban community. Construction began 1998, completed in phases through 2000s following 2001 European Housing Expo. Population ~5,500 residents, 16,000+ workers. All buildings constructed to low-energy or passive house standards; many equipped with photovoltaic panels. Solar Settlement features entirely plus-energy buildings generating more energy than consumed - residents sell excess electricity to municipal grid reducing bills. ''Sun Ship'' (Das Sonnenschiff) consists entirely of plus-energy buildings. Car traffic minimized: 30 km/h speed limit, cars give right-of-way to pedestrians/cyclists, streets designed prioritizing walking/cycling/public transport. Tram line directly connects to Freiburg city center. Aktern heat pump plant produces heating/cooling stored seasonally in 90m-deep aquifer wells. 2 MW wind power plant supplies 1,000 apartments. 1,400 m² solar collectors contribute 15% total heating. 120 m² solar cells for electricity. Green Space Factor incentivized developers to create defined green space amounts, resulting in extensive green roofs providing insulation, biodiversity, stormwater management.', 'Strong political commitment from City of Freiburg supporting sustainable development; Learning from local opposition to nuclear power plants catalyzing renewable energy transition; German Energiewende policies (feed-in tariffs) making solar cost-competitive enabling mass adoption; Quality design preventing stigmatization of sustainable housing; Car-reduced not car-free approach balancing sustainability with practicality; Excellent public transit connectivity (tram to city center) enabling car-free lifestyle; Green Space Factor policy tool requiring defined greenery amounts; Participatory planning with future residents; Plus-energy buildings demonstrating technical and economic viability of net-positive construction; International recognition establishing as global model attracting study tours; Inspiring London Plan green space factor policy showing replicable influence; Mixed-use development combining residential, commercial, services; 20+ years proven sustainability demonstrating long-term viability not just experiment.', TRUE);

    INSERT INTO project_sdgs (project_id, sdg_number) VALUES (project_id, 7), (project_id, 11), (project_id, 13);
    INSERT INTO project_typologies (project_id, typology) VALUES (project_id, 'Residential'), (project_id, 'Infrastructure');
    INSERT INTO project_requirements (project_id, requirement_type, requirement) VALUES
        (project_id, 'government', 'Strong Political Leadership'),
        (project_id, 'other', 'Technical Expertise'),
        (project_id, 'other', 'Community Engagement Framework'),
        (project_id, 'other', 'Environmental Assessment');

    INSERT INTO project_images (project_id, image_url, display_order) VALUES
        (project_id, 'https://images.unsplash.com/photo-1509023464722-18d996393ca8', 0),
        (project_id, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2', 1);
END $$;

-- Project 17: Portland Green Streets
DO $$
DECLARE
    project_id UUID := uuid_generate_v4();
BEGIN
    INSERT INTO projects (id, organization_name, contact_person, contact_email, project_name, project_status, workflow_status, funding_needed, funding_spent, uia_region, city, country, latitude, longitude, brief_description, detailed_description, success_factors, gdpr_consent)
    VALUES (project_id, 'City of Portland Bureau of Environmental Services', 'BES Sustainable Stormwater', 'stormwater@portlandoregon.gov', 'Portland Green Streets - Sustainable Stormwater Management', 'IMPLEMENTED', 'APPROVED', 86000000, 86000000, 'SECTION_V', 'Portland', 'United States', 45.5152, -122.6784, 'City-wide green infrastructure network of 2,500+ facilities using rain gardens, bioswales, and permeable surfaces saving $58M over conventional drainage.', 'Portland transformed stormwater management from conventional underground pipes to above-ground sustainable strategies. Original plan: $144M for underground pipes kicking water to river potentially increasing flooding. New integrated plan: $86M using stormwater harvesting, infiltration, reuse as free irrigation - $58M savings primarily from reduced pipe replacement. Resolution No. 36500 (April 2007) adopted Green Streets Policy ENB-4.19 as Binding City Policy promoting green street facilities in public/private development. Currently maintains 2,500+ green street stormwater facilities plus ~150 vegetated regional water quality facilities distributed city-wide. 2023 authorized $12M over 5 years for on-call green infrastructure maintenance/irrigation (10 price agreements). Unlike storm drain pipe only conveying water, sustainable strategies are beautiful providing multiple benefits: traffic control, neighborhood beautification, safer walking/bicycling, natural bioremediation filtering contaminants, free irrigation for associated plantings shading/cooling neighborhoods in summer. Reduced flooding throughout subwatersheds and downstream while improving water quality. Turned problem neighborhoods into desirable neighborhoods increasing business and financial resources for city.', 'Financial analysis demonstrating $58M cost savings over conventional approach building business case; Multiple co-benefits beyond drainage: beautification, traffic calming, safety, cooling, increasing political support; Binding City Policy (Resolution 36500) providing regulatory framework ensuring implementation; Steady construction integrated into development projects spreading costs; Measurable water quality improvements providing evidence of effectiveness; Neighborhood revitalization attracting business investment creating economic development narrative; Educational value demonstrating nature-based solutions; Replicable model inspiring other US cities; Long-term commitment: $12M 5-year maintenance contract showing operational sustainability; Bureau of Environmental Services institutional leadership; Integration with broader Portland sustainability brand; Community engagement transforming skepticism into pride; Design excellence ensuring aesthetic quality.', TRUE);

    INSERT INTO project_sdgs (project_id, sdg_number) VALUES (project_id, 6), (project_id, 11), (project_id, 13), (project_id, 15);
    INSERT INTO project_typologies (project_id, typology) VALUES (project_id, 'Infrastructure'), (project_id, 'Public Realm & Urban Landscape'), (project_id, 'Natural Environment & Ecological Projects');
    INSERT INTO project_requirements (project_id, requirement_type, requirement) VALUES
        (project_id, 'government', 'Strong Political Leadership'),
        (project_id, 'funding', 'Public Sector Funding'),
        (project_id, 'government', 'Favorable Policy Environment'),
        (project_id, 'other', 'Environmental Assessment');
END $$;

-- Project 18: Cape Town New Water Programme
DO $$
DECLARE
    project_id UUID := uuid_generate_v4();
BEGIN
    INSERT INTO projects (id, organization_name, contact_person, contact_email, project_name, project_status, workflow_status, funding_needed, funding_spent, uia_region, city, country, latitude, longitude, brief_description, detailed_description, success_factors, gdpr_consent)
    VALUES (project_id, 'City of Cape Town Water & Sanitation Department', 'Water Resilience Office', 'water@capetown.gov.za', 'Cape Town New Water Programme - Overcoming Day Zero Crisis', 'IN_PROGRESS', 'APPROVED', 580000000, 250000000, 'SECTION_III', 'Cape Town', 'South Africa', -33.9249, 18.4241, 'Comprehensive water resilience strategy delivering 300 million liters/day from alternative sources by 2030 after near Day Zero crisis in 2018.', 'Following devastating 2015-2018 drought bringing Cape Town within 90 days of ''Day Zero'' (taps running dry), city adopted comprehensive resilience strategy. New Water Programme targets 300 million liters/day (ML/day) by 2030 from alternative sources. R10 billion ($580M) of R30B capital expenditure plan invested in water/sanitation infrastructure over 3 years ensuring sustainable development. City raised R1 billion Green Bond on Johannesburg Stock Exchange funding key sustainability projects: reservoir upgrades, water pressure management, water reuse, sewer/supply network upgrades. Groundwater: R4.7B ($250M) investment bringing 105 ML/day from aquifers by 2036. Table Mountain Group Aquifer delivered first water 2020; Cape Flats Aquifer expected mid-2023. Quadrupled annual rate for pipe replacement maintaining low water losses. Desalination and reuse projects coordinated with Independent Advisory Panel and Water Research Commission ensuring transparency/accountability. City targets <950 ML/day consumption converting water savings into culture. Greater Cape Town Water Fund: Nature-based solutions restoring watersheds, R50M city contribution 2021-2023. Added 17.6 billion liters annually through watershed restoration.', 'Crisis focusing political will and public support for major investment; Communication strategy using ''Day Zero'' narrative effectively changing middle-class water consumption behavior; Diversified portfolio approach (groundwater, desalination, reuse, conservation) reducing risk; Green Bond financing (R1B) demonstrating innovative funding mechanism; Nature-based solutions complementing gray infrastructure: Greater Cape Town Water Fund watershed restoration cost-effective; Public-private partnerships for water reuse/desalination; Cultural shift: sustained conservation even after crisis passed; Transparent governance through Independent Advisory Panel; Integration with broader climate adaptation strategy; Learning from near-disaster preventing future crises; International attention bringing funding and technical support; Evidence-based planning using best available climate models.', TRUE);

    INSERT INTO project_sdgs (project_id, sdg_number) VALUES (project_id, 6), (project_id, 11), (project_id, 13);
    INSERT INTO project_typologies (project_id, typology) VALUES (project_id, 'Infrastructure');
    INSERT INTO project_requirements (project_id, requirement_type, requirement) VALUES
        (project_id, 'government', 'Strong Political Leadership'),
        (project_id, 'other', 'Community Engagement Framework'),
        (project_id, 'other', 'Technical Expertise'),
        (project_id, 'funding', 'Public Sector Funding');
END $$;

-- Project 19: Malmö Western Harbour Bo01
DO $$
DECLARE
    project_id UUID := uuid_generate_v4();
BEGIN
    INSERT INTO projects (id, organization_name, contact_person, contact_email, project_name, project_status, workflow_status, funding_needed, funding_spent, uia_region, city, country, latitude, longitude, brief_description, detailed_description, success_factors, gdpr_consent)
    VALUES (project_id, 'City of Malmö - Western Harbour Development', 'Western Harbour Project Office', 'westernharbour@malmo.se', 'Malmö Western Harbour Bo01 - Climate-Neutral Urban District', 'IMPLEMENTED', 'APPROVED', 450000000, 450000000, 'SECTION_I', 'Malmö', 'Sweden', 55.6167, 12.9833, '187-hectare transformation of run-down shipyard into vibrant sustainable district with 10,000 residents, 100% locally renewable energy, extensive green infrastructure.', 'Malmö Western Harbour transformed previously run-down shipyard/industrial area (187 hectares) into vibrant ''city within a city'' with university, ~10,000 residents, 16,000+ workers. Bo01 district designed by international architects following 2001 European Housing Expo emphasizing sustainability broadly. Many buildings have green roofs with plants varying colors by season plus extensive rainwater runoff systems. Aktern heat pump plant at energy system heart producing heating/cooling stored seasonally in natural aquifers in 90m-deep wells. Electricity from local 2 MW wind power plant supplying 1,000 apartments. 1,400 m² solar collectors on roofs/walls contribute 15% total heating. 120 m² solar cells for electricity generation. Modern waste collection systems facilitate efficient management: glass, metal, plastic, paper, food waste separated for recycling; residual waste incinerated for heating; food waste transported to Sjölunda biogas plant converted to slurry then Kristianstad recycling plant producing biogas heating Bo01 buildings. 200 households have waste grinders. Green Space Factor (developer dialogue quality program element) required defined green space creation with differential weighting: more points for trees/bushes than grass, domestic species preferred, green roofs included. Green roofs provide insulation, increase biodiversity, retain rainwater relieving stormwater system. 20+ years operational demonstrating sustained sustainability.', 'Transforming brownfield (shipyard) into sustainable asset demonstrating urban regeneration potential; Strong municipal vision and commitment from City of Malmö; International architectural competition attracting design excellence; European Housing Expo 2001 showcasing innovations internationally; 100% locally renewable energy demonstrating technical feasibility; Integrated waste-to-energy and biogas systems creating circular resource flows; Green Space Factor policy tool incentivizing green infrastructure; Green roofs providing multiple benefits (insulation, biodiversity, stormwater); Mixed-use development combining residential, employment, education creating complete community; Public space quality attracting residents and businesses; Inspiration for London Plan Green Space Factor showing policy influence; 20+ year track record proving long-term viability; Carbon neutrality achievement demonstrating climate action feasibility; Accessibility design throughout district.', TRUE);

    INSERT INTO project_sdgs (project_id, sdg_number) VALUES (project_id, 7), (project_id, 11), (project_id, 12), (project_id, 13);
    INSERT INTO project_typologies (project_id, typology) VALUES (project_id, 'Residential'), (project_id, 'Infrastructure');
    INSERT INTO project_requirements (project_id, requirement_type, requirement) VALUES
        (project_id, 'government', 'Strong Political Leadership'),
        (project_id, 'funding', 'Public Sector Funding'),
        (project_id, 'other', 'Technical Expertise'),
        (project_id, 'other', 'Environmental Assessment');
END $$;

-- Project 20: Addis Ababa Light Rail
DO $$
DECLARE
    project_id UUID := uuid_generate_v4();
BEGIN
    INSERT INTO projects (id, organization_name, contact_person, contact_email, project_name, project_status, workflow_status, funding_needed, funding_spent, uia_region, city, country, latitude, longitude, brief_description, detailed_description, success_factors, gdpr_consent)
    VALUES (project_id, 'Ethiopian Railways Corporation', 'ERC Light Rail Division', 'info@erc.gov.et', 'Addis Ababa Light Rail Transit - Sub-Saharan Africa First LRT', 'IMPLEMENTED', 'APPROVED', 475000000, 475000000, 'SECTION_III', 'Addis Ababa', 'Ethiopia', 9.0320, 38.7469, 'Sub-Saharan Africa''s first light rail: 31.6km system carrying 60,000 passengers/hour powered by renewable energy (hydro/geothermal/wind), reducing emissions 170,000 tons CO2/year.', 'Inaugurated September 2015 as Sub-Saharan Africa first modern light-rail train (LRT). North-south line intersecting east-west line totaling 19.6 miles (31.6km). Cost $475M ($24M/mile). Built by China State Railways with Export-Import Bank of China loans; rail cars manufactured China. Can carry 60,000 people/hour; after 10 months reached 15,000 passengers/hour each direction. Powered by Ethiopia grid: almost exclusively hydropower, geothermal, wind - making it renewable energy-powered transit. Transportation accounts 47% CO2 emissions in Addis; LRT reduces greenhouse gases while bringing clean efficient transport. Emissions reductions: 55,000 tons CO2/year (2015) growing to 170,000 tons/year by 2030. Average transport speed improved from 10 km/hour road traffic to 22 km/hour with LRT significantly reducing worker commute times. 1,100+ jobs created to operate LRT. Ethiopian government expects reduced foreign oil purchases. Decreased particulate emissions reducing heart/respiratory diseases. Blueprint for local expansion and regional replication. Part of Addis Ababa Climate Resilient Growth Economy plan driving green economy transition. However faces maintenance challenges: only 8 of 41 trains functional 7 years later, operates alternate days for track maintenance, needs $60M restoration.', 'Sub-Saharan Africa first demonstrating continental leadership and ambition; International collaboration: Ethiopian government, Chinese government, foreign banks enabling complex financing; Integration with Climate Resilient Growth Economy plan connecting to broader development strategy; Renewable energy grid (hydro/geothermal/wind) making it truly low-carbon transport; Measurable emissions reductions (170,000 tons CO2/year by 2030); Significant commute time reduction (10 to 22 km/hour) improving quality of life; Job creation (1,100+ positions) providing employment; Health benefits from reduced air pollution; Low cost per mile ($24M) compared to developed country projects; However: maintenance challenges highlighting importance of operational planning, technology transfer, and sustainable financing beyond construction; Lessons: initial cost advantage undermined without maintenance capacity and funding.', TRUE);

    INSERT INTO project_sdgs (project_id, sdg_number) VALUES (project_id, 7), (project_id, 9), (project_id, 11), (project_id, 13);
    INSERT INTO project_typologies (project_id, typology) VALUES (project_id, 'Infrastructure');
    INSERT INTO project_requirements (project_id, requirement_type, requirement) VALUES
        (project_id, 'government', 'Strong Political Leadership'),
        (project_id, 'other', 'Technical Expertise'),
        (project_id, 'funding', 'International Funding'),
        (project_id, 'other', 'Private Sector Partnership');
END $$;

-- Project 21: Masdar City
DO $$
DECLARE
    project_id UUID := uuid_generate_v4();
BEGIN
    INSERT INTO projects (id, organization_name, contact_person, contact_email, project_name, project_status, workflow_status, funding_needed, funding_spent, uia_region, city, country, latitude, longitude, brief_description, detailed_description, success_factors, gdpr_consent)
    VALUES (project_id, 'Masdar / Mubadala Development Company', 'Masdar City Management', 'info@masdar.ae', 'Masdar City - Zero-Carbon Eco-City in the Desert', 'IN_PROGRESS', 'APPROVED', 19800000000, 2400000000, 'SECTION_III', 'Abu Dhabi', 'United Arab Emirates', 24.4292, 54.6167, '6 sq km sustainable city in Abu Dhabi desert targeting 50,000 residents with net-zero energy buildings, renewable power, 40% reduced energy/water consumption.', 'Masdar City is Abu Dhabi government-funded ecology project designed by Foster and Partners, built by Masdar (Mubadala Development Company subsidiary). Construction started 2008 next to Abu Dhabi International Airport. Originally planned completion 2016, pushed to 2020-2025 due to global financial crisis; building to demand not speculating empty buildings. Estimated construction cost $18.7-19.8 billion. Abu Dhabi invested $2.4 billion smart city initiatives since 2015. Currently 4,000+ residents, ultimate capacity ~50,000. Hosts headquarters International Renewable Energy Agency (IRENA). 1,000+ public/private organizations based in city (6 sq km economic free zone). Community powered partly by on-site renewable energy, constructed using sustainable materials. Eco-friendly buildings designed reducing energy/water consumption minimum 40%; some exceed this. Three net-zero energy buildings under construction producing as much energy as consumed. Masdar Green REIT portfolio valued AED 980M (USD 267M) December 2021 with 3.3% valuation gain. Part of UAE long-term plan achieving net zero 2050 and diversifying economy beyond oil. Hub for cleantech companies: Siemens, GE, IRENA, Advanced Technology Research Council. Solar power costs as little as 1.35 cents/kWh demonstrating economic viability.', 'Strong Abu Dhabi government political and financial commitment demonstrating state capacity; Diversification strategy beyond oil providing strategic imperative; World-class design by Foster and Partners ensuring architectural quality; Economic free zone attracting international companies and investment; IRENA headquarters providing international legitimacy and visibility; $50M UAE-Caribbean Renewable Energy Fund demonstrating technology export; Masdar Green REIT providing innovative financing mechanism and investment opportunity; ESG investment attractiveness as first ''green'' REIT in UAE; Pragmatic timeline adjustment (building to demand) avoiding ghost city syndrome; Clean technology cluster creating innovation ecosystem; Test-bed for renewable energy technologies before broader deployment; Integration with Abu Dhabi Vision 2030; However: original 100% renewable energy goal moderated showing challenge of absolute sustainability in practice; Lessons: ambition must balance with feasibility.', TRUE);

    INSERT INTO project_sdgs (project_id, sdg_number) VALUES (project_id, 7), (project_id, 9), (project_id, 11), (project_id, 12), (project_id, 13);
    INSERT INTO project_typologies (project_id, typology) VALUES (project_id, 'Commercial'), (project_id, 'Infrastructure'), (project_id, 'Industrial');
    INSERT INTO project_requirements (project_id, requirement_type, requirement) VALUES
        (project_id, 'government', 'Strong Political Leadership'),
        (project_id, 'funding', 'Public Sector Funding'),
        (project_id, 'other', 'Private Sector Partnership'),
        (project_id, 'other', 'Technical Expertise');
END $$;

-- Project 22: Mexico City Rainwater Harvesting
DO $$
DECLARE
    project_id UUID := uuid_generate_v4();
BEGIN
    INSERT INTO projects (id, organization_name, contact_person, contact_email, project_name, project_status, workflow_status, funding_needed, funding_spent, uia_region, city, country, latitude, longitude, brief_description, detailed_description, success_factors, gdpr_consent)
    VALUES (project_id, 'SEDEMA - Mexico City Environment Secretariat', 'Cosecha de Lluvia Program', 'cosecha@sedema.cdmx.gob.mx', 'Mexico City Cosecha de Lluvia - Rainwater Harvesting for Water Security', 'IN_PROGRESS', 'APPROVED', 18000000, 18000000, 'SECTION_V', 'Mexico City', 'Mexico', 19.4326, -99.1332, 'Citywide rainwater harvesting: 2,300+ systems installed in 1,800+ schools serving 1.3M users, capturing 918 million liters annually, reducing water scarcity in marginalized areas.', 'Mexico City Rainwater Harvesting Program (Cosecha de Lluvia) addresses acute water scarcity in marginalized neighborhoods lacking reliable piped water supply. Since 2023 with ''Escuelas de Captación'' (Schools of Harvesting) project: 2,300+ rainwater harvesting systems (SCALL) installed in 1,800+ educational facilities all levels city-wide. Investment: 300 million pesos (~$18M USD). Benefits 1.3M+ total users (students + staff). Majority in basic education schools, covering all 16 Alcaldías (boroughs). Annual capture capacity: 918 million liters alleviating pressure on traditional water sources. Systems enable water for showering, washing, cooking where public supply doesn''t reach or is unreliable. Before program, residents collected rainwater with makeshift systems filtered through cotton cloths or bought water from tanker trucks (pipas) carrying in jerry cans. RHS consists of receptacle ''Tlaloc'' (named after Aztec rain god) filtering dust before water runs into 5,000-liter tank distributed to local network. First 2-3 downpours pass through for cleaner harvested water. Installation cost ~$270 per system. Successfully reduced water scarcity, improved welfare for beneficiary households, avoided GHG emissions from centralized water provision, reduced urban runoff supporting climate adaptation.', 'Addressing critical need in vehicle-inaccessible areas where conventional infrastructure doesn''t reach; Low-cost appropriate technology accessible to resource-constrained communities ($270/system); Schools-first strategy maximizing impact: 1.3M users including vulnerable children; Education integration teaching students about water conservation and climate adaptation; Community organizing building local ownership and maintenance capacity; Cultural relevance naming system after Aztec rain god Tlaloc; Simple design enabling replication and local maintenance; Impressive scale: 2,300+ systems demonstrating programmatic not just pilot approach; Multiple benefits: water security, GHG reduction, flood mitigation, nutrition (clean water for cooking); Dignity-preserving approach replacing tanker truck dependence; Replicable model for other Latin American cities facing similar challenges; Climate adaptation building resilience to supply disruptions.', TRUE);

    INSERT INTO project_sdgs (project_id, sdg_number) VALUES (project_id, 6), (project_id, 11), (project_id, 13);
    INSERT INTO project_typologies (project_id, typology) VALUES (project_id, 'Infrastructure'), (project_id, 'Educational');
    INSERT INTO project_requirements (project_id, requirement_type, requirement) VALUES
        (project_id, 'other', 'Community Engagement Framework'),
        (project_id, 'other', 'Local Community Support'),
        (project_id, 'other', 'Technical Expertise'),
        (project_id, 'other', 'Cultural Sensitivity');
END $$;

-- =====================================================
-- COMPLETE!
-- =====================================================

SELECT 'Database setup complete!' AS status;
SELECT COUNT(*) AS total_projects FROM projects;
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS total_sdgs FROM project_sdgs;
SELECT COUNT(*) AS total_typologies FROM project_typologies;
SELECT COUNT(*) AS total_requirements FROM project_requirements;
SELECT COUNT(*) AS total_images FROM project_images;
