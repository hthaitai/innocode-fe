import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, X } from "lucide-react"
import TextFieldFluent from "../../../../shared/components/TextFieldFluent"
import { useModal } from "../../../../shared/hooks/useModal"

const ContestsToolbar = ({ onSearch, onFilter }) => {
  const navigate = useNavigate()
  const { openModal } = useModal()
  const [search, setSearch] = useState("")

  const handleAddContest = () => {
    navigate("/organizer/contests/add")
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      if (onSearch) onSearch(search) // Trigger search only on Enter
    }
  }

  const handleClearSearch = () => {
    setSearch("")
    if (onSearch) onSearch("")
  }

  const handleFilterClick = () => {
    openModal("contestFilter")
    if (onFilter) onFilter()
  }

  return (
    <div className="flex justify-between items-center mb-3">
      {/* Left section: search + filter */}
      <div className="flex items-center space-x-2">
        <div className="w-[280px]">
          <TextFieldFluent
            placeholder="Search contests..."
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

        {/* <button
          type="button"
          className="button-white"
          onClick={handleFilterClick}
        >
          Filter
        </button> */}
      </div>

      {/* Right section: add contest */}
      <button className="button-orange" onClick={handleAddContest}>
        Add contest
      </button>
    </div>
  )
}

export default ContestsToolbar
