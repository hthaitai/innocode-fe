import { useState } from 'react';
import quizApi from '@/api/quizApi';

const useQuizSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const submitQuiz = async (roundId, answer) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const submissionDTO = {
        answers: Object.entries(answer).map(([questionId, optionId]) => ({
          questionId,
          selectedOptionId: optionId,
        })),
      };
      const response = await quizApi.submitQuiz(roundId, { submissionDTO });
      console.log('✅ Submit Quiz Response:', response.data);

      if (response.data && response.data.code === 'SUCCESS') {
        setSubmitSuccess(true);
        return { success: true, data: response.data.data };
      } else {
        setSubmitError(response.data?.message || 'Failed to submit quiz');
        return { success: false, error: response.data?.message };
      }
    } catch (error) {
      console.error('❌ Error submitting quiz:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to submit quiz';
      setSubmitError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };
  const resetSubmit = () => {
    setIsSubmitting(false);
    setSubmitError(null);
    setSubmitSuccess(false);
  };
  return {
    isSubmitting,
    submitError,
    submitSuccess,
    submitQuiz,
    resetSubmit,
  };
};
export default useQuizSubmit;
