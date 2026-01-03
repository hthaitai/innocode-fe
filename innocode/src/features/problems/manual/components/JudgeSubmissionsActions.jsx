import React from "react"
import DropdownFluent from "../../../../shared/components/DropdownFluent"

const JudgeSubmissionsActions = ({ statusFilter, setStatusFilter }) => {
  return (
    <div className="flex justify-end mb-3">
      <div className="min-w-[130px] w-max">
        <DropdownFluent
          id="statusFilterDropdown"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "Pending", label: "Pending" },
            { value: "Finished", label: "Finished" },
            { value: "Cancelled", label: "Cancelled" },
            { value: "PlagiarismConfirmed", label: "Plagiarism confirmed" },
            { value: "PlagiarismSuspected", label: "Plagiarism suspected" },
          ]}
        />
      </div>
    </div>
  )
}

export default JudgeSubmissionsActions
