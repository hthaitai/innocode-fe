import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import './QuizQuestion.css';

const QuizQuestion = ({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onAnswer, 
  timeLimit = 30,
  onTimeUp 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isAnswered, setIsAnswered] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      onTimeUp();
    }
  }, [timeLeft, isAnswered, onTimeUp]);

  // Reset when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(timeLimit);
  }, [question.id, timeLimit]);

  const handleAnswerSelect = (optionId) => {
    if (isAnswered) return;
    
    setSelectedAnswer(optionId);
    setIsAnswered(true);
    
    // Find the selected option
    const selectedOption = question.options.find(opt => opt.id === optionId);
    onAnswer(selectedOption);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getOptionClass = (option) => {
    if (!isAnswered) {
      return selectedAnswer === option.id 
        ? 'quiz-option quiz-option--selected' 
        : 'quiz-option quiz-option--unselected';
    }
    
    // After answered, show correct/incorrect
    if (option.isCorrect) {
      return 'quiz-option quiz-option--correct';
    }
    if (selectedAnswer === option.id && !option.isCorrect) {
      return 'quiz-option quiz-option--incorrect';
    }
    return 'quiz-option quiz-option--disabled';
  };

  return (
    <div className="quiz-question-container">
      {/* Header */}
      <div className="quiz-header">
        <div className="quiz-progress">
          <span className="quiz-question-number">
            Câu {questionNumber} / {totalQuestions}
          </span>
          <div className="quiz-progress-bar">
            <div 
              className="quiz-progress-fill"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="quiz-meta">
          <span className={`quiz-difficulty ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty === 'easy' ? 'Dễ' : 
             question.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
          </span>
          <span className="quiz-category">{question.category}</span>
        </div>
      </div>

      {/* Timer */}
      <div className="quiz-timer">
        <Icon icon="lucide:clock" className="quiz-timer-icon" />
        <span className={`quiz-timer-text ${timeLeft <= 10 ? 'quiz-timer-text--warning' : ''}`}>
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Question */}
      <div className="quiz-question-content">
        <h2 className="quiz-question-text">{question.question}</h2>
      </div>

      {/* Options */}
      <div className="quiz-options">
        {question.options.map((option) => (
          <button
            key={option.id}
            className={getOptionClass(option)}
            onClick={() => handleAnswerSelect(option.id)}
            disabled={isAnswered}
          >
            <div className="quiz-option-content">
              <span className="quiz-option-letter">{option.id.toUpperCase()}</span>
              <span className="quiz-option-text">{option.text}</span>
            </div>
            {isAnswered && option.isCorrect && (
              <Icon icon="lucide:check" className="quiz-option-icon quiz-option-icon--correct" />
            )}
            {isAnswered && selectedAnswer === option.id && !option.isCorrect && (
              <Icon icon="lucide:x" className="quiz-option-icon quiz-option-icon--incorrect" />
            )}
          </button>
        ))}
      </div>

      {/* Explanation (shown after answering) */}
      {isAnswered && question.explanation && (
        <div className="quiz-explanation">
          <div className="quiz-explanation-header">
            <Icon icon="lucide:lightbulb" className="quiz-explanation-icon" />
            <span className="quiz-explanation-title">Giải thích:</span>
          </div>
          <p className="quiz-explanation-text">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
