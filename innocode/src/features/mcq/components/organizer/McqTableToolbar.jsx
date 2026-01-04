import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"

const McqTableToolbar = () => {
  const { t } = useTranslation("common")
  const navigate = useNavigate()
  const { contestId, roundId } = useParams()

  return (
    <div className="flex justify-end items-center mb-3">
      <button
        className="button-orange"
        onClick={() =>
          navigate(
            `/organizer/contests/${contestId}/rounds/${roundId}/mcqs/new`
          )
        }
      >
        {t("common.addQuestions")}
      </button>
    </div>
  )
}

export default McqTableToolbar
