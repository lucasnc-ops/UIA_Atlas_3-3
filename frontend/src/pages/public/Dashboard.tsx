import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, LayersControl, ZoomControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useSearchParams, Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { dashboardAPI } from '../../services/api/dashboardAPI';
import type { FilterOptions, DashboardKPIs, Project } from '../../types';
import FilterControls from '../../components/dashboard/FilterControls';
import ProjectDetailPanel from '../../components/dashboard/ProjectDetailPanel';
import AnalyticsPanel from '../../components/dashboard/AnalyticsPanel';
import InsightsDrawer from '../../components/dashboard/InsightsDrawer';
import ProjectTable from '../../components/dashboard/ProjectTable';
import { createSDGMarker, getMarkerSizeByFunding, MARKER_STYLES } from '../../components/map/CustomSDGMarker';
import SDGLegend, { LEGEND_STYLES } from '../../components/map/SDGLegend';
import ChoroplethLayer from '../../components/map/ChoroplethLayer';
import EmptyState, { EMPTY_STATE_STYLES } from '../../components/common/EmptyState';
import SmartSearch from '../../components/dashboard/SmartSearch';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import StatusBadge from '../../components/common/StatusBadge';
import { useToast } from '../../hooks/useToast';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const BASEMAPS = {
  streets: {
    name: 'Streets',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
  },
  dark: {
    name: 'Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  light: {
    name: 'Light',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }
};

interface MapMarker {
  id: string;
  projectName: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  region: string;
  status?: string;
  fundingNeeded?: number;
  primarySdg?: number;
  imageUrl?: string;
}

const formatCurrency = (value: number | undefined | null) => {
  if (value === undefined || value === null) return '$0';
  if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return `$${value.toLocaleString()}`;
};

function ZoomWatcher({ onZoom }: { onZoom: (zoom: number) => void }) {
  useMapEvents({
    zoomend: (e) => onZoom(e.target.getZoom()),
  });
  return null;
}

function MapUpdater({ markers }: { markers: MapMarker[] }) {
  const map = useMap();
  const hasAutoFit = useRef(false);
  useEffect(() => {
    if (markers.length > 0 && !hasAutoFit.current) {
      hasAutoFit.current = true;
      const bounds = L.latLngBounds(
        markers.map((m) => [m.latitude, m.longitude] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
    }
  }, [markers, map]);
  return null;
}

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [kpis, setKpis] = useState<DashboardKPIs>({
    totalProjects: 0,
    citiesEngaged: 0,
    countriesRepresented: 0,
    totalFundingNeeded: 0,
    totalFundingSpent: 0,
  });
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    region: 'All Regions',
    sdg: 'All SDGs',
  });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showInsights, setShowInsights] = useState(false);
  const dashHeaderRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [mapZoom, setMapZoom] = useState(2);
  const [mapKey, setMapKey] = useState(0);
  const { addToast } = useToast();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const measure = () => {
      if (dashHeaderRef.current) setHeaderHeight(dashHeaderRef.current.offsetHeight);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [kpis]);

  // Desktop: show filters by default
  useEffect(() => {
    if (!isMobile) setShowFilters(true);
  }, [isMobile]);

  // Keyboard Shortcuts (desktop only)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.key === 'Escape') (e.target as HTMLElement).blur();
        return;
      }
      switch (e.key.toLowerCase()) {
        case 'f': setShowFilters(prev => !prev); break;
        case 'a': setShowAnalytics(prev => !prev); break;
        case 'i': setShowInsights(prev => !prev); break;
        case 'm': setViewMode('map'); break;
        case 'l': setViewMode('table'); break;
        case '/':
          e.preventDefault();
          const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
          searchInput?.focus();
          break;
        case 'escape':
          if (selectedProject) handleProjectClose();
          else if (showAnalytics) setShowAnalytics(false);
          else if (showInsights) setShowInsights(false);
          else if (showMobileSearch) setShowMobileSearch(false);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, showAnalytics, showInsights, showFilters, showMobileSearch]);

  useEffect(() => {
    const projectId = searchParams.get('project');
    if (projectId) handleProjectSelect(projectId);
  }, []);

  // Increment mapKey on filter changes so MapUpdater remounts and resets hasAutoFit
  useEffect(() => {
    setMapKey(k => k + 1);
  }, [filters]);

  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        if (viewMode === 'map') {
          const [kpiData, markerData] = await Promise.all([
            dashboardAPI.getKPIs(filters, controller.signal),
            dashboardAPI.getMapMarkers(filters, controller.signal),
          ]);
          setKpis(kpiData);
          setMarkers(markerData);
        } else {
          const kpiData = await dashboardAPI.getKPIs(filters, controller.signal);
          setKpis(kpiData);
        }
      } catch (error: any) {
        if (error?.code !== 'ERR_CANCELED') {
          console.error('Error fetching dashboard data:', error);
          addToast('Could not load dashboard data', 'error');
        }
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filters, viewMode]);

  const handleProjectSelect = async (projectId: string) => {
    try {
      const project = await dashboardAPI.getProject(projectId);
      setSelectedProject(project);
      // Auto-close filter panel on mobile when project opens
      if (isMobile) setShowFilters(false);
      const newParams = new URLSearchParams(searchParams);
      newParams.set('project', projectId);
      setSearchParams(newParams);
    } catch (error) {
      console.error('Error fetching project details:', error);
      addToast('Could not load project details', 'error');
    }
  };

  const handleProjectClose = () => {
    setSelectedProject(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('project');
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setFilters({ region: 'All Regions', sdg: 'All SDGs' });
  };

  const handleFilterOpen = () => {
    setShowFilters(true);
    // Auto-close project panel on mobile when filters open
    if (isMobile && selectedProject) handleProjectClose();
    if (isMobile) setShowMobileSearch(false);
  };

  // Count active filters for FAB badge
  const activeFilterCount = [
    filters.region && filters.region !== 'All Regions',
    filters.sdg && filters.sdg !== 'All SDGs',
    filters.city && filters.city !== 'All Cities',
    filters.fundedBy && filters.fundedBy !== 'All',
    filters.search && filters.search !== '',
  ].filter(Boolean).length;

  return (
    <div className="h-screen w-screen flex flex-col bg-white text-mapbox-light overflow-hidden relative">
      <style>{MARKER_STYLES}</style>
      <style>{LEGEND_STYLES}</style>
      <style>{EMPTY_STATE_STYLES}</style>

      {/* ── DESKTOP HEADER ── (md+) */}
      <div ref={dashHeaderRef} className="absolute top-0 left-0 right-0 z-30 px-6 py-4 pointer-events-none hidden md:block">
        {/* Nav strip */}
        <div className="pointer-events-auto flex items-center gap-1 text-xs font-display mb-3 w-fit bg-white/80 backdrop-blur-md border border-uia-dark rounded px-3 py-1 shadow-sm">
          <Link to="/" className="text-uia-dark hover:text-uia-red transition-colors">Home</Link>
          <span className="text-gray-300 px-1">|</span>
          <span className="text-black font-bold">Panorama</span>
          <span className="text-gray-300 px-1">|</span>
          <Link to="/submit" className="text-uia-dark hover:text-uia-red transition-colors">Submit Project</Link>
        </div>
        <div className="flex justify-between items-start">
          <div className="pointer-events-auto flex gap-4">
            <Link
              to="/"
              className="bg-white/90 backdrop-blur-md border border-uia-dark rounded-md px-4 shadow-lg shadow-black/5 hover:bg-white hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center text-uia-dark hover:text-uia-red"
              title="Return to Home"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            <div className="bg-white/90 backdrop-blur-md border border-uia-dark rounded-md p-4 shadow-lg shadow-black/5 hover:shadow-xl transition-shadow duration-300">
              <h1 className="text-2xl font-display font-bold text-black tracking-uia-normal">Panorama</h1>
              <p className="text-xs font-display text-uia-dark mt-1 uppercase tracking-uia-wide">UIA · SDG Implementation Metrics</p>
            </div>

            {/* View Toggle */}
            <div className="bg-white/90 backdrop-blur-md border border-uia-dark rounded-md p-1 shadow-lg shadow-black/5 flex items-center h-full self-stretch">
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-sm text-sm font-display font-medium transition-all duration-200 h-full flex items-center gap-2 ${viewMode === 'map' ? 'bg-uia-blue/10 text-uia-blue shadow-sm' : 'text-uia-dark hover:text-black hover:bg-uia-gray-light'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Map
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-sm text-sm font-display font-medium transition-all duration-200 h-full flex items-center gap-2 ${viewMode === 'table' ? 'bg-uia-blue/10 text-uia-blue shadow-sm' : 'text-uia-dark hover:text-black hover:bg-uia-gray-light'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                List
              </button>
            </div>

            <button
              onClick={() => setShowInsights(true)}
              className="bg-white/90 backdrop-blur-md border border-uia-dark rounded-md px-4 py-2 shadow-lg shadow-black/5 hover:bg-white hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 flex items-center gap-2 h-full self-stretch group text-uia-dark hover:text-uia-violet"
              title="Insights (I)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-display font-medium text-sm">Insights</span>
            </button>
            <button
              onClick={() => setShowAnalytics(true)}
              className="bg-white/90 backdrop-blur-md border border-uia-dark rounded-md px-4 py-2 shadow-lg shadow-black/5 hover:bg-white hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 flex items-center gap-2 h-full self-stretch group text-uia-dark hover:text-uia-blue"
              title="Full Analytics (A)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-display font-medium text-sm">Analytics</span>
            </button>
          </div>

          {/* Desktop KPI Cards */}
          <div className="pointer-events-auto bg-white/90 backdrop-blur-md border border-uia-dark rounded-md p-2 shadow-lg shadow-black/5 flex gap-4">
            <div className="px-4 py-2 border-r border-uia-dark last:border-0">
              <div className="text-xs text-uia-dark uppercase font-display font-bold tracking-uia-wide">Projects</div>
              <div className="text-xl font-display font-bold text-uia-blue"><AnimatedCounter value={kpis.totalProjects} /></div>
            </div>
            <div className="px-4 py-2 border-r border-uia-dark last:border-0">
              <div className="text-xs text-uia-dark uppercase font-display font-bold tracking-uia-wide">Cities</div>
              <div className="text-xl font-display font-bold text-uia-violet"><AnimatedCounter value={kpis.citiesEngaged} /></div>
            </div>
            <div className="px-4 py-2 border-r border-uia-dark last:border-0">
              <div className="text-xs text-uia-dark uppercase font-display font-bold tracking-uia-wide">Countries</div>
              <div className="text-xl font-display font-bold text-uia-blue"><AnimatedCounter value={kpis.countriesRepresented} /></div>
            </div>
            <div className="px-4 py-2 border-r border-uia-dark last:border-0">
              <div className="text-xs text-uia-dark uppercase font-display font-bold tracking-uia-wide">Funding Needed</div>
              <div className="text-xl font-display font-bold text-uia-red"><AnimatedCounter value={kpis.totalFundingNeeded} formatter={formatCurrency} /></div>
            </div>
            <div className="px-4 py-2">
              <div className="text-xs text-uia-dark uppercase font-display font-bold tracking-uia-wide">Funding Spent</div>
              <div className="text-xl font-display font-bold text-uia-blue"><AnimatedCounter value={kpis.totalFundingSpent} formatter={formatCurrency} /></div>
            </div>
          </div>
        </div>

        {/* Desktop Search Bar */}
        <div className="pointer-events-auto flex justify-center mt-3">
          <SmartSearch
            onProjectSelect={handleProjectSelect}
            onFilterChange={(filter) => {
              setFilters((prev) => ({
                ...prev,
                city: filter.city !== undefined ? filter.city : prev.city,
                sdg: filter.sdg !== undefined ? (filter.sdg as any) : prev.sdg,
              }));
            }}
          />
        </div>
      </div>

      {/* ── MOBILE HEADER ── (< md) */}
      <div className="absolute top-0 left-0 right-0 z-50 md:hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-white/95 backdrop-blur-md border-b border-uia-dark shadow-md h-14">
          {/* Left: back button */}
          <Link
            to="/"
            className="flex items-center justify-center w-9 h-9 rounded-md border border-uia-dark text-uia-dark hover:text-uia-red hover:bg-gray-50 transition-colors flex-shrink-0"
            title="Return to Home"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>

          {/* Center: title */}
          <div className="flex-1 text-center px-2">
            <span className="font-display font-bold text-lg text-black tracking-uia-normal">Panorama</span>
          </div>

          {/* Right: action icons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Search */}
            <button
              onClick={() => { setShowMobileSearch(true); setShowFilters(false); }}
              className="flex items-center justify-center w-9 h-9 rounded-md border border-uia-dark text-uia-dark hover:text-uia-blue hover:bg-gray-50 transition-colors"
              title="Search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>

            {/* Analytics */}
            <button
              onClick={() => setShowAnalytics(true)}
              className="flex items-center justify-center w-9 h-9 rounded-md border border-uia-dark text-uia-dark hover:text-uia-blue hover:bg-gray-50 transition-colors"
              title="Analytics"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </button>

            {/* Map / List toggle */}
            <button
              onClick={() => setViewMode(viewMode === 'map' ? 'table' : 'map')}
              className="flex items-center justify-center w-9 h-9 rounded-md border border-uia-dark text-uia-dark hover:text-uia-blue hover:bg-gray-50 transition-colors"
              title={viewMode === 'map' ? 'Switch to List' : 'Switch to Map'}
            >
              {viewMode === 'map' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav + KPI strip */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-md border-b border-gray-100 overflow-x-auto">
          {/* Nav chips */}
          <Link to="/" className="text-[10px] font-display text-uia-dark hover:text-uia-red whitespace-nowrap px-1.5 py-0.5 rounded border border-gray-200">Home</Link>
          <Link to="/submit" className="text-[10px] font-display text-uia-dark hover:text-uia-red whitespace-nowrap px-1.5 py-0.5 rounded border border-gray-200">Submit</Link>
          <span className="text-gray-200">|</span>
          {/* KPI stats */}
          <span className="text-xs font-display font-bold text-uia-blue whitespace-nowrap">
            <AnimatedCounter value={kpis.totalProjects} /> Projects
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-xs font-display font-bold text-uia-violet whitespace-nowrap">
            <AnimatedCounter value={kpis.citiesEngaged} /> Cities
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-xs font-display font-bold text-uia-red whitespace-nowrap">
            <AnimatedCounter value={kpis.totalFundingNeeded} formatter={formatCurrency} /> Needed
          </span>
        </div>

        {/* Mobile Search Overlay */}
        {showMobileSearch && (
          <div className="absolute top-full left-0 right-0 z-50 p-3 bg-white/98 backdrop-blur-md border-b border-uia-dark shadow-xl">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <SmartSearch
                  autoFocus
                  onProjectSelect={(id) => { handleProjectSelect(id); setShowMobileSearch(false); }}
                  onFilterChange={(filter) => {
                    setFilters((prev) => ({
                      ...prev,
                      city: filter.city !== undefined ? filter.city : prev.city,
                      sdg: filter.sdg !== undefined ? (filter.sdg as any) : prev.sdg,
                    }));
                    setShowMobileSearch(false);
                  }}
                />
              </div>
              <button
                onClick={() => setShowMobileSearch(false)}
                className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-md border border-gray-200 text-gray-500 hover:text-gray-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── BODY ROW (flex-1 = fills remaining screen height) ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── DESKTOP FILTER SIDEBAR (docked left) ── */}
        <div className={`hidden md:flex flex-col flex-shrink-0 bg-white border-r border-gray-200 overflow-hidden transition-[width] duration-300 ease-in-out ${showFilters ? 'w-72' : 'w-0'}`}>
          <div className="flex-shrink-0 p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-display font-semibold text-gray-900 text-sm">Filters</h2>
            <div className="flex items-center gap-2">
              <button onClick={handleClearFilters} className="text-xs text-uia-blue hover:text-uia-red font-display font-medium">Reset</button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex items-center justify-center w-6 h-6 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                title="Hide Filters"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar min-w-[288px]">
            <FilterControls filters={filters} onFilterChange={setFilters} onClearFilters={handleClearFilters} />
          </div>
          <div className="flex-shrink-0 p-3 border-t border-gray-100 bg-gray-50">
            <span className="text-xs text-gray-500">Showing <span className="font-semibold text-gray-900">{markers.length}</span> projects</span>
          </div>
        </div>

        {/* ── MAP / TABLE AREA (flex-1 = fills remaining width) ── */}
        <div className="flex-1 relative overflow-hidden">

          {/* Filter-refetch loading strip */}
          {loading && viewMode === 'map' && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-uia-blue animate-pulse z-10" />
          )}

          {viewMode === 'map' ? (
            <MapContainer
              center={[20, 0]}
              zoom={2}
              style={{ height: '100%', width: '100%', background: '#e5e5e5' }}
              zoomSnap={0.5}
              zoomDelta={0.5}
              wheelPxPerZoomLevel={120}
              scrollWheelZoom={true}
              zoomControl={false}
            >
              <ZoomControl position="bottomright" />
              <LayersControl position="bottomright">
                {Object.entries(BASEMAPS).map(([key, config]) => (
                  <LayersControl.BaseLayer key={key} name={config.name} checked={key === 'streets'}>
                    <TileLayer attribution={config.attribution} url={config.url} />
                  </LayersControl.BaseLayer>
                ))}
              </LayersControl>

              {/* Choropleth layer (visible when zoom < 5) */}
              <ChoroplethLayer markers={markers} visible={mapZoom < 5} />

              {/* Individual markers (visible when zoom >= 5) */}
              <MarkerClusterGroup chunkedLoading>
                {markers.map((marker) => {
                  const markerIcon = marker.primarySdg
                    ? createSDGMarker({ sdgNumber: marker.primarySdg, projectName: marker.projectName, size: getMarkerSizeByFunding(marker.fundingNeeded || 0) })
                    : undefined;

                  return (
                    <Marker
                      key={marker.id}
                      position={[marker.latitude, marker.longitude]}
                      icon={markerIcon}
                      eventHandlers={{
                        click: () => handleProjectSelect(marker.id),
                        ...(!isMobile && {
                          mouseover: (e) => e.target.openPopup(),
                          mouseout: (e) => e.target.closePopup(),
                        }),
                      }}
                    >
                      {!isMobile && (
                        <Popup className="custom-popup p-0 overflow-hidden" closeButton={false} maxWidth={280} minWidth={240}>
                          <div className="bg-white rounded-lg shadow-sm overflow-hidden text-gray-900">
                            {marker.imageUrl ? (
                              <div className="h-32 w-full overflow-hidden">
                                <img src={marker.imageUrl} alt={marker.projectName} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                              </div>
                            ) : (
                              <div className="h-24 w-full bg-gray-100 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              </div>
                            )}
                            <div className="p-3">
                              <h3 className="font-bold text-sm leading-tight mb-1 text-gray-900">{marker.projectName}</h3>
                              <p className="text-xs text-gray-500 mb-2 flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {marker.city}, {marker.country}
                              </p>
                              <div className="flex justify-between items-center mt-3">
                                {marker.status && (
                                  <StatusBadge status={marker.status} size="sm" />
                                )}
                                <button onClick={() => handleProjectSelect(marker.id)} className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline">
                                  View Details →
                                </button>
                              </div>
                            </div>
                          </div>
                        </Popup>
                      )}
                    </Marker>
                  );
                })}
              </MarkerClusterGroup>

              <MapUpdater markers={markers} key={mapKey} />
              <ZoomWatcher onZoom={setMapZoom} />
            </MapContainer>
          ) : (
            <div className="h-full overflow-auto bg-gray-50">
              <ProjectTable filters={filters} onProjectClick={(p) => handleProjectSelect(p.id)} />
            </div>
          )}

          {/* SDG Legend (inside map area) */}
          {viewMode === 'map' && !loading && markers.length > 0 && (
            <SDGLegend
              onSDGClick={(sdgId) => setFilters({ ...filters, sdg: sdgId as any })}
              activeSdg={typeof filters.sdg === 'number' ? filters.sdg : null}
            />
          )}

          {/* Empty state */}
          {viewMode === 'map' && !loading && markers.length === 0 && (
            <EmptyState
              icon="🌍"
              title="No Projects Found"
              description="No projects match your current filters. Try adjusting your criteria or clearing all filters."
              actionLabel="Clear All Filters"
              onAction={handleClearFilters}
              secondaryActionLabel="View All Projects"
              onSecondaryAction={() => { handleClearFilters(); setViewMode('table'); }}
            />
          )}

          {/* Loading overlay */}
          {loading && viewMode === 'map' && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/50 backdrop-blur-sm pointer-events-none">
              <div className="bg-white p-8 rounded-2xl shadow-2xl shadow-black/10 pointer-events-auto">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                  <p className="text-gray-600 font-medium">Loading projects...</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── DESKTOP DETAIL PANEL (docked right) ── */}
        {selectedProject && !isMobile && (
          <div className="hidden md:flex flex-col flex-shrink-0 w-[480px] border-l border-gray-200 bg-white overflow-hidden">
            <ProjectDetailPanel
              project={selectedProject}
              onClose={handleProjectClose}
              docked
            />
          </div>
        )}
      </div>

      {/* ── ANALYTICS PANEL (full overlay) ── */}
      {showAnalytics && (
        <AnalyticsPanel filters={filters} onClose={() => setShowAnalytics(false)} />
      )}

      {/* ── INSIGHTS DRAWER ── */}
      {showInsights && (
        <InsightsDrawer filters={filters} onClose={() => setShowInsights(false)} />
      )}

      {/* ── MOBILE PROJECT DETAIL PANEL (bottom sheet, < md) ── */}
      {selectedProject && isMobile && (
        <ProjectDetailPanel
          project={selectedProject}
          onClose={handleProjectClose}
        />
      )}
    </div>
  );
}
