import React, { useState } from "react"
import { Search, X } from "lucide-react"
import TextFieldFluent from "../../../../shared/components/TextFieldFluent"
import { useTranslation } from "react-i18next"

const TeamsToolbar = ({ onSearch }) => {
  const [search, setSearch] = useState("")
  const { t } = useTranslation("common")

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      if (onSearch) onSearch(search)
    }
  }

  const handleClearSearch = () => {
    setSearch("")
    if (onSearch) onSearch("")
  }

  // Note: Add Team button is omitted for now as it wasn't in the original page
  // logic, but the structure is here if needed.

  return (
    <div className="flex justify-between items-center mb-3">
      {/* Left section: search */}
      <div className="flex items-center space-x-2">
        <div className="w-[280px]">
          <TextFieldFluent
            placeholder={t("common.search")}
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

export default TeamsToolbar
