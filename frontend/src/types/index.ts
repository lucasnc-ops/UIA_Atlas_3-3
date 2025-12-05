// Core Types for Atlas 3+3

export type ProjectStatus = 'Planned' | 'In Progress' | 'Implemented';

export type WorkflowStatus = 'submitted' | 'in_review' | 'approved' | 'rejected' | 'changes_requested';

export type UIARegion =
  | 'Section I - Western Europe'
  | 'Section II - Eastern Europe & Central Asia'
  | 'Section III - Middle East & Africa'
  | 'Section IV - Asia & Pacific'
  | 'Section V - Americas';

export type ProjectTypology =
  | 'Residential'
  | 'Commercial & Mixed-Use'
  | 'Hospitality & Tourism'
  | 'Educational'
  | 'Healthcare'
  | 'Civic & Government'
  | 'Cultural & Heritage'
  | 'Sports & Recreation'
  | 'Industrial & Logistics'
  | 'Infrastructure & Utilities'
  | 'Public Realm & Urban Landscape'
  | 'Natural Environment & Ecological Projects'
  | 'Traditional Markets & Bazaars'
  | 'Other';

export type FundingRequirement =
  | 'Private Investment / Corporate Sponsorship'
  | 'Public Funding / Government Grants'
  | 'International Aid / Development Grants'
  | 'Community Funding / Crowdfunding'
  | 'Philanthropic Support';

export type GovernmentRequirement =
  | 'National Government Support & Political Will'
  | 'Regional / Gubernatorial Support'
  | 'Local / Municipal Support & Endorsement'
  | 'Favorable Policies or Regulations'
  | 'Streamlined Permitting & Approval Process';

export type OtherRequirement =
  | 'Strong Project Leadership & Management'
  | 'Media Coverage & Public Awareness'
  | 'Availability of Land / Site'
  | 'Other';

export type SDG = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17;

export interface SDGInfo {
  id: SDG;
  title: string;
  color: string;
}

export interface Project {
  id: string;
  projectName: string;
  organizationName: string;
  contactPerson: string;
  contactEmail: string;
  projectStatus: ProjectStatus;
  workflowStatus: WorkflowStatus;
  fundingNeeded: number;
  fundingSpent: number;
  uiaRegion: UIARegion;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  briefDescription: string;
  detailedDescription: string;
  successFactors: string;
  typologies: ProjectTypology[];
  fundingRequirements: FundingRequirement[];
  governmentRequirements: GovernmentRequirement[];
  otherRequirements: OtherRequirement[];
  sdgs: SDG[];
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSubmission {
  projectName: string;
  organizationName: string;
  contactPerson: string;
  contactEmail: string;
  projectStatus: ProjectStatus;
  fundingNeeded: number;
  uiaRegion: UIARegion;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  briefDescription: string;
  detailedDescription: string;
  successFactors: string;
  typologies: ProjectTypology[];
  fundingRequirements: FundingRequirement[];
  governmentRequirements: GovernmentRequirement[];
  otherRequirements: OtherRequirement[];
  otherRequirementText?: string;
  sdgs: SDG[];
  imageUrls: string[];
}

export interface DashboardKPIs {
  totalProjects: number;
  citiesEngaged: number;
  countriesRepresented: number;
  totalFundingNeeded: number;
  totalFundingSpent: number;
}

export interface FilterOptions {
  region?: UIARegion | 'All Regions';
  sdg?: SDG | 'All SDGs';
  city?: string | 'All Cities';
  fundedBy?: string | 'All';
  search?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'reviewer' | 'manager';
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
