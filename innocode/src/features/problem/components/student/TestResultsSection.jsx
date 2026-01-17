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

  // Hỗ trợ cả format cũ (details) và format mới (summary + cases)
  const summary = testResult.summary || {}
  const testCases = testResult.cases || testResult.details || []

  // Đếm số test case passed
  const passedCount =
    summary.passed !== undefined
      ? summary.passed
      : testCases.filter((d) => {
          // New format: check judge0StatusId or status
          if (d.judge0StatusId === 3 || d.status === "success") {
            return true
          }
          // Old format: check note field for "success"
          if (d.note && d.note.toLowerCase().includes("success")) {
            return true
          }
          return false
        }).length

  const totalCases =
    summary.total !== undefined ? summary.total : testCases.length
  const rawScore =
    summary.rawScore !== undefined ? summary.rawScore : testResult.score || 0
  const penaltyScore = summary.penaltyScore

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6 mt-4">
      <h2 className="text-lg font-semibold text-[#2d3748] mb-4">
        {t("autoEvaluation.testResults")}
      </h2>

      <div className="space-y-4">
        {/* Summary */}
        <div className="bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
            {summary.failed !== undefined && (
              <div className="text-center">
                <p className="text-xs text-[#7A7574] mb-1">
                  {t("autoEvaluation.failed")}
                </p>
                <p className="text-xl font-bold text-red-600">
                  {summary.failed}
                </p>
              </div>
            )}
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
            {testCases.map((detail, index) => {
              const caseId = detail.detailsId || detail.id || index
              const isExpanded = expandedCases.has(caseId)

              // Parse test case name and status from note field (old format)
              // Format: "test 3: success" or just use judge0Status (new format)
              let testCaseName =
                detail.id || `${t("autoEvaluation.testCase")} ${index + 1}`
              let testStatus = detail.judge0Status || detail.status || "Unknown"

              if (detail.note && !detail.id) {
                // Parse from note field: "test 3: success"
                const noteParts = detail.note.split(":")
                if (noteParts.length >= 2) {
                  testCaseName = noteParts[0].trim() // "test 3"
                  testStatus = noteParts[1].trim() // "success"
                }
              }

              // Check if passed
              const isPassed =
                detail.judge0StatusId === 3 ||
                detail.status === "success" ||
                testStatus.toLowerCase() === "success"

              const hasOutput =
                detail.stdout !== undefined ||
                detail.stderr !== undefined ||
                detail.compileOutput !== undefined ||
                detail.expected !== undefined

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
                          isPassed
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {testStatus}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Additional Info - always visible */}
                      {(detail.time || detail.memoryKb) && (
                        <div className="flex items-center gap-3 text-xs text-[#7A7574]">
                          {detail.time && (
                            <div className="flex items-center gap-1">
                              <Icon icon="mdi:clock-outline" width="14" />
                              <span>{detail.time}s</span>
                            </div>
                          )}
                          {detail.memoryKb && (
                            <div className="flex items-center gap-1">
                              <Icon icon="mdi:memory" width="14" />
                              <span>{detail.memoryKb} KB</span>
                            </div>
                          )}
                        </div>
                      )}
                      {detail.weight !== undefined && (
                        <div className="font-bold text-sm">
                          {detail.weight || 0} {t("autoEvaluation.points")}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Output Display */}
                  {isExpanded && hasOutput && (
                    <div className="mt-3 space-y-3">
                      {/* Expected vs Actual Output */}
                      {(detail.expected !== undefined ||
                        detail.actual !== undefined) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Expected Output */}
                          {detail.expected !== undefined && (
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
                                {detail.expected || "N/A"}
                              </div>
                            </div>
                          )}
                          {/* Actual Output */}
                          {detail.actual !== undefined && (
                            <div className="bg-white border border-gray-200 rounded-[5px] p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Icon
                                  icon={isPassed ? "mdi:check" : "mdi:close"}
                                  width="16"
                                  className={
                                    isPassed ? "text-green-600" : "text-red-600"
                                  }
                                />
                                <span className="text-xs font-semibold text-[#7A7574] uppercase">
                                  {t("autoEvaluation.yourActualOutput")}
                                </span>
                              </div>
                              <div
                                className={`rounded p-2 font-mono text-sm break-words whitespace-pre-wrap ${
                                  isPassed
                                    ? "bg-[#f9fafb] text-[#2d3748]"
                                    : "bg-red-50 text-red-800"
                                }`}
                              >
                                {detail.actual || "N/A"}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Stdout */}
                      {detail.stdout && (
                        <div className="bg-white border border-gray-200 rounded-[5px] p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon
                              icon="mdi:console"
                              width="16"
                              className="text-blue-600"
                            />
                            <span className="text-xs font-semibold text-[#7A7574] uppercase">
                              Standard Output
                            </span>
                          </div>
                          <div className="bg-[#f9fafb] rounded p-2 font-mono text-sm text-[#2d3748] break-words whitespace-pre-wrap">
                            {detail.stdout}
                          </div>
                        </div>
                      )}

                      {/* Stderr */}
                      {detail.stderr && (
                        <div className="bg-white border border-red-200 rounded-[5px] p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon
                              icon="mdi:alert-circle"
                              width="16"
                              className="text-red-600"
                            />
                            <span className="text-xs font-semibold text-red-600 uppercase">
                              Standard Error
                            </span>
                          </div>
                          <div className="bg-red-50 rounded p-2 font-mono text-sm text-red-800 break-words whitespace-pre-wrap">
                            {detail.stderr}
                          </div>
                        </div>
                      )}

                      {/* Compile Output */}
                      {detail.compileOutput && (
                        <div className="bg-white border border-orange-200 rounded-[5px] p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon
                              icon="mdi:code-braces"
                              width="16"
                              className="text-orange-600"
                            />
                            <span className="text-xs font-semibold text-orange-600 uppercase">
                              Compile Output
                            </span>
                          </div>
                          <div className="bg-orange-50 rounded p-2 font-mono text-sm text-orange-800 break-words whitespace-pre-wrap">
                            {detail.compileOutput}
                          </div>
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
