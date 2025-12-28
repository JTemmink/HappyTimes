import { useState, useEffect } from 'react';
import { Place, getRouteUrl } from '../utils/placesApi';
import { generateMassageDescription, parseStrikethroughText } from '../utils/openaiApi';

interface RouteSelectorProps {
  place: Place;
  userLat: number;
  userLng: number;
  wantsTreatment: boolean;
  onBack: () => void;
}

export const RouteSelector = ({ place, userLat, userLng, wantsTreatment, onBack }: RouteSelectorProps) => {
  const [description, setDescription] = useState<string | null>(null);
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDescription = async () => {
      setLoadingDescription(true);
      setDescriptionError(null);
      try {
        const desc = await generateMassageDescription(place.name, wantsTreatment);
        setDescription(desc);
      } catch (error) {
        console.error('Error generating description:', error);
        setDescriptionError('Could not generate description');
      } finally {
        setLoadingDescription(false);
      }
    };

    fetchDescription();
  }, [place.name, wantsTreatment]);
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

          {/* AI Generated Description */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <p className="text-sm font-semibold text-thai-red mb-2">💬 AI Description:</p>
            {loadingDescription && (
              <div className="flex items-center gap-2 text-gray-600">
                <div className="animate-spin text-lg">🌸</div>
                <span className="text-sm">Generating witty description...</span>
              </div>
            )}
            {descriptionError && (
              <p className="text-sm text-gray-500 italic">{descriptionError}</p>
            )}
            {description && !loadingDescription && (
              <p className="text-sm text-gray-700 italic leading-relaxed">
                {parseStrikethroughText(description).map((part, index) => 
                  part.strikethrough ? (
                    <span key={index} className="line-through text-gray-500">
                      {part.text}
                    </span>
                  ) : (
                    <span key={index}>{part.text}</span>
                  )
                )}
              </p>
            )}
          </div>
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

