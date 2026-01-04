import React from "react"
import { useTranslation } from "react-i18next"
import { formatDateTime } from "@/shared/utils/dateTime"

const RoundDateInfo = ({ contest }) => {
  const { t } = useTranslation("round")
  if (!contest) return null

  const contestStart = formatDateTime(contest.start)
  const contestEnd = formatDateTime(contest.end)

  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-4 mb-5">
        <div>
          <div className="font-medium text-[40px] leading-[52px]">
            {t("contestPeriod")}
          </div>
          <div className="text-xs leading-4 text-[#7A7574] mt-[2px]">
            {contestStart} → {contestEnd}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoundDateInfo
