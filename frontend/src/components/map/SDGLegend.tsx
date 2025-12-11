import { useState } from 'react';
import { SDG_COLORS } from './CustomSDGMarker';

const SDG_INFO = [
  { id: 1, name: 'No Poverty', shortName: 'No Poverty' },
  { id: 2, name: 'Zero Hunger', shortName: 'Zero Hunger' },
  { id: 3, name: 'Good Health', shortName: 'Good Health' },
  { id: 4, name: 'Quality Education', shortName: 'Education' },
  { id: 5, name: 'Gender Equality', shortName: 'Gender Equality' },
  { id: 6, name: 'Clean Water', shortName: 'Clean Water' },
  { id: 7, name: 'Clean Energy', shortName: 'Clean Energy' },
  { id: 8, name: 'Decent Work', shortName: 'Decent Work' },
  { id: 9, name: 'Innovation', shortName: 'Innovation' },
  { id: 10, name: 'Reduced Inequality', shortName: 'Equality' },
  { id: 11, name: 'Sustainable Cities', shortName: 'Cities' },
  { id: 12, name: 'Responsible Consumption', shortName: 'Consumption' },
  { id: 13, name: 'Climate Action', shortName: 'Climate' },
  { id: 14, name: 'Life Below Water', shortName: 'Oceans' },
  { id: 15, name: 'Life on Land', shortName: 'Land' },
  { id: 16, name: 'Peace & Justice', shortName: 'Peace' },
  { id: 17, name: 'Partnerships', shortName: 'Partnerships' },
];

interface SDGLegendProps {
  onSDGClick?: (sdgId: number) => void;
  activeSdg?: number | null;
}

export default function SDGLegend({ onSDGClick, activeSdg }: SDGLegendProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredSdg, setHoveredSdg] = useState<number | null>(null);

  if (isCollapsed) {
    return (
      <div className="absolute bottom-6 right-6 z-20 pointer-events-auto">
        <button
          onClick={() => setIsCollapsed(false)}
          className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-lg px-4 py-3 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group"
          title="Show SDG Legend"
        >
          <div className="flex -space-x-1">
            {[1, 11, 13, 17].map((sdgId) => (
              <div
                key={sdgId}
                className="w-6 h-6 rounded-full border-2 border-white"
                style={{ backgroundColor: SDG_COLORS[sdgId] }}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
            SDG Legend
          </span>
          <svg
            className="w-4 h-4 text-gray-400 group-hover:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-6 right-6 z-20 pointer-events-auto">
      <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl shadow-2xl shadow-black/10 overflow-hidden max-w-sm">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-primary-50 to-white">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {[1, 11, 13].map((sdgId) => (
                <div
                  key={sdgId}
                  className="w-5 h-5 rounded-full border-2 border-white"
                  style={{ backgroundColor: SDG_COLORS[sdgId] }}
                />
              ))}
            </div>
            <h3 className="font-bold text-sm text-gray-900">SDG Legend</h3>
          </div>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 hover:bg-white/50 rounded transition-colors"
            title="Minimize"
          >
            <svg
              className="w-4 h-4 text-gray-500 hover:text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* SDG Grid */}
        <div className="p-4 max-h-96 overflow-y-auto custom-scrollbar">
          <p className="text-xs text-gray-600 mb-3">
            Markers are colored by their primary SDG goal
          </p>
          <div className="grid grid-cols-2 gap-2">
            {SDG_INFO.map((sdg) => {
              const isActive = activeSdg === sdg.id;
              const isHovered = hoveredSdg === sdg.id;

              return (
                <button
                  key={sdg.id}
                  onClick={() => onSDGClick?.(sdg.id)}
                  onMouseEnter={() => setHoveredSdg(sdg.id)}
                  onMouseLeave={() => setHoveredSdg(null)}
                  className={`flex items-center gap-2 p-2 rounded-lg transition-all text-left ${
                    isActive
                      ? 'bg-primary-50 ring-2 ring-primary-300 shadow-sm'
                      : isHovered
                      ? 'bg-gray-50 shadow-sm scale-105'
                      : 'hover:bg-gray-50'
                  } ${onSDGClick ? 'cursor-pointer' : 'cursor-default'}`}
                  disabled={!onSDGClick}
                >
                  {/* SDG Color Circle */}
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-xs flex-shrink-0 transition-transform ${
                      isHovered ? 'scale-110' : ''
                    }`}
                    style={{
                      backgroundColor: SDG_COLORS[sdg.id],
                      boxShadow: isHovered
                        ? `0 4px 12px ${SDG_COLORS[sdg.id]}40`
                        : '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    {sdg.id}
                  </div>

                  {/* SDG Name */}
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-xs font-medium leading-tight ${
                        isActive ? 'text-primary-700' : 'text-gray-700'
                      }`}
                    >
                      {sdg.shortName}
                    </div>
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-primary-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-[10px] text-gray-500 leading-relaxed">
              <strong>Marker sizes</strong> indicate funding: Small (&lt;$10M), Medium
              ($10M-$50M), Large (&gt;$50M)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

// Export styles for injection
export const LEGEND_STYLES = scrollbarStyles;
