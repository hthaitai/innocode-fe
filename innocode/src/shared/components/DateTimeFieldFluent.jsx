// DateTimeFieldFluent.jsx
import React from "react"
import TextFieldFluent from "@/shared/components/TextFieldFluent"

const DateTimeFieldFluent = ({ label, name, value, onChange, error, helperText }) => {
  return (
    <TextFieldFluent
      label={label}
      name={name}
      type="datetime-local"
      value={value || ""}
      onChange={onChange}
      error={!!error}
      helperText={helperText}
    />
  )
}

export default DateTimeFieldFluent
