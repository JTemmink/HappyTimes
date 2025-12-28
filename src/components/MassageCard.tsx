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
      className="thai-card cursor-pointer hover:scale-[1.02] transition-all duration-300 mb-5 group relative"
    >
      <div className="absolute top-2 right-2 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">
        💆‍♀️
      </div>
      <div className="flex justify-between items-start relative z-10">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-thai-red mb-2 group-hover:text-thai-red-dark transition-colors">
            {place.name}
          </h3>
          <p className="text-gray-600 mb-3 text-sm">{place.vicinity}</p>
          <div className="mb-3">{renderStars(place.rating || 0)}</div>
        </div>
        <div className="text-right ml-4 flex flex-col items-end">
          <div className="bg-gradient-to-br from-thai-green to-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg mb-1">
            <p className="text-2xl font-bold">{distance} km</p>
          </div>
          <p className="text-xs text-gray-500 font-medium">distance</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t-2 border-gradient-to-r from-transparent via-thai-gold to-transparent relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-thai-gold to-transparent"></div>
        <span className="text-thai-gold-dark font-semibold flex items-center gap-2 group-hover:text-thai-gold transition-colors">
          <span className="text-lg">📍</span>
          Tap to see route →
        </span>
      </div>
    </div>
  );
};

