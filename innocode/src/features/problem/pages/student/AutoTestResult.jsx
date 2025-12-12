import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PageContainer from "@/shared/components/PageContainer";
import { Icon } from "@iconify/react";
import { ArrowLeft, Trophy, CheckCircle, XCircle, Download } from "lucide-react";
import { useGetAutoTestResultQuery } from "@/services/autoEvaluationApi";
import useContestDetail from "@/features/contest/hooks/useContestDetail";

const AutoTestResult = () => {
  const { contestId: contestIdParam, roundId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Get contestId from location state (if navigated from contest detail) or params
  const contestId = location.state?.contestId || contestIdParam;

  // Skip queries if essential params are missing
  const shouldSkipContest = !contestId;
  const shouldSkipResult = !roundId;

  // Only fetch contest if we have a valid contestId
  const { contest, loading: contestLoading, error: contestError } = useContestDetail(
    shouldSkipContest ? null : contestId
  );
  const {
    data: testResultData,
    isLoading: resultLoading,
    error: resultError,
  } = useGetAutoTestResultQuery(roundId, {
    skip: shouldSkipResult,
  });

  // Extract testResult from response structure
  // transformResponse already extracts data, so testResultData should be the data object
  const testResult = testResultData;

  const round = contest?.rounds?.find((r) => r.roundId === roundId);

  // Handle navigation back - redirect if params are missing
  useEffect(() => {
    if (!roundId || !contestId) {
      console.warn("⚠️ AutoTestResult - Missing params, redirecting...");
      // Use replace to prevent back button from going to invalid state
      if (contestId) {
        navigate(`/contest-detail/${contestId}`, { replace: true });
      } else {
        navigate("/contests", { replace: true });
      }
      return;
    }
  }, [roundId, contestId, navigate]);
  // Show error if contest fetch failed
  if (contestError && !shouldSkipContest) {
    return (
      <PageContainer bg={false}>
        <div className="max-w-5xl mt-[38px] mx-auto">
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6 text-center">
            <Icon
              icon="mdi:alert-circle"
              width="48"
              className="mx-auto mb-2 text-red-500"
            />
            <p className="text-[#7A7574]">Failed to load contest</p>
            <button
              onClick={() => navigate("/contests")}
              className="button-orange mt-4"
            >
              Back to Contests
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (contestLoading || resultLoading) {
    return (
      <PageContainer bg={false}>
        <div className="flex justify-center items-center h-[400px]">
          <div className="text-center">
            <Icon
              icon="mdi:loading"
              width="48"
              className="mx-auto mb-2 text-[#ff6b35] animate-spin"
            />
            <p className="text-[#7A7574]">Loading results...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (resultError) {
    console.error("❌ AutoTestResult error:", resultError);
    return (
      <PageContainer bg={false}>
        <div className="max-w-5xl mt-[38px] mx-auto">
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6 text-center">
            <Icon
              icon="mdi:alert-circle"
              width="48"
              className="mx-auto mb-2 text-red-500"
            />
            <p className="text-[#7A7574]">Failed to load results</p>
            <p className="text-xs text-red-500 mt-2">
              {resultError?.data?.message || resultError?.message || "Unknown error"}
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

  if (!testResult) {
    return (
      <PageContainer bg={false}>
        <div className="max-w-5xl mt-[38px] mx-auto">
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6 text-center">
            <Icon
              icon="mdi:test-tube"
              width="48"
              className="mx-auto mb-2 opacity-50"
            />
            <p className="text-[#7A7574]">No test results found</p>
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

  // Safely get counts
  const passedCount = testResult?.details?.filter(
    (d) => d.note === "success"
  ).length || 0;
  const totalCount = testResult?.details?.length || 0;

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
              <Trophy size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2d3748]">
                {round?.roundName || "Auto Test Results"}
              </h1>
              <p className="text-sm text-[#7A7574]">
                {contest?.name || "Contest"}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6 mb-4">
          <h2 className="text-lg font-semibold text-[#2d3748] mb-4">
            Test Results Summary
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <p className="text-xs text-[#7A7574] mb-1">Total Test Cases</p>
              <p className="text-xl font-bold text-[#2d3748]">{totalCount}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[#7A7574] mb-1">Passed</p>
              <p className="text-xl font-bold text-green-600">{passedCount}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[#7A7574] mb-1">Score</p>
              <p className="text-xl font-bold text-[#ff6b35]">
                {testResult?.score || 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[#7A7574] mb-1">Attempt</p>
              <p className="text-xl font-bold text-[#2d3748]">
                {testResult?.submissionAttemptNumber || 0}
              </p>
            </div>
          </div>

          {/* Status */}
          {testResult?.status && (
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
                  Status: {testResult?.status}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Test Cases Detail */}
        {testResult?.details && testResult.details.length > 0 && (
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6 mb-4">
            <h2 className="text-lg font-semibold text-[#2d3748] mb-4">
              Test Cases Detail
            </h2>
            <div className="space-y-3">
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
                      Time: {detail.runtimeMs}ms | Memory: {detail.memoryKb} KB
                      | Weight: {detail.weight}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submission Info */}
        <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6">
          <h2 className="text-lg font-semibold text-[#2d3748] mb-4">
            Submission Information
          </h2>
          <div className="space-y-2 text-sm">
            {testResult?.teamName && (
              <p className="text-[#4a5568]">
                <span className="font-medium">Team:</span> {testResult.teamName}
              </p>
            )}
            {testResult?.submittedByStudentName && (
              <p className="text-[#4a5568]">
                <span className="font-medium">Submitted by:</span>{" "}
                {testResult.submittedByStudentName}
              </p>
            )}
            {testResult?.createdAt && (
              <p className="text-[#4a5568]">
                <span className="font-medium">Submitted at:</span>{" "}
                {new Date(testResult.createdAt).toLocaleString()}
              </p>
            )}
            {testResult?.artifacts && testResult.artifacts.length > 0 && (
              <div className="mt-4 flex items-center gap-2">
                <p className="font-medium text-[#2d3748]">Your Submitted Code:</p>
                <a
                  href={testResult.artifacts[0].url}
                  download
                  className=" text-[#ff6b35]  hover:text-[#e55a2b] transition-colors"
                  title="Download submitted code"
                >
                  <Download size={30} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default AutoTestResult;

