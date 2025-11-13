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
      const payload = { code: code }; // ✅ Sửa thành "Code" (viết hoa)
      console.log('Submitting payload:', payload);

      const response = await submissionApi.submitAutoTest(roundId, payload);

      // ✅ Lưu kết quả test
      setSubmitResult(response.data);
      setTestResult(response.data);

      // ✅ Lưu submissionId để dùng cho final submit
      setSubmissionId(response.data.submissionId);

      return response.data;
    } catch (err) {
      console.error('Submit error:', err.response?.data);

      const errorMessage =
        err.response?.data?.errorMessage ||
        err.response?.data?.message ||
        err.response?.data?.title ||
        'Server error occurred. Please try again later or contact support.';

      setSubmitError(errorMessage);
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

      // ✅ Lưu kết quả final submission
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
