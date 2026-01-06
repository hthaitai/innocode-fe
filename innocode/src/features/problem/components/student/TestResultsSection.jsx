import React, { useState } from "react"
import { Icon } from "@iconify/react"

/**
 * Component hiển thị test results
 */
const TestResultsSection = ({ testResult, isLoading }) => {
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
          Test Results
        </h2>
        <div className="text-center py-8">
          <Icon
            icon="mdi:loading"
            width="48"
            className="mx-auto mb-2 text-[#ff6b35] animate-spin"
          />
          <p className="text-[#7A7574]">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!testResult) {
    return (
      <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6">
        <h2 className="text-lg font-semibold text-[#2d3748] mb-4">
          Test Results
        </h2>
        <div className="text-center py-8 text-[#7A7574]">
          <Icon
            icon="mdi:test-tube"
            width="48"
            className="mx-auto mb-2 opacity-50"
          />
          <p>Run your code to see test results</p>
        </div>
      </div>
    )
  }

  const passedCount =
    testResult.details?.filter(
      (d) => d.note === "success" || d.status === "success"
    ).length || 0

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6 mt-4">
      <h2 className="text-lg font-semibold text-[#2d3748] mb-4">
        Test Results
      </h2>

      <div className="space-y-4">
        {/* Summary */}
        <div className="bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-xs text-[#7A7574] mb-1">Total Test Cases</p>
              <p className="text-xl font-bold text-[#2d3748]">
                {testResult.details?.length || 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[#7A7574] mb-1">Passed</p>
              <p className="text-xl font-bold text-green-600">{passedCount}</p>
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
            {testResult.details.map((detail, index) => {
              const caseId = detail.detailsId || detail.id || index
              const isExpanded = expandedCases.has(caseId)
              const hasOutput =
                detail.actual !== undefined || detail.expected !== undefined

              return (
                <div
                  key={caseId}
                  className={`border rounded-[5px] p-4 ${
                    detail.note === "success" || detail.status === "success"
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
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
                        Test Case {index + 1}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          detail.note === "success" ||
                          detail.status === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {detail.note || detail.status || detail.judge0Status}
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
                      <div className="font-bold text-sm">
                        {detail.weight || 0} Pointssss
                      </div>
                    </div>
                  </div>

                  {/* Actual and Expected Output - only show when expanded */}
                  {isExpanded && hasOutput && (
                    <div className="mt-3 space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Actual Output */}
                        {detail.actual !== undefined && (
                          <div className="bg-white border border-gray-200 rounded-[5px] p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Icon
                                icon="mdi:code-json"
                                width="16"
                                className={
                                  detail.status === "success" ||
                                  detail.note === "success"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              />
                              <span className="text-xs font-semibold text-[#7A7574] uppercase">
                                Your Actual Output
                              </span>
                            </div>
                            <div
                              className={`rounded p-2 font-mono text-sm break-words ${
                                detail.status === "success" ||
                                detail.note === "success"
                                  ? "bg-green-50 text-green-800"
                                  : "bg-red-50 text-red-800"
                              }`}
                            >
                              {detail.actual || "N/A"}
                            </div>
                          </div>
                        )}
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
                                Expected Output
                              </span>
                            </div>
                            <div className="bg-[#f9fafb] rounded p-2 font-mono text-sm text-[#2d3748] break-words">
                              {detail.expected || "N/A"}
                            </div>
                          </div>
                        )}
                      </div>
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
              Submission Info
            </h3>
            <div className="space-y-1 text-sm">
              <p className="text-[#4a5568]">
                <span className="font-medium">Team:</span> {testResult.teamName}
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
    </div>
  )
}

export default TestResultsSection
