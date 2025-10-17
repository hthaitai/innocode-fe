import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";

const ORANGE = "#E05307";
const LIGHT_GRAY = "#E5E5E5";
const TEXT_GRAY = "#7A7574";
const INPUT_TEXT = "#333";

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
});

const RoundForm = ({ initialData = {}, onChange, showErrors = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    start: "",
    end: "",
    ...initialData,
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    start: "",
    end: "",
  });

  // Only validate if showErrors is true
  useEffect(() => {
    if (!showErrors) {
      setFormErrors({});
      onChange?.({ ...formData, isValid: true });
      return;
    }

    const errors = {};
    if (!formData.name.trim()) errors.name = "Round name is required";
    if (!formData.start) errors.start = "Start date/time is required";
    if (!formData.end) errors.end = "End date/time is required";
    else if (formData.start && formData.end < formData.start)
      errors.end = "End must be after Start";

    setFormErrors(errors);
    onChange?.({ ...formData, isValid: Object.keys(errors).length === 0 });
  }, [formData, showErrors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className="flex flex-col gap-3">
      <TextField
        label="Round Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        sx={customBorders()}
        error={showErrors && !!formErrors.name}
        helperText={showErrors ? formErrors.name : ""}
      />
      <TextField
        label="Start"
        name="start"
        type="datetime-local"
        value={formData.start}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        sx={customBorders()}
        error={showErrors && !!formErrors.start}
        helperText={showErrors ? formErrors.start : ""}
      />
      <TextField
        label="End"
        name="end"
        type="datetime-local"
        value={formData.end}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        sx={customBorders()}
        error={showErrors && !!formErrors.end}
        helperText={showErrors ? formErrors.end : ""}
      />
    </form>
  );
};

export default RoundForm;
