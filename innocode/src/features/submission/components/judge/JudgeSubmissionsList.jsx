import React from "react"
import { FileText, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import StatusBadge from "@/shared/components/StatusBadge"

const JudgeSubmissionsList = ({ contestId, roundId, submissions }) => {
  const navigate = useNavigate()
  const { t } = useTranslation("judge")

  if (!submissions || submissions.length === 0) {
    return (
      <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
        {t("manualSubmissions.empty")}
      </div>
    )
  }

  return (
    <ul className="space-y-1">
      {submissions.map((submission, index) => {
        const submissionNumber = index + 1
        const submissionText = t("manualSubmissions.table.submission")

        // Calculate score
        const results = submission.criterionResults || []
        const totalScore = results.reduce((acc, r) => acc + (r.score || 0), 0)
        const maxScore = results.reduce((acc, r) => acc + (r.maxScore || 0), 0)

        return (
          <div
            key={submission.submissionId}
            className="cursor-pointer hover:bg-[#F6F6F6] transition-colors border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]"
            onClick={() =>
              navigate(
                `/judge/contests/${contestId}/rounds/${roundId}/submissions/${submission.submissionId}/evaluation`,
              )
            }
          >
            <div className="flex gap-5 items-center flex-1">
              <FileText size={20} />
              <div>
                <p className="text-[14px] leading-[20px]">
                  {submissionText} {submissionNumber}
                </p>
                <p className="text-[12px] leading-[16px] text-[#7A7574]">
                  {t("manualSubmissions.table.score")}: {totalScore} /{" "}
                  {maxScore}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {submission.status && (
                <StatusBadge status={submission.status} translate="judge" />
              )}

              <div className="flex items-center gap-2">
                <ChevronRight
                  size={20}
                  className="text-[#7A7574] cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(
                      `/judge/contests/${contestId}/rounds/${roundId}/submissions/${submission.submissionId}/evaluation`,
                    )
                  }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </ul>
  )
}

export default JudgeSubmissionsList
