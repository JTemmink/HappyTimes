import { useState, useEffect } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import { LocationPrompt } from './components/LocationPrompt';
import { QuestionFlow } from './components/QuestionFlow';
import { MassageList } from './components/MassageList';

type AppState = 'location' | 'questions' | 'results';

function App() {
  const { position, error, loading, requestLocation } = useGeolocation();
  const [appState, setAppState] = useState<AppState>('location');
  const [questionsCompleted, setQuestionsCompleted] = useState(false);
  const [wantsTreatment, setWantsTreatment] = useState(false);

  // Auto-advance to questions when location is ready
  useEffect(() => {
    if (position && appState === 'location') {
      setAppState('questions');
    }
  }, [position, appState]);

  // If we have a position and questions are completed, show results
  if (position && questionsCompleted) {
    return <MassageList latitude={position.latitude} longitude={position.longitude} wantsTreatment={wantsTreatment} />;
  }

  // If we have a position but questions not yet completed, show questions
  if (position && !questionsCompleted && appState === 'questions') {
    return <QuestionFlow onComplete={(wants) => { setWantsTreatment(wants); setQuestionsCompleted(true); }} />;
  }

  // Location loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="thai-card max-w-md w-full text-center relative">
          <div className="floating-lotus" style={{top: '10%', left: '10%'}}>🌸</div>
          <div className="floating-lotus" style={{top: '15%', right: '15%', animationDelay: '1s'}}>💆‍♀️</div>
          <div className="relative z-10">
            <div className="animate-spin text-6xl mb-4" style={{animationDuration: '2s'}}>🌸</div>
            <p className="text-xl font-bold text-thai-red mb-2">Determining location...</p>
            <div className="flex justify-center gap-1 mt-3">
              <div className="w-2 h-2 bg-thai-gold rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
              <div className="w-2 h-2 bg-thai-red rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-thai-green rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
            <p className="text-sm text-gray-500 mt-4">Please allow location access when prompted</p>
          </div>
        </div>
      </div>
    );
  }

  // Location error or no position - show prompt to request location
  if (error || !position) {
    return (
      <LocationPrompt
        onGrant={() => {
          // Request location on button click (required for mobile browsers)
          requestLocation();
        }}
        error={error}
      />
    );
  }

  return null;
}

export default App;

