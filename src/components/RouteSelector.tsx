import { Place, getRouteUrl } from '../utils/placesApi';

interface RouteSelectorProps {
  place: Place;
  userLat: number;
  userLng: number;
  onBack: () => void;
}

export const RouteSelector = ({ place, userLat, userLng, onBack }: RouteSelectorProps) => {
  const handleRoute = (mode: 'walking' | 'driving') => {
    const url = getRouteUrl(
      place.geometry.location.lat,
      place.geometry.location.lng,
      userLat,
      userLng,
      mode
    );
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="thai-card thai-pattern max-w-md w-full text-center space-y-6">
        <button
          onClick={onBack}
          className="text-left text-thai-red hover:text-thai-red-dark font-bold mb-4"
        >
          ← Back
        </button>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-thai-red">{place.name}</h2>
          <p className="text-gray-600">{place.vicinity}</p>
          {place.rating && (
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">⭐</span>
              <span className="text-xl font-bold">{place.rating.toFixed(1)}</span>
              <span className="text-gray-600">({place.user_ratings_total} reviews)</span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-6 space-y-4">
          <p className="text-xl font-bold text-thai-red">How would you like to get there?</p>
          
          <button
            onClick={() => handleRoute('walking')}
            className="thai-button-primary w-full"
          >
            🚶 Walking
          </button>
          
          <button
            onClick={() => handleRoute('driving')}
            className="thai-button-secondary w-full"
          >
            🚗 Driving
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          You will be redirected for directions
        </p>
      </div>
    </div>
  );
};

