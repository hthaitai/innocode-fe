import React, { useState } from "react"
import { Icon } from "@iconify/react"
import { useTranslation } from "react-i18next"

/**
 * Component hiển thị test results
 */
const TestResultsSection = ({ testResult, isLoading }) => {
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

  // Lấy summary và cases từ response mới
  const summary = testResult.summary || {}
  const testCases = testResult.cases || []

  // Lấy thông tin từ summary
  const totalCases = summary.total || 0
  const passedCount = summary.passed || 0
  const failedCount = summary.failed || 0
  const rawScore = summary.rawScore || 0
  const penaltyScore = summary.penaltyScore
  const submissionAttemptNumber =
    summary.submissionAttemptNumber || testResult.submissionAttemptNumber || 1

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6 mt-4">
      <h2 className="text-lg font-semibold text-[#2d3748] mb-4">
        {t("autoEvaluation.testResults")}
      </h2>

      <div className="space-y-4">
        {/* Summary */}
        <div className="bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-xs text-[#7A7574] mb-1">
                {t("autoEvaluation.totalTestCases")}
              </p>
              <p className="text-xl font-bold text-[#2d3748]">{totalCases}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[#7A7574] mb-1">
                {t("autoEvaluation.passed")}
              </p>
              <p className="text-xl font-bold text-green-600">{passedCount}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[#7A7574] mb-1">
                {t("autoEvaluation.failed")}
              </p>
              <p className="text-xl font-bold text-red-600">{failedCount}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[#7A7574] mb-1">
                {t("autoEvaluation.rawScore")}
              </p>
              <p className="text-xl font-bold text-[#ff6b35]">{rawScore}</p>
            </div>
            {penaltyScore !== undefined && (
              <div className="text-center">
                <p className="text-xs text-[#7A7574] mb-1">
                  {t("autoEvaluation.penaltyScore")}
                </p>
                <p className="text-xl font-bold text-purple-600">
                  {penaltyScore}
                </p>
              </div>
            )}
            {testResult.submissionAttemptNumber !== undefined && (
              <div className="text-center">
                <p className="text-xs text-[#7A7574] mb-1">
                  {t("autoEvaluation.attempt")}
                </p>
                <p className="text-xl font-bold text-[#2d3748]">
                  {testResult.submissionAttemptNumber}
                </p>
              </div>
            )}
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
                {t("autoEvaluation.status")} {testResult.status}
              </span>
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
              const testCaseName = `Test Case ${index + 1}`
              const testStatus = testCase.status

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
                        {testStatus}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Additional Info - always visible */}
                      {(testCase.time || testCase.memoryKb) && (
                        <div className="flex items-center gap-3 text-xs text-[#7A7574]">
                          {testCase.time && (
                            <div className="flex items-center gap-1">
                              <Icon icon="mdi:clock-outline" width="14" />
                              <span>{testCase.time}s</span>
                            </div>
                          )}
                          {testCase.memoryKb && (
                            <div className="flex items-center gap-1">
                              <Icon icon="mdi:memory" width="14" />
                              <span>{testCase.memoryKb} KB</span>
                            </div>
                          )}
                        </div>
                      )}
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
    </div>
  )
}

export default TestResultsSection
