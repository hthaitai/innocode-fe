import React from 'react';
import { Icon } from '@iconify/react';
import './Quiz.css';

const Quiz = ({ 
  questions, 
  currentQuestionIndex, 
  userAnswers, 
  timeLeft, 
  onAnswer, 
  onSubmit,
  onQuestionChange 
}) => {
  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = userAnswers.find(answer => answer.questionId === currentQuestion.id);

  const handleAnswerSelect = (option) => {
    onAnswer(currentQuestion.id, option);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="quiz-container">
      {/* Header */}
      <div className="quiz-header">
        <div className="quiz-progress">
          <span className="quiz-question-number">
            Câu {currentQuestionIndex + 1} / {questions.length}
          </span>
          <div className="quiz-progress-bar">
            <div 
              className="quiz-progress-fill"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="quiz-timer">
          <Icon icon="lucide:clock" className="quiz-timer-icon" />
          <span className={`quiz-timer-text ${timeLeft <= 300 ? 'quiz-timer-text--warning' : ''}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="quiz-question">
        <h2 className="quiz-question-text">{currentQuestion.question}</h2>
      </div>

      {/* Options */}
      <div className="quiz-options">
        {currentQuestion.options.map((option) => (
          <button
            key={option.id}
            className={`quiz-option ${userAnswer?.selectedOption?.id === option.id ? 'quiz-option--selected' : ''}`}
            onClick={() => handleAnswerSelect(option)}
          >
            <div className="quiz-option-content">
              <span className="quiz-option-letter">{option.id.toUpperCase()}</span>
              <span className="quiz-option-text">{option.text}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="quiz-navigation">
        <button
          className="quiz-nav-button quiz-nav-button--prev"
          onClick={() => onQuestionChange(currentQuestionIndex - 1)}
          disabled={currentQuestionIndex === 0}
        >
          <Icon icon="lucide:chevron-left" />
          Câu trước
        </button>
        
        <div className="quiz-question-dots">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`quiz-dot ${index === currentQuestionIndex ? 'quiz-dot--active' : ''} ${
                userAnswers.find(answer => answer.questionId === questions[index].id) ? 'quiz-dot--answered' : ''
              }`}
              onClick={() => onQuestionChange(index)}
            />
          ))}
        </div>
        
        <button
          className="quiz-nav-button quiz-nav-button--next"
          onClick={() => onQuestionChange(currentQuestionIndex + 1)}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Câu sau
          <Icon icon="lucide:chevron-right" />
        </button>
      </div>

      {/* Submit Button */}
      <div className="quiz-submit">
        <button
          className="quiz-submit-button"
          onClick={onSubmit}
        >
          <Icon icon="lucide:send" />
          Nộp bài
        </button>
      </div>
    </div>
  );
};

export default Quiz;
