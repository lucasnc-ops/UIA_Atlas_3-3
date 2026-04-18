import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { dashboardAPI } from '../../services/api/dashboardAPI';
import type { FilterOptions } from '../../types';

interface AnalyticsPanelProps {
  filters: FilterOptions;
}

const SDG_COLORS = [
  '#E5243B', '#DDA63A', '#4C9F38', '#C5192D', '#FF3A21', '#26BDE2',
  '#FCC30B', '#A21942', '#FD6925', '#DD1367', '#FD9D24', '#BF8B2E',
  '#3F7E44', '#0A97D9', '#56C02B', '#00689D', '#19486A',
];

const SDG_NAMES: Record<number, string> = {
  1: 'No Poverty', 2: 'Zero Hunger', 3: 'Good Health', 4: 'Quality Education',
  5: 'Gender Equality', 6: 'Clean Water', 7: 'Affordable Energy', 8: 'Decent Work',
  9: 'Industry & Innovation', 10: 'Reduced Inequalities', 11: 'Sustainable Cities',
  12: 'Responsible Consumption', 13: 'Climate Action', 14: 'Life Below Water',
  15: 'Life on Land', 16: 'Peace & Justice', 17: 'Partnerships',
};

const REGION_DISPLAY: Record<string, string> = {
  'SECTION_I': 'Section I — W. Europe',
  'SECTION_II': 'Section II — E. Europe & C. Asia',
  'SECTION_III': 'Section III — Middle East & Africa',
  'SECTION_IV': 'Section IV — Asia & Pacific',
  'SECTION_V': 'Section V — Americas',
};

const SECTION_COLORS: Record<string, string> = {
  'SECTION_I': '#577CB3',
  'SECTION_II': '#7B68EE',
  'SECTION_III': '#C0392B',
  'SECTION_IV': '#27AE60',
  'SECTION_V': '#E67E22',
};

const STATUS_COLORS: Record<string, string> = {
  'Implemented': '#22c55e',
  'In Progress': '#3b82f6',
  'Needed but Constrained': '#f59e0b',
  'Planned': '#8b5cf6',
  'Unknown': '#9ca3af',
};

const CustomSDGTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { sdg, count } = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg text-sm">
      <p className="font-bold text-gray-900">SDG {sdg}: {SDG_NAMES[sdg] ?? ''}</p>
      <p className="text-gray-600">{count} project{count !== 1 ? 's' : ''}</p>
    </div>
  );
};

const CustomCountryTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { country, count } = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg text-sm">
      <p className="font-bold text-gray-900">{country}</p>
      <p className="text-gray-600">{count} project{count !== 1 ? 's' : ''}</p>
    </div>
  );
};

export default function AnalyticsPanel({ filters }: AnalyticsPanelProps) {
  const [sdgData, setSdgData] = useState<any[]>([]);
  const [regionData, setRegionData] = useState<any[]>([]);
  const [typologyData, setTypologyData] = useState<any[]>([]);
  const [countryData, setCountryData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sdg, region, typology, country, status] = await Promise.all([
          dashboardAPI.getSDGDistribution(filters),
          dashboardAPI.getRegionalDistribution(filters),
          dashboardAPI.getTypologyDistribution(filters),
          dashboardAPI.getCountryDistribution(filters),
          dashboardAPI.getStatusDistribution(filters),
        ]);
        if (cancelled) return;
        setSdgData(sdg);
        setRegionData(
          region.map((r: any) => ({
            ...r,
            label: REGION_DISPLAY[r.region] ?? r.region,
            fill: SECTION_COLORS[r.region] ?? '#577CB3',
          }))
        );
        setTypologyData(typology);
        setCountryData(country);
        setStatusData(status);
      } catch (error) {
        console.error('Analytics fetch error:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [filters]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-uia-blue/20 border-t-uia-blue rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Loading analytics…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 p-6 space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 tracking-tight">Project Analytics</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Aggregated insights across {countryData.reduce((s, c) => s + c.count, 0)} approved projects
            {filters.region && filters.region !== 'All Regions' ? ` · ${filters.region}` : ''}
            {typeof filters.sdg === 'number' ? ` · SDG ${filters.sdg}` : ''}
          </p>
        </div>
      </div>

      {/* ── Row 1: SDG Distribution (full width) ── */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-1">SDG Impact Distribution</h3>
        <p className="text-xs text-gray-400 mb-4">Number of projects linked to each Sustainable Development Goal</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sdgData} margin={{ bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="sdg"
                stroke="#9ca3af"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `SDG ${v}`}
              />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip content={<CustomSDGTooltip />} />
              <Bar dataKey="count" name="Projects" radius={[4, 4, 0, 0]}>
                {sdgData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SDG_COLORS[(entry.sdg - 1) % SDG_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ── Row 2: Regional + Status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Regional Distribution */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Projects by UIA Section</h3>
          <p className="text-xs text-gray-400 mb-4">Distribution across the five UIA geographical sections</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionData}
                  cx="40%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="project_count"
                  nameKey="label"
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill ?? '#577CB3'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', fontSize: 12 }}
                  formatter={(value: any, _: any, props: any) => [
                    `${value} projects`,
                    props.payload.label,
                  ]}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.8' }}
                  formatter={(value) => value}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Project Status */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Project Status Breakdown</h3>
          <p className="text-xs text-gray-400 mb-4">Current implementation stage of approved projects</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statusData}
                layout="vertical"
                margin={{ left: 8, right: 16 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" stroke="#9ca3af" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis
                  dataKey="status"
                  type="category"
                  stroke="#9ca3af"
                  width={160}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', fontSize: 12 }}
                  formatter={(value: any) => [`${value} projects`, 'Count']}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={22}>
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.status] ?? '#9ca3af'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* ── Row 3: Country Distribution (full width) ── */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-1">Top Countries by Project Count</h3>
        <p className="text-xs text-gray-400 mb-4">Countries with the most UIA-approved urban innovation projects (top 15)</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={countryData}
              layout="vertical"
              margin={{ left: 8, right: 24 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" stroke="#9ca3af" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis
                dataKey="country"
                type="category"
                stroke="#9ca3af"
                width={120}
                tick={{ fontSize: 11 }}
              />
              <Tooltip content={<CustomCountryTooltip />} />
              <Bar dataKey="count" fill="#577CB3" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ── Row 4: Typology Breakdown (full width) ── */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-1">Project Typologies</h3>
        <p className="text-xs text-gray-400 mb-4">Distribution by urban intervention type</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={typologyData}
              layout="vertical"
              margin={{ left: 8, right: 24 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" stroke="#9ca3af" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis
                dataKey="typology"
                type="category"
                stroke="#9ca3af"
                width={160}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', fontSize: 12 }}
                formatter={(value: any) => [`${value} projects`, 'Count']}
              />
              <Bar dataKey="count" fill="#484675" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

    </div>
  );
}
