import React from "react"
import { Icon } from "@iconify/react"
import { useTranslation } from "react-i18next"

/**
 * Component hiển thị problem description
 */
const ProblemDescription = ({ problem, testCase, timeLimitMinutes }) => {
  const { t } = useTranslation("pages")
  if (!problem) return null

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6">
      <h2 className="text-lg font-semibold text-[#2d3748] mb-4">
        {t("autoEvaluation.problemDescription")}
      </h2>
      <div className="text-[#4a5568] space-y-3">
        <p className="whitespace-pre-wrap">{problem.description}</p>

        {/* Sample Test Case */}
        {testCase && (
          <div className="bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-4">
            <h3 className="font-semibold text-[#2d3748] mb-3 text-sm">
              {t("autoEvaluation.sampleTestCase")}
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium mb-1">
                  {t("autoEvaluation.input")}
                </p>
                <pre className="bg-white border border-[#E5E5E5] rounded p-2 text-sm">
                  {testCase.input}
                </pre>
              </div>
              <div>
                <p className="text-xs font-medium mb-1">
                  {t("autoEvaluation.expectedOutput")}
                </p>
                <pre className="bg-white border border-[#E5E5E5] rounded p-2 text-sm">
                  {testCase.expectedOutput}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Problem Details */}
        <div className="bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-4">
          <h3 className="font-semibold text-[#2d3748] mb-2 text-sm">
            {t("autoEvaluation.problemDetails")}
          </h3>
          <div className="flex gap-2">
            <Icon width="30" icon="mdi:alert" className="text-[#7A7574]" />
            <span
              className="text-[#7A7574]"
              dangerouslySetInnerHTML={{
                __html: t("autoEvaluation.penaltyNotice", {
                  rate: (problem.penaltyRate * 100).toFixed(0),
                }),
              }}
            />
          </div>
        </div>

        {/* Constraints */}
        <div className="space-y-2">
          <h3 className="font-semibold text-[#2d3748] text-sm">
            {t("autoEvaluation.constraints")}
          </h3>
          <ul className="text-sm text-[#4a5568] space-y-1 list-disc list-inside">
            <li>
              {t("autoEvaluation.timeLimit", { minutes: timeLimitMinutes })}
            </li>
            <li>{t("autoEvaluation.memoryLimit")}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ProblemDescription
