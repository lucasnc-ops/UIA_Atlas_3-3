import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api/dashboard';
import type { FilterOptions, UIARegion, SDG } from '../../types';

interface FilterControlsProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

const regions: (UIARegion | 'All Regions')[] = [
  'All Regions',
  'Section I - Western Europe',
  'Section II - Eastern Europe & Central Asia',
  'Section III - Middle East & Africa',
  'Section IV - Asia & Pacific',
  'Section V - Americas',
];

const sdgs: (SDG | 'All SDGs')[] = ['All SDGs', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

const sdgLabels: Record<SDG, string> = {
  1: 'No Poverty',
  2: 'Zero Hunger',
  3: 'Good Health',
  4: 'Quality Education',
  5: 'Gender Equality',
  6: 'Clean Water',
  7: 'Clean Energy',
  8: 'Decent Work',
  9: 'Innovation',
  10: 'Reduced Inequality',
  11: 'Sustainable Cities',
  12: 'Responsible Consumption',
  13: 'Climate Action',
  14: 'Life Below Water',
  15: 'Life on Land',
  16: 'Peace & Justice',
  17: 'Partnerships',
};

export default function FilterControls({
  filters,
  onFilterChange,
  onClearFilters,
}: FilterControlsProps) {
  const [cities, setCities] = useState<string[]>([]);
  const [fundingSources, setFundingSources] = useState<string[]>([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const data = await dashboardAPI.getFilters();
        setCities(data.cities);
        setFundingSources(data.funding_sources);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    fetchFilters();
  }, []);

  const hasActiveFilters =
    (filters.region && filters.region !== 'All Regions') ||
    (filters.sdg && filters.sdg !== 'All SDGs') ||
    (filters.city && filters.city !== 'All Cities') ||
    (filters.fundedBy && filters.fundedBy !== 'All') ||
    (filters.search && filters.search !== '');

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          Search Projects
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Name or Country..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-gray-900 transition-colors hover:border-gray-300 pl-9"
          />
          <svg
            className="absolute left-3 top-3 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Region Filter */}
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          UIA Region
        </label>
        <select
          value={filters.region || 'All Regions'}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              region: e.target.value as UIARegion | 'All Regions',
            })
          }
          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-gray-900 transition-colors hover:border-gray-300"
        >
          {regions.map((region) => (
            <option key={region} value={region} className="bg-white text-gray-900">
              {region}
            </option>
          ))}
        </select>
      </div>

      {/* City Filter */}
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          City
        </label>
        <select
          value={filters.city || 'All Cities'}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              city: e.target.value === 'All Cities' ? 'All Cities' : e.target.value,
            })
          }
          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-gray-900 transition-colors hover:border-gray-300"
        >
          <option value="All Cities">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Funded By Filter */}
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          Funded By
        </label>
        <select
          value={filters.fundedBy || 'All'}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              fundedBy: e.target.value === 'All' ? 'All' : e.target.value,
            })
          }
          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-gray-900 transition-colors hover:border-gray-300"
        >
          <option value="All">All Funding Sources</option>
          {fundingSources.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>
      </div>

      {/* SDG Filter */}
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          Sustainable Development Goal
        </label>
        <select
          value={filters.sdg || 'All SDGs'}
          onChange={(e) => {
            const value = e.target.value;
            onFilterChange({
              ...filters,
              sdg: value === 'All SDGs' ? 'All SDGs' : (parseInt(value) as SDG),
            });
          }}
          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-gray-900 transition-colors hover:border-gray-300"
        >
          {sdgs.map((sdg) => (
            <option key={sdg} value={sdg} className="bg-white text-gray-900">
              {sdg === 'All SDGs' ? 'All SDGs' : `SDG ${sdg}: ${sdgLabels[sdg as SDG]}`}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-500 mb-3">
            Active Filters
          </p>
          <div className="flex flex-wrap gap-2">
            {filters.region && filters.region !== 'All Regions' && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200">
                {filters.region}
                <button
                  onClick={() => onFilterChange({ ...filters, region: 'All Regions' })}
                  className="ml-2 text-primary-400 hover:text-primary-600"
                >
                  ×
                </button>
              </span>
            )}
            {filters.city && filters.city !== 'All Cities' && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200">
                {filters.city}
                <button
                  onClick={() => onFilterChange({ ...filters, city: 'All Cities' })}
                  className="ml-2 text-primary-400 hover:text-primary-600"
                >
                  ×
                </button>
              </span>
            )}
            {filters.fundedBy && filters.fundedBy !== 'All' && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200">
                {filters.fundedBy}
                <button
                  onClick={() => onFilterChange({ ...filters, fundedBy: 'All' })}
                  className="ml-2 text-primary-400 hover:text-primary-600"
                >
                  ×
                </button>
              </span>
            )}
            {filters.sdg && filters.sdg !== 'All SDGs' && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                SDG {filters.sdg}
                <button
                  onClick={() => onFilterChange({ ...filters, sdg: 'All SDGs' })}
                  className="ml-2 text-green-400 hover:text-green-600"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}