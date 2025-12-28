import { useState } from 'react';

interface ManualLocationProps {
  onLocationSet: (lat: number, lng: number) => void;
  onBack: () => void;
}

export const ManualLocation = ({ onLocationSet, onBack }: ManualLocationProps) => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      setError('Please enter valid numbers');
      return;
    }

    if (lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90');
      return;
    }

    if (lng < -180 || lng > 180) {
      setError('Longitude must be between -180 and 180');
      return;
    }

    onLocationSet(lat, lng);
  };

  const handleOpenMapPicker = () => {
    // Open Google Maps in a new tab where user can click to get coordinates
    window.open('https://www.google.com/maps', '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="thai-card thai-pattern max-w-md w-full text-center space-y-6 relative">
        <div className="floating-lotus" style={{top: '10%', left: '5%'}}>🗺️</div>
        <div className="floating-lotus" style={{bottom: '15%', right: '8%', animationDelay: '2s'}}>📍</div>
        
        <button
          onClick={onBack}
          className="text-left text-thai-red hover:text-thai-red-dark font-bold mb-4 transition-colors flex items-center gap-2 group relative z-10"
        >
          <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span> Back
        </button>

        <div className="relative z-10">
          <div className="text-6xl mb-4">📍</div>
          <h2 className="thai-title text-3xl mb-4">Choose Your Location</h2>
          <p className="text-gray-700 mb-6">
            Enter your coordinates or use the map picker to find them
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="latitude" className="block text-left text-sm font-semibold text-gray-700 mb-2">
                Latitude (-90 to 90)
              </label>
              <input
                id="latitude"
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g., 52.3676"
                className="w-full px-4 py-3 rounded-xl border-2 border-thai-gold focus:border-thai-red focus:ring-2 focus:ring-thai-gold focus:outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="longitude" className="block text-left text-sm font-semibold text-gray-700 mb-2">
                Longitude (-180 to 180)
              </label>
              <input
                id="longitude"
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g., 4.9041"
                className="w-full px-4 py-3 rounded-xl border-2 border-thai-gold focus:border-thai-red focus:ring-2 focus:ring-thai-gold focus:outline-none transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                className="thai-button-primary w-full"
              >
                Use This Location 📍
              </button>

              <button
                type="button"
                onClick={handleOpenMapPicker}
                className="thai-button-secondary w-full"
              >
                Open Map to Find Coordinates 🗺️
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-thai-gold/10 rounded-xl border border-thai-gold/20">
            <p className="text-xs text-gray-600 text-left">
              <strong>💡 Tip:</strong> Right-click on Google Maps and select "What's here?" to get coordinates. 
              Or search for your city/address and right-click on the location.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

