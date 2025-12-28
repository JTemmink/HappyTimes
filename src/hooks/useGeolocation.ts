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
      setError('Geolocatie wordt niet ondersteund door je browser');
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
        let errorMessage = 'Kan je locatie niet bepalen';
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            errorMessage = 'Locatie toegang geweigerd';
            break;
          case geoError.POSITION_UNAVAILABLE:
            errorMessage = 'Locatie informatie niet beschikbaar';
            break;
          case geoError.TIMEOUT:
            errorMessage = 'Locatie request timeout';
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

