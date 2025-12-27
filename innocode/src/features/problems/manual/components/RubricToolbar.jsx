import React from "react"

const RubricToolbar = ({
  openModal,
  roundId,
  contestId,
  criteria,
  totalMaxScore,
}) => {
  return (
    <div className="flex justify-between items-end mb-3">
      <div>
        <p className="text-sm leading-5 font-medium">
          Total points: <span>{totalMaxScore || 0}</span>
        </p>
      </div>

      <div className="flex gap-2">
        <button
          className="button-orange"
          onClick={() => openModal("rubricCsv", { roundId, contestId })}
        >
          Upload CSV
        </button>

        <button
          className="button-white"
          onClick={() => openModal("rubric", { roundId, contestId, criteria })}
        >
          Add critera
        </button>
      </div>
    </div>
  )
}

export default RubricToolbar
