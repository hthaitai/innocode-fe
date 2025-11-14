import { useState, useEffect } from 'react';
import testcaseApi from '../../../api/testcaseApi';
import submissionApi from '../../../api/submissionApi';

const useAutoEvaluation = (roundId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testCases, setTestCases] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [resultLoading, setResultLoading] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);

  // ✅ State riêng cho final submission
  const [finalSubmitting, setFinalSubmitting] = useState(false);
  const [finalSubmitError, setFinalSubmitError] = useState(null);
  const [finalSubmitResult, setFinalSubmitResult] = useState(null);

  useEffect(() => {
    if (roundId) {
      fetchTestCases();
      fetchTestResult();
    }
  }, [roundId]);

  const fetchTestCases = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await testcaseApi.getRoundTestcases(roundId, {
        pageNumber: 1,
        pageSize: 1,
      });
      setTestCases(response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Failed to fetch test cases';
      setError(errorMessage);
      console.error('Failed to fetch test cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestResult = async () => {
    setResultLoading(true);
    try {
      const response = await submissionApi.getAutoTestResult(roundId);
      setTestResult(response.data);
    } catch (err) {
      console.log('No previous test result found');
      setTestResult(null);
    } finally {
      setResultLoading(false);
    }
  };

  const submitCode = async (code) => {
    setSubmitting(true);
    setSubmitError(null);
    setSubmitResult(null);

    try {
      const response = await submissionApi.submitAutoTest(roundId, {
        code: code,
      });

      console.log('📥 API Response:', response.data);

      setSubmitResult(response.data);

      // Kiểm tra và lưu submissionId
      const newSubmissionId =
        response.data?.data?.submissionId ||
        response.data?.submissionId ||
        response.data?.id;

      console.log('🆔 New Submission ID:', newSubmissionId);

      if (newSubmissionId) {
        setSubmissionId(newSubmissionId);
        // Fetch test results
        await fetchTestResult(newSubmissionId);
      } else {
        console.error('❌ No submission ID in response:', response.data);
      }

      return response.data;
    } catch (err) {
      console.error('❌ Submit error:', err);
      setSubmitError(err.response?.data?.message || 'Failed to submit code');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const submitFinalAutoTest = async () => {
    if (!submissionId) {
      setFinalSubmitError('Please run your code first before submitting.');
      return;
    }

    setFinalSubmitting(true);
    setFinalSubmitError(null);
    setFinalSubmitResult(null);

    try {
      const response = await submissionApi.submitFinalAutoTest(submissionId);

      console.log('Final submission response:', response.data);

      setFinalSubmitResult(response.data);

      return response.data;
    } catch (err) {
      console.error('Final submit error:', err.response?.data);

      const errorMessage =
        err.response?.data?.errorMessage ||
        err.response?.data?.message ||
        err.response?.data?.title ||
        'Failed to submit final test. Please try again.';

      setFinalSubmitError(errorMessage);
      throw err;
    } finally {
      setFinalSubmitting(false);
    }
  };

  return {
    loading,
    error,
    testCases,
    fetchTestCases,
    submitCode,
    submitting,
    submitError,
    submitResult,
    testResult,
    resultLoading,
    fetchTestResult,
    submissionId,
    submitFinalAutoTest,
    finalSubmitting,
    finalSubmitError,
    finalSubmitResult,
  };
};

export default useAutoEvaluation;
