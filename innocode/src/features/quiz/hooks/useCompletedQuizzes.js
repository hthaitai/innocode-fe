import { useState, useEffect, useMemo, useRef } from 'react';
import quizApi from '@/api/quizApi';

/**
 * Hook to check which rounds have completed quizzes
 * @param {Array} rounds - Array of round objects
 * @returns {Object} { completedRounds, loading, error }
 */
const useCompletedQuizzes = (rounds) => {
  const [completedRounds, setCompletedRounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Create a stable reference for rounds by extracting roundIds
  const roundsRef = useRef([]);
  const roundsKey = useMemo(() => {
    if (!rounds || rounds.length === 0) return '';
    const mcqRounds = rounds.filter(
      (round) => round.problemType === 'McqTest' && round.roundId
    );
    const key = mcqRounds.map(r => r.roundId).sort().join(',');
    
    // Only update ref if key changed
    if (key !== roundsRef.current.key) {
      roundsRef.current = { key, rounds: mcqRounds };
    }
    return key;
  }, [rounds]);

  useEffect(() => {
    const checkCompletedQuizzes = async () => {
      const mcqRounds = roundsRef.current.rounds || [];
      
      if (mcqRounds.length === 0) {
        setCompletedRounds([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Check each MCQ round for completed attempts
        const checkPromises = mcqRounds.map(async (round) => {
          try {
            const res = await quizApi.getMyQuiz(round.roundId);
            const attemptData = res.data?.data?.[0] || res.data;
            
            // If we have attempt data with score or endTime, quiz is completed
            if (attemptData && (attemptData.score !== undefined || attemptData.endTime)) {
              return round;
            }
            return null;
          } catch (err) {
            // If error is 404 or no attempt found, quiz is not completed
            if (err?.response?.status === 404) {
              return null;
            }
            // For other errors, we'll skip this round
            console.warn(`Error checking quiz for round ${round.roundId}:`, err);
            return null;
          }
        });

        const results = await Promise.all(checkPromises);
        const completed = results.filter((round) => round !== null);
        setCompletedRounds(completed);
      } catch (err) {
        console.error('Error checking completed quizzes:', err);
        setError(err.message || 'Failed to check completed quizzes');
      } finally {
        setLoading(false);
      }
    };

    checkCompletedQuizzes();
  }, [roundsKey]);

  return { completedRounds, loading, error };
};

export default useCompletedQuizzes;

