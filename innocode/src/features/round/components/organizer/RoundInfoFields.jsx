import React from "react"
import TextFieldFluent from "../../../../shared/components/TextFieldFluent"

const RoundInfoFields = ({ formData, errors, handleChange }) => {
  return (
    <>
      <TextFieldFluent
        label="Round Name"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
      />
      <TextFieldFluent
        label="Start"
        name="start"
        type="datetime-local"
        value={formData.start || ""}
        onChange={handleChange}
        error={!!errors.start}
        helperText={errors.start}
      />
      <TextFieldFluent
        label="End"
        name="end"
        type="datetime-local"
        value={formData.end || ""}
        onChange={handleChange}
        error={!!errors.end}
        helperText={errors.end}
      />
    </>
  )
}

export default RoundInfoFields
