import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { dashboardAPI } from '../../services/api/dashboard';
import type { FilterOptions } from '../../types';

interface AnalyticsPanelProps {
  filters: FilterOptions;
  onClose: () => void;
}

const COLORS = [
  '#E5243B', '#DDA63A', '#4C9F38', '#C5192D', '#FF3A21', '#26BDE2',
  '#FCC30B', '#A21942', '#FD6925', '#DD1367', '#FD9D24', '#BF8B2E',
  '#3F7E44', '#0A97D9', '#56C02B', '#00689D', '#19486A'
];

export default function AnalyticsPanel({ filters, onClose }: AnalyticsPanelProps) {
  const [sdgData, setSdgData] = useState<any[]>([]);
  const [regionData, setRegionData] = useState<any[]>([]);
  const [typologyData, setTypologyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sdg, region, typology] = await Promise.all([
          dashboardAPI.getSDGDistribution(filters),
          dashboardAPI.getRegionalDistribution(filters),
          dashboardAPI.getTypologyDistribution(filters),
        ]);
        setSdgData(sdg);
        setRegionData(region);
        setTypologyData(typology);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  return (
    <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white/50">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Project Analytics</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            
            {/* SDG Distribution */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SDG Impact Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sdgData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis 
                      dataKey="sdg" 
                      stroke="#6b7280" 
                      tick={{ fontSize: 12 }}
                      label={{ value: 'SDG Goal', position: 'insideBottom', offset: -5, fill: '#6b7280' }}
                    />
                    <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', color: '#111827', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ color: '#111827' }}
                      cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                    />
                    <Bar dataKey="count" name="Projects" radius={[4, 4, 0, 0]}>
                      {sdgData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(entry.sdg - 1) % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Regional Distribution */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects by Region</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={regionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="project_count"
                      nameKey="region"
                    >
                      {regionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', color: '#111827', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ color: '#111827' }}
                    />
                    <Legend 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      wrapperStyle={{ fontSize: '12px', color: '#6b7280' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Typology Breakdown */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Typologies</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={typologyData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                    <XAxis type="number" stroke="#6b7280" />
                    <YAxis 
                      dataKey="typology" 
                      type="category" 
                      stroke="#6b7280" 
                      width={150}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', color: '#111827', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ color: '#111827' }}
                      cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                    />
                    <Bar dataKey="count" name="Projects" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
