interface LocationPromptProps {
  onGrant: () => void;
}

export const LocationPrompt = ({ onGrant }: LocationPromptProps) => {
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
        <button onClick={onGrant} className="thai-button-primary w-full mt-4">
          Share Location 📍
        </button>
        <p className="text-sm text-gray-500">
          Your location is only used to find massage places and is not stored.
        </p>
      </div>
    </div>
  );
};

