import { useState, useEffect } from 'react';
import { testcaseApi } from '../../../api/testcaseApi';

const useTestCase = (problemId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [fetchingTestCases, setFetchingTestCases] = useState(false);

  // Fetch test cases khi component mount
  useEffect(() => {
    if (problemId) {
      fetchTestCases();
    }
  }, [problemId]);

  const fetchTestCases = async () => {
    setFetchingTestCases(true);
    try {
      const response = await testcaseApi.getRoundTestcases(problemId, {
        pageNumber: 1,
        pageSize: 100, // Lấy tất cả test cases
      });
      setTestCases(response.data || []);
    } catch (err) {
      console.error('Failed to fetch test cases:', err);
    } finally {
      setFetchingTestCases(false);
    }
  };

  const runTestCases = async (code, language) => {
    setLoading(true);
    setError(null);
    setTestResults(null);

    try {
      const response = await testcaseApi.runTestCases(problemId, {
        code,
        language,
      });
      setTestResults(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to run test cases';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitSolution = async (code, language) => {
    setLoading(true);
    setError(null);

    try {
      const response = await testCaseApi.submitSolution(problemId, {
        code,
        language,
      });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to submit solution';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    testResults,
    testCases,
    fetchingTestCases,
    runTestCases,
    submitSolution,
    refetchTestCases: fetchTestCases,
  };
};

export default useTestCase;