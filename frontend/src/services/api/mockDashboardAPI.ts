/**
 * Mock Dashboard API using embedded project data
 * This replaces the real API calls for the prototype
 */

import type { Project, DashboardKPIs, FilterOptions, SDG, ProjectTypology } from '../../types';
import {
  MOCK_PROJECTS,
  type MockProject
} from '../../data/mockProjects';

// Region name mapping
const REGION_NAMES: Record<string, string> = {
  'SECTION_I': 'Europe',
  'SECTION_II': 'Americas & Caribbean',
  'SECTION_III': 'Africa & Middle East',
  'SECTION_IV': 'Asia & Oceania',
  'SECTION_V': 'Americas',
};

// Status mapping
const STATUS_NAMES: Record<string, string> = {
  'IMPLEMENTED': 'Implemented',
  'IN_PROGRESS': 'In Progress',
  'PLANNED': 'Planned',
};

// Convert MockProject to Project type
function convertToProject(mockProject: MockProject): Project {
  return {
    id: mockProject.id,
    projectName: mockProject.projectName,
    organizationName: mockProject.organizationName,
    contactPerson: 'N/A',
    contactEmail: 'info@uia.org',
    city: mockProject.city,
    country: mockProject.country,
    latitude: mockProject.latitude,
    longitude: mockProject.longitude,
    uiaRegion: (REGION_NAMES[mockProject.region] || mockProject.region) as any,
    projectStatus: (STATUS_NAMES[mockProject.status] || mockProject.status) as any,
    workflowStatus: 'APPROVED' as any,
    fundingNeeded: mockProject.fundingNeeded,
    fundingSpent: mockProject.fundingSpent,
    briefDescription: mockProject.briefDescription,
    detailedDescription: mockProject.detailedDescription,
    successFactors: mockProject.successFactors,
    sdgs: mockProject.sdgs as SDG[],
    typologies: mockProject.typologies as ProjectTypology[],
    fundingRequirements: [],
    governmentRequirements: [],
    otherRequirements: [],
    imageUrls: mockProject.imageUrl ? [mockProject.imageUrl] : [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };
}

// Filter projects based on FilterOptions
function applyFilters(projects: MockProject[], filters?: FilterOptions): MockProject[] {
  if (!filters) return projects;

  let filtered = [...projects];

  // Region filter
  if (filters.region && filters.region !== 'All Regions') {
    filtered = filtered.filter(p => REGION_NAMES[p.region] === filters.region);
  }

  // SDG filter
  if (filters.sdg && filters.sdg !== 'All SDGs') {
    const sdgNumber = typeof filters.sdg === 'number' ? filters.sdg : parseInt(filters.sdg);
    filtered = filtered.filter(p => p.sdgs.includes(sdgNumber));
  }

  // City filter
  if (filters.city && filters.city !== 'All Cities') {
    filtered = filtered.filter(p => p.city === filters.city);
  }

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.projectName.toLowerCase().includes(searchLower) ||
      p.city.toLowerCase().includes(searchLower) ||
      p.country.toLowerCase().includes(searchLower) ||
      p.organizationName.toLowerCase().includes(searchLower) ||
      p.briefDescription.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
}

export const mockDashboardAPI = {
  // Get available filters (cities, funding sources)
  getFilters: async () => {
    const cities = Array.from(new Set(MOCK_PROJECTS.map(p => p.city))).sort();
    const regions = Array.from(new Set(MOCK_PROJECTS.map(p => REGION_NAMES[p.region]))).sort();

    return {
      cities: ['All Cities', ...cities],
      regions: ['All Regions', ...regions],
      fundingSources: ['All'],
    };
  },

  // Get KPIs
  getKPIs: async (filters?: FilterOptions): Promise<DashboardKPIs> => {
    const filteredProjects = applyFilters(MOCK_PROJECTS, filters);

    const uniqueCities = new Set(filteredProjects.map(p => p.city)).size;
    const uniqueCountries = new Set(filteredProjects.map(p => p.country)).size;
    const totalFunding = filteredProjects.reduce((sum, p) => sum + p.fundingNeeded, 0);
    const totalSpent = filteredProjects.reduce((sum, p) => sum + p.fundingSpent, 0);

    return {
      totalProjects: filteredProjects.length,
      citiesEngaged: uniqueCities,
      countriesRepresented: uniqueCountries,
      totalFundingNeeded: totalFunding,
      totalFundingSpent: totalSpent,
    };
  },

  // Get map markers
  getMapMarkers: async (filters?: FilterOptions) => {
    const filteredProjects = applyFilters(MOCK_PROJECTS, filters);

    return filteredProjects.map(p => ({
      id: p.id,
      projectName: p.projectName,
      city: p.city,
      country: p.country,
      latitude: p.latitude,
      longitude: p.longitude,
      region: REGION_NAMES[p.region] || p.region,
      status: STATUS_NAMES[p.status] || p.status,
      fundingNeeded: p.fundingNeeded,
      primarySdg: p.sdgs[0],
      imageUrl: p.imageUrl,
    }));
  },

  // Get projects list
  getProjects: async (
    filters?: FilterOptions,
    page: number = 1,
    pageSize: number = 20,
    sortBy: string = 'created_at',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) => {
    let filteredProjects = applyFilters(MOCK_PROJECTS, filters);

    // Sort
    filteredProjects.sort((a, b) => {
      let compareValue = 0;

      switch (sortBy) {
        case 'projectName':
          compareValue = a.projectName.localeCompare(b.projectName);
          break;
        case 'city':
          compareValue = a.city.localeCompare(b.city);
          break;
        case 'fundingNeeded':
          compareValue = a.fundingNeeded - b.fundingNeeded;
          break;
        case 'fundingSpent':
          compareValue = a.fundingSpent - b.fundingSpent;
          break;
        default:
          compareValue = 0;
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    // Paginate
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedProjects = filteredProjects.slice(start, end);

    return {
      projects: paginatedProjects.map(convertToProject),
      total: filteredProjects.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredProjects.length / pageSize),
    };
  },

  // Get single project
  getProject: async (projectId: string): Promise<Project> => {
    const mockProject = MOCK_PROJECTS.find(p => p.id === projectId);

    if (!mockProject) {
      throw new Error(`Project ${projectId} not found`);
    }

    return convertToProject(mockProject);
  },

  // Get analytics data
  getSDGDistribution: async (filters?: FilterOptions) => {
    const filteredProjects = applyFilters(MOCK_PROJECTS, filters);

    const sdgCounts: Record<number, number> = {};

    filteredProjects.forEach(project => {
      project.sdgs.forEach(sdg => {
        sdgCounts[sdg] = (sdgCounts[sdg] || 0) + 1;
      });
    });

    return Object.entries(sdgCounts).map(([sdg, count]) => ({
      sdg: parseInt(sdg),
      count,
    }));
  },

  getRegionalDistribution: async (filters?: FilterOptions) => {
    const filteredProjects = applyFilters(MOCK_PROJECTS, filters);

    const regionFunding: Record<string, { needed: number; spent: number; count: number }> = {};

    filteredProjects.forEach(project => {
      const regionName = REGION_NAMES[project.region] || project.region;

      if (!regionFunding[regionName]) {
        regionFunding[regionName] = { needed: 0, spent: 0, count: 0 };
      }

      regionFunding[regionName].needed += project.fundingNeeded;
      regionFunding[regionName].spent += project.fundingSpent;
      regionFunding[regionName].count += 1;
    });

    return Object.entries(regionFunding).map(([region, data]) => ({
      region,
      fundingNeeded: data.needed,
      fundingSpent: data.spent,
      projectCount: data.count,
    }));
  },

  getTypologyDistribution: async (filters?: FilterOptions) => {
    const filteredProjects = applyFilters(MOCK_PROJECTS, filters);

    const typologyCounts: Record<string, number> = {};

    filteredProjects.forEach(project => {
      project.typologies.forEach(typology => {
        typologyCounts[typology] = (typologyCounts[typology] || 0) + 1;
      });
    });

    return Object.entries(typologyCounts)
      .map(([typology, count]) => ({ typology, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  },
};
