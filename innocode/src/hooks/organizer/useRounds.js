import { useState, useEffect, useCallback } from "react";
import { contestService } from "../../services/mockService";

export const useRounds = (contestId) => {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRounds = useCallback(async () => {
    if (!contestId) return;
    setLoading(true);
    setError(null);
    try {
      const contest = await contestService.getContestById(contestId);
      setRounds(contest.rounds || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [contestId]);

  useEffect(() => {
    fetchRounds();
  }, [fetchRounds]);

  const validateRound = useCallback((data) => {
    const errors = {};
    if (!data.name?.trim()) errors.name = "Round name is required";
    if (!data.start) errors.start = "Start date/time is required";
    if (!data.end) errors.end = "End date/time is required";
    if (data.start && data.end && new Date(data.end) < new Date(data.start)) {
      errors.end = "End date/time cannot be before start date/time";
    }
    return errors;
  }, []);

  const addRound = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);
      try {
        const newRound = await contestService.addRound(contestId, data);
        setRounds((prev) => [...prev, newRound]);
        return newRound;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [contestId]
  );

  const updateRound = useCallback(
    async (roundId, data) => {
      setLoading(true);
      setError(null);
      try {
        const updated = await contestService.updateRound(contestId, roundId, data);
        setRounds((prev) => prev.map((r) => (r.round_id === roundId ? updated : r)));
        return updated;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [contestId]
  );

  const deleteRound = useCallback(
    async (roundId) => {
      setLoading(true);
      setError(null);
      try {
        await contestService.deleteRound(contestId, roundId);
        setRounds((prev) => prev.filter((r) => r.round_id !== roundId));
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [contestId]
  );

  return {
    rounds,
    loading,
    error,
    fetchRounds,
    validateRound,
    addRound,
    updateRound,
    deleteRound,
  };
};
