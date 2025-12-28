import { useState } from 'react';
import { geocodeAddress } from '../utils/geocoding';

interface ManualLocationProps {
  onLocationSet: (lat: number, lng: number) => void;
  onBack: () => void;
}

export const ManualLocation = ({ onLocationSet, onBack }: ManualLocationProps) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundLocation, setFoundLocation] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFoundLocation(null);

    if (!address.trim()) {
      setError('Please enter an address or city name');
      return;
    }

    setLoading(true);
    try {
      const result = await geocodeAddress(address);
      setFoundLocation(result.display_name);
      // Small delay to show the found location
      setTimeout(() => {
        onLocationSet(result.lat, result.lng);
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not find location');
      setLoading(false);
    }
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
            Enter an address, city name, or landmark to find Thai massages nearby
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-left text-sm font-semibold text-gray-700 mb-2">
                Enter Address or City
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g., Amsterdam, Netherlands or 123 Main St, New York"
                className="w-full px-4 py-3 rounded-xl border-2 border-thai-gold focus:border-thai-red focus:ring-2 focus:ring-thai-gold focus:outline-none transition-all text-base"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1 text-left">
                Enter a city name, street address, or landmark
              </p>
            </div>

            {loading && (
              <div className="flex items-center justify-center gap-2 py-4">
                <div className="animate-spin text-2xl">🔍</div>
                <span className="text-sm text-gray-600">Searching for location...</span>
              </div>
            )}

            {foundLocation && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-green-700 font-semibold mb-1">✓ Found:</p>
                <p className="text-sm text-green-800">{foundLocation}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                className="thai-button-primary w-full"
                disabled={loading || !address.trim()}
              >
                {loading ? 'Searching...' : 'Search Location 🔍'}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-thai-gold/10 rounded-xl border border-thai-gold/20">
            <p className="text-xs text-gray-600 text-left">
              <strong>💡 Tip:</strong> You can enter a city name (e.g., "Amsterdam"), 
              a full address, or a landmark. The app will find the location automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

