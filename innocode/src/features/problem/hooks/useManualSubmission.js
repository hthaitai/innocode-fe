import { useState } from "react";
import manualProblemService from "../services/manualProblemService";

const useManualSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const submitSolution = async (roundId, file) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await manualProblemService.submitSolution(roundId, file);
      setSuccess(true);
      return response;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to submit solution";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };
    return {
    submitSolution,
    loading,
    error,
    success,
    reset,
  };
};
export default useManualSubmission;