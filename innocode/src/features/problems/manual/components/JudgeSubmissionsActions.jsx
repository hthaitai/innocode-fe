import React from "react"
import DropdownFluent from "../../../../shared/components/DropdownFluent"

const JudgeSubmissionsActions = ({ statusFilter, setStatusFilter }) => {
  return (
    <div className="flex justify-end items-center min-h-[70px] px-5">
      <div className="flex items-center gap-2">
        <label htmlFor="statusFilterDropdown" className="whitespace-nowrap text-sm leading-5 text-[#7A7574]">
          Filter by status:
        </label>
        <DropdownFluent
          id="statusFilterDropdown"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "Pending", label: "Pending" },
            { value: "Finished", label: "Finished" },
            { value: "Cancelled", label: "Cancelled" },
          ]}
        />
      </div>
    </div>
  )
}

export default JudgeSubmissionsActions
