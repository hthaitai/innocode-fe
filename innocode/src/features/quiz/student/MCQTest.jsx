import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '@/shared/components/PageContainer';
import { Icon } from '@iconify/react';
import useQuiz from '../hooks/useQuiz';
import useQuizSubmit from '../hooks/useQuizSubmit';
import useMCQTestFlow from '../hooks/useMCQTestFlow';

const MCQTest = () => {
  const { roundId, contestId } = useParams();
  const navigate = useNavigate();
  const { quiz, loading: quizLoading, error: quizError } = useQuiz(roundId);
  const { submitQuiz, isSubmitting } = useQuizSubmit();
  
  // MCQ Test Flow hook
  const {
    testKey,
    startTime,
    timeLimitInSeconds,
    loading: flowLoading,
    error: flowError,
    initializeTest,
    saveAnswer,
    saveAnswerImmediate,
    getCurrentAnswers,
    getTimeRemaining,
  } = useMCQTestFlow(roundId);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const hasRestoredAnswers = useRef(false);
  const isRestoring = useRef(false);

  // Initialize test when quiz is loaded
  useEffect(() => {
    const init = async () => {
      console.log('🚀 Initializing test...', {
        hasQuiz: !!quiz,
        hasMcqTest: !!quiz?.mcqTest,
        isInitialized
      });

      if (!quiz?.mcqTest || isInitialized) {
        console.log('⏸️ Skip init:', { hasQuiz: !!quiz, hasMcqTest: !!quiz?.mcqTest, isInitialized });
        return;
      }
      
      console.log('📞 Calling initializeTest...');
      const result = await initializeTest();
      console.log('📥 initializeTest result:', result);
      
      if (result) {
        setIsInitialized(true);
        console.log('✅ Test initialized, testKey:', result.key);
        
        // Try to restore answers from API using the key from initializeTest result
        isRestoring.current = true; // Mark that we're restoring
        console.log('🔄 Restoring answers from server...', { testKey: result.key });
        // Use testKey from result instead of waiting for state update
        const currentData = await getCurrentAnswers(result.key);
        console.log('📥 getCurrentAnswers result:', currentData);
        
        if (currentData?.answers && currentData.answers.length > 0) {
          const restoredAnswers = {};
          currentData.answers.forEach(item => {
            restoredAnswers[item.questionId] = item.selectedOptionId;
          });
          // Set answers while isRestoring is true (auto-save will skip)
          setAnswers(restoredAnswers);
          console.log(`✅ Restored ${currentData.answers.length} answer(s) from server`, restoredAnswers);
        } else {
          console.log('ℹ️ No answers to restore');
        }
        // Mark restore as complete first, then enable auto-save in next tick
        isRestoring.current = false;
        // Enable auto-save after a brief delay to avoid saving during restore
        setTimeout(() => {
          hasRestoredAnswers.current = true;
          console.log('✅ Auto-save enabled - Ready to save!');
        }, 50);
      } else {
        console.log('❌ Failed to initialize test');
      }
    };
    
    init();
  }, [quiz, isInitialized, initializeTest, getCurrentAnswers]);

  // Calculate and update time remaining based on startTime
  useEffect(() => {
    if (!isInitialized || !startTime || !timeLimitInSeconds) return;

    const updateTime = () => {
      const remaining = getTimeRemaining();
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        handleAutoSubmit();
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, [isInitialized, startTime, timeLimitInSeconds, getTimeRemaining]);

  // Auto-save when answer changes (only after initialization and restoring answers)
  useEffect(() => {
    console.log('🔍 Auto-save effect triggered', {
      isInitialized,
      testKey,
      hasRestoredAnswers: hasRestoredAnswers.current,
      isRestoring: isRestoring.current,
      answersCount: Object.keys(answers).length,
      answers: answers
    });

    // Skip auto-save if:
    // - Not initialized yet
    // - No testKey
    // - Haven't finished restoring answers
    // - Currently restoring (to avoid saving during restore)
    if (!isInitialized) {
      console.log('⏸️ Auto-save skipped: Not initialized');
      return;
    }
    if (!testKey) {
      console.log('⏸️ Auto-save skipped: No testKey');
      return;
    }
    if (!hasRestoredAnswers.current) {
      console.log('⏸️ Auto-save skipped: Answers not restored yet');
      return;
    }
    if (isRestoring.current) {
      console.log('⏸️ Auto-save skipped: Currently restoring');
      return;
    }
    
    const answersArray = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
      questionId,
      selectedOptionId,
    }));
    
    if (answersArray.length > 0) {
      console.log('💾 Auto-saving answers...', answersArray);
      saveAnswer(answersArray);
    } else {
      console.log('⏸️ Auto-save skipped: No answers to save');
    }
  }, [answers, testKey, isInitialized, saveAnswer]);

  const handleAnswerSelect = (questionId, optionId) => {
    console.log('👆 User selected answer:', { questionId, optionId });
    setAnswers((prev) => {
      const newAnswers = {
        ...prev,
        [questionId]: optionId,
      };
      console.log('📝 Updated answers:', newAnswers);
      return newAnswers;
    });
    // Auto-save will be triggered by useEffect above
  };

  const handlePrevious = async () => {
    console.log('⬅️ Previous button clicked', {
      currentQuestion,
      testKey,
      answersCount: Object.keys(answers).length
    });

    if (currentQuestion > 0) {
      // Save answers immediately before navigating
      if (testKey && Object.keys(answers).length > 0) {
        const answersArray = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
          questionId,
          selectedOptionId,
        }));
        console.log('💾 Saving answers before Previous:', answersArray);
        const result = await saveAnswerImmediate(answersArray);
        console.log('💾 Save result:', result);
      } else {
        console.log('⏸️ Skip save: No testKey or no answers', { testKey, answersCount: Object.keys(answers).length });
      }
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = async () => {
    console.log('➡️ Next button clicked', {
      currentQuestion,
      totalQuestions: quiz?.mcqTest?.questions?.length,
      testKey,
      answersCount: Object.keys(answers).length,
      answers: answers
    });

    if (currentQuestion < quiz.mcqTest.questions.length - 1) {
      // Save answers immediately before navigating (even if empty to test)
      if (testKey) {
        const answersArray = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
          questionId,
          selectedOptionId,
        }));
        console.log('💾 Saving answers before Next:', {
          answersArray,
          answersArrayLength: answersArray.length,
          answersObject: answers
        });
        
        if (answersArray.length > 0) {
          const result = await saveAnswerImmediate(answersArray);
          console.log('💾 Save result:', result);
        } else {
          console.log('⏸️ No answers to save (empty array)');
        }
      } else {
        console.log('⏸️ Skip save: No testKey', { testKey });
      }
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
      if (!window.confirm(confirmMessage)) return;
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
    console.log('📝 Body answers gửi lên:', answersArray);

    const result = await submitQuiz(roundId, answersArray);

    if (result.success) {
      // Clear sessionStorage after successful submit
      sessionStorage.removeItem(`mcq_test_key_${roundId}`);
      sessionStorage.removeItem(`mcq_test_startTime_${roundId}`);
      sessionStorage.removeItem(`mcq_test_timeLimit_${roundId}`);
      
      // Navigate to finish page with result data
      navigate(`/quiz/${roundId}/finish`, {
        state: { 
          contestId,
          resultData: result.data // Pass the full result data from submit response
        },
      });
    } else {
      alert(`Failed to submit quiz: ${result.error}`);
    }
  };

  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return '00:00:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Combine loading states
  if (quizLoading || flowLoading) {
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

  // Combine error states
  if (quizError || flowError) {
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
            <p className="text-gray-600 mb-4">{quizError || flowError}</p>
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
                        timeRemaining !== null && timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'
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
                            onChange={(e) => {
                              console.log('🔘 Radio input onChange triggered', {
                                questionId: question.questionId,
                                optionId: option.optionId,
                                value: e.target.value,
                                checked: e.target.checked
                              });
                              handleAnswerSelect(
                                question.questionId,
                                option.optionId
                              );
                            }}
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
