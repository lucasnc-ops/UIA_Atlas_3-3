-- =============================================================================
-- supabase_update_typologies.sql
-- Generated from user-verified classification of 141 UIA projects
-- =============================================================================

-- Step 1: Add website_url column (idempotent)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS website_url TEXT;

-- Step 2: Insert typologies for all 141 projects
-- Each row keyed on external_code (unique index)

-- EFP1: Residential, Natural Environment & Ecological Projects
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'EFP1'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'EFP1'
ON CONFLICT DO NOTHING;

-- IFF35: Residential, Infrastructure, Natural Environment & Ecological Projects
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'IFF35'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Infrastructure' FROM projects WHERE external_code = 'IFF35'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'IFF35'
ON CONFLICT DO NOTHING;

-- IFF61: Educational
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'IFF61'
ON CONFLICT DO NOTHING;

-- LDP15: Civic, Cultural
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'LDP15'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Cultural' FROM projects WHERE external_code = 'LDP15'
ON CONFLICT DO NOTHING;

-- LDP3: Residential, Civic
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'LDP3'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'LDP3'
ON CONFLICT DO NOTHING;

-- LDP71: Public Realm & Urban Landscape, Civic
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'LDP71'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'LDP71'
ON CONFLICT DO NOTHING;

-- IFF15: Natural Environment & Ecological Projects, Markets & Exchange
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'IFF15'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Markets & Exchange' FROM projects WHERE external_code = 'IFF15'
ON CONFLICT DO NOTHING;

-- IFF4: Natural Environment & Ecological Projects, Markets & Exchange, Educational
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'IFF4'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Markets & Exchange' FROM projects WHERE external_code = 'IFF4'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'IFF4'
ON CONFLICT DO NOTHING;

-- IFF44: Natural Environment & Ecological Projects, Industrial
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'IFF44'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Industrial' FROM projects WHERE external_code = 'IFF44'
ON CONFLICT DO NOTHING;

-- IFF59: Cultural
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Cultural' FROM projects WHERE external_code = 'IFF59'
ON CONFLICT DO NOTHING;

-- LDP25: Educational, Natural Environment & Ecological Projects
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'LDP25'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'LDP25'
ON CONFLICT DO NOTHING;

-- LDP52: Cultural, Natural Environment & Ecological Projects
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Cultural' FROM projects WHERE external_code = 'LDP52'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'LDP52'
ON CONFLICT DO NOTHING;

-- IFF12: Educational
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'IFF12'
ON CONFLICT DO NOTHING;

-- LDP1: Residential, Commercial, Public Realm & Urban Landscape
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'LDP1'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Commercial' FROM projects WHERE external_code = 'LDP1'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'LDP1'
ON CONFLICT DO NOTHING;

-- LDP12: Civic, Cultural
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'LDP12'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Cultural' FROM projects WHERE external_code = 'LDP12'
ON CONFLICT DO NOTHING;

-- LDP21: Public Realm & Urban Landscape, Cultural
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'LDP21'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Cultural' FROM projects WHERE external_code = 'LDP21'
ON CONFLICT DO NOTHING;

-- LDP28: Civic
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'LDP28'
ON CONFLICT DO NOTHING;

-- LDP43: Sports & Recreation
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Sports & Recreation' FROM projects WHERE external_code = 'LDP43'
ON CONFLICT DO NOTHING;

-- IFF24: Educational, Natural Environment & Ecological Projects
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'IFF24'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'IFF24'
ON CONFLICT DO NOTHING;

-- IFF37: Infrastructure, Public Realm & Urban Landscape, Natural Environment & Ecological Projects
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Infrastructure' FROM projects WHERE external_code = 'IFF37'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'IFF37'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'IFF37'
ON CONFLICT DO NOTHING;

-- LDP17: Educational
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'LDP17'
ON CONFLICT DO NOTHING;

-- LDP20: Educational, Civic
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'LDP20'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'LDP20'
ON CONFLICT DO NOTHING;

-- LDP23: Educational
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'LDP23'
ON CONFLICT DO NOTHING;

-- LDP67: Educational
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'LDP67'
ON CONFLICT DO NOTHING;

-- IFF3: Public Realm & Urban Landscape, Civic
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'IFF3'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'IFF3'
ON CONFLICT DO NOTHING;

-- IFF7: Residential, Civic
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'IFF7'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'IFF7'
ON CONFLICT DO NOTHING;

-- LDP11: Commercial
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Commercial' FROM projects WHERE external_code = 'LDP11'
ON CONFLICT DO NOTHING;

-- LDP59: Commercial, Industrial
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Commercial' FROM projects WHERE external_code = 'LDP59'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Industrial' FROM projects WHERE external_code = 'LDP59'
ON CONFLICT DO NOTHING;

-- LDP6: Educational, Residential
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'LDP6'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'LDP6'
ON CONFLICT DO NOTHING;

-- LDP72: Civic, Infrastructure
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'LDP72'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Infrastructure' FROM projects WHERE external_code = 'LDP72'
ON CONFLICT DO NOTHING;

-- IFF2: Infrastructure, Public Realm & Urban Landscape, Residential
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Infrastructure' FROM projects WHERE external_code = 'IFF2'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'IFF2'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'IFF2'
ON CONFLICT DO NOTHING;

-- LDP2: Commercial
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Commercial' FROM projects WHERE external_code = 'LDP2'
ON CONFLICT DO NOTHING;

-- LDP31: Infrastructure, Natural Environment & Ecological Projects
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Infrastructure' FROM projects WHERE external_code = 'LDP31'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'LDP31'
ON CONFLICT DO NOTHING;

-- LDP37: Infrastructure, Civic
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Infrastructure' FROM projects WHERE external_code = 'LDP37'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'LDP37'
ON CONFLICT DO NOTHING;

-- LDP61: Residential
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'LDP61'
ON CONFLICT DO NOTHING;

-- LDP73: Natural Environment & Ecological Projects, Public Realm & Urban Landscape
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'LDP73'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'LDP73'
ON CONFLICT DO NOTHING;

-- IFF34: Civic, Educational
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'IFF34'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'IFF34'
ON CONFLICT DO NOTHING;

-- LDP18: Public Realm & Urban Landscape, Commercial
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'LDP18'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Commercial' FROM projects WHERE external_code = 'LDP18'
ON CONFLICT DO NOTHING;

-- LDP19: Educational, Sports & Recreation
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'LDP19'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Sports & Recreation' FROM projects WHERE external_code = 'LDP19'
ON CONFLICT DO NOTHING;

-- LDP22: Cultural, Civic
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Cultural' FROM projects WHERE external_code = 'LDP22'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'LDP22'
ON CONFLICT DO NOTHING;

-- LDP62: Educational, Cultural
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'LDP62'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Cultural' FROM projects WHERE external_code = 'LDP62'
ON CONFLICT DO NOTHING;

-- LDP8: Residential
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'LDP8'
ON CONFLICT DO NOTHING;

-- IFF48: Public Realm & Urban Landscape
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'IFF48'
ON CONFLICT DO NOTHING;

-- LDP24: Infrastructure, Public Realm & Urban Landscape
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Infrastructure' FROM projects WHERE external_code = 'LDP24'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'LDP24'
ON CONFLICT DO NOTHING;

-- LDP27: Markets & Exchange, Civic
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Markets & Exchange' FROM projects WHERE external_code = 'LDP27'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'LDP27'
ON CONFLICT DO NOTHING;

-- LDP45: Commercial
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Commercial' FROM projects WHERE external_code = 'LDP45'
ON CONFLICT DO NOTHING;

-- LDP70: Industrial, Natural Environment & Ecological Projects
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Industrial' FROM projects WHERE external_code = 'LDP70'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'LDP70'
ON CONFLICT DO NOTHING;

-- IFF16: Public Realm & Urban Landscape, Natural Environment & Ecological Projects
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'IFF16'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'IFF16'
ON CONFLICT DO NOTHING;

-- IFF42: Civic
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'IFF42'
ON CONFLICT DO NOTHING;

-- LDP14: Cultural, Civic
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Cultural' FROM projects WHERE external_code = 'LDP14'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'LDP14'
ON CONFLICT DO NOTHING;

-- LDP30: Civic, Markets & Exchange
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'LDP30'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Markets & Exchange' FROM projects WHERE external_code = 'LDP30'
ON CONFLICT DO NOTHING;

-- LDP55: Residential
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'LDP55'
ON CONFLICT DO NOTHING;

-- LDP65: Public Realm & Urban Landscape, Natural Environment & Ecological Projects
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'LDP65'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'LDP65'
ON CONFLICT DO NOTHING;

-- IFF17: Natural Environment & Ecological Projects, Sports & Recreation
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'IFF17'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Sports & Recreation' FROM projects WHERE external_code = 'IFF17'
ON CONFLICT DO NOTHING;

-- IFF52: Residential
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'IFF52'
ON CONFLICT DO NOTHING;

-- IFF56: Educational
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'IFF56'
ON CONFLICT DO NOTHING;

-- LDP44: Infrastructure, Civic
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Infrastructure' FROM projects WHERE external_code = 'LDP44'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'LDP44'
ON CONFLICT DO NOTHING;

-- LDP50: Educational
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'LDP50'
ON CONFLICT DO NOTHING;

-- LDP54: Public Realm & Urban Landscape, Civic
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'LDP54'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'LDP54'
ON CONFLICT DO NOTHING;

-- IFF5: Educational, Civic
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'IFF5'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'IFF5'
ON CONFLICT DO NOTHING;

-- IFF55: Residential, Natural Environment & Ecological Projects
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'IFF55'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'IFF55'
ON CONFLICT DO NOTHING;

-- IFF9: Cultural
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Cultural' FROM projects WHERE external_code = 'IFF9'
ON CONFLICT DO NOTHING;

-- LDP35: Educational, Commercial
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'LDP35'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Commercial' FROM projects WHERE external_code = 'LDP35'
ON CONFLICT DO NOTHING;

-- LDP47: Public Realm & Urban Landscape, Sports & Recreation, Natural Environment & Ecological Projects
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'LDP47'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Sports & Recreation' FROM projects WHERE external_code = 'LDP47'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'LDP47'
ON CONFLICT DO NOTHING;

-- LDP7: Educational, Natural Environment & Ecological Projects
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'LDP7'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'LDP7'
ON CONFLICT DO NOTHING;

-- LDP16: Cultural, Commercial
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Cultural' FROM projects WHERE external_code = 'LDP16'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Commercial' FROM projects WHERE external_code = 'LDP16'
ON CONFLICT DO NOTHING;

-- LDP29: Residential, Public Realm & Urban Landscape
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'LDP29'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'LDP29'
ON CONFLICT DO NOTHING;

-- LDP32: Residential
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'LDP32'
ON CONFLICT DO NOTHING;

-- LDP53: Commercial, Sports & Recreation
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Commercial' FROM projects WHERE external_code = 'LDP53'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Sports & Recreation' FROM projects WHERE external_code = 'LDP53'
ON CONFLICT DO NOTHING;

-- LDP66: Public Realm & Urban Landscape
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'LDP66'
ON CONFLICT DO NOTHING;

-- LDP9: Residential
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'LDP9'
ON CONFLICT DO NOTHING;

-- IFF25: Residential, Infrastructure
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'IFF25'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Infrastructure' FROM projects WHERE external_code = 'IFF25'
ON CONFLICT DO NOTHING;

-- IFF46: Cultural, Civic
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Cultural' FROM projects WHERE external_code = 'IFF46'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'IFF46'
ON CONFLICT DO NOTHING;

-- IFF49: Residential, Cultural, Natural Environment & Ecological Projects
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'IFF49'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Cultural' FROM projects WHERE external_code = 'IFF49'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'IFF49'
ON CONFLICT DO NOTHING;

-- LDP48: Public Realm & Urban Landscape, Residential, Natural Environment & Ecological Projects
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'LDP48'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'LDP48'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'LDP48'
ON CONFLICT DO NOTHING;

-- LDP49: Industrial
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Industrial' FROM projects WHERE external_code = 'LDP49'
ON CONFLICT DO NOTHING;

-- LDP69: Civic, Public Realm & Urban Landscape
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'LDP69'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'LDP69'
ON CONFLICT DO NOTHING;

-- IFF11: Natural Environment & Ecological Projects, Markets & Exchange, Cultural
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'IFF11'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Markets & Exchange' FROM projects WHERE external_code = 'IFF11'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Cultural' FROM projects WHERE external_code = 'IFF11'
ON CONFLICT DO NOTHING;

-- IFF51: Public Realm & Urban Landscape, Civic
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'IFF51'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'IFF51'
ON CONFLICT DO NOTHING;

-- LDP13: Cultural, Public Realm & Urban Landscape
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Cultural' FROM projects WHERE external_code = 'LDP13'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'LDP13'
ON CONFLICT DO NOTHING;

-- LDP26: Natural Environment & Ecological Projects, Cultural
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'LDP26'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Cultural' FROM projects WHERE external_code = 'LDP26'
ON CONFLICT DO NOTHING;

-- LDP41: Natural Environment & Ecological Projects, Sports & Recreation, Cultural
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'LDP41'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Sports & Recreation' FROM projects WHERE external_code = 'LDP41'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Cultural' FROM projects WHERE external_code = 'LDP41'
ON CONFLICT DO NOTHING;

-- LDP60: Civic, Public Realm & Urban Landscape
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'LDP60'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'LDP60'
ON CONFLICT DO NOTHING;

-- IFF10: Educational, Public Realm & Urban Landscape
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'IFF10'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'IFF10'
ON CONFLICT DO NOTHING;

-- IFF14: Civic, Public Realm & Urban Landscape, Cultural
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'IFF14'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'IFF14'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Cultural' FROM projects WHERE external_code = 'IFF14'
ON CONFLICT DO NOTHING;

-- IFF45: Civic, Educational
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'IFF45'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'IFF45'
ON CONFLICT DO NOTHING;

-- LDP34: Educational, Cultural
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'LDP34'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Cultural' FROM projects WHERE external_code = 'LDP34'
ON CONFLICT DO NOTHING;

-- LDP36: Civic
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'LDP36'
ON CONFLICT DO NOTHING;

-- LDP38: Residential
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'LDP38'
ON CONFLICT DO NOTHING;

-- LDP39: Residential
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'LDP39'
ON CONFLICT DO NOTHING;

-- IFF43: Public Realm & Urban Landscape, Educational
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'IFF43'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'IFF43'
ON CONFLICT DO NOTHING;

-- IFF58: Civic, Public Realm & Urban Landscape
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'IFF58'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'IFF58'
ON CONFLICT DO NOTHING;

-- IFF62: Public Realm & Urban Landscape, Residential, Civic
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'IFF62'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'IFF62'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'IFF62'
ON CONFLICT DO NOTHING;

-- LDP58: Public Realm & Urban Landscape, Civic
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'LDP58'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'LDP58'
ON CONFLICT DO NOTHING;

-- LDP63: Cultural, Public Realm & Urban Landscape
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Cultural' FROM projects WHERE external_code = 'LDP63'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'LDP63'
ON CONFLICT DO NOTHING;

-- LDP68: Residential
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'LDP68'
ON CONFLICT DO NOTHING;

-- IFF39: Infrastructure, Commercial
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Infrastructure' FROM projects WHERE external_code = 'IFF39'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Commercial' FROM projects WHERE external_code = 'IFF39'
ON CONFLICT DO NOTHING;

-- EFP2: Cultural, Civic
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Cultural' FROM projects WHERE external_code = 'EFP2'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Civic' FROM projects WHERE external_code = 'EFP2'
ON CONFLICT DO NOTHING;

-- IFF1: Educational
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'IFF1'
ON CONFLICT DO NOTHING;

-- IFF13: Public Realm & Urban Landscape
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'IFF13'
ON CONFLICT DO NOTHING;

-- IFF18: Public Realm & Urban Landscape, Natural Environment & Ecological Projects
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'IFF18'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'IFF18'
ON CONFLICT DO NOTHING;

-- IFF19: Public Realm & Urban Landscape, Natural Environment & Ecological Projects
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'IFF19'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'IFF19'
ON CONFLICT DO NOTHING;

-- IFF20: Public Realm & Urban Landscape, Natural Environment & Ecological Projects
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'IFF20'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'IFF20'
ON CONFLICT DO NOTHING;

-- IFF21: Infrastructure, Residential
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Infrastructure' FROM projects WHERE external_code = 'IFF21'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'IFF21'
ON CONFLICT DO NOTHING;

-- IFF22: Infrastructure, Commercial
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Infrastructure' FROM projects WHERE external_code = 'IFF22'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Commercial' FROM projects WHERE external_code = 'IFF22'
ON CONFLICT DO NOTHING;

-- IFF23: Infrastructure, Public Realm & Urban Landscape
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Infrastructure' FROM projects WHERE external_code = 'IFF23'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'IFF23'
ON CONFLICT DO NOTHING;

-- IFF26: Residential
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'IFF26'
ON CONFLICT DO NOTHING;

-- IFF27: Infrastructure, Commercial
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Infrastructure' FROM projects WHERE external_code = 'IFF27'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Commercial' FROM projects WHERE external_code = 'IFF27'
ON CONFLICT DO NOTHING;

-- IFF28: Infrastructure, Commercial
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Infrastructure' FROM projects WHERE external_code = 'IFF28'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Commercial' FROM projects WHERE external_code = 'IFF28'
ON CONFLICT DO NOTHING;

-- IFF29: Infrastructure, Commercial
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Infrastructure' FROM projects WHERE external_code = 'IFF29'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Commercial' FROM projects WHERE external_code = 'IFF29'
ON CONFLICT DO NOTHING;

-- IFF30: Infrastructure, Commercial
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Infrastructure' FROM projects WHERE external_code = 'IFF30'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Commercial' FROM projects WHERE external_code = 'IFF30'
ON CONFLICT DO NOTHING;

-- IFF31: Infrastructure, Commercial
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Infrastructure' FROM projects WHERE external_code = 'IFF31'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Commercial' FROM projects WHERE external_code = 'IFF31'
ON CONFLICT DO NOTHING;

-- IFF32: Public Realm & Urban Landscape, Educational
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'IFF32'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'IFF32'
ON CONFLICT DO NOTHING;

-- IFF33: Commercial, Markets & Exchange
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Commercial' FROM projects WHERE external_code = 'IFF33'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Markets & Exchange' FROM projects WHERE external_code = 'IFF33'
ON CONFLICT DO NOTHING;

-- IFF36: Natural Environment & Ecological Projects
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'IFF36'
ON CONFLICT DO NOTHING;

-- IFF38: Educational
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'IFF38'
ON CONFLICT DO NOTHING;

-- IFF40: Infrastructure, Commercial, Residential
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Infrastructure' FROM projects WHERE external_code = 'IFF40'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Commercial' FROM projects WHERE external_code = 'IFF40'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'IFF40'
ON CONFLICT DO NOTHING;

-- IFF41: Residential
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'IFF41'
ON CONFLICT DO NOTHING;

-- IFF47: Natural Environment & Ecological Projects, Residential
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'IFF47'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'IFF47'
ON CONFLICT DO NOTHING;

-- IFF50: Educational
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'IFF50'
ON CONFLICT DO NOTHING;

-- IFF53: Natural Environment & Ecological Projects, Public Realm & Urban Landscape
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'IFF53'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'IFF53'
ON CONFLICT DO NOTHING;

-- IFF54: Public Realm & Urban Landscape, Residential, Natural Environment & Ecological Projects
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'IFF54'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'IFF54'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'IFF54'
ON CONFLICT DO NOTHING;

-- IFF57: Natural Environment & Ecological Projects, Infrastructure
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'IFF57'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Infrastructure' FROM projects WHERE external_code = 'IFF57'
ON CONFLICT DO NOTHING;

-- IFF6: Residential, Infrastructure
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'IFF6'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Infrastructure' FROM projects WHERE external_code = 'IFF6'
ON CONFLICT DO NOTHING;

-- IFF60: Educational
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'IFF60'
ON CONFLICT DO NOTHING;

-- IFF63: Infrastructure, Public Realm & Urban Landscape
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Infrastructure' FROM projects WHERE external_code = 'IFF63'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'IFF63'
ON CONFLICT DO NOTHING;

-- IFF64: Public Realm & Urban Landscape
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'IFF64'
ON CONFLICT DO NOTHING;

-- IFF8: Residential, Public Realm & Urban Landscape
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'IFF8'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'IFF8'
ON CONFLICT DO NOTHING;

-- LDP10: Educational
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'LDP10'
ON CONFLICT DO NOTHING;

-- LDP33: Educational, Cultural
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'LDP33'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Cultural' FROM projects WHERE external_code = 'LDP33'
ON CONFLICT DO NOTHING;

-- LDP4: Cultural, Industrial, Markets & Exchange
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Cultural' FROM projects WHERE external_code = 'LDP4'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Industrial' FROM projects WHERE external_code = 'LDP4'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Markets & Exchange' FROM projects WHERE external_code = 'LDP4'
ON CONFLICT DO NOTHING;

-- LDP40: Residential, Infrastructure, Public Realm & Urban Landscape
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'LDP40'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Infrastructure' FROM projects WHERE external_code = 'LDP40'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'LDP40'
ON CONFLICT DO NOTHING;

-- LDP42: Educational
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Educational' FROM projects WHERE external_code = 'LDP42'
ON CONFLICT DO NOTHING;

-- LDP46: Public Realm & Urban Landscape
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'LDP46'
ON CONFLICT DO NOTHING;

-- LDP5: Residential
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'LDP5'
ON CONFLICT DO NOTHING;

-- LDP51: Residential, Infrastructure
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'LDP51'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Infrastructure' FROM projects WHERE external_code = 'LDP51'
ON CONFLICT DO NOTHING;

-- LDP56: Cultural, Natural Environment & Ecological Projects
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Cultural' FROM projects WHERE external_code = 'LDP56'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'LDP56'
ON CONFLICT DO NOTHING;

-- LDP57: Natural Environment & Ecological Projects
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Natural Environment & Ecological Projects' FROM projects WHERE external_code = 'LDP57'
ON CONFLICT DO NOTHING;

-- LDP64: Commercial, Public Realm & Urban Landscape
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Commercial' FROM projects WHERE external_code = 'LDP64'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Public Realm & Urban Landscape' FROM projects WHERE external_code = 'LDP64'
ON CONFLICT DO NOTHING;

-- LDP74: Residential, Infrastructure
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Residential' FROM projects WHERE external_code = 'LDP74'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Infrastructure' FROM projects WHERE external_code = 'LDP74'
ON CONFLICT DO NOTHING;

-- LDP75: Commercial, Cultural
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Commercial' FROM projects WHERE external_code = 'LDP75'
ON CONFLICT DO NOTHING;
INSERT INTO project_typologies (project_id, typology)
SELECT id, 'Cultural' FROM projects WHERE external_code = 'LDP75'
ON CONFLICT DO NOTHING;

-- =============================================================================
-- Verification:
-- =============================================================================
-- Total typology rows inserted: 256
-- SELECT typology, COUNT(*) FROM project_typologies GROUP BY typology ORDER BY COUNT(*) DESC;
-- SELECT COUNT(DISTINCT project_id) FROM project_typologies;  -- expect 141
-- SELECT column_name FROM information_schema.columns
--   WHERE table_name = 'projects' AND column_name = 'website_url';
