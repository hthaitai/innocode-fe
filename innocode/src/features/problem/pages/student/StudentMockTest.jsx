import React, { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import PageContainer from "@/shared/components/PageContainer"
import { Icon } from "@iconify/react"
import { ArrowLeft, Code, Moon, Sun, Clock } from "lucide-react"
import useContestDetail from "@/features/contest/hooks/useContestDetail"
import useStudentAutoEvaluation from "../../hooks/useStudentAutoEvaluation"
import {
  useSubmitFinalAutoTestMutation,
  useSubmitAutoTestMutation,
  useSubmitNullSubmissionMutation,
} from "@/services/autoEvaluationApi"
import { toast } from "react-hot-toast"
import { useRoundTimer } from "../../hooks/useRoundTimer"
import ProblemDescription from "../../components/student/ProblemDescription"
import CodeEditorSection from "../../components/student/CodeEditorSection"
import MockTestResultsSection from "../../components/student/MockTestResultsSection"

const StudentMockTest = () => {
  const { contestId, roundId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation("pages")
  // Fetch contest data
  const { contest, loading, error } = useContestDetail(contestId)

  // Theme state - lưu vào localStorage
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("codeEditorTheme")
    return savedTheme || "vs-dark"
  })

  // Lưu theme vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("codeEditorTheme", theme)
  }, [theme])

  // Extract round and problem data
  const round = contest?.rounds?.find((r) => r.roundId === roundId)
  const problem = round?.problem

  // Custom hook auto evaluation - pass problem to check mockTestUrl
  const {
    code,
    setCode,
    submissionId,
    testCases,
    testResult,
    submitResponse, // Lấy submitResponse từ hook
    testCaseLoading,
    resultLoading,
    submitting,
    finalSubmitting,
    testCaseError,
    submitError,
    finalSubmitError,
    finalSubmitResult,
    hasRunCode,
    handleClearCode,
    handleRunCode,
    handleFinalSubmit,
  } = useStudentAutoEvaluation(contestId, roundId, problem)

  // Direct submit mutation for auto-submit
  const [submitFinalAutoTest] = useSubmitFinalAutoTestMutation()
  const [submitAutoTest] = useSubmitAutoTestMutation()
  const [submitNullSubmission] = useSubmitNullSubmissionMutation()

  // Check if mockTestUrl exists to determine which API to use
  const useMockTest =
    problem?.mockTestUrl !== null && problem?.mockTestUrl !== undefined

  const timeLimitMinutes = round?.timeLimitSeconds / 60
  const sampleTestCase = testCases?.data?.[0]

  // Auto-submit when time expires (direct submit without modal)
  // Submit ngay cả khi chưa có code (submit code trống)
  const handleAutoSubmit = useCallback(async () => {
    if (finalSubmitting) return // Đang submit rồi thì bỏ qua

    try {
      toast.dismiss()
      toast.loading(t("autoEvaluation.timeUpSubmitting"))

      let finalSubmissionId = submissionId

      // Nếu chưa có submissionId và không có code, gọi null-submission API
      if (!finalSubmissionId && (!code || code.trim() === "")) {
        try {
          await submitNullSubmission(roundId).unwrap()
          toast.dismiss()
          toast.success(t("autoEvaluation.nullSubmissionSuccess"))
          return
        } catch (error) {
          toast.dismiss()
          toast.error(
            `${t("autoEvaluation.errorOccurred")}. ${
              error?.data?.errorMessage ||
              error?.message ||
              t("common.unknownError")
            }`,
            {
              duration: 3000,
            },
          )
          return
        }
      }

      // Nếu chưa có submissionId nhưng có code, submit code hiện tại trước
      if (!finalSubmissionId) {
        try {
          const result = await submitAutoTest({
            roundId,
            code: code || "", // Submit code hiện tại hoặc code trống
            useMockTest: useMockTest, // Use mock test endpoint if mockTestUrl is not null
          }).unwrap()

          finalSubmissionId = result?.data?.submissionId || result?.submissionId

          if (!finalSubmissionId) {
            throw new Error("Failed to get submission ID")
          }

          // Đợi một chút để submission được xử lý
          await new Promise((resolve) => setTimeout(resolve, 500))
        } catch (error) {
          console.error("❌ Failed to submit code:", error)
          toast.dismiss()
          toast.error(
            `${t("autoEvaluation.errorOccurred")}. ${
              error?.data?.errorMessage ||
              error?.message ||
              t("common.unknownError")
            }`,
            {
              duration: 3000,
            },
          )
          return
        }
      }

      // Submit final với submissionId
      await submitFinalAutoTest(finalSubmissionId).unwrap()

      toast.dismiss()
      toast.success(t("autoEvaluation.submissionSuccess"))

      // Navigate to contest detail sau khi submit thành công
      // Dùng replace: true để không cho quay lại trang này
      setTimeout(() => {
        navigate(`/contest-detail/${contestId}`, { replace: true })
      }, 2000) // Đợi 2 giây để user thấy toast message
    } catch (error) {
      console.error("❌ Failed to auto-submit:", error)
      toast.dismiss()
      toast.error(
        error?.data?.errorMessage || t("autoEvaluation.errorOccurred"),
      )
    }
  }, [
    submissionId,
    finalSubmitting,
    submitFinalAutoTest,
    submitAutoTest,
    contestId,
    navigate,
    roundId,
    code,
    submitNullSubmission,
  ])

  // Timer for round
  const { timeRemaining, formatTime, isExpired } = useRoundTimer(
    round,
    handleAutoSubmit,
  )
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
            <p className="text-[#7A7574]">
              {t("autoEvaluation.loadingProblem")}
            </p>
          </div>
        </div>
      </PageContainer>
    )
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
            {testCaseError?.data?.errorMessage ||
              t("autoEvaluation.errorOccurred")}
          </p>
          <button
            onClick={() => navigate(`/contest-detail/${contestId}`)}
            className="button-orange mt-4"
          >
            {t("autoEvaluation.backToContest")}
          </button>
        </div>
      </div>
    )
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
          <p className="text-[#7A7574]">
            {t("autoEvaluation.problemNotFound")}
          </p>
          <button
            onClick={() => navigate(`/contest-detail/${contestId}`)}
            className="button-orange mt-4"
          >
            {t("autoEvaluation.backToContest")}
          </button>
        </div>
      </div>
    )
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
            <span className="text-sm">{t("autoEvaluation.backToContest")}</span>
          </button>

          {/* Timer */}
          {timeRemaining !== null && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-[#7A7574]" />
                <div className="text-right">
                  <p className="text-xs text-[#7A7574]">
                    {t("autoEvaluation.timeRemaining")}
                  </p>
                  <p
                    className={`text-lg font-bold ${
                      timeRemaining < 300 ? "text-red-600" : "text-[#2d3748]"
                    }`}
                  >
                    {formatTime(timeRemaining)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#ff6b35] text-white flex items-center justify-center">
            <Code size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#2d3748]">
              {round.roundName || t("common.nameUnknown")}
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
          hasRunCode={hasRunCode}
          onClearCode={handleClearCode}
          onRunCode={handleRunCode}
          onFinalSubmit={handleFinalSubmit}
          isTimeUp={isExpired}
          templateUrl={round.problem.templateUrl}
        />

        {/* Problem Description */}
        <ProblemDescription
          problem={problem}
          testCase={sampleTestCase}
          timeLimitMinutes={timeLimitMinutes}
        />
      </div>

      {/* Mock Test Results Section */}
      {/* Merge submitResponse (test results) với testResult (metadata) */}
      <MockTestResultsSection
        testResult={
          submitResponse
            ? { ...testResult, ...submitResponse } // Merge: testResult có metadata, submitResponse có test results
            : testResult
        }
        isLoading={resultLoading}
      />
    </div>
  )
}

export default StudentMockTest
