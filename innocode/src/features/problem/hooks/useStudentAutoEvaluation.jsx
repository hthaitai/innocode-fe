import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useModal } from "@/shared/hooks/useModal";
import {
  useGetRoundTestCasesQuery,
  useGetAutoTestResultQuery,
  useSubmitAutoTestMutation,
  useSubmitFinalAutoTestMutation,
} from "@/services/autoEvaluationApi";

/**
 * Custom hook quản lý logic cho StudentAutoEvaluation
 * @param {string} contestId - Contest ID
 * @param {string} roundId - Round ID
 * @returns {object} - State và handlers
 */
const useStudentAutoEvaluation = (contestId, roundId) => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const STORAGE_KEY = `code_${roundId}`;

  // State
  const [code, setCode] = useState(() => {
    const savedCode = localStorage.getItem(STORAGE_KEY);
    return savedCode || "";
  });
  const [submissionId, setSubmissionId] = useState(null);
  const [submitResponseCases, setSubmitResponseCases] = useState(null);

  // RTK Query hooks
  const {
    data: testCases,
    isLoading: testCaseLoading,
    error: testCaseError,
  } = useGetRoundTestCasesQuery(
    { roundId, pageNumber: 1, pageSize: 1 },
    { skip: !roundId }
  );

  const {
    data: testResult,
    isLoading: resultLoading,
    refetch: refetchTestResult,
  } = useGetAutoTestResultQuery(roundId, {
    skip: !roundId,
  });

  const [submitAutoTest, { isLoading: submitting, error: submitError }] =
    useSubmitAutoTestMutation();

  const [
    submitFinalAutoTest,
    {
      isLoading: finalSubmitting,
      error: finalSubmitError,
      data: finalSubmitResult,
    },
  ] = useSubmitFinalAutoTestMutation();

  // Auto-save code to localStorage
  useEffect(() => {
    if (code) {
      localStorage.setItem(STORAGE_KEY, code);
    }
  }, [code, STORAGE_KEY]);

  // Clear submitResponseCases when testResult already has actual/expected
  useEffect(() => {
    if (testResult?.details && submitResponseCases) {
      const hasActualExpected = testResult.details.every(
        (detail) => detail.actual !== undefined || detail.expected !== undefined
      );
      if (hasActualExpected) {
        // testResult already has the values, clear submitResponseCases
        setSubmitResponseCases(null);
      }
    }
  }, [testResult, submitResponseCases]);

  // Handlers
  const handleClearCode = () => {
    openModal("confirm", {
      title: "Clear Code",
      description: "Are you sure you want to clear your code? This action cannot be undone.",
      onConfirm: () => {
        setCode("");
        localStorage.removeItem(STORAGE_KEY);
        toast.dismiss();
        toast.success("Code cleared");
      },
    });
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      toast.dismiss();
      toast.error("Please enter your code before running.");
      return;
    }

    try {
      const result = await submitAutoTest({
        roundId,
        code: code,
      }).unwrap();

      console.log("📥 API Response:", result);

      const newSubmissionId =
        result?.data?.submissionId || result?.submissionId;

      console.log("🆔 New Submission ID:", newSubmissionId);

      // Extract cases array from response (contains actual and expected)
      const cases = result?.data?.cases || result?.cases;
      if (cases && Array.isArray(cases)) {
        console.log("📋 Cases from response:", cases);
        setSubmitResponseCases(cases);
      }

      if (newSubmissionId) {
        setSubmissionId(newSubmissionId);
        setTimeout(() => {
          refetchTestResult();
        }, 1000);
      } else {
        console.error("❌ No submission ID in response:", result);
        return;
      }

      const summary = result?.data?.summary || result?.summary;
      if (summary) {
        toast.success(
          `Code tested! Passed: ${summary.passed}/${summary.total} test cases. Click Submit to add to leaderboard.`
        );
      } else {
        toast.success(
          "Code tested successfully! Click Submit to add to leaderboard."
        );
      }
    } catch (error) {
      console.error("❌ Failed to run code:", error);
      const errorMessage =
        error?.data?.errorMessage || "Failed to submit code. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleFinalSubmit = async () => {
    if (!submissionId) {
      toast.dismiss();
      toast.error("Please run your code first before submitting.");
      return;
    }

    // Get test result summary for confirmation
    const testCases = testResult?.details || testResult?.cases || [];
    const passedCount = testCases.filter(
      (d) => d.note === "success" || d.status === "success"
    ).length || 0;
    const totalCount = testCases.length || 0;
    const score = testResult?.score || 0;

    openModal("confirm", {
      title: "Submit Final Solution",
      description: (
        <div className="space-y-3">
          <p className="text-[#2d3748]">
            Are you sure you want to submit your solution? This will add your score to the leaderboard.
          </p>
          {testResult && (
            <div className="bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#7A7574]">Test Cases Passed:</span>
                  <span className="font-semibold text-green-600">
                    {passedCount}/{totalCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7A7574]">Score:</span>
                  <span className="font-semibold text-[#ff6b35]">{score}</span>
                </div>
                {testResult.submissionAttemptNumber > 1 && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#7A7574]">Attempt:</span>
                    <span className="font-semibold text-[#2d3748]">
                      {testResult.submissionAttemptNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="bg-yellow-50 border border-yellow-200 rounded-[5px] p-3">
            <div className="flex items-start gap-2">
              <span className="text-sm text-yellow-800">
                ⚠️ Once submitted, you cannot change your solution. Your score will be added to the leaderboard.
              </span>
            </div>
          </div>
        </div>
      ),
      onConfirm: async () => {
        try {
          await submitFinalAutoTest(submissionId).unwrap();
          toast.dismiss();
          toast.success(
            "Submission accepted! Your score has been added to the leaderboard."
          );

          setTimeout(() => {
            navigate(`/leaderboard/${contestId}`);
          }, 1500);
        } catch (error) {
          console.error("❌ Failed to submit final test:", error);
          toast.dismiss();
          toast.error(
            error?.data?.errorMessage ||
              "Failed to submit final test. Please try again."
          );
        }
      },
    });
  };

  // Merge submitResponseCases with testResult.details to include actual/expected
  const mergedTestResult = useMemo(() => {
    if (!testResult) return null;

    // If we have cases from submit response, merge them with testResult.details
    if (submitResponseCases && testResult.details) {
      const mergedDetails = testResult.details.map((detail) => {
        // Try to find matching case by id
        const matchingCase = submitResponseCases.find(
          (c) => c.id === detail.id || c.id === detail.detailsId
        );

        if (matchingCase) {
          return {
            ...detail,
            // Add actual and expected from submit response
            actual: matchingCase.actual !== undefined ? matchingCase.actual : detail.actual,
            expected: matchingCase.expected !== undefined ? matchingCase.expected : detail.expected,
          };
        }

        // If no match by id, try to match by index (fallback)
        const index = testResult.details.indexOf(detail);
        if (submitResponseCases[index]) {
          return {
            ...detail,
            actual: submitResponseCases[index].actual !== undefined 
              ? submitResponseCases[index].actual 
              : detail.actual,
            expected: submitResponseCases[index].expected !== undefined 
              ? submitResponseCases[index].expected 
              : detail.expected,
          };
        }

        return detail;
      });

      return {
        ...testResult,
        details: mergedDetails,
      };
    }

    return testResult;
  }, [testResult, submitResponseCases]);

  return {
    // State
    code,
    setCode,
    submissionId,
    testCases,
    testResult: mergedTestResult,
    
    // Loading states
    testCaseLoading,
    resultLoading,
    submitting,
    finalSubmitting,
    
    // Error states
    testCaseError,
    submitError,
    finalSubmitError,
    finalSubmitResult,
    
    // Handlers
    handleClearCode,
    handleRunCode,
    handleFinalSubmit,
  };
};

export default useStudentAutoEvaluation;

