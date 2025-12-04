import { useState, useEffect, useMemo, useRef } from 'react';
import submissionApi from '@/api/submissionApi';

/**
 * Hook to check which AutoEvaluation rounds have completed results
 * @param {Array} rounds - Array of round objects
 * @returns {Object} { completedRounds, loading }
 */
const useCompletedAutoTests = (rounds) => {
  const [completedRounds, setCompletedRounds] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filter AutoEvaluation rounds
  const autoEvaluationRounds = useMemo(() => {
    if (!rounds || rounds.length === 0) return [];
    return rounds.filter(
      (round) => round.problemType === 'AutoEvaluation' && round.roundId
    );
  }, [rounds]);

  // Create a stable key from roundIds to prevent infinite loops
  const roundsKey = useMemo(() => {
    if (!autoEvaluationRounds || autoEvaluationRounds.length === 0) return '';
    return autoEvaluationRounds
      .map((r) => r.roundId)
      .sort()
      .join(',');
  }, [autoEvaluationRounds]);

  // Track previous key to prevent unnecessary re-fetches
  const previousKeyRef = useRef('');
  // Store rounds in ref to avoid stale closure
  const roundsRef = useRef(rounds);

  // Update roundsRef when rounds change
  useEffect(() => {
    roundsRef.current = rounds;
  }, [rounds]);

  useEffect(() => {
    // Skip if key hasn't changed
    if (roundsKey === previousKeyRef.current) {
      return;
    }

    // Update previous key
    previousKeyRef.current = roundsKey;

    const checkCompletedAutoTests = async () => {
      // Filter rounds from ref to get latest value
      const autoEvalRounds = (roundsRef.current || []).filter(
        (round) => round.problemType === 'AutoEvaluation' && round.roundId
      );

      if (autoEvalRounds.length === 0) {
        setCompletedRounds([]);
        return;
      }

      setLoading(true);

      try {
        // Check each AutoEvaluation round for results
        const checkPromises = autoEvalRounds.map(async (round) => {
          try {
            const res = await submissionApi.getAutoTestResult(round.roundId);
            // If we have result data, round is completed
            if (res.data?.data) {
              return round;
            }
            return null;
          } catch (err) {
            // If error is 404 or no result found, round is not completed
            if (err?.response?.status === 404) {
              return null;
            }
            // For other errors, we'll skip this round
            console.warn(`Error checking auto test result for round ${round.roundId}:`, err);
            return null;
          }
        });

        const results = await Promise.all(checkPromises);
        const completed = results.filter((round) => round !== null);
        setCompletedRounds(completed);
      } catch (err) {
        console.error('Error checking completed auto tests:', err);
      } finally {
        setLoading(false);
      }
    };

    checkCompletedAutoTests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundsKey]); // Only depend on roundsKey, rounds is used inside effect to avoid stale closure

  return { completedRounds, loading };
};

export default useCompletedAutoTests;

