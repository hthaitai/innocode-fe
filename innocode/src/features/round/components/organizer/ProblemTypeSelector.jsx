import React from "react"
import DropdownFluent from "../../../../shared/components/DropdownFluent"

const ProblemTypeSelector = ({ formData, handleChange, errors = {} }) => {
  const options = [
    { value: "McqTest", label: "MCQ" },
    { value: "Problem", label: "Problem" },
  ]

  return (
    <DropdownFluent
      label="Problem Type"
      options={options}
      value={formData.problemType || ""}
      onChange={(val) =>
        handleChange({ target: { name: "problemType", value: val } })
      }
      placeholder="Select type"
      error={!!errors.problemType}
      helperText={errors.problemType}
    />
  )
}

export default ProblemTypeSelector
