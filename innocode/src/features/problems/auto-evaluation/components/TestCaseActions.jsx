import React from "react"

const TestCaseActions = ({ onCreate, openModal, roundId, isLoading }) => {
  return (
    <div className="px-5 min-h-[70px] flex justify-between items-center">
      <p className="text-sm leading-5 font-medium">Test case management</p>

      <div className="flex gap-2">
        {/* Upload CSV */}
        <button
          className="button-orange"
          onClick={() => openModal("testCaseCsv", { roundId })}
        >
          Upload CSV
        </button>

        {/* Add Test Case */}
        <button
          className="button-white"
          onClick={onCreate}
          disabled={isLoading}
        >
          Add test case
        </button>
      </div>
    </div>
  )
}

export default TestCaseActions
