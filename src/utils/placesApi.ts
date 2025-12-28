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

// Search using OpenStreetMap Nominatim API (completely free, no key needed)
export const searchThaiMassagePlaces = async (
  latitude: number,
  longitude: number,
  _radius: number = 5000
): Promise<Place[]> => {
  // Nominatim search with bounding box for radius filtering
  // We create a bbox of approximately 5km around the location
  const bboxSize = 0.045; // Approximately 5km in degrees (approximate)
  
  const bbox = [
    longitude - bboxSize, // min lon
    latitude - bboxSize,  // min lat
    longitude + bboxSize, // max lon
    latitude + bboxSize,  // max lat
  ].join(',');

  // Search for "thai massage" nearby
  const query = 'thai massage';
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=50&bounded=1&viewbox=${bbox}&bzoom=15&addressdetails=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'HappyTimes/1.0 (Thai Massage Finder)', // Nominatim requires User-Agent
      },
    });

    if (!response.ok) {
      throw new Error('Unable to connect to search service');
    }

    const data: NominatimResult[] = await response.json();

    // Convert Nominatim results to Place format
    const places: Place[] = data
      .map((result) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        const distance = calculateDistance(latitude, longitude, lat, lng);

        return {
          place_id: result.place_id.toString(),
          name: result.name || result.display_name.split(',')[0] || 'Thai Massage',
          rating: 0, // Nominatim doesn't have ratings, we use 0
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
      .filter((place) => place.distance <= 5) // Max 5km
      .sort((a, b) => a.distance - b.distance)
      .map(({ distance, ...place }) => place); // Remove distance from final result

    return places;
  } catch (error) {
    console.error('Error fetching places:', error);
    throw new Error('Something went wrong while searching for massage places. Please try again later.');
  }
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

