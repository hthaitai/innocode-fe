import React from "react"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import DropdownFluent from "@/shared/components/DropdownFluent"
import { AnimatePresence, motion } from "framer-motion"

export default function SchoolForm({
  formData,
  setFormData,
  errors = {},
  setErrors,
  provinces = [],
}) {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear field-specific error when typing
    if (errors?.[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelect = (value, field) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear dropdown error when selecting
    if (errors?.[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* School Name */}
      <TextFieldFluent
        label="School Name"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        error={!!errors?.name}
        helperText={errors?.name}
      />

      {/* Province Dropdown */}
      <DropdownFluent
        label="Province"
        placeholder="Select a province"
        value={formData.province_id}
        options={provinces.map((p) => ({
          value: p.province_id,
          label: p.name,
        }))}
        onChange={(value) => handleSelect(value, "province_id")}
        error={!!errors?.province_id}
        helperText={errors?.province_id}
      />

      {/* Contact Email */}
      <TextFieldFluent
        label="Contact Email"
        name="contact"
        value={formData.contact || ""}
        onChange={handleChange}
        error={!!errors?.contact}
        helperText={errors?.contact}
      />
    </div>
  )
}
