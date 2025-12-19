import React from "react"
import DropdownFluent from "../../../../shared/components/DropdownFluent"

const OrganizerAppealsActions = ({ decisionFilter, setDecisionFilter }) => {
  return (
    <div className="flex items-center justify-end gap-2 mb-3">
      <label
        htmlFor="decisionFilterDropdown"
        className="whitespace-nowrap text-sm leading-5 text-[#7A7574]"
      >
        Filter by decision:
      </label>

      <div className="w-[130px]">
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

export default OrganizerAppealsActions
