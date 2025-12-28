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

// Search using OpenStreetMap Nominatim API (volledig gratis, geen key nodig)
export const searchThaiMassagePlaces = async (
  latitude: number,
  longitude: number,
  radius: number = 5000
): Promise<Place[]> => {
  // Nominatim search met bounding box voor radius filtering
  // We maken een bbox van ongeveer 5km rond de locatie
  const bboxSize = 0.045; // Ongeveer 5km in graden (ongeveer)
  
  const bbox = [
    longitude - bboxSize, // min lon
    latitude - bboxSize,  // min lat
    longitude + bboxSize, // max lon
    latitude + bboxSize,  // max lat
  ].join(',');

  // Zoek naar "thai massage" in de buurt
  const query = 'thai massage';
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=50&bounded=1&viewbox=${bbox}&bzoom=15&addressdetails=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'HappyTimes/1.0 (Thai Massage Finder)', // Nominatim vereist User-Agent
      },
    });

    if (!response.ok) {
      throw new Error('Kan geen verbinding maken met de zoek service');
    }

    const data: NominatimResult[] = await response.json();

    // Converteer Nominatim results naar Place format
    const places: Place[] = data
      .map((result) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        const distance = calculateDistance(latitude, longitude, lat, lng);

        return {
          place_id: result.place_id.toString(),
          name: result.name || result.display_name.split(',')[0] || 'Thai Massage',
          rating: 0, // Nominatim heeft geen ratings, we gebruiken 0
          user_ratings_total: 0,
          vicinity: extractVicinity(result.display_name),
          geometry: {
            location: {
              lat,
              lng,
            },
          },
          distance, // Tijdelijk voor filtering
        };
      })
      .filter((place) => place.distance <= 5) // Max 5km
      .sort((a, b) => a.distance - b.distance)
      .map(({ distance, ...place }) => place); // Remove distance from final result

    return places;
  } catch (error) {
    console.error('Error fetching places:', error);
    throw new Error('Er ging iets mis bij het zoeken naar massage plekken. Probeer het later opnieuw.');
  }
};

// Gebruik gratis routing via externe services
export const getRouteUrl = (
  destinationLat: number,
  destinationLng: number,
  userLat: number,
  userLng: number,
  travelMode: 'walking' | 'driving' = 'driving'
): string => {
  // Google Maps routing links werken zonder API key (alleen voor routing links, niet voor Places API)
  // Dit is volledig gratis en vereist geen authenticatie
  const mode = travelMode === 'walking' ? 'walking' : 'driving';
  return `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destinationLat},${destinationLng}&travelmode=${mode}`;
};

