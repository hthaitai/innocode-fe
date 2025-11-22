import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '@/shared/components/PageContainer';
import { Icon } from '@iconify/react';
import useQuiz from '../hooks/useQuiz';
import useQuizSubmit from '../hooks/useQuizSubmit';

const MCQTest = () => {
  const { roundId, contestId } = useParams();
  const navigate = useNavigate();
  const { quiz, loading, error } = useQuiz(roundId);
  const { submitQuiz, isSubmitting, submitError } = useQuizSubmit();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(null);
  useEffect(() => {
    if (quiz?.mcqTest) {
      setTimeRemaining(3600); // 1 hour default
      console.log(roundId);
    }
  }, [quiz]);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz.mcqTest.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleAutoSubmit = async () => {
    alert('Time is up! Submitting your answers...');
    await handleSubmitQuiz();
  };

  const handleSubmit = async () => {
    const unansweredCount =
      quiz.mcqTest.totalQuestions - Object.keys(answers).length;

    if (unansweredCount > 0) {
      const confirmMessage = `You have ${unansweredCount} unanswered question(s). Are you sure you want to submit?`;
      if (!window.confirm(confirmMessage)) ;
    } else {
      if (!window.confirm('Are you sure you want to submit your answers?'))
        return;
    }

    await handleSubmitQuiz();
  };

  const handleSubmitQuiz = async () => {
    const answersArray = Object.entries(answers).map(
      ([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId,
      })
    );
    console.log('📝 Body answers gửi lên:', answersArray); // Log để kiểm tra

    const result = await submitQuiz(roundId, answersArray);

    if (result.success) {
      alert('Quiz submitted successfully!');
      navigate(`/quiz/${roundId}/finish`);
    } else {
      alert(`Failed to submit quiz: ${result.error}`);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <PageContainer bg={false}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading quiz...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer bg={false}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <Icon
              icon="mdi:alert-circle-outline"
              className="w-20 h-20 text-red-500 mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Failed to Load Quiz
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate(`/contest-detail/${contestId}`)}
              className="button-orange"
            >
              <Icon icon="mdi:arrow-left" className="inline mr-2" />
              Back to Contest
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!quiz?.mcqTest?.questions || quiz.mcqTest.questions.length === 0) {
    return (
      <PageContainer bg={false}>
        <div className="text-center py-10">
          <Icon
            icon="mdi:file-question-outline"
            className="w-20 h-20 text-gray-400 mx-auto mb-4"
          />
          <p className="text-xl text-gray-600">No questions available</p>
        </div>
      </PageContainer>
    );
  }

  const question = quiz.mcqTest.questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / quiz.mcqTest.totalQuestions) * 100;

  return (
    <PageContainer bg={false}>
      <div className="page-container">
        {/* Header */}
        <div className="flex flex-col">
          <div className="border-b border-gray-200 sticky">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{quiz.roundName}</h1>
                  <p className="text-sm text-gray-600">
                    Question {currentQuestion + 1} of{' '}
                    {quiz.mcqTest.totalQuestions}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Time Remaining</p>
                    <p
                      className={`text-xl font-bold ${
                        timeRemaining < 300 ? 'text-red-600' : 'text-red-600'
                      }`}
                    >
                      {formatTime(timeRemaining)}
                    </p>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Contest'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 mt-6">
            <div className="grid grid-cols-12 gap-6">
              {/* Main Content */}
              <div className="col-span-9">
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                  {/* Question */}
                  <div className="mb-8">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold">
                        {currentQuestion + 1}
                      </span>
                      <div className="flex-1">
                        <pre className="whitespace-pre-wrap font-sans text-lg text-gray-900">
                          {question.text}
                        </pre>
                        {question.weight > 1 && (
                          <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                            {question.weight} points
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <label
                        key={option.optionId}
                        className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          answers[question.questionId] === option.optionId
                            ? 'border-orange-300 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name={`question-${question.questionId}`}
                            value={option.optionId}
                            checked={
                              answers[question.questionId] === option.optionId
                            }
                            onChange={() =>
                              handleAnswerSelect(
                                question.questionId,
                                option.optionId
                              )
                            }
                            className="w-5 h-5 text-orange-600 cursor-pointer"
                          />
                          <span className="flex items-center gap-2">
                            <span className="font-semibold">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            <span>{option.text}</span>
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={handlePrevious}
                      disabled={currentQuestion === 0}
                      className="flex items-center gap-2 cursor-pointer px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Icon icon="lucide:chevron-left" className="w-5 h-5" />
                      Previous
                    </button>

                    <button
                      onClick={handleNext}
                      disabled={
                        currentQuestion === quiz.mcqTest.questions.length - 1
                      }
                      className="flex items-center cursor-pointer gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <Icon icon="lucide:chevron-right" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="col-span-3">
                <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Progress
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        {answeredCount}/{quiz.mcqTest.totalQuestions}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Question Navigator */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Questions
                    </h3>
                    <div className="grid grid-cols-5 gap-2">
                      {quiz.mcqTest.questions.map((q, index) => (
                        <button
                          key={q.questionId}
                          onClick={() => setCurrentQuestion(index)}
                          className={`aspect-square rounded-lg cursor-pointer text-sm font-semibold transition-all ${
                            index === currentQuestion
                              ? 'bg-orange-500 text-white'
                              : answers[q.questionId]
                              ? 'bg-green-100 text-green-700 border border-green-300'
                              : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-orange-500 rounded"></div>
                        <span className="text-gray-600">Current</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                        <span className="text-gray-600">Answered</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                        <span className="text-gray-600">Not Answered</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default MCQTest;
