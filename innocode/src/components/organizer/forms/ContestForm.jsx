import React, { useState } from "react";
import { TextField } from "@mui/material";
import DropdownFluent from "../../DropdownFluent";

const ORANGE = "#E05307";
const LIGHT_GRAY = "#E5E5E5";
const TEXT_GRAY = "#7A7574";
const INPUT_TEXT = "#333";

const customBorders = (focusColor = ORANGE) => ({
  "& label": {
    color: TEXT_GRAY,
    fontSize: 14,
  },
  "& label.Mui-focused": {
    color: focusColor,
  },
  "& .MuiOutlinedInput-root": {
    fontSize: 14,
    color: INPUT_TEXT,
    backgroundColor: "#fff",
    borderRadius: "5px",

    "& fieldset": {
      border: `1px solid ${LIGHT_GRAY}`,
      borderRadius: "5px",
      transition: "border-color 0.2s ease",
    },
    "&:hover fieldset": {
      borderColor: LIGHT_GRAY, // no hover color change
    },
    "&.Mui-focused fieldset": {
      borderColor: focusColor,
    },
  },
});

const ContestForm = ({ initialData = {}, onChange }) => {
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    name: "",
    description: "",
    img_url: "",
    status: "draft",
    ...initialData,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    onChange?.(updated);
  };

  return (
    <form className="flex flex-col gap-3">
      <TextField
        label="Year"
        name="year"
        type="number"
        value={formData.year}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        sx={customBorders()}
      />
      <TextField
        label="Contest Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        sx={customBorders()}
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
        onChange={(val) => setFormData({ ...formData, status: val })}
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
