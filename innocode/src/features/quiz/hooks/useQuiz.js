import { useState, useEffect } from 'react';
import quizApi from '@/api/quizApi';

const useQuiz = (roundId) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!roundId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await quizApi.getQuiz(roundId);
        console.log('✅ Quiz API Response:', response);
        
        // axiosClient returns response.data directly
        if (response.data && response.data.code === 'SUCCESS') {
          setQuiz(response.data.data);
        } else {
          setError(response.data?.message || 'Failed to load quiz');
        }
      } catch (error) {
        console.error('❌ Error fetching quiz:', error);
        setError(error.response?.data?.message || error.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [roundId]);
  return { quiz, loading, error };
};
export default useQuiz;
