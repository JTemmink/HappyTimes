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

// Known Thai massage places that might not be found by search
// These will be added when user is in the area
interface KnownPlace {
  name: string;
  address: string;
  lat: number;
  lng: number;
  city: string;
  radiusKm: number; // Within this radius of the city, include this place
}

const KNOWN_PLACES: KnownPlace[] = [
  // Garmisch-Partenkirchen area (radius ~5km from city center)
  {
    name: 'Thai Siam Spa Massage',
    address: 'St.-Martin-Straße 2, Garmisch-Partenkirchen',
    lat: 47.4925,
    lng: 11.0964,
    city: 'Garmisch-Partenkirchen',
    radiusKm: 5,
  },
  {
    name: 'Bulan Spa Thai Massage Garmisch-Partenkirchen',
    address: 'Rathauspl. 11, Garmisch-Partenkirchen',
    lat: 47.4937,
    lng: 11.0952,
    city: 'Garmisch-Partenkirchen',
    radiusKm: 5,
  },
  {
    name: 'Thai- Yoga Massage und Yoga by MounTeam',
    address: 'St.-Martin-Straße, Garmisch-Partenkirchen',
    lat: 47.4920,
    lng: 11.0960,
    city: 'Garmisch-Partenkirchen',
    radiusKm: 5,
  },
];

// Check if a location is near a known place's city
const getKnownPlacesForLocation = (
  latitude: number,
  longitude: number,
  radiusKm: number
): Array<Place & { distance: number }> => {
  const nearbyKnownPlaces: Array<Place & { distance: number }> = [];

  for (const knownPlace of KNOWN_PLACES) {
    const distance = calculateDistance(latitude, longitude, knownPlace.lat, knownPlace.lng);
    
    // Check if user is within the known place's radius
    if (distance <= knownPlace.radiusKm) {
      // Check if the place is also within the user's search radius
      if (distance <= radiusKm) {
        nearbyKnownPlaces.push({
          place_id: `known_${knownPlace.name.replace(/\s+/g, '_')}_${knownPlace.lat}_${knownPlace.lng}`,
          name: knownPlace.name,
          rating: 0,
          user_ratings_total: 0,
          vicinity: knownPlace.address,
          geometry: {
            location: {
              lat: knownPlace.lat,
              lng: knownPlace.lng,
            },
          },
          distance, // Temporary for sorting
        });
      }
    }
  }

  return nearbyKnownPlaces;
};

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

  // Search with all queries in parallel
  const allResults = await Promise.all(
    searchQueries.map(query => searchWithQuery(query, bbox, latitude, longitude))
  );

  // Combine and deduplicate results by place_id
  const resultMap = new Map<number, NominatimResult & { distance: number }>();
  
  allResults.flat().forEach((result) => {
    const existing = resultMap.get(result.place_id);
    // Keep the result with the closest match to "thai massage" or the closest distance
    if (!existing || result.name?.toLowerCase().includes('thai') || result.distance < existing.distance) {
      resultMap.set(result.place_id, result);
    }
  });

  // Filter for Thai massage related places and convert to Place format
  const places: Array<Place & { distance: number }> = Array.from(resultMap.values())
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
    });

  // Add known places for the area
  const knownPlaces = getKnownPlacesForLocation(latitude, longitude, radiusKm);
  
  // Combine and deduplicate by name similarity
  const allPlacesMap = new Map<string, Place & { distance: number }>();
  
  // Add search results
  places.forEach((place) => {
    const key = place.name.toLowerCase().trim();
    allPlacesMap.set(key, place);
  });
  
  // Add known places (they override search results if name is very similar, otherwise add as new)
  knownPlaces.forEach((knownPlace) => {
    const key = knownPlace.name.toLowerCase().trim();
    const existing = allPlacesMap.get(key);
    
    // Only add if not already found or if it's a better match
    if (!existing) {
      allPlacesMap.set(key, knownPlace);
    }
  });

  // Convert back to array, sort, and remove distance
  const finalPlaces = Array.from(allPlacesMap.values())
    .sort((a, b) => {
      const aIsThai = a.name.toLowerCase().includes('thai');
      const bIsThai = b.name.toLowerCase().includes('thai');
      if (aIsThai && !bIsThai) return -1;
      if (!aIsThai && bIsThai) return 1;
      return a.distance - b.distance;
    })
    .map(({ distance, ...place }) => place);

  return finalPlaces;
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

