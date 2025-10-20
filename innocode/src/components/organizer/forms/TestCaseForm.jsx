import React from "react"
import { TextField } from "@mui/material"
import DropdownFluent from "../../DropdownFluent"

const types = [
  { value: "public", label: "Public" },
  { value: "hidden", label: "Hidden" },
]

export default function TestCaseForm({ formData, setFormData, errors = {} }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelect = (value, field) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Description */}
      <div className="flex flex-col">
        <TextField
          label="Description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          error={!!errors.description}
          helperText={errors.description || ""}
        />
      </div>

      {/* Type (DropdownFluent) */}
      <div className="flex flex-col">
        <DropdownFluent
          label="Type"
          value={formData.type}
          placeholder="Select type"
          options={types}
          onChange={(value) => handleSelect(value, "type")}
        />
        {errors.type && (
          <span className="text-red-500 text-xs">{errors.type}</span>
        )}
      </div>

      {/* Weight */}
      <div className="flex flex-col">
        <TextField
          label="Weight"
          name="weight"
          type="number"
          value={formData.weight ?? 1}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          inputProps={{ min: 0.01, step: 0.01 }}
          error={!!errors.weight}
          helperText={errors.weight || ""}
        />
      </div>

      {/* Time Limit */}
      <div className="flex flex-col">
        <TextField
          label="Time Limit (ms)"
          name="time_limit_ms"
          type="number"
          value={formData.time_limit_ms ?? 1000}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          inputProps={{ min: 1 }}
        />
      </div>

      {/* Memory */}
      <div className="flex flex-col">
        <TextField
          label="Memory (KB)"
          name="memory_kb"
          type="number"
          value={formData.memory_kb ?? 65536}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          inputProps={{ min: 1 }}
        />
      </div>
    </div>
  )
}
