import { useState, useEffect } from 'react';
import { PlaceWithDistance, searchThaiMassagePlaces, calculateDistance } from '../utils/placesApi';
import { MassageCard } from './MassageCard';
import { RouteSelector } from './RouteSelector';

interface MassageListProps {
  latitude: number;
  longitude: number;
  wantsTreatment: boolean;
}

export const MassageList = ({ latitude, longitude, wantsTreatment }: MassageListProps) => {
  const [places, setPlaces] = useState<PlaceWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceWithDistance | null>(null);
  const [searchRadius, setSearchRadius] = useState(5); // Start with 5km

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Start search and minimum delay in parallel
        const [results] = await Promise.all([
          searchThaiMassagePlaces(latitude, longitude, searchRadius),
          new Promise(resolve => setTimeout(resolve, 3000)) // Minimum 3 seconds delay
        ]);
        
        // Add distance to each place
        const placesWithDistance = results.map((place) => ({
          ...place,
          distance: calculateDistance(
            latitude,
            longitude,
            place.geometry.location.lat,
            place.geometry.location.lng
          ),
        }));

        setPlaces(placesWithDistance);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong while searching');
        console.error('Error fetching places:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [latitude, longitude, searchRadius]);

  const handleSearchFurther = () => {
    setSearchRadius(25);
  };

  if (selectedPlace) {
    return (
      <RouteSelector
        place={selectedPlace}
        userLat={latitude}
        userLng={longitude}
        wantsTreatment={wantsTreatment}
        onBack={() => setSelectedPlace(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="thai-card max-w-md w-full text-center relative">
          <div className="floating-lotus" style={{top: '10%', left: '10%'}}>💆‍♀️</div>
          <div className="floating-lotus" style={{top: '15%', right: '15%', animationDelay: '1.5s'}}>🌸</div>
          <div className="relative z-10">
            <div className="animate-spin text-6xl mb-4" style={{animationDuration: '2s'}}>💆‍♀️</div>
            <p className="text-xl font-bold text-thai-red mb-2">Searching for Thai massages...</p>
            <div className="flex justify-center gap-1 mt-3">
              <div className="w-2 h-2 bg-thai-gold rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
              <div className="w-2 h-2 bg-thai-red rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-thai-green rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="thai-card max-w-md w-full text-center">
          <p className="text-xl font-bold text-thai-red mb-4">⚠️ {error}</p>
          <p className="text-gray-600">
            Please try again later or check your internet connection.
          </p>
        </div>
      </div>
    );
  }

  if (places.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="thai-card max-w-md w-full text-center space-y-4">
          <p className="text-2xl font-bold text-thai-red mb-4">😔</p>
          <p className="text-xl font-bold text-thai-red mb-2">No Thai massages found</p>
          <p className="text-gray-600">
            No Thai massage places found within {searchRadius} km.
          </p>
          {searchRadius === 5 && (
            <button
              onClick={handleSearchFurther}
              className="thai-button-primary w-full mt-4"
            >
              Search Further Away
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10 relative">
          <div className="floating-lotus" style={{top: '-20px', left: '5%'}}>🌸</div>
          <div className="floating-lotus" style={{top: '-10px', right: '8%', animationDelay: '1s'}}>💆‍♀️</div>
          <h1 className="thai-title text-5xl mb-4 relative z-10">🌸 Jovan 🌸 Happy Times Thai Massage Finder</h1>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/30 inline-block">
            <p className="text-xl text-white font-bold drop-shadow-2xl">
              {places.length} Thai massage{places.length !== 1 ? 's' : ''} found within {searchRadius} km
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {places.map((place) => (
            <MassageCard
              key={place.place_id}
              place={place}
              userLat={latitude}
              userLng={longitude}
              onSelect={setSelectedPlace}
            />
          ))}
        </div>

        {searchRadius === 5 && places.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={handleSearchFurther}
              className="thai-button-secondary w-full max-w-md mx-auto"
            >
              🔍 Search Further Away (25 km)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

