import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "@/shared/components/PageContainer";
import { Icon } from "@iconify/react";
import { ArrowLeft, Code, Moon, Sun } from "lucide-react";
import useContestDetail from "@/features/contest/hooks/useContestDetail";
import useStudentAutoEvaluation from "../../hooks/useStudentAutoEvaluation";
import ProblemDescription from "../../components/student/ProblemDescription";
import CodeEditorSection from "../../components/student/CodeEditorSection";
import TestResultsSection from "../../components/student/TestResultsSection";

const StudentAutoEvaluation = () => {
  const { contestId, roundId } = useParams();
  const navigate = useNavigate();
  // Fetch contest data
  const { contest, loading, error } = useContestDetail(contestId);

  // Theme state - lưu vào localStorage
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("codeEditorTheme");
    return savedTheme || "vs-dark";
  });

  // Lưu theme vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("codeEditorTheme", theme);
  }, [theme]);

  // Custom hook auto evaluation
  const {
    code,
    setCode,
    submissionId,
    testCases,
    testResult,
    testCaseLoading,
    resultLoading,
    submitting,
    finalSubmitting,
    testCaseError,
    submitError,
    finalSubmitError,
    finalSubmitResult,
    handleClearCode,
    handleRunCode,
    handleFinalSubmit,
  } = useStudentAutoEvaluation(contestId, roundId);

  // Extract round and problem data
  const round = contest?.rounds?.find((r) => r.roundId === roundId);
  const problem = round?.problem;
  const timeLimitMinutes = round?.timeLimitSeconds / 60;
  const sampleTestCase = testCases?.data?.[0];
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
      <div className="max-w-5xl mt-[38px] mx-auto">
        <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6 text-center">
          <Icon
            icon="mdi:alert-circle"
            width="48"
            className="mx-auto mb-2 text-red-500"
          />
          <p className="text-[#7A7574]">
            {testCaseError?.data?.errorMessage || "An error occurred"}
          </p>
          <button
            onClick={() => navigate(`/contest-detail/${contestId}`)}
            className="button-orange mt-4"
          >
            Back to Contest
          </button>
        </div>
      </div>
    );
  }

  // Not found state
  if (!round || !problem) {
    return (
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
    );
  }
  return (
    <div className="w-full mt-[10px] mx-auto">
      {/* Header */}
      <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(`/contest-detail/${contestId}`)}
            className="flex items-center gap-2 text-[#7A7574] hover:text-[#ff6b35] transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-sm">Back to Contest</span>
          </button>
        </div>

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
        
        {/* Code Editor Section */}
        <CodeEditorSection
          theme={theme}
          setTheme={setTheme}
          code={code}
          setCode={setCode}
          language={round.problem.language}
          submitting={submitting}
          finalSubmitting={finalSubmitting}
          submissionId={submissionId}
          submitError={submitError}
          finalSubmitError={finalSubmitError}
          finalSubmitResult={finalSubmitResult}
          onClearCode={handleClearCode}
          onRunCode={handleRunCode}
          onFinalSubmit={handleFinalSubmit}
        />

        {/* Problem Description */}
        <ProblemDescription
          problem={problem}
          testCase={sampleTestCase}
          timeLimitMinutes={timeLimitMinutes}
        />
      </div>

      {/* Test Results Section */}
      <TestResultsSection testResult={testResult} isLoading={resultLoading} />
    </div>
  );
};

export default StudentAutoEvaluation;
