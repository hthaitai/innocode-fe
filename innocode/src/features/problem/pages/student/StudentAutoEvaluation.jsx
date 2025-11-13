import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '@/shared/components/PageContainer';
import { Icon } from '@iconify/react';
import { ArrowLeft, Code, Play, CheckCircle } from 'lucide-react';
import useContestDetail from '@/features/contest/hooks/useContestDetail';
import useAutoEvaluation from '../../hooks/useAutoEvaluation';

const StudentAutoEvaluation = () => {
  const { contestId, roundId } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const { contest, loading, error } = useContestDetail(contestId);
  const {
    testCases,
    loading: testCaseLoading,
    error: testCaseError,
    submitCode,
    submitting,
    submitError,
    submitResult,
    testResult,
    resultLoading,
    submissionId,
    submitFinalAutoTest,
    finalSubmitting,
    finalSubmitError,
    finalSubmitResult,
  } = useAutoEvaluation(roundId);

  const round = contest?.rounds?.find((r) => r.roundId === roundId);
  const problem = round?.problem;
  const timeLimitMinutes = round?.timeLimitSeconds / 60;

  const handleRuncode = async () => {
    if (!code.trim()) {
      alert('Please enter your code before running.');
      return;
    }

    try {
      await submitCode(code);
    } catch (error) {
      console.error('Failed to run code:', error);
    }
  };

  const handleFinalSubmit = async () => {
    if (!submissionId) {
      alert('Please run your code first before submitting.');
      return;
    }

    try {
      await submitFinalAutoTest();
      // Hiển thị thông báo thành công
      alert('Final submission successful!');
    } catch (error) {
      console.error('Failed to submit final test:', error);
    }
  };
  // Loading state
  if (loading) {
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
  if (error) {
    return (
      <PageContainer bg={false}>
        <div className="max-w-5xl mt-[38px] mx-auto">
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6 text-center">
            <Icon
              icon="mdi:alert-circle"
              width="48"
              className="mx-auto mb-2 text-red-500"
            />
            <p className="text-[#7A7574]">Failed to load problem</p>
            <p className="text-sm text-[#7A7574] mt-1">{error}</p>
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
                {round.roundName || 'Name unknown'}
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
                    You will lose{' '}
                    <span className="text-[#dd4b4b] font-medium">
                      {' '}
                      {(problem.penaltyRate * 100).toFixed(0)}%
                    </span>{' '}
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
            <h2 className="text-lg font-semibold text-[#2d3748] mb-4 flex items-center gap-2">
              <Code size={20} className="text-[#ff6b35]" />
              Your Solution
            </h2>

            <div className="mb-4">{round.problem.language}</div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="# Write your code here..."
              className="w-full h-[300px] p-4 border border-[#E5E5E5] rounded-[5px] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
            />

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
                  !submissionId ? 'opacity-50 cursor-not-allowed' : ''
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
                    <p className="text-sm text-red-600">{submitError}</p>
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
                    <p className="text-sm text-red-600">{finalSubmitError}</p>
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
          ) : testResult?.data?.summary ? (
            <div className="space-y-4">
              {/* Summary */}
              <div className="bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-[#7A7574] mb-1">Total</p>
                    <p className="text-xl font-bold text-[#2d3748]">
                      {testResult.data.summary.total}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#7A7574] mb-1">Passed</p>
                    <p className="text-xl font-bold text-green-600">
                      {testResult.data.summary.passed}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#7A7574] mb-1">Failed</p>
                    <p className="text-xl font-bold text-red-600">
                      {testResult.data.summary.failed}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#7A7574] mb-1">Raw Score</p>
                    <p className="text-xl font-bold text-[#ff6b35]">
                      {testResult.data.summary.rawScore}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#7A7574] mb-1">Final Score</p>
                    <p className="text-xl font-bold text-[#2d3748]">
                      {testResult.data.summary.penaltyScore}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Test Cases */}
              {testResult.data.cases && testResult.data.cases.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-[#2d3748] text-sm">
                    Test Cases Detail
                  </h3>
                  {testResult.data.cases.map((testCase, index) => (
                    <div
                      key={testCase.id || index}
                      className={`border rounded-[5px] p-4 ${
                        testCase.status === 'success'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            Test Case {index + 1}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              testCase.status === 'success'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {testCase.judge0Status}
                          </span>
                        </div>
                        <div className="text-xs text-[#7A7574]">
                          Time: {testCase.time}s | Memory: {testCase.memoryKb}{' '}
                          KB
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-[#7A7574] mb-1">
                            Expected:
                          </p>
                          <pre className="bg-white border border-[#E5E5E5] rounded p-2">
                            {testCase.expected}
                          </pre>
                        </div>
                        <div>
                          <p className="text-xs text-[#7A7574] mb-1">Actual:</p>
                          <pre
                            className={`bg-white border rounded p-2 ${
                              testCase.status === 'success'
                                ? 'border-green-200'
                                : 'border-red-200'
                            }`}
                          >
                            {testCase.actual || 'N/A'}
                          </pre>
                        </div>
                      </div>
                      {testCase.stderr && (
                        <div className="mt-2">
                          <p className="text-xs text-red-600 mb-1">Error:</p>
                          <pre className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-700">
                            {testCase.stderr}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
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
