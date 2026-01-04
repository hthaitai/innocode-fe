import React from "react"
import { ListCheck } from "lucide-react"
import { useTranslation } from "react-i18next"

const ManualResultRubricScores = ({ criteriaScores }) => {
  const { t } = useTranslation("common")

  return (
    <div className="space-y-1">
      {!criteriaScores || criteriaScores.length === 0 ? (
        <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
          {t("common.noRubricScoresAvailable")}
        </div>
      ) : (
        criteriaScores.map((criterion, index) => (
          <div
            key={criterion.rubricId || index}
            className="text-sm leading-5 flex justify-between items-center px-5 min-h-[70px] border border-[#E5E5E5] rounded-[5px] bg-white"
          >
            <div className="flex items-center gap-5">
              <ListCheck size={20} />
              <span>{criterion.description || t("common.criterion")}</span>
            </div>

            <div>
              {criterion.score ?? 0} / {criterion.maxScore ?? 0}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default ManualResultRubricScores
