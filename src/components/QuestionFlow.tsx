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

  const handleFirstQuestion = (wants: boolean) => {
    if (wants) {
      onComplete(true);
    } else {
      setShowFirstQuestion(false);
      setCurrentQuestionIndex(0);
    }
  };

  const handleFollowUpQuestion = (isOption1: boolean) => {
    // Option 1 is always the "yes" variant, option 2 is always the "no" variant
    if (isOption1) {
      // User chooses treatment (yes variant)
      onComplete(true);
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

  if (showFirstQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="thai-card thai-pattern max-w-md w-full text-center space-y-8">
          <div className="space-y-4">
            <h1 className="thai-title text-5xl mb-4">🌸 Jovan 🌸 Happy Times Thai Massage Finder</h1>
            <p className="text-2xl font-bold text-thai-red">Would you like a Thai massage with</p>
            <p className="text-4xl font-bold text-thai-gold-dark animate-pulse">"Happy New Years treatment"?</p>
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
        <div className="space-y-4">
          <p className="text-2xl font-bold text-thai-red">{currentQuestion.question}</p>
          <p className="text-xl text-gray-700 italic">"{currentQuestion.example}"</p>
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

