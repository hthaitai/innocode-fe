import React from "react"

const TestCaseToolbar = ({ onUploadCsv, onCreate }) => {
  return (
    <div className="flex justify-end items-center mb-3">
      <div className="flex gap-2">
        {/* Upload CSV */}
        <button className="button-orange" onClick={onUploadCsv}>
          Upload CSV
        </button>

        {/* Add Test Case */}
        <button className="button-white" onClick={onCreate}>
          Add test case
        </button>
      </div>
    </div>
  )
}

export default TestCaseToolbar
