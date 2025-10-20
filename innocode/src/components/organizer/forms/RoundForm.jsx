import React from "react"
import { TextField } from "@mui/material"

const ORANGE = "#E05307"
const LIGHT_GRAY = "#E5E5E5"
const TEXT_GRAY = "#7A7574"
const INPUT_TEXT = "#333"

const customBorders = (focusColor = ORANGE) => ({
  "& label": { color: TEXT_GRAY, fontSize: 14 },
  "& label.Mui-focused": { color: focusColor },
  "& .MuiOutlinedInput-root": {
    fontSize: 14,
    color: INPUT_TEXT,
    backgroundColor: "#fff",
    borderRadius: "5px",
    "& fieldset": { border: `1px solid ${LIGHT_GRAY}`, borderRadius: "5px" },
    "&:hover fieldset": { borderColor: LIGHT_GRAY },
    "&.Mui-focused fieldset": { borderColor: focusColor },
  },
})

export default function RoundForm({ formData, setFormData, errors = {} }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form className="flex flex-col gap-3">
      <TextField
        label="Round Name"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        sx={customBorders()}
        error={!!errors.name}
        helperText={errors.name || ""}
      />

      <TextField
        label="Start"
        name="start"
        type="datetime-local"
        value={formData.start || ""}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        sx={customBorders()}
        error={!!errors.start}
        helperText={errors.start || ""}
      />

      <TextField
        label="End"
        name="end"
        type="datetime-local"
        value={formData.end || ""}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        sx={customBorders()}
        error={!!errors.end}
        helperText={errors.end || ""}
      />
    </form>
  )
}
