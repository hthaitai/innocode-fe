import React from "react"
import { Calendar, ChevronRight } from "lucide-react"
import { formatDateTime, toDatetimeLocal } from "@/shared/utils/dateTime"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import StatusBadge from "@/shared/components/StatusBadge"

const RoundsList = ({ contestId, rounds, disableNavigation = false }) => {
  const navigate = useNavigate()
  const { t } = useTranslation(["pages", "round"])

  if (!rounds || rounds.length === 0) {
    return (
      <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
        {t("organizerContestDetail.rounds.empty")}
      </div>
    )
  }

  return (
    <ul className="space-y-1">
      {rounds.map((round) => (
        <div
          key={round.roundId}
          className={`${
            disableNavigation
              ? ""
              : "cursor-pointer hover:bg-[#F6F6F6] transition-colors"
          } border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]`}
          onClick={() =>
            !disableNavigation &&
            navigate(`/organizer/contests/${contestId}/rounds/${round.roundId}`)
          }
        >
          <div className="flex gap-5 items-center flex-1">
            <Calendar size={20} />
            <div>
              <p className="text-[14px] leading-[20px]">
                {round.name ?? t("organizerContestDetail.rounds.untitled")}
              </p>
              <p className="text-[12px] leading-[16px] text-[#7A7574]">
                {formatDateTime(round.start)} - {formatDateTime(round.end)} |{" "}
                {t(`round:info.problemTypes.${round.problemType}`) ||
                  round.problemType ||
                  "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div>
              {round.isRetakeRound && (
                <span className="text-xs px-2 py-0.5 rounded bg-orange-100 text-orange-700">
                  {t("organizerContestDetail.rounds.retake")}
                </span>
              )}
            </div>

            {round.status && (
              <StatusBadge status={round.status} translate="round" />
            )}

            {!disableNavigation && (
              <div className="flex items-center gap-2">
                <ChevronRight
                  size={20}
                  className="text-[#7A7574] cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(
                      `/organizer/contests/${contestId}/rounds/${round.roundId}`,
                    )
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </ul>
  )
}

export default RoundsList
