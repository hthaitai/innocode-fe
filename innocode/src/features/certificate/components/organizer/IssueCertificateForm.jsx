import React from "react"
import DropdownFluent from "@/shared/components/DropdownFluent"

export default function IssueCertificateForm({ formData, setFormData, errors = {}, teams = [] }) {
  const handleSelect = (value) => {
    setFormData({ team_id: value })
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Team Selection */}
      <div className="flex flex-col">
        <DropdownFluent
          label="Select Team"
          value={formData.team_id}
          placeholder="Select a team"
          options={teams.map((t) => ({ value: t.team_id, label: t.name }))}
          onChange={handleSelect}
        />
        {errors.team && (
          <span className="text-red-500 text-xs">{errors.team}</span>
        )}
      </div>
    </div>
  )
}
