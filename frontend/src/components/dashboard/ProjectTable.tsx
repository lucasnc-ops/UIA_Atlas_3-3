import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api/dashboard';
import type { Project, FilterOptions } from '../../types';

interface ProjectTableProps {
  filters: FilterOptions;
  onProjectClick: (project: Project) => void;
}

export default function ProjectTable({ filters, onProjectClick }: ProjectTableProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchProjects();
  }, [filters, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      // API expects filters and pagination
      const data = await dashboardAPI.getProjects(page, pageSize, filters);
      setProjects(data.projects);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      // Fetch all (up to 1000) for export based on current filters
      const data = await dashboardAPI.getProjects(1, 1000, filters);
      const exportProjects = data.projects;

      if (exportProjects.length === 0) {
        alert("No projects to export.");
        return;
      }

      const headers = [
        "Project Name",
        "Region",
        "City",
        "Country",
        "Status",
        "Funding Needed",
        "Funding Spent",
        "Organization"
      ];

      const csvRows = exportProjects.map((p: any) => [
        `"${p.projectName.replace(/