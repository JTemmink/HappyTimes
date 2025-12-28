interface LocationPromptProps {
  onGrant: () => void;
  error?: string | null;
}

export const LocationPrompt = ({ onGrant, error }: LocationPromptProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="thai-card thai-pattern max-w-md w-full text-center space-y-6">
        <div className="text-6xl mb-4">📍</div>
        <h1 className="thai-title text-4xl mb-4">🌸 HappyTimes 🌸</h1>
        <p className="text-xl font-bold text-thai-red mb-2">
          We need your location
        </p>
        <p className="text-gray-700">
          To find Thai massages near you, we need access to your location.
        </p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700 font-semibold mb-1">⚠️ {error}</p>
            {error.includes('denied') && (
              <p className="text-xs text-red-600 mt-2">
                Please enable location access in your browser settings and try again.
              </p>
            )}
          </div>
        )}
        
        <button 
          onClick={onGrant} 
          className="thai-button-primary w-full mt-4"
        >
          Share Location 📍
        </button>
        <p className="text-sm text-gray-500">
          Your location is only used to find massage places and is not stored.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          💡 Tip: Make sure HTTPS is enabled and allow location access when your browser asks.
        </p>
      </div>
    </div>
  );
};

