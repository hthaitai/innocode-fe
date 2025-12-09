import React, { useState, useEffect, useMemo, useCallback } from "react"
import BaseModal from "@/shared/components/BaseModal"
import { validateSchool } from "@/shared/validators/schoolValidator"
import SchoolForm from "./SchoolForm"


export default function SchoolModal({
  isOpen,
  mode = "create",
  initialData = {},
  provinces = [],
  onSubmit,
  onClose,
}) {
  const emptyData = useMemo(() => ({
    name: "",
    province_id: "",
    contact: "",
  }), [])

  const [formData, setFormData] = useState(emptyData)
  const [errors, setErrors] = useState({})

  // Reset form when modal opens or mode/data changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit") {
        // Convert provinceId to province_id for form compatibility
        const editData = {
          ...initialData,
          province_id: initialData.provinceId || initialData.province_id,
        };
        setFormData(editData);
      } else {
        setFormData(emptyData);
      }
      setErrors({});
    }
  }, [isOpen, mode, initialData, emptyData])

  // Validate and submit
  const handleSubmit = useCallback(async () => {
    const validationErrors = validateSchool(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      // Prepare data for API - use provinceId if available, otherwise province_id
      const submitData = {
        ...formData,
        provinceId: formData.provinceId || formData.province_id,
      };
      // Remove province_id if provinceId exists to avoid confusion
      if (submitData.provinceId) {
        delete submitData.province_id;
      }
      await onSubmit(submitData, mode)
      onClose()
    }
  }, [formData, mode, onSubmit, onClose])

  // Memoize title and footer to prevent unnecessary re-renders
  const title = useMemo(() => 
    mode === "edit"
      ? `Edit School: ${initialData.name || ""}`
      : "Create New School",
    [mode, initialData.name]
  )

  const footer = useMemo(() => (
    <div className="flex justify-end gap-2">
      <button type="button" className="button-white" onClick={onClose}>
        Cancel
      </button>
      <button type="button" className="button-orange" onClick={handleSubmit}>
        {mode === "edit" ? "Save Changes" : "Create"}
      </button>
    </div>
  ), [mode, onClose, handleSubmit])

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      footer={footer}
    >
      <SchoolForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        provinces={provinces}
      />
    </BaseModal>
  )
}
