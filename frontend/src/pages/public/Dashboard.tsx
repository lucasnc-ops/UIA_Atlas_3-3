import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { dashboardAPI } from '../../services/api/dashboard';
import type { FilterOptions, DashboardKPIs, Project } from '../../types';
import KPICards from '../../components/dashboard/KPICards';
import FilterControls from '../../components/dashboard/FilterControls';
import ProjectDetailPanel from '../../components/dashboard/ProjectDetailPanel';
import AnalyticsPanel from '../../components/dashboard/AnalyticsPanel';
import ProjectTable from '../../components/dashboard/ProjectTable';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapMarker {
  id: string;
  project_name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  region: string;
}

const formatCurrency = (value: number) => {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}k`;
  }
  return `$${value.toLocaleString()}`;
};

function MapUpdater({ markers }: { markers: MapMarker[] }) {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(
        markers.map((m) => [m.latitude, m.longitude] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
    }
  }, [markers, map]);

  return null;
}

export default function Dashboard() {
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
  const [showFilters, setShowFilters] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');

  // Fetch data
  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    // Only show full loading on initial load or map updates
    // Table handles its own loading state
    if (viewMode === 'map') {
      setLoading(true);
    }
    try {
      const [kpisData, markersData] = await Promise.all([
        dashboardAPI.getKPIs(filters),
        dashboardAPI.getMapMarkers(filters),
      ]);

      setKpis(kpisData);
      setMarkers(markersData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerClick = async (projectId: string) => {
    try {
      const project = await dashboardAPI.getProject(projectId);
      setSelectedProject(project);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      region: 'All Regions',
      sdg: 'All SDGs',
    });
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 text-gray-900 overflow-hidden relative">
      
      {/* Main Content (Map or Table) */}
      <div className="absolute inset-0 z-0">
         {viewMode === 'map' ? (
           <MapContainer
              center={[20, 0]}
              zoom={2}
              style={{ height: '100%', width: '100%', background: '#e5e5e5' }}
              zoomSnap={0.5}
              zoomDelta={0.5}
              wheelPxPerZoomLevel={120}
              scrollWheelZoom={true}
            >
              {/* CartoDB Voyager Tiles (Light, readable, modern) */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />

              <MarkerClusterGroup chunkedLoading>
                {markers.map((marker) => (
                  <Marker
                    key={marker.id}
                    position={[marker.latitude, marker.longitude]}
                    eventHandlers={{
                      click: () => handleMarkerClick(marker.id),
                      mouseover: (e) => e.target.openPopup(),
                      mouseout: (e) => e.target.closePopup(),
                    }}
                  >
                    <Popup className="custom-popup" closeButton={false}>
                      <div className="p-2 text-gray-900">
                        <h3 className="font-semibold mb-1">
                          {marker.project_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {marker.city}, {marker.country}
                        </p>
                        <button
                          onClick={() => handleMarkerClick(marker.id)}
                          className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                          View Details →
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>

              <MapUpdater markers={markers} />
            </MapContainer>
         ) : (
            <div className="h-full pt-32 pb-0 bg-gray-50">
               <ProjectTable filters={filters} onProjectClick={(p) => setSelectedProject(p)} />
            </div>
         )}
      </div>

      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 px-6 py-4 pointer-events-none">
        <div className="flex justify-between items-start">
           <div className="pointer-events-auto flex gap-4">
             <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-lg p-4 shadow-lg shadow-black/5">
               <h1 className="text-2xl font-bold text-gray-900 tracking-tight">SDG Atlas</h1>
               <p className="text-xs text-gray-500 mt-1">Global Sustainable Development Projects</p>
             </div>
             
             {/* View Toggle */}
             <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-lg p-1 shadow-lg shadow-black/5 flex items-center h-full self-stretch">
               <button
                 onClick={() => setViewMode('map')}
                 className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors h-full flex items-center gap-2 ${viewMode === 'map' ? 'bg-primary-100 text-primary-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
               >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="hidden sm:inline">Map</span>
               </button>
               <button
                 onClick={() => setViewMode('table')}
                 className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors h-full flex items-center gap-2 ${viewMode === 'table' ? 'bg-primary-100 text-primary-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                 <span className="hidden sm:inline">List</span>
               </button>
             </div>

             <button
               onClick={() => setShowAnalytics(true)}
               className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-lg px-4 py-2 shadow-lg shadow-black/5 hover:bg-white transition-colors flex items-center gap-2 h-full self-stretch group text-gray-600 hover:text-primary-600"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
               </svg>
               <span className="font-medium text-sm hidden sm:block">Analytics</span>
             </button>
           </div>
           
           {/* Floating KPI Cards */}
           <div className="pointer-events-auto bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-lg p-2 shadow-lg shadow-black/5 hidden md:flex gap-4">
              <div className="px-4 py-2 border-r border-gray-200 last:border-0">
                 <div className="text-xs text-gray-500 uppercase font-medium tracking-wide">Projects</div>
                 <div className="text-xl font-bold text-gray-900">{kpis.totalProjects}</div>
              </div>
              <div className="px-4 py-2 border-r border-gray-200 last:border-0">
                 <div className="text-xs text-gray-500 uppercase font-medium tracking-wide">Cities</div>
                 <div className="text-xl font-bold text-gray-900">{kpis.citiesEngaged}</div>
              </div>
               <div className="px-4 py-2 border-r border-gray-200 last:border-0">
                 <div className="text-xs text-gray-500 uppercase font-medium tracking-wide">Countries</div>
                 <div className="text-xl font-bold text-gray-900">{kpis.countriesRepresented}</div>
              </div>
               <div className="px-4 py-2 border-r border-gray-200 last:border-0">
                 <div className="text-xs text-gray-500 uppercase font-medium tracking-wide">Funding Needed</div>
                 <div className="text-xl font-bold text-gray-900">{formatCurrency(kpis.totalFundingNeeded)}</div>
              </div>
               <div className="px-4 py-2">
                 <div className="text-xs text-gray-500 uppercase font-medium tracking-wide">Funding Spent</div>
                 <div className="text-xl font-bold text-green-600">{formatCurrency(kpis.totalFundingSpent)}</div>
              </div>
           </div>
        </div>
      </div>

      {/* Analytics Panel Overlay */}
      {showAnalytics && (
        <AnalyticsPanel filters={filters} onClose={() => setShowAnalytics(false)} />
      )}

      {/* Sidebar Overlay */}
      <div className={`absolute top-24 left-6 bottom-6 w-80 z-10 transition-transform duration-300 transform ${showFilters ? 'translate-x-0' : '-translate-x-[110%]'}`}>
         <div className="h-full flex flex-col bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl shadow-2xl shadow-black/10 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-900">Filters</h2>
              <button onClick={handleClearFilters} className="text-xs text-primary-600 hover:text-primary-700 font-medium">Reset</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="light-theme-wrapper">
                   <FilterControls
                      filters={filters}
                      onFilterChange={setFilters}
                      onClearFilters={handleClearFilters}
                   />
                </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50/50">
               <div className="flex items-center justify-between text-xs text-gray-500">
                 <span>Visible: <span className="text-gray-900 font-medium">{markers.length}</span></span>
                 <button onClick={() => setShowFilters(false)} className="md:hidden text-gray-900 font-medium">Hide</button>
               </div>
            </div>
         </div>
      </div>

      {/* Mobile Toggle Button */}
      {!showFilters && (
        <button 
          onClick={() => setShowFilters(true)}
          className="absolute top-24 left-6 z-10 bg-white text-gray-600 p-3 rounded-lg shadow-lg hover:text-primary-600 transition-colors border border-gray-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
        </button>
      )}

      {/* Loading State Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-50 backdrop-blur-sm">
           <div className="flex flex-col items-center">
             <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="mt-4 text-gray-900 font-medium tracking-wide">Loading Atlas Data...</p>
           </div>
        </div>
      )}

      {/* Project Details Panel Overlay */}
      {selectedProject && (
         <div className="absolute top-0 right-0 bottom-0 w-full md:w-[480px] z-20 bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300">
            <ProjectDetailPanel 
               project={selectedProject} 
               onClose={() => setSelectedProject(null)} 
            />
         </div>
      )}
    </div>
  );
}