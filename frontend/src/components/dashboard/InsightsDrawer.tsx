import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { dashboardAPI } from '../../services/api/dashboardAPI';
import { SDG_COLORS } from '../../utils/assets';
import { ASSETS } from '../../utils/assets';
import type { FilterOptions } from '../../types';

interface InsightsDrawerProps {
  filters: FilterOptions;
  onClose: () => void;
}

const REGION_COLORS = ['#577CB3', '#484675', '#AF201C', '#FCC30B', '#4C9F38'];

export default function InsightsDrawer({ filters, onClose }: InsightsDrawerProps) {
  const [sdgData, setSdgData] = useState<any[]>([]);
  const [regionData, setRegionData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [sdg, region] = await Promise.all([
          dashboardAPI.getSDGDistribution(filters),
          dashboardAPI.getRegionalDistribution(filters),
        ]);
        setSdgData(sdg.slice(0, 6));
        setRegionData(region);
      } catch {
        // silent — insights are supplemental
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [filters]);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-30" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-2xl shadow-2xl border-t border-gray-200 max-h-[48vh] flex flex-col">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="font-display font-bold text-sm text-gray-900 uppercase tracking-wide">Insights</h3>
            <p className="text-[10px] text-gray-400 font-display uppercase tracking-widest mt-0.5">Headline charts · current filters</p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors"
            aria-label="Close Insights"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-uia-blue border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex gap-4 px-5 py-4 h-full" style={{ minWidth: 'max-content' }}>

              {/* Chart 1 — Top SDGs */}
              <div className="flex-shrink-0 w-64">
                <p className="text-[10px] font-display font-bold text-gray-400 uppercase tracking-widest mb-2">Top SDGs</p>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sdgData} layout="vertical" margin={{ left: 0, right: 8, top: 0, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="sdg"
                        type="category"
                        width={36}
                        tick={({ x, y, payload }: any) => (
                          <image
                            x={x - 16}
                            y={y - 12}
                            width={24}
                            height={24}
                            href={ASSETS.sdgIcon(payload.value)}
                          />
                        )}
                      />
                      <Tooltip
                        formatter={(v: any) => [`${v} projects`, 'Count']}
                        contentStyle={{ fontSize: 11, border: '1px solid #e5e7eb' }}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={14}>
                        {sdgData.map((entry) => (
                          <Cell key={entry.sdg} fill={SDG_COLORS[entry.sdg] || '#577CB3'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Divider */}
              <div className="flex-shrink-0 w-px bg-gray-100 self-stretch my-1" />

              {/* Chart 2 — By Region */}
              <div className="flex-shrink-0 w-52">
                <p className="text-[10px] font-display font-bold text-gray-400 uppercase tracking-widest mb-2">By Region</p>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={regionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={28}
                        outerRadius={52}
                        paddingAngle={3}
                        dataKey="projectCount"
                        nameKey="region"
                      >
                        {regionData.map((_: any, idx: number) => (
                          <Cell key={idx} fill={REGION_COLORS[idx % REGION_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: any, _: any, props: any) => [`${v}`, props.payload.region?.replace('Section ', 'S')]}
                        contentStyle={{ fontSize: 11, border: '1px solid #e5e7eb' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Divider */}
              <div className="flex-shrink-0 w-px bg-gray-100 self-stretch my-1" />

              {/* Chart 3 — Region legend labels */}
              <div className="flex-shrink-0 w-40 flex flex-col justify-center gap-1.5">
                <p className="text-[10px] font-display font-bold text-gray-400 uppercase tracking-widest mb-1">Regions</p>
                {regionData.map((r: any, i: number) => (
                  <div key={r.region} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: REGION_COLORS[i % REGION_COLORS.length] }} />
                    <span className="text-[10px] text-gray-600 leading-tight truncate">{r.region?.replace(/Section [IVX]+ - /, '')}</span>
                    <span className="text-[10px] font-bold text-gray-900 ml-auto flex-shrink-0">{r.projectCount}</span>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}
