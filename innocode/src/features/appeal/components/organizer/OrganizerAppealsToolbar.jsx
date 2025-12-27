import React from "react"
import DropdownFluent from "../../../../shared/components/DropdownFluent"

const OrganizerAppealsToolbar = ({ decisionFilter, setDecisionFilter }) => {
  return (
    <div className="flex items-center justify-end gap-2 mb-3">
      <div className="max-w-[364px] w-max">
        <DropdownFluent
          id="decisionFilterDropdown"
          value={decisionFilter}
          onChange={setDecisionFilter}
          options={[
            { value: "Pending", label: "Pending" },
            { value: "Approved", label: "Approved" },
            { value: "Rejected", label: "Rejected" },
          ]}
        />
      </div>
    </div>
  )
}

export default OrganizerAppealsToolbar
