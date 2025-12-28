import { useState, useEffect } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import { LocationPrompt } from './components/LocationPrompt';
import { QuestionFlow } from './components/QuestionFlow';
import { MassageList } from './components/MassageList';

type AppState = 'location' | 'questions' | 'results';

function App() {
  const { position, error, loading } = useGeolocation();
  const [appState, setAppState] = useState<AppState>('location');
  const [questionsCompleted, setQuestionsCompleted] = useState(false);

  // Auto-advance to questions when location is ready
  useEffect(() => {
    if (position && appState === 'location') {
      setAppState('questions');
    }
  }, [position, appState]);

  // If we have a position and questions are completed, show results
  if (position && questionsCompleted) {
    return <MassageList latitude={position.latitude} longitude={position.longitude} />;
  }

  // If we have a position but questions not yet completed, show questions
  if (position && !questionsCompleted && appState === 'questions') {
    return <QuestionFlow onComplete={() => setQuestionsCompleted(true)} />;
  }

  // Location loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="thai-card max-w-md w-full text-center">
          <div className="animate-spin text-6xl mb-4">🌸</div>
          <p className="text-xl font-bold text-thai-red">Determining location...</p>
        </div>
      </div>
    );
  }

  // Location error or no position
  if (error || !position) {
    return (
      <LocationPrompt
        onGrant={() => {
          // Reload page to retry geolocation
          window.location.reload();
        }}
      />
    );
  }

  return null;
}

export default App;

