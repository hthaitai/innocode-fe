import React from "react"

const RubricActions = ({
  openModal,
  roundId,
  criteria,
  totalMaxScore,
  savingRubric,
}) => {
  return (
    <div className="px-5 min-h-[70px] flex justify-between items-center">
      <div>
        <p className="text-sm leading-5 font-medium">Rubric</p>
        {criteria.length > 0 && (
          <p className="text-[12px] leading-[16px] text-[#7A7574]">
            Total Max Score: <span>{totalMaxScore}</span>
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          className="button-orange"
          onClick={() => openModal("rubricCsv", { roundId })}
        >
          Upload CSV
        </button>

        <button
          className="button-white"
          onClick={() => openModal("rubric", { roundId, criteria })}
          disabled={savingRubric}
        >
          Add Criterion
        </button>
      </div>
    </div>
  )
}

export default RubricActions
