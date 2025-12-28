export interface Place {
  place_id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface PlaceWithDistance extends Place {
  distance: number;
}

// Nominatim (OpenStreetMap) response type
interface NominatimResult {
  place_id: number;
  name: string;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance?: number;
}

// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Extract address from display_name (vicinity equivalent)
const extractVicinity = (displayName: string): string => {
  // Split by comma and take the relevant parts
  const parts = displayName.split(',').map(p => p.trim());
  // Usually take first few parts (street, city, etc)
  if (parts.length >= 2) {
    return parts.slice(0, 3).join(', ');
  }
  return displayName;
};

// Overpass API result type
interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  tags?: {
    name?: string;
    'addr:street'?: string;
    'addr:city'?: string;
    'addr:housenumber'?: string;
    amenity?: string;
    shop?: string;
    leisure?: string;
  };
}

interface OverpassResponse {
  elements: OverpassElement[];
}

// Search using Overpass API for POIs with specific tags
const searchOverpassAPI = async (
  latitude: number,
  longitude: number,
  radiusKm: number
): Promise<Array<NominatimResult & { distance: number }>> => {
  // Calculate bounding box for Overpass
  const bboxSize = radiusKm / 111; // 1 degree ≈ 111 km
  const south = latitude - bboxSize;
  const north = latitude + bboxSize;
  const west = longitude - bboxSize;
  const east = longitude + bboxSize;

  // Overpass query to find spas, massage places, wellness centers
  // Using multiple tag combinations
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="spa"](${south},${west},${north},${east});
      node["shop"="massage"](${south},${west},${north},${east});
      node["leisure"="spa"](${south},${west},${north},${east});
      way["amenity"="spa"](${south},${west},${north},${east});
      way["shop"="massage"](${south},${west},${north},${east});
      way["leisure"="spa"](${south},${west},${north},${east});
      relation["amenity"="spa"](${south},${west},${north},${east});
      relation["shop"="massage"](${south},${west},${north},${east});
      relation["leisure"="spa"](${south},${west},${north},${east});
    );
    out center meta;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: query,
    });

    if (!response.ok) {
      return [];
    }

    const data: OverpassResponse = await response.json();

    return data.elements
      .filter((element) => {
        const tags = element.tags || {};
        const name = (tags.name || '').toLowerCase();
        // Filter for massage/spa related
        return (
          tags.amenity === 'spa' ||
          tags.shop === 'massage' ||
          tags.leisure === 'spa' ||
          name.includes('massage') ||
          name.includes('spa') ||
          name.includes('thai') ||
          name.includes('wellness')
        );
      })
      .map((element) => {
        // Get coordinates: use center for ways/relations, direct lat/lon for nodes
        let lat: number, lng: number;
        if (element.type === 'node' && element.lat && element.lon) {
          lat = element.lat;
          lng = element.lon;
        } else if (element.type === 'way' || element.type === 'relation') {
          // For ways/relations, Overpass returns center coordinates in tags or we need to calculate
          // Since we asked for "out center", coordinates should be available
          if (element.lat && element.lon) {
            lat = element.lat;
            lng = element.lon;
          } else {
            return null;
          }
        } else {
          return null;
        }

        const distance = calculateDistance(latitude, longitude, lat, lng);
        const tags = element.tags || {};
        const name = tags.name || 'Massage';
        const street = tags['addr:street'] || '';
        const houseNumber = tags['addr:housenumber'] || '';
        const city = tags['addr:city'] || '';

        let address = '';
        if (street) {
          address = houseNumber ? `${street} ${houseNumber}` : street;
          if (city) address += `, ${city}`;
        }

        const display_name = address || name;

        return {
          place_id: element.id,
          name,
          display_name,
          lat: lat.toString(),
          lon: lng.toString(),
          type: tags.amenity || tags.shop || tags.leisure || 'massage',
          distance,
        };
      })
      .filter((r): r is NominatimResult & { distance: number } => r !== null);
  } catch (error) {
    console.error('Error searching Overpass API:', error);
    return [];
  }
};

// Helper function to search with a specific query
const searchWithQuery = async (
  query: string,
  bbox: string,
  latitude: number,
  longitude: number
): Promise<Array<NominatimResult & { distance: number }>> => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=50&bounded=1&viewbox=${bbox}&bzoom=10&addressdetails=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'HappyTimes/1.0 (Thai Massage Finder)',
      },
    });

    if (!response.ok) {
      return [];
    }

    const data: NominatimResult[] = await response.json();
    
    return data.map((result) => {
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);
      const distance = calculateDistance(latitude, longitude, lat, lng);
      return { ...result, distance };
    });
  } catch (error) {
    console.error(`Error searching for "${query}":`, error);
    return [];
  }
};

// Search using OpenStreetMap Nominatim API (completely free, no key needed)
export const searchThaiMassagePlaces = async (
  latitude: number,
  longitude: number,
  radiusKm: number = 5
): Promise<Place[]> => {
  // Nominatim search with bounding box for radius filtering
  // Convert km to approximate degrees (1 degree ≈ 111 km)
  const bboxSize = (radiusKm / 111) * 1.3; // Add 30% buffer for better results
  
  const bbox = [
    longitude - bboxSize, // min lon
    latitude - bboxSize,  // min lat
    longitude + bboxSize, // max lon
    latitude + bboxSize,  // max lat
  ].join(',');

  // Search with multiple queries to get more results
  const searchQueries = [
    'thai massage',
    'massage',
    'spa',
    'thai spa',
    'wellness center',
    'body massage',
    'relaxation center'
  ];

  // Search with both Nominatim and Overpass API in parallel for maximum coverage
  const [nominatimResults, overpassResults] = await Promise.all([
    Promise.all(searchQueries.map(query => searchWithQuery(query, bbox, latitude, longitude))),
    searchOverpassAPI(latitude, longitude, radiusKm)
  ]);

  // Combine all results
  const allResults = [...nominatimResults.flat(), ...overpassResults];

  // Combine and deduplicate results by name+location (since different APIs may have different IDs)
  const resultMap = new Map<string, NominatimResult & { distance: number }>();
  
  allResults.flat().forEach((result) => {
    // Create a unique key based on name and approximate location (rounded to 4 decimals ≈ 11 meters)
    const lat = parseFloat(result.lat).toFixed(4);
    const lng = parseFloat(result.lon).toFixed(4);
    const key = `${(result.name || '').toLowerCase().trim()}_${lat}_${lng}`;
    
    const existing = resultMap.get(key);
    // Keep the result with the closest match to "thai massage" or the closest distance
    if (!existing || 
        result.name?.toLowerCase().includes('thai') && !existing.name?.toLowerCase().includes('thai') ||
        (result.name?.toLowerCase().includes('thai') === existing.name?.toLowerCase().includes('thai') && 
         result.distance < existing.distance)) {
      resultMap.set(key, result);
    }
  });

  // Filter for Thai massage related places and convert to Place format
  const places: Place[] = Array.from(resultMap.values())
    .filter((result) => {
      const distance = result.distance;
      if (distance > radiusKm) return false;
      
      // Filter for massage/spa related places
      const name = (result.name || '').toLowerCase();
      const displayName = result.display_name.toLowerCase();
      const type = result.type?.toLowerCase() || '';
      
      // Check if it's massage/spa/wellness related
      const isMassageRelated = 
        name.includes('massage') ||
        name.includes('spa') ||
        name.includes('wellness') ||
        name.includes('thai') ||
        displayName.includes('massage') ||
        displayName.includes('spa') ||
        type.includes('spa') ||
        type.includes('massage');
      
      return isMassageRelated;
    })
    .map((result) => {
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);
      const distance = result.distance;

      return {
        place_id: result.place_id.toString(),
        name: result.name || result.display_name.split(',')[0] || 'Massage',
        rating: 0,
        user_ratings_total: 0,
        vicinity: extractVicinity(result.display_name),
        geometry: {
          location: {
            lat,
            lng,
          },
        },
        distance, // Temporary for filtering
      };
    })
    .sort((a, b) => {
      // Sort by: Thai massage first, then by distance
      const aIsThai = a.name.toLowerCase().includes('thai');
      const bIsThai = b.name.toLowerCase().includes('thai');
      if (aIsThai && !bIsThai) return -1;
      if (!aIsThai && bIsThai) return 1;
      return a.distance - b.distance;
    })
    .map(({ distance, ...place }) => place); // Remove distance from final result

  return places;
};

// Use free routing via external services
export const getRouteUrl = (
  destinationLat: number,
  destinationLng: number,
  userLat: number,
  userLng: number,
  travelMode: 'walking' | 'driving' = 'driving'
): string => {
  // Google Maps routing links work without API key (only for routing links, not for Places API)
  // This is completely free and requires no authentication
  const mode = travelMode === 'walking' ? 'walking' : 'driving';
  return `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destinationLat},${destinationLng}&travelmode=${mode}`;
};

