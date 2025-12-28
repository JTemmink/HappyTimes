import { useState, useMemo } from 'react';
import { getRandomQuestions, Question } from '../types';

interface QuestionFlowProps {
  onComplete: (wantsTreatment: boolean) => void;
}

export const QuestionFlow = ({ onComplete }: QuestionFlowProps) => {
  // Randomly select up to 5 questions once when component mounts
  const selectedQuestions = useMemo(() => getRandomQuestions(), []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [showFirstQuestion, setShowFirstQuestion] = useState(true);
  const [showPermissionCheck, setShowPermissionCheck] = useState(false);
  const [showMarriageCheck, setShowMarriageCheck] = useState(false);
  const [showFunMessage, setShowFunMessage] = useState(false);

  const handlePositiveResponse = () => {
    // When user says yes, show permission check first
    setShowPermissionCheck(true);
  };

  const handleFirstQuestion = (wants: boolean) => {
    if (wants) {
      handlePositiveResponse();
    } else {
      setShowFirstQuestion(false);
      setCurrentQuestionIndex(0);
    }
  };

  const handleFollowUpQuestion = (isOption1: boolean) => {
    // Option 1 is always the "yes" variant, option 2 is always the "no" variant
    if (isOption1) {
      // User chooses treatment (yes variant) - show permission check
      handlePositiveResponse();
    } else {
      // User still chooses no, go to next question
      if (currentQuestionIndex < selectedQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Last question done, proceed to results anyway (still false)
        onComplete(false);
      }
    }
  };

  const handlePermissionResponse = (hasPermission: boolean) => {
    if (hasPermission) {
      // Has permission, show fun message first
      setShowPermissionCheck(false);
      setShowFunMessage(true);
    } else {
      // Didn't ask, show marriage check
      setShowPermissionCheck(false);
      setShowMarriageCheck(true);
    }
  };

  const handleFunMessageContinue = () => {
    setShowFunMessage(false);
    onComplete(true);
  };

  const handleMarriageResponse = () => {
    // Either way, proceed (it's a joke after all)
    setShowMarriageCheck(false);
    onComplete(true);
  };

  // Show fun message screen
  if (showFunMessage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="thai-card thai-pattern max-w-md w-full text-center space-y-8">
          <div className="space-y-4 relative z-10">
            <h1 className="thai-title text-5xl mb-6 font-thai-title">🌸 Jovan 🌸 Happy Times Thai Massage Finder</h1>
            <div className="relative">
              <p className="text-3xl font-bold text-thai-gold-dark mb-4 animate-pulse-glow">
                Have FUN! even if i don't believe
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={handleFunMessageContinue}
              className="thai-button-primary text-xl"
            >
              Continue 🎉
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show permission check screen
  if (showPermissionCheck) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="thai-card thai-pattern max-w-md w-full text-center space-y-8">
          <div className="space-y-4 relative z-10">
            <h1 className="thai-title text-5xl mb-6 font-thai-title">🌸 Jovan 🌸 Happy Times Thai Massage Finder</h1>
            <div className="relative">
              <p className="text-3xl font-bold text-thai-red mb-4 animate-pulse-glow">
                JOVAN!! Do you have written permission from Nonoy?!!
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={() => handlePermissionResponse(true)}
              className="thai-button-primary text-xl"
            >
              YES OF COURSE!!
            </button>
            <button
              onClick={() => handlePermissionResponse(false)}
              className="thai-button-secondary text-xl"
            >
              ... didn't really ask..
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show marriage check screen
  if (showMarriageCheck) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="thai-card thai-pattern max-w-md w-full text-center space-y-8">
          <div className="space-y-4 relative z-10">
            <h1 className="thai-title text-5xl mb-6 font-thai-title">🌸 Jovan 🌸 Happy Times Thai Massage Finder</h1>
            <div className="relative">
              <p className="text-3xl font-bold text-thai-red mb-4 animate-pulse-glow">
                JOVAN!!! THAT REALLY CAN'T BE. YOU'RE MARRIED
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={handleMarriageResponse}
              className="thai-button-primary text-xl"
            >
              Oh yes, i forgot...
            </button>
            <button
              onClick={handleMarriageResponse}
              className="thai-button-secondary text-xl"
            >
              If you don't say anything, then neither will I
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showFirstQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="thai-card thai-pattern max-w-md w-full text-center space-y-8">
          <div className="space-y-4 relative z-10">
            <h1 className="thai-title text-5xl mb-6 font-thai-title">🌸 Jovan 🌸 Happy Times Thai Massage Finder</h1>
            <div className="relative">
              <p className="text-2xl font-bold text-thai-red mb-3">Would you like a Thai massage with</p>
              <p className="text-4xl font-bold text-thai-gold-dark animate-pulse-glow relative z-10">
                "Happy New Years treatment"?
              </p>
              <div className="absolute -top-2 -left-2 text-4xl opacity-20 animate-pulse">✨</div>
              <div className="absolute -bottom-2 -right-2 text-4xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}>✨</div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={() => handleFirstQuestion(true)}
              className="thai-button-primary"
            >
              Yes, please! 🎉
            </button>
            <button
              onClick={() => handleFirstQuestion(false)}
              className="thai-button-secondary"
            >
              No, thanks
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion: Question = selectedQuestions[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="thai-card thai-pattern max-w-md w-full text-center space-y-8">
        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl animate-bounce">💆‍♀️</span>
            <p className="text-2xl font-bold text-thai-red">{currentQuestion.question}</p>
            <span className="text-3xl animate-bounce" style={{animationDelay: '0.5s'}}>💆‍♂️</span>
          </div>
          <div className="bg-gradient-to-r from-thai-gold/20 via-transparent to-thai-gold/20 rounded-xl p-4 border border-thai-gold/30">
            <p className="text-xl text-gray-700 italic leading-relaxed">"{currentQuestion.example}"</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleFollowUpQuestion(true)}
            className="thai-button-primary"
          >
            {currentQuestion.option1}
          </button>
          <button
            onClick={() => handleFollowUpQuestion(false)}
            className="thai-button-secondary"
          >
            {currentQuestion.option2}
          </button>
        </div>
        
        <p className="text-sm text-gray-500">
          Question {currentQuestionIndex + 1} of {selectedQuestions.length}
        </p>
      </div>
    </div>
  );
};

