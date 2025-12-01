import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "@/shared/components/PageContainer";
import { Icon } from "@iconify/react";
import { ArrowLeft, Code, Play, CheckCircle } from "lucide-react";
import useContestDetail from "@/features/contest/hooks/useContestDetail";
import {
  useGetRoundTestCasesQuery,
  useGetAutoTestResultQuery,
  useSubmitAutoTestMutation,
  useSubmitFinalAutoTestMutation,
} from "@/services/autoEvaluationApi";
import { toast } from "react-hot-toast";

const StudentAutoEvaluation = () => {
  const { contestId, roundId } = useParams();
  const navigate = useNavigate();

  // Tạo key unique cho localStorage dựa trên roundId
  const STORAGE_KEY = `code_${roundId}`;

  // Khởi tạo code từ localStorage
  const [code, setCode] = useState(() => {
    const savedCode = localStorage.getItem(STORAGE_KEY);
    return savedCode || "";
  });
  const [submissionId, setSubmissionId] = useState(null);

  const { contest, loading, error } = useContestDetail(contestId);

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

  const round = contest?.rounds?.find((r) => r.roundId === roundId);
  const problem = round?.problem;
  const timeLimitMinutes = round?.timeLimitSeconds / 60;

  // Lưu code vào localStorage mỗi khi thay đổi
  useEffect(() => {
    if (code) {
      localStorage.setItem(STORAGE_KEY, code);
    }
  }, [code, STORAGE_KEY]);

  // Optional: Xóa code khỏi localStorage khi submit thành công
  useEffect(() => {
    if (finalSubmitResult) {
      // Có thể xóa hoặc giữ lại tùy yêu cầu
      // localStorage.removeItem(STORAGE_KEY);
    }
  }, [finalSubmitResult, STORAGE_KEY]);

  // Clear code function
  const handleClearCode = () => {
    if (window.confirm("Are you sure you want to clear your code?")) {
      setCode("");
      localStorage.removeItem(STORAGE_KEY);
      toast.dismiss();
      toast.success("Code cleared");
    }
  };

  // Run code to test against test cases (doesn't submit to leaderboard)
  const handleRuncode = async () => {
    if (!code.trim()) {
      toast.dismiss();
      toast.error("Please enter your code before running.");
      return;
    }

    try {
      // POST /api/rounds/{roundId}/auto-test/submissions - Run code for testing
      const result = await submitAutoTest({
        roundId,
        code: code,
      }).unwrap();

      console.log("📥 API Response:", result);

      // Extract submissionId from response structure
      // Response can be: { data: { submissionId, summary, cases }, ... } or { submissionId, summary, cases }
      const newSubmissionId =
        result?.data?.submissionId || result?.submissionId;

      console.log("🆔 New Submission ID:", newSubmissionId);

      if (newSubmissionId) {
        setSubmissionId(newSubmissionId);
        // Refetch test results after a short delay to allow backend processing
        setTimeout(() => {
          refetchTestResult();
        }, 1000);
      } else {
        console.error("❌ No submission ID in response:", result);
        return; // Don't show success message if no submissionId
      }

      // Show success message with summary
      // Summary can be in result.data.summary or result.summary
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
    }
  };

  // Submit final - Accept result and add score to leaderboard
  const handleFinalSubmit = async () => {
    if (!submissionId) {
      toast.dismiss();
      toast.error("Please run your code first before submitting.");
      return;
    }

    try {
      // PUT /api/submissions/{submissionId}/acceptance - Accept submission and add to leaderboard
      await submitFinalAutoTest(submissionId).unwrap();
      toast.dismiss();
      toast.success(
        "Submission accepted! Your score has been added to the leaderboard."
      );

      // Navigate to leaderboard after a short delay to let user see the success message
      setTimeout(() => {
        navigate(`/leaderboard/${contestId}`);
      }, 1500); // 1.5 seconds to see the toast message
    } catch (error) {
      console.error("❌ Failed to submit final test:", error);
      toast.dismiss();
      toast.error(
        error?.data?.errorMessage ||
          "Failed to submit final test. Please try again."
      );
    }
  };
  // Loading state
  if (loading || testCaseLoading) {
    return (
      <PageContainer bg={false}>
        <div className="flex justify-center items-center h-[400px]">
          <div className="text-center">
            <Icon
              icon="mdi:loading"
              width="48"
              className="mx-auto mb-2 text-[#ff6b35] animate-spin"
            />
            <p className="text-[#7A7574]">Loading problem...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Error state
  if (error || testCaseError) {
    return (
      <PageContainer bg={false}>
        <div className="max-w-5xl mt-[38px] mx-auto">
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6 text-center">
            <Icon
              icon="mdi:alert-circle"
              width="48"
              className="mx-auto mb-2 text-red-500"
            />
            <p className=" text-[#7A7574]">
              {testCaseError?.data.errorMessage}
            </p>
            <button
              onClick={() => navigate(`/contest-detail/${contestId}`)}
              className="button-orange mt-4"
            >
              Back to Contest
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }
  // Not found state
  if (!round || !problem) {
    return (
      <PageContainer bg={false}>
        <div className="max-w-5xl mt-[38px] mx-auto">
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6 text-center">
            <Icon
              icon="mdi:file-question"
              width="48"
              className="mx-auto mb-2 text-[#7A7574]"
            />
            <p className="text-[#7A7574]">Problem not found</p>
            <button
              onClick={() => navigate(`/contest-detail/${contestId}`)}
              className="button-orange mt-4"
            >
              Back to Contest
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }
  return (
    <PageContainer bg={false}>
      <div className="max-w-6xl mt-[38px] mx-auto">
        {/* Header */}
        <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6 mb-4">
          <button
            onClick={() => navigate(`/contest-detail/${contestId}`)}
            className="flex items-center gap-2 text-[#7A7574] hover:text-[#ff6b35] mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-sm">Back to Contest</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#ff6b35] text-white flex items-center justify-center">
              <Code size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2d3748]">
                {round.roundName || "Name unknown"}
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Problem Description */}
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6">
            <h2 className="text-lg font-semibold text-[#2d3748] mb-4">
              Problem Description
            </h2>
            <div className="text-[#4a5568] space-y-3">
              <p>{round.problem.description}</p>

              {/* Sample Test Case */}
              {testCases?.data?.[0] && (
                <div className="bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-4">
                  <h3 className="font-semibold text-[#2d3748] mb-3 text-sm">
                    Sample Test Case
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium  mb-1">Input:</p>
                      <pre className="bg-white border border-[#E5E5E5] rounded p-2 text-sm">
                        {testCases.data[0].input}
                      </pre>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1">
                        Expected Output:
                      </p>
                      <pre className="bg-white border border-[#E5E5E5] rounded p-2 text-sm">
                        {testCases.data[0].expectedOutput}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-4">
                <h3 className="font-semibold text-[#2d3748] mb-2 text-sm">
                  Problem Details
                </h3>
                <div className="flex gap-2">
                  <Icon
                    width="30"
                    icon="mdi:alert"
                    className="text-[#7A7574]"
                  />
                  <span className="text-[#7A7574]">
                    You will lose{" "}
                    <span className="text-[#dd4b4b] font-medium">
                      {" "}
                      {(problem.penaltyRate * 100).toFixed(0)}%
                    </span>{" "}
                    of your total test score for each submission from the second
                    attempt onward.
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-[#2d3748] text-sm">
                  Constraints:
                </h3>
                <ul className="text-sm text-[#4a5568] space-y-1 list-disc list-inside">
                  <li>Time limit: {timeLimitMinutes} minutes</li>
                  <li>Memory limit: 256 MB</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#2d3748] flex items-center gap-2">
                <Code size={20} className="text-[#ff6b35]" />
                Your Solution
              </h2>
            </div>

            <div className="mb-4 font-semibold">
              <span className="">Type code: </span>
              {round.problem.language}
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="# Write your code here..."
              className="w-full h-[300px] p-4 border border-[#E5E5E5] rounded-[5px] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
            />

            {/* Hiển thị auto-save indicator */}
            {code && (
              <div className="flex items-center gap-1 mt-2 text-xs text-[#7A7574]">
                <Icon icon="mdi:content-save" width={14} />
                <span>Auto-saved</span>
              </div>
            )}
            {/* Optional: Clear button */}
            {code && (
              <button
                onClick={handleClearCode}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <Icon icon="mdi:delete" width={14} />
                Clear
              </button>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleRuncode}
                disabled={submitting}
                className="flex-1 button-white flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Icon
                      icon="mdi:loading"
                      className="animate-spin"
                      width={16}
                    />
                    Running...
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    Run Code
                  </>
                )}
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={finalSubmitting || !submissionId}
                className={`flex-1 button-orange flex items-center justify-center gap-2 ${
                  !submissionId ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {finalSubmitting ? (
                  <>
                    <Icon
                      icon="mdi:loading"
                      className="animate-spin"
                      width={16}
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Submit
                  </>
                )}
              </button>
            </div>

            {/* Hiển thị lỗi submit code */}
            {submitError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon
                    icon="mdi:alert-circle"
                    className="flex-shrink-0 mt-0.5 text-red-600"
                    width={20}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-red-800 mb-1">
                      Run Code Error
                    </p>
                    <p className="text-sm text-red-600">
                      {submitError?.data?.errorMessage ||
                        submitError?.message ||
                        "Failed to submit code"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Hiển thị lỗi final submit */}
            {finalSubmitError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon
                    icon="mdi:alert-circle"
                    className="flex-shrink-0 mt-0.5 text-red-600"
                    width={20}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-red-800 mb-1">
                      Submit Error
                    </p>
                    <p className="text-sm text-red-600">
                      {finalSubmitError?.data?.errorMessage ||
                        finalSubmitError?.data?.message ||
                        finalSubmitError?.data?.title ||
                        finalSubmitError?.message ||
                        "Failed to submit final test"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Hiển thị thành công final submit */}
            {finalSubmitResult && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon
                    icon="mdi:check-circle"
                    className="flex-shrink-0 mt-0.5 text-green-600"
                    width={20}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-green-800 mb-1">
                      Submission Successful!
                    </p>
                    <p className="text-sm text-green-600">
                      Your code has been submitted for final evaluation.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6 mt-4">
          <h2 className="text-lg font-semibold text-[#2d3748] mb-4">
            Test Results
          </h2>

          {resultLoading ? (
            <div className="text-center py-8">
              <Icon
                icon="mdi:loading"
                width="48"
                className="mx-auto mb-2 text-[#ff6b35] animate-spin"
              />
              <p className="text-[#7A7574]">Loading results...</p>
            </div>
          ) : testResult ? (
            <div className="space-y-4">
              {/* Summary */}
              <div className="bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-[#7A7574] mb-1">
                      Total Test Cases
                    </p>
                    <p className="text-xl font-bold text-[#2d3748]">
                      {testResult.details?.length || 0}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#7A7574] mb-1">Passed</p>
                    <p className="text-xl font-bold text-green-600">
                      {testResult.details?.filter((d) => d.note === "success")
                        .length || 0}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#7A7574] mb-1">Score</p>
                    <p className="text-xl font-bold text-[#ff6b35]">
                      {testResult.score || 0}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#7A7574] mb-1">Attempt</p>
                    <p className="text-xl font-bold text-[#2d3748]">
                      {testResult.submissionAttemptNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              {testResult.status && (
                <div
                  className={`border rounded-[5px] p-3 ${
                    testResult.status === "Finished"
                      ? "bg-green-50 border-green-200"
                      : "bg-yellow-50 border-yellow-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      icon={
                        testResult.status === "Finished"
                          ? "mdi:check-circle"
                          : "mdi:progress-clock"
                      }
                      width="20"
                      className={
                        testResult.status === "Finished"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }
                    />
                    <span className="font-medium text-sm">
                      Status: {testResult.status}
                    </span>
                  </div>
                </div>
              )}

              {/* Test Cases Detail */}
              {testResult.details && testResult.details.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-[#2d3748] text-sm">
                    Test Cases Detail
                  </h3>
                  {testResult.details.map((detail, index) => (
                    <div
                      key={detail.detailsId || index}
                      className={`border rounded-[5px] p-4 ${
                        detail.note === "success"
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            Test Case {index + 1}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              detail.note === "success"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {detail.note}
                          </span>
                        </div>
                        <div className="text-xs text-[#7A7574]">
                          Time: {detail.runtimeMs}ms | Memory: {detail.memoryKb}{" "}
                          KB | Weight: {detail.weight}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Team Info */}
              {testResult.teamName && (
                <div className="bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-4">
                  <h3 className="font-semibold text-[#2d3748] text-sm mb-2">
                    Submission Info
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-[#4a5568]">
                      <span className="font-medium">Team:</span>{" "}
                      {testResult.teamName}
                    </p>
                    <p className="text-[#4a5568]">
                      <span className="font-medium">Submitted by:</span>{" "}
                      {testResult.submittedByStudentName}
                    </p>
                    <p className="text-[#4a5568]">
                      <span className="font-medium">Submitted at:</span>{" "}
                      {new Date(testResult.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-[#7A7574]">
              <Icon
                icon="mdi:test-tube"
                width="48"
                className="mx-auto mb-2 opacity-50"
              />
              <p>Run your code to see test results</p>
            </div>
          )}
        </div>

        {/* Info Notice */}
        <div className="bg-[#e6f4ea] border border-[#34a853] rounded-[8px] p-4 mt-4">
          <div className="flex items-start gap-2">
            <Icon
              icon="mdi:information"
              width="20"
              className="text-[#34a853] flex-shrink-0 mt-0.5"
            />
            <div className="text-sm">
              <p className="font-semibold text-[#2d3748] mb-1">
                Auto Evaluation
              </p>
              <p className="text-[#4a5568]">
                Your code will be tested against multiple test cases
                automatically. Make sure it handles all edge cases correctly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default StudentAutoEvaluation;
