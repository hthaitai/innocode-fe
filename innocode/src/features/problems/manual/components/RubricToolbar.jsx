import React from "react"
import { useTranslation } from "react-i18next"

const RubricToolbar = ({
  openModal,
  roundId,
  contestId,
  criteria,
  totalMaxScore,
}) => {
  const { t } = useTranslation(["common"])
  return (
    <div className="flex justify-between items-end mb-3">
      <div>
        <p className="text-sm leading-5 font-medium">
          {t("common.totalPoints")}: <span>{totalMaxScore || 0}</span>
        </p>
      </div>

      <div className="flex gap-2">
        <button
          className="button-orange"
          onClick={() => openModal("rubricCsv", { roundId, contestId })}
        >
          {t("common.uploadCsv")}
        </button>

        <button
          className="button-white"
          onClick={() => openModal("rubric", { roundId, contestId, criteria })}
        >
          {t("common.addCriteria")}
        </button>
      </div>
    </div>
  )
}

export default RubricToolbar
