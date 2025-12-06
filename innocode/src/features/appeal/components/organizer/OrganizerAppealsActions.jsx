import React from "react"
import DropdownFluent from "../../../../shared/components/DropdownFluent"

const OrganizerAppealsActions = ({
  stateFilter,
  setStateFilter,
  decisionFilter,
  setDecisionFilter,
}) => {
  return (
    <div className="flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-center min-h-[70px] px-5 border-b border-[#E5E5E5]">
        <p className="text-[14px] leading-[20px] font-medium">Appeals</p>
      </div>

      {/* Filters Section */}
      <div className="flex justify-end items-center min-h-[70px] px-5 gap-4">
        {/* State Filter */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="stateFilterDropdown"
            className="whitespace-nowrap text-sm leading-5 text-[#7A7574]"
          >
            Filter by state:
          </label>
          <DropdownFluent
            id="stateFilterDropdown"
            value={stateFilter}
            onChange={setStateFilter}
            options={[
              { value: "Opened", label: "Opened" },
              { value: "Closed", label: "Closed" },
            ]}
          />
        </div>

        {/* Decision Filter */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="decisionFilterDropdown"
            className="whitespace-nowrap text-sm leading-5 text-[#7A7574]"
          >
            Filter by decision:
          </label>
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
    </div>
  )
}

export default OrganizerAppealsActions
