# Map Visualization Improvements for Atlas 3+3

## Current Implementation

The map currently uses:
- **Leaflet** with React Leaflet
- **CartoDB Voyager tiles** (clean, modern basemap)
- **Marker clustering** for performance
- **Hover popups** with project preview
- **Click to open** detail panel
- **Auto-fit bounds** based on filtered markers

## Suggested Improvements

### 🎨 1. Custom Marker Icons Based on SDGs

**Why:** Make markers visually distinctive and immediately convey project focus

**Implementation:**
```tsx
// Create custom marker icons colored by primary SDG
const createSDGMarker = (sdgNumber: number) => {
  const sdgColors = {
    1: '#E5243B', 2: '#DDA63A', 3: '#4C9F38', 4: '#C5192D',
    5: '#FF3A21', 6: '#26BDE2', 7: '#FCC30B', 8: '#A21942',
    9: '#FD6925', 10: '#DD1367', 11: '#FD9D24', 12: '#BF8B2E',
    13: '#3F7E44', 14: '#0A97D9', 15: '#56C02B', 16: '#00689D',
    17: '#19486A'
  };

  const color = sdgColors[sdgNumber] || '#666';

  return L.divIcon({
    html: `<div style="background: ${color}; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"
                class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs">
             ${sdgNumber}
           </div>`,
    className: 'custom-sdg-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};
```

**Benefits:**
- ✅ Immediate visual categorization by SDG
- ✅ Better than default blue pins
- ✅ Maintains UIA/SDG branding

---

### 🗺️ 2. Multiple Basemap Options

**Why:** Users have different preferences and use cases

**Implementation:**
```tsx
const basemaps = {
  streets: {
    name: 'Streets',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  },
  dark: {
    name: 'Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  },
  light: {
    name: 'Light',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  },
  terrain: {
    name: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  }
};

// Add basemap switcher in top-right corner
<LayersControl position="topright">
  {Object.entries(basemaps).map(([key, map]) => (
    <LayersControl.BaseLayer
      key={key}
      name={map.name}
      checked={key === 'streets'}
    >
      <TileLayer url={map.url} />
    </LayersControl.BaseLayer>
  ))}
</LayersControl>
```

**Benefits:**
- ✅ Presentation mode (clean light map)
- ✅ Analysis mode (satellite for context)
- ✅ Dark mode for night viewing

---

### 📊 3. Heat Map Layer for Project Density

**Why:** Show where sustainable development is most concentrated

**Implementation:**
```tsx
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3';

const heatmapPoints = markers.map(m => [
  m.latitude,
  m.longitude,
  0.5 // intensity
]);

<HeatmapLayer
  fitBoundsOnLoad
  fitBoundsOnUpdate
  points={heatmapPoints}
  longitudeExtractor={m => m[1]}
  latitudeExtractor={m => m[0]}
  intensityExtractor={m => m[2]}
  radius={25}
  blur={15}
  max={1.0}
/>
```

**Benefits:**
- ✅ Identify global innovation hubs
- ✅ Spot regions needing more projects
- ✅ Toggle on/off for presentations

---

### 🎯 4. Marker Size Based on Funding

**Why:** Visually emphasize high-impact projects

**Implementation:**
```tsx
const getMarkerSize = (fundingNeeded: number) => {
  if (fundingNeeded > 50000000) return 'large';  // >$50M
  if (fundingNeeded > 10000000) return 'medium'; // >$10M
  return 'small';
};

const sizeClasses = {
  small: 'w-6 h-6 text-[8px]',
  medium: 'w-8 h-8 text-[10px]',
  large: 'w-10 h-10 text-xs'
};
```

**Benefits:**
- ✅ Highlights major infrastructure projects
- ✅ Helps donors find significant opportunities
- ✅ Subtle but informative

---

### 🌐 5. Regional Boundary Overlays

**Why:** Show UIA sections visually on the map

**Implementation:**
```tsx
import { GeoJSON } from 'react-leaflet';

const uiaSections = {
  'Section I': { /* Western Europe GeoJSON */ },
  'Section II': { /* Eastern Europe GeoJSON */ },
  // ... etc
};

<GeoJSON
  data={uiaSections['Section I']}
  style={{
    fillColor: 'blue',
    fillOpacity: 0.1,
    color: 'blue',
    weight: 2,
    dashArray: '5, 10'
  }}
/>
```

**Benefits:**
- ✅ Understand regional distribution at a glance
- ✅ Educational for users unfamiliar with UIA sections
- ✅ Toggle on/off to reduce clutter

---

### 🔍 6. Search and Geocoding

**Why:** Quick navigation to specific locations

**Implementation:**
```tsx
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

// Add search control
useEffect(() => {
  const provider = new OpenStreetMapProvider();
  const searchControl = new GeoSearchControl({
    provider: provider,
    style: 'bar',
    autoClose: true,
    searchLabel: 'Search for a city or country...',
  });
  map.addControl(searchControl);
}, [map]);
```

**Benefits:**
- ✅ Find projects by location name
- ✅ Better UX than manual panning/zooming
- ✅ Works with city/country names

---

### 🎬 7. Animated Tour Mode

**Why:** Showcase projects in presentations

**Implementation:**
```tsx
const startTour = () => {
  let index = 0;
  const interval = setInterval(() => {
    if (index >= markers.length) {
      clearInterval(interval);
      return;
    }

    const marker = markers[index];
    map.flyTo([marker.latitude, marker.longitude], 12, {
      duration: 2,
      easeLinearity: 0.25
    });

    handleProjectSelect(marker.id);
    index++;
  }, 8000); // 8 seconds per project
};
```

**Benefits:**
- ✅ Auto-play for presentations
- ✅ Engaging for public displays
- ✅ Showcases all projects systematically

---

### 📏 8. Measurement Tools

**Why:** Show project scale and distances

**Implementation:**
```tsx
import 'leaflet-draw';

<FeatureGroup>
  <EditControl
    position="topright"
    draw={{
      rectangle: false,
      circle: false,
      circlemarker: false,
      marker: false,
      polyline: {
        shapeOptions: {
          color: '#3388ff',
          weight: 3
        }
      },
      polygon: {
        shapeOptions: {
          color: '#3388ff'
        }
      }
    }}
  />
</FeatureGroup>
```

**Benefits:**
- ✅ Measure distances between projects
- ✅ Draw areas for regional analysis
- ✅ Useful for urban planners

---

### 🎨 9. Project Status Visualization

**Why:** Quickly identify implementation stage

**Implementation:**
```tsx
// Add pulsing animation for "In Progress" projects
const pulseAnimation = `
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.7); }
    50% { box-shadow: 0 0 0 10px rgba(66, 153, 225, 0); }
  }
`;

// Apply to markers
<style>{pulseAnimation}</style>
<div
  className={status === 'In Progress' ? 'animate-pulse-ring' : ''}
  style={{ animation: 'pulse 2s infinite' }}
>
```

**Benefits:**
- ✅ Draw attention to active projects
- ✅ Shows momentum and progress
- ✅ Engaging visual effect

---

### 🌍 10. 3D Building Layer (Optional)

**Why:** Modern, impressive visualization

**Implementation:**
```tsx
// Switch to Mapbox GL JS for 3D
import mapboxgl from 'mapbox-gl';

map.addLayer({
  'id': '3d-buildings',
  'source': 'composite',
  'source-layer': 'building',
  'filter': ['==', 'extrude', 'true'],
  'type': 'fill-extrusion',
  'paint': {
    'fill-extrusion-color': '#aaa',
    'fill-extrusion-height': ['get', 'height'],
    'fill-extrusion-opacity': 0.6
  }
});
```

**Benefits:**
- ✅ Modern, impressive look
- ✅ Context for urban projects
- ⚠️ Requires migration to Mapbox GL (paid)

---

### 📱 11. Mobile-Optimized Popups

**Why:** Better UX on phones/tablets

**Current Issue:** Popups can overflow on small screens

**Implementation:**
```tsx
// Detect mobile and show simplified popup
const isMobile = window.innerWidth < 768;

<Popup maxWidth={isMobile ? 200 : 280} minWidth={isMobile ? 180 : 240}>
  <div className="p-2">
    {/* Simplified content on mobile */}
    {!isMobile && marker.imageUrl && (
      <img src={marker.imageUrl} alt={marker.projectName} />
    )}
    <h3 className="text-sm font-bold">{marker.projectName}</h3>
    <button onClick={() => handleProjectSelect(marker.id)}>
      View Details
    </button>
  </div>
</Popup>
```

**Benefits:**
- ✅ Better mobile experience
- ✅ Faster loading
- ✅ Less clutter

---

### 🎯 12. "Nearby Projects" Feature

**Why:** Discover related projects in the same region

**Implementation:**
```tsx
const findNearbyProjects = (project: Project, maxDistance = 500) => {
  // Calculate distance using Haversine formula
  return markers
    .filter(m => m.id !== project.id)
    .map(m => ({
      ...m,
      distance: calculateDistance(
        project.latitude, project.longitude,
        m.latitude, m.longitude
      )
    }))
    .filter(m => m.distance < maxDistance)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5);
};

// Show in ProjectDetailPanel
<div className="nearby-projects">
  <h4>Nearby Projects</h4>
  {nearbyProjects.map(p => (
    <button onClick={() => handleProjectSelect(p.id)}>
      {p.projectName} ({p.distance.toFixed(0)}km away)
    </button>
  ))}
</div>
```

**Benefits:**
- ✅ Discover project clusters
- ✅ Identify regional patterns
- ✅ Encourage exploration

---

## Priority Recommendations

### 🔥 High Priority (Quick Wins)
1. **Custom SDG-colored markers** - Most impactful visual improvement
2. **Mobile-optimized popups** - Better user experience
3. **Search functionality** - Greatly improves navigation

### 🚀 Medium Priority (Good Impact)
4. **Multiple basemaps** - Flexibility for different use cases
5. **Marker size by funding** - Subtle but informative
6. **Nearby projects** - Encourages exploration

### ⭐ Low Priority (Nice to Have)
7. **Heat map layer** - Cool for presentations
8. **Regional boundaries** - Educational value
9. **Tour mode** - Great for demos
10. **Measurement tools** - Niche use case

### 🔮 Future Considerations
11. **3D buildings** - Impressive but requires Mapbox (paid)
12. **Project status animation** - Polish, not essential

---

## Implementation Plan

### Week 1: Core Visual Improvements
- [ ] Implement SDG-colored custom markers
- [ ] Add basemap switcher (3-4 options)
- [ ] Optimize popups for mobile

### Week 2: Navigation Enhancements
- [ ] Add search/geocoding
- [ ] Implement "Nearby Projects"
- [ ] Add marker sizing by funding

### Week 3: Advanced Features
- [ ] Create heat map toggle
- [ ] Add regional boundary overlays
- [ ] Implement tour mode

### Week 4: Polish & Testing
- [ ] Test all features on mobile
- [ ] Performance optimization
- [ ] User feedback incorporation

---

## Technical Notes

### Dependencies to Add
```json
{
  "leaflet-geosearch": "^3.8.0",
  "react-leaflet-heatmap-layer-v3": "^2.0.1",
  "leaflet-draw": "^1.0.4",
  "@react-leaflet/core": "^2.1.0"
}
```

### File Structure
```
frontend/src/
  components/
    map/
      CustomMarker.tsx         (SDG-colored markers)
      BasemapSwitcher.tsx      (Basemap control)
      HeatmapLayer.tsx         (Density visualization)
      SearchControl.tsx        (Location search)
      TourControl.tsx          (Animated tour)
      NearbyProjects.tsx       (Related projects)
```

---

## Testing Checklist

- [ ] All markers load correctly
- [ ] Clustering works with 1000+ projects
- [ ] Popups display on mobile without overflow
- [ ] Search finds cities accurately
- [ ] Basemap switching is smooth
- [ ] Deep links work with map state
- [ ] Performance: <2s load time for 500 markers
- [ ] Accessibility: Keyboard navigation works

---

## Resources

- [Leaflet Documentation](https://leafletjs.com/)
- [React Leaflet](https://react-leaflet.js.org/)
- [SDG Colors (Official)](https://www.un.org/sustainabledevelopment/news/communications-material/)
- [CartoDB Basemaps](https://github.com/CartoDB/basemap-styles)
- [Leaflet Plugins](https://leafletjs.com/plugins.html)
