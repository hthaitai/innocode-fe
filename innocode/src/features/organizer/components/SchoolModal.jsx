import React, { useState, useEffect } from "react"
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
  const emptyData = {
    name: "",
    province_id: "",
    contact: "",
  }

  const [formData, setFormData] = useState(emptyData)
  const [errors, setErrors] = useState({})

  // Reset form when modal opens or mode/data changes
  useEffect(() => {
    if (isOpen) {
      setFormData(mode === "edit" ? initialData : emptyData)
      setErrors({})
    }
  }, [isOpen, mode, initialData])

  // Validate and submit
  const handleSubmit = async () => {
    const validationErrors = validateSchool(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      await onSubmit(formData, mode)
      onClose()
    }
  }

  // Dynamic title + footer
  const title =
    mode === "edit"
      ? `Edit School: ${initialData.name || ""}`
      : "Create New School"

  const footer = (
    <div className="flex justify-end gap-2">
      <button type="button" className="button-white" onClick={onClose}>
        Cancel
      </button>
      <button type="button" className="button-orange" onClick={handleSubmit}>
        {mode === "edit" ? "Save Changes" : "Create"}
      </button>
    </div>
  )

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
        provinces={provinces}
      />
    </BaseModal>
  )
}
