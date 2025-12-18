import L from 'leaflet';

// Official UN SDG colors
export const SDG_COLORS: Record<number, string> = {
  1: '#E5243B',  // No Poverty
  2: '#DDA63A',  // Zero Hunger
  3: '#4C9F38',  // Good Health
  4: '#C5192D',  // Quality Education
  5: '#FF3A21',  // Gender Equality
  6: '#26BDE2',  // Clean Water
  7: '#FCC30B',  // Affordable Energy
  8: '#A21942',  // Decent Work
  9: '#FD6925',  // Industry & Innovation
  10: '#DD1367', // Reduced Inequality
  11: '#FD9D24', // Sustainable Cities
  12: '#BF8B2E', // Responsible Consumption
  13: '#3F7E44', // Climate Action
  14: '#0A97D9', // Life Below Water
  15: '#56C02B', // Life on Land
  16: '#00689D', // Peace & Justice
  17: '#19486A', // Partnerships
};

interface CustomSDGMarkerOptions {
  sdgNumber: number;
  projectName: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Creates a custom marker icon colored by primary SDG
 * @param options - Marker configuration
 * @returns Leaflet DivIcon
 */
export function createSDGMarker({
  sdgNumber,
  projectName,
  size = 'medium',
}: CustomSDGMarkerOptions): L.DivIcon {
  const color = SDG_COLORS[sdgNumber] || '#666666';

  // Size configurations
  const sizeConfig = {
    small: { width: 24, height: 24, fontSize: '9px', iconSize: [24, 24] as [number, number] },
    medium: { width: 32, height: 32, fontSize: '11px', iconSize: [32, 32] as [number, number] },
    large: { width: 40, height: 40, fontSize: '13px', iconSize: [40, 40] as [number, number] },
  };

  const config = sizeConfig[size];

  return L.divIcon({
    html: `
      <div
        style="
          width: ${config.width}px;
          height: ${config.height}px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${config.fontSize};
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        "
        class="custom-sdg-marker"
        title="${projectName}"
      >
        ${sdgNumber}
      </div>
    `,
    className: '', // Clear default className to avoid conflicts
    iconSize: config.iconSize,
    iconAnchor: [config.iconSize[0] / 2, config.iconSize[1] / 2],
    popupAnchor: [0, -config.iconSize[1] / 2],
  });
}

/**
 * Get marker size based on funding amount
 * @param fundingNeeded - Project funding in USD
 * @returns Size category
 */
export function getMarkerSizeByFunding(fundingNeeded: number): 'small' | 'medium' | 'large' {
  if (fundingNeeded > 50000000) return 'large';  // >$50M
  if (fundingNeeded > 10000000) return 'medium'; // >$10M
  return 'small';
}

/**
 * CSS for marker hover effects
 * Add this to your global styles or component
 */
export const MARKER_STYLES = `
  .custom-sdg-marker:hover {
    transform: scale(1.15) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
    z-index: 1000 !important;
  }

  .custom-sdg-marker {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  /* Pulsing animation for "In Progress" projects */
  @keyframes pulse-ring {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.7);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(66, 153, 225, 0);
    }
  }

  .marker-pulse {
    animation: pulse-ring 2s infinite;
  }
`;
