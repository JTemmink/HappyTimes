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
          We hebben je locatie nodig
        </p>
        <p className="text-gray-700">
          Om Thai massages in jouw buurt te vinden, hebben we toegang tot je locatie nodig.
        </p>
        <button onClick={onGrant} className="thai-button-primary w-full mt-4">
          Locatie delen 📍
        </button>
        <p className="text-sm text-gray-500">
          Je locatie wordt alleen gebruikt om massage plekken te vinden en wordt niet opgeslagen.
        </p>
      </div>
    </div>
  );
};

