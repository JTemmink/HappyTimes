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
      <div className="thai-card thai-pattern max-w-md w-full text-center space-y-6 relative">
        <div className="floating-lotus" style={{top: '5%', right: '5%'}}>💆‍♀️</div>
        <div className="floating-lotus" style={{bottom: '10%', left: '5%', animationDelay: '2s'}}>🌸</div>
        <button
          onClick={onBack}
          className="text-left text-thai-red hover:text-thai-red-dark font-bold mb-4 transition-colors flex items-center gap-2 group relative z-10"
        >
          <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span> Back
        </button>

        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-3xl animate-bounce">💆‍♀️</span>
            <h2 className="text-3xl font-bold text-thai-red drop-shadow-lg">{place.name}</h2>
            <span className="text-3xl animate-bounce" style={{animationDelay: '0.5s'}}>💆‍♂️</span>
          </div>
          <p className="text-gray-600 text-sm bg-gray-50 rounded-lg p-2">{place.vicinity}</p>
          {place.rating && (
            <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-3 border border-yellow-200">
              <span className="text-2xl">⭐</span>
              <span className="text-xl font-bold text-gray-800">{place.rating.toFixed(1)}</span>
              <span className="text-gray-600 text-sm">({place.user_ratings_total} reviews)</span>
            </div>
          )}

          {/* AI Generated Description */}
          <div className="border-t-2 border-gradient-to-r from-transparent via-thai-gold to-transparent pt-4 mt-4 relative">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-thai-gold to-transparent"></div>
            <div className="bg-gradient-to-r from-thai-gold/10 via-transparent to-thai-gold/10 rounded-xl p-4 border border-thai-gold/20">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-lg">💬</span>
                <p className="text-sm font-semibold text-thai-red">AI Description</p>
                <span className="text-lg">✨</span>
              </div>
              {loadingDescription && (
                <div className="flex items-center justify-center gap-2 text-gray-600 py-4">
                  <div className="animate-spin text-lg" style={{animationDuration: '2s'}}>🌸</div>
                  <span className="text-sm">Generating witty description...</span>
                </div>
              )}
              {descriptionError && (
                <p className="text-sm text-gray-500 italic text-center py-2">{descriptionError}</p>
              )}
              {description && !loadingDescription && (
                <div className="text-sm text-gray-700 italic leading-relaxed bg-white/60 rounded-lg p-3 border border-thai-gold/10">
                  {parseStrikethroughText(description).map((part, index) => 
                    part.strikethrough ? (
                      <span key={index} className="line-through text-gray-500">
                        {part.text}
                      </span>
                    ) : (
                      <span key={index}>{part.text}</span>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t-2 border-gradient-to-r from-transparent via-thai-gold to-transparent pt-6 space-y-4 relative z-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-thai-gold to-transparent"></div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🗺️</span>
            <p className="text-xl font-bold text-thai-red">How would you like to get there?</p>
            <span className="text-2xl">🗺️</span>
          </div>
          
          <button
            onClick={() => handleRoute('walking')}
            className="thai-button-primary w-full relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span className="text-2xl">🚶</span>
              Walking
            </span>
          </button>
          
          <button
            onClick={() => handleRoute('driving')}
            className="thai-button-secondary w-full relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span className="text-2xl">🚗</span>
              Driving
            </span>
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          You will be redirected for directions
        </p>
      </div>
    </div>
  );
};

