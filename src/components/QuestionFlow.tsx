import { useState } from 'react';
import { QUESTIONS, Question } from '../types';

interface QuestionFlowProps {
  onComplete: () => void;
}

export const QuestionFlow = ({ onComplete }: QuestionFlowProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [showFirstQuestion, setShowFirstQuestion] = useState(true);

  const handleFirstQuestion = (wantsTreatment: boolean) => {
    if (wantsTreatment) {
      onComplete();
    } else {
      setShowFirstQuestion(false);
      setCurrentQuestionIndex(0);
    }
  };

  const handleFollowUpQuestion = (option: string) => {
    // Bij elke optie gaan we door, maar als iemand kiest voor de "ja" variant,
    // kunnen we doorgaan, bij "nee" variant gaan we door naar volgende vraag
    if (option.includes('!') || option.toLowerCase().includes('wil') || option.toLowerCase().includes('geef')) {
      // Gebruiker kiest voor behandeling
      onComplete();
    } else {
      // Gebruiker kiest nog steeds nee, volgende vraag
      if (currentQuestionIndex < QUESTIONS.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Laatste vraag geweest, toch maar door naar resultaten
        onComplete();
      }
    }
  };

  if (showFirstQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="thai-card thai-pattern max-w-md w-full text-center space-y-8">
          <div className="space-y-4">
            <h1 className="thai-title text-5xl mb-4">🌸 HappyTimes 🌸</h1>
            <p className="text-2xl font-bold text-thai-red">Wil je een Thai massage met</p>
            <p className="text-4xl font-bold text-thai-gold-dark animate-pulse">"Happy New Years treatment"?</p>
          </div>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={() => handleFirstQuestion(true)}
              className="thai-button-primary"
            >
              Ja, graag! 🎉
            </button>
            <button
              onClick={() => handleFirstQuestion(false)}
              className="thai-button-secondary"
            >
              Nee, dank je
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
          Vraag {currentQuestionIndex + 1} van {QUESTIONS.length}
        </p>
      </div>
    </div>
  );
};

