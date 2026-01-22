import React, { useState } from "react"
import { Icon } from "@iconify/react"
import { useTranslation } from "react-i18next"

/**
 * Component hiển thị kết quả mock test
 */
const MockTestResultsSection = ({ testResult, isLoading }) => {
  const { t } = useTranslation("pages")
  const [expandedCases, setExpandedCases] = useState(new Set())

  const toggleCase = (caseId) => {
    setExpandedCases((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(caseId)) {
        newSet.delete(caseId)
      } else {
        newSet.add(caseId)
      }
      return newSet
    })
  }

  if (isLoading) {
    return (
      <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6">
        <h2 className="text-lg font-semibold text-[#2d3748] mb-4">
          {t("autoEvaluation.testResults")}
        </h2>
        <div className="text-center py-8">
          <Icon
            icon="mdi:loading"
            width="48"
            className="mx-auto mb-2 text-[#ff6b35] animate-spin"
          />
          <p className="text-[#7A7574]">{t("autoEvaluation.loadingResults")}</p>
        </div>
      </div>
    )
  }

  if (!testResult) {
    return (
      <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6">
        <h2 className="text-lg font-semibold text-[#2d3748] mb-4">
          {t("autoEvaluation.testResults")}
        </h2>
        <div className="text-center py-8 text-[#7A7574]">
          <Icon
            icon="mdi:test-tube"
            width="48"
            className="mx-auto mb-2 opacity-50"
          />
          <p>{t("autoEvaluation.runToSeeResults")}</p>
        </div>
      </div>
    )
  }

  // Kiểm tra format của response
  // Format 1: submitResponse từ Run Code - có summary và cases
  // Format 2: testResult từ Final Submit - có details
  const hasSubmitResponseFormat = testResult.summary && testResult.cases
  const hasFinalSubmitFormat = testResult.details

  let totalCases,
    passedCount,
    failedCount,
    rawScore,
    score,
    submissionAttemptNumber,
    status,
    testCases

  if (hasSubmitResponseFormat) {
    // Format từ Run Code (submitResponse)
    const summary = testResult.summary
    const cases = testResult.cases || []

    totalCases = summary.total || 0
    passedCount = summary.passed || 0
    failedCount = summary.failed || 0
    rawScore = summary.rawScore || 0
    score = summary.penaltyScore // Penalty score từ summary

    // submitResponse thường không có status và submissionAttemptNumber
    // Nên không set ở đây, sẽ lấy từ phần common bên dưới
    submissionAttemptNumber = testResult.submissionAttemptNumber
    status = testResult.status

    // Convert cases thành format hiển thị
    testCases = cases.map((testCase, index) => ({
      id: testCase.id || `Test Case ${index + 1}`,
      status: testCase.status,
      judge0Status:
        testCase.judge0Status ||
        (testCase.status === "success" ? "Accepted" : "Failed"),
      expected: testCase.expected,
      actual: testCase.actual,
      time: testCase.time,
      memoryKb: testCase.memoryKb,
      stderr: testCase.stderr,
      stdout: testCase.stdout,
    }))
  } else if (hasFinalSubmitFormat) {
    // Format từ Final Submit (testResult)

    const details = testResult.details || []

    // 🔍 DEBUG: Log để xem cấu trúc dữ liệu thực tế
    console.log("🔍 [MockTest] Final Submit Format - testResult:", testResult)
    console.log("🔍 [MockTest] Details array:", details)
    if (details.length > 0) {
      console.log("🔍 [MockTest] First detail sample:", details[0])
    }

    // Tính toán summary từ details
    totalCases = details.length
    const passedDetails = details.filter((d) => d.note?.includes("success"))
    passedCount = passedDetails.length
    failedCount = totalCases - passedCount

    console.log(
      `🔍 [MockTest] Passed details count: ${passedCount}/${totalCases}`,
    )

    // Lấy raw score từ testResult.score (đã được backend tính chính xác)
    // Thay vì tính từ weight để tránh lỗi làm tròn (33.33 × 3 = 99.99)
    rawScore = testResult.score || 0

    // Lấy thông tin từ testResult
    score = testResult.score // Điểm sau penalty (trong trường hợp mock test thường giống rawScore)
    submissionAttemptNumber = testResult.submissionAttemptNumber
    status = testResult.status

    // Convert details thành format dễ hiển thị
    testCases = details.map((detail, index) => {
      // Parse note để lấy status
      // Backend trả về note có thể là:
      // - "success" hoặc "failed" (format đơn giản)
      // - "test 1: success" (format có test case name)
      let statusText = "unknown"
      let testCaseName = `Test Case ${index + 1}`

      if (detail.note) {
        // Thử match format "test 1: success"
        const noteMatch = detail.note.match(/^(test \d+):\s*(\w+)$/i)
        if (noteMatch) {
          testCaseName = noteMatch[1]
          statusText = noteMatch[2]
        } else {
          // Format đơn giản: chỉ có "success" hoặc "failed"
          statusText = detail.note.trim()
        }
      }

      console.log(
        `🔍 [MockTest] Test case ${index + 1}: note="${detail.note}", parsed status="${statusText}"`,
      )

      return {
        id: testCaseName,
        status: statusText.toLowerCase() === "success" ? "success" : "failed",
        judge0Status:
          statusText.toLowerCase() === "success" ? "Success" : "Failed",
        expected: detail.expected,
        actual: detail.actual,
        time: detail.runtimeMs ? (detail.runtimeMs / 1000).toFixed(3) : null,
        memoryKb: detail.memoryKb,
        weight: detail.weight,
      }
    })
  } else {
    // Không có data hợp lệ
    console.warn("⚠️ Unknown response format:", testResult)
    return null
  }

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6 mt-4">
      <h2 className="text-lg font-semibold text-[#2d3748] mb-4">
        {t("autoEvaluation.testResults")}
      </h2>

      <div className="space-y-4">
        {/* Summary Section - Responsive Grid */}
        <div className="bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Total Test Cases */}
            <div className="text-center">
              <p className="text-xs text-[#7A7574] mb-1">
                {t("autoEvaluation.totalTestCases")}
              </p>
              <p className="text-xl font-bold text-[#2d3748]">{totalCases}</p>
            </div>

            {/* Passed */}
            <div className="text-center">
              <p className="text-xs text-[#7A7574] mb-1">
                {t("autoEvaluation.passed")}
              </p>
              <p className="text-xl font-bold text-green-600">{passedCount}</p>
            </div>

            {/* Failed */}
            <div className="text-center">
              <p className="text-xs text-[#7A7574] mb-1">
                {t("autoEvaluation.failed")}
              </p>
              <p className="text-xl font-bold text-red-600">{failedCount}</p>
            </div>

            {/* Raw Score */}
            <div className="text-center">
              <p className="text-xs text-[#7A7574] mb-1">
                {t("autoEvaluation.rawScore")}
              </p>
              <p className="text-xl font-bold text-[#ff6b35]">{rawScore}</p>
            </div>

            {/* Penalty Score (actual score after penalty) */}
            {score !== undefined && (
              <div className="text-center">
                <p className="text-xs text-[#7A7574] mb-1">
                  {t("autoEvaluation.penaltyScore")}
                </p>
                <p className="text-xl font-bold text-purple-600">{score}</p>
              </div>
            )}
          </div>
        </div>

        {/* Status and Attempt Info */}
        {(status || submissionAttemptNumber) && (
          <div className="bg-blue-50 border border-blue-200 rounded-[5px] p-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              {status && (
                <div className="flex items-center gap-2">
                  <Icon
                    icon={
                      status === "Finished"
                        ? "mdi:check-circle"
                        : "mdi:progress-clock"
                    }
                    width="20"
                    className={
                      status === "Finished"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }
                  />
                  <span className="text-sm font-medium text-[#2d3748]">
                    {t("autoEvaluation.status")} {status}
                  </span>
                </div>
              )}
              {submissionAttemptNumber && (
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:counter"
                    width="20"
                    className="text-blue-600"
                  />
                  <span className="text-sm font-medium text-[#2d3748]">
                    {t("autoEvaluation.attempt")} #{submissionAttemptNumber}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Test Cases Detail */}
        {testCases && testCases.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-[#2d3748] text-sm">
              {t("autoEvaluation.testCasesDetail")}
            </h3>
            {testCases.map((testCase, index) => {
              const caseId = testCase.id || index
              const isExpanded = expandedCases.has(caseId)

              // Lấy thông tin từ testCase
              const testCaseName = testCase.id || `Test Case ${index + 1}`
              const testStatus = testCase.status
              const judge0Status = testCase.status

              const hasOutput =
                testCase.expected !== undefined || testCase.actual !== undefined

              return (
                <div
                  key={caseId}
                  className="border border-gray-200 rounded-[5px] p-4 bg-white"
                >
                  <div
                    className={`flex items-center justify-between ${
                      hasOutput ? "cursor-pointer" : ""
                    }`}
                    onClick={() => hasOutput && toggleCase(caseId)}
                  >
                    <div className="flex items-center gap-2">
                      {hasOutput && (
                        <Icon
                          icon={
                            isExpanded
                              ? "mdi:chevron-down"
                              : "mdi:chevron-right"
                          }
                          width="20"
                          className="text-[#7A7574] transition-transform"
                        />
                      )}
                      <span className="font-medium text-sm">
                        {testCaseName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          testStatus === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {judge0Status}
                      </span>
                    </div>
                  </div>

                  {/* Output Display */}
                  {isExpanded && hasOutput && (
                    <div className="mt-3 space-y-3">
                      {/* Expected vs Actual Output */}
                      {(testCase.expected !== undefined ||
                        testCase.actual !== undefined) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Actual Output */}
                          {testCase.actual !== undefined && (
                            <div className="bg-white border border-gray-200 rounded-[5px] p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Icon
                                  icon={
                                    testStatus === "success"
                                      ? "mdi:check"
                                      : "mdi:close"
                                  }
                                  width="16"
                                  className={
                                    testStatus === "success"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                />
                                <span className="text-xs font-semibold text-[#7A7574] uppercase">
                                  {t("autoEvaluation.yourActualOutput")}
                                </span>
                              </div>
                              <div
                                className={`rounded p-2 font-mono text-sm break-words whitespace-pre-wrap ${
                                  testStatus === "success"
                                    ? "bg-[#f9fafb] text-[#2d3748]"
                                    : "bg-red-50 text-red-800"
                                }`}
                              >
                                {testCase.actual || "N/A"}
                              </div>
                            </div>
                          )}{" "}
                          {/* Expected Output */}
                          {testCase.expected !== undefined && (
                            <div className="bg-white border border-gray-200 rounded-[5px] p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Icon
                                  icon="mdi:check"
                                  width="16"
                                  className="text-green-600"
                                />
                                <span className="text-xs font-semibold text-[#7A7574] uppercase">
                                  {t("autoEvaluation.expectedOutput")}
                                </span>
                              </div>
                              <div className="bg-[#f9fafb] rounded p-2 font-mono text-sm text-[#2d3748] break-words whitespace-pre-wrap">
                                {testCase.expected || "N/A"}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
      {/* Team Info */}
      {testResult.teamName && (
        <div className="bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-4">
          <h3 className="font-semibold text-[#2d3748] text-sm mb-2">
            {t("autoEvaluation.submissionInfo")}
          </h3>
          <div className="space-y-1 text-sm">
            <p className="text-[#4a5568]">
              <span className="font-medium">{t("autoEvaluation.team")}</span>{" "}
              {testResult.teamName}
            </p>
            <p className="text-[#4a5568]">
              <span className="font-medium">
                {t("autoEvaluation.submittedBy")}
              </span>{" "}
              {testResult.submittedByStudentName}
            </p>
            <p className="text-[#4a5568]">
              <span className="font-medium">
                {t("autoEvaluation.submittedAt")}
              </span>{" "}
              {new Date(testResult.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default MockTestResultsSection
