import { useState } from 'react';
import { QUESTIONS, Question } from '../types';

interface QuestionFlowProps {
  onComplete: (wantsTreatment: boolean) => void;
}

export const QuestionFlow = ({ onComplete }: QuestionFlowProps) => {
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

  const handleFollowUpQuestion = (option: string) => {
    // We continue with any option, but if someone chooses the "yes" variant,
    // we can proceed, with the "no" variant we continue to the next question
    const lowerOption = option.toLowerCase();
    if (option.includes('!') || lowerOption.includes('want') || lowerOption.includes('give') || 
        lowerOption.includes('meatballs') || lowerOption.includes('wheels') || lowerOption.includes('cheese') ||
        lowerOption.includes('kick') || lowerOption.includes('water') || lowerOption.includes('music')) {
      // User chooses treatment
      onComplete(true);
    } else {
      // User still chooses no, next question
      if (currentQuestionIndex < QUESTIONS.length - 1) {
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

  const currentQuestion: Question = QUESTIONS[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="thai-card thai-pattern max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <p className="text-2xl font-bold text-thai-red">{currentQuestion.question}</p>
          <p className="text-xl text-gray-700 italic">"{currentQuestion.example}"</p>
        </div>
        
        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleFollowUpQuestion(currentQuestion.option1)}
            className="thai-button-primary"
          >
            {currentQuestion.option1}
          </button>
          <button
            onClick={() => handleFollowUpQuestion(currentQuestion.option2)}
            className="thai-button-secondary"
          >
            {currentQuestion.option2}
          </button>
        </div>
        
        <p className="text-sm text-gray-500">
          Question {currentQuestionIndex + 1} of {QUESTIONS.length}
        </p>
      </div>
    </div>
  );
};

