import React, { useMemo, useCallback } from "react"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import DropdownFluent from "@/shared/components/DropdownFluent"

export default function SchoolForm({
  formData,
  setFormData,
  errors = {},
  setErrors,
  provinces = [],
}) {
  // Memoize province options to prevent unnecessary re-renders
  const provinceOptions = useMemo(() => {
    return provinces.map((p) => ({
      value: p.provinceId || p.province_id,
      label: p.provinceName || p.name,
    }))
  }, [provinces])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear field-specific error when typing
    if (errors?.[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }, [errors, setFormData, setErrors])

  const handleProvinceSelect = useCallback((value) => {
    setFormData((prev) => ({ 
      ...prev, 
      province_id: value,
      provinceId: value 
    }))

    // Clear dropdown error when selecting
    if (errors?.province_id) {
      setErrors((prev) => ({ ...prev, province_id: "" }))
    }
  }, [errors, setFormData, setErrors])

  const currentProvinceValue = formData.province_id || formData.provinceId

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
        value={currentProvinceValue}
        options={provinceOptions}
        onChange={handleProvinceSelect}
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
