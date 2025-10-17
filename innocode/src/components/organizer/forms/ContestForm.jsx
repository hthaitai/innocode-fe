// ContestForm.jsx
import React from "react";
import { TextField } from "@mui/material";
import DropdownFluent from "../../DropdownFluent";

const ORANGE = "#E05307";
const LIGHT_GRAY = "#E5E5E5";
const TEXT_GRAY = "#7A7574";

const customBorders = (focusColor = ORANGE) => ({
  "& label": { color: TEXT_GRAY, fontSize: 14 },
  "& label.Mui-focused": { color: focusColor },
  "& .MuiOutlinedInput-root": {
    fontSize: 14,
    backgroundColor: "#fff",
    borderRadius: "5px",
    "& fieldset": { border: `1px solid ${LIGHT_GRAY}`, borderRadius: "5px" },
    "&:hover fieldset": { borderColor: LIGHT_GRAY },
    "&.Mui-focused fieldset": { borderColor: focusColor },
  },
});

const ContestForm = ({ formData, onChange, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
      <TextField
        label="Year"
        name="year"
        type="number"
        value={formData.year}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        sx={customBorders()}
        error={!!errors.year}
        helperText={errors.year}
      />
      <TextField
        label="Contest Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        sx={customBorders()}
        error={!!errors.name}
        helperText={errors.name}
      />
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        sx={customBorders()}
        error={!!errors.description}
        helperText={errors.description}
      />
      <TextField
        label="Image URL"
        name="img_url"
        value={formData.img_url}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        sx={customBorders()}
      />
      <DropdownFluent
        label="Status"
        value={formData.status}
        onChange={(val) => onChange({ ...formData, status: val })}
        placeholder="Select status"
        options={[
          { label: "Draft", value: "draft" },
          { label: "Published", value: "published" },
          { label: "Finalized", value: "finalized" },
        ]}
      />
    </form>
  );
};

export default ContestForm;
