// Geocode address to coordinates using Nominatim (free, no API key needed)
export interface GeocodeResult {
  lat: number;
  lng: number;
  display_name: string;
}

export const geocodeAddress = async (address: string): Promise<GeocodeResult> => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&addressdetails=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'HappyTimes/1.0 (Thai Massage Finder)',
      },
    });

    if (!response.ok) {
      throw new Error('Unable to connect to geocoding service');
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error('Address not found. Please try a different location.');
    }

    const result = data[0];
    return {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      display_name: result.display_name,
    };
  } catch (error) {
    console.error('Error geocoding address:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Something went wrong while searching for the address. Please try again.');
  }
};

