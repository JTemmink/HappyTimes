import { useState, useEffect } from 'react';

interface Position {
  latitude: number;
  longitude: number;
}

interface UseGeolocationReturn {
  position: Position | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (geoPosition) => {
        setPosition({
          latitude: geoPosition.coords.latitude,
          longitude: geoPosition.coords.longitude,
        });
        setLoading(false);
        setError(null);
      },
      (geoError) => {
        let errorMessage = 'Unable to determine your location';
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            errorMessage = 'Location access denied';
            break;
          case geoError.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case geoError.TIMEOUT:
            errorMessage = 'Location request timeout';
            break;
        }
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return { position, error, loading };
};

