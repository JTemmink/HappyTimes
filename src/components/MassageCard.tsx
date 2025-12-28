import { PlaceWithDistance } from '../utils/placesApi';

interface MassageCardProps {
  place: PlaceWithDistance;
  userLat: number;
  userLng: number;
  onSelect: (place: PlaceWithDistance) => void;
}

export const MassageCard = ({ place, onSelect }: MassageCardProps) => {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-xl">⭐</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400 text-xl">✨</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={i} className="text-gray-300 text-xl">☆</span>
        ))}
        <span className="ml-2 text-gray-600">({place.user_ratings_total || 0})</span>
      </div>
    );
  };

  const distance = place.distance ? place.distance.toFixed(1) : '?';

  return (
    <div
      onClick={() => onSelect(place)}
      className="thai-card cursor-pointer hover:scale-105 transition-transform duration-200 mb-4"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-thai-red mb-2">{place.name}</h3>
          <p className="text-gray-600 mb-2">{place.vicinity}</p>
          {renderStars(place.rating || 0)}
        </div>
        <div className="text-right ml-4">
          <p className="text-2xl font-bold text-thai-green">{distance} km</p>
          <p className="text-sm text-gray-500">distance</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <span className="text-thai-gold-dark font-semibold">📍 Tap to see route</span>
      </div>
    </div>
  );
};

