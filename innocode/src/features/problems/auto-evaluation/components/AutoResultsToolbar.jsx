import React, { useState } from "react"
import { Search, X } from "lucide-react"
import TextFieldFluent from "../../../../shared/components/TextFieldFluent"

const AutoResultsToolbar = ({ onSearch }) => {
  const [search, setSearch] = useState("")

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      if (onSearch) onSearch({ studentName: search, teamName: search })
    }
  }

  const handleClearSearch = () => {
    setSearch("")
    if (onSearch) onSearch({ studentName: "", teamName: "" })
  }

  return (
    <div className="flex justify-between items-center mb-3">
      {/* Left section: search + filter */}
      <div className="flex items-center space-x-2">
        <div className="w-[280px]">
          <TextFieldFluent
            placeholder="Search student or team name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            startIcon={<Search className="text-[#7A7574] w-4 h-4" />}
            endButton={
              search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="text-[#7A7574] p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )
            }
          />
        </div>
      </div>
    </div>
  )
}

export default AutoResultsToolbar

