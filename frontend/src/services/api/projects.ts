import { apiClient } from './client';

export interface ProjectCreate {
  project_name: string;
  organization_name: string;
  contact_person: string;
  contact_email: string;
  project_status: string;
  funding_needed: number;
  uia_region: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  brief_description: string;
  detailed_description: string;
  success_factors: string;
  typologies: string[];
  funding_requirements: string[];
  government_requirements: string[];
  other_requirements: string[];
  other_requirement_text?: string;
  sdgs: number[];
  image_urls: string[];
  captcha_token?: string;
}

export const projectsApi = {
  submit: async (data: ProjectCreate) => {
    const response = await apiClient.post('/api/projects/submit', data);
    return response.data;
  },

  getByToken: async (token: string) => {
    const response = await apiClient.get(`/api/projects/edit/${token}`);
    return response.data;
  },

  updateByToken: async (token: string, data: ProjectCreate) => {
    const response = await apiClient.put(`/api/projects/edit/${token}`, data);
    return response.data;
  },
};
