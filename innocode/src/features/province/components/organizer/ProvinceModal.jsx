import React, { useState, useEffect } from "react"
import BaseModal from "@/shared/components/BaseModal"
import { validateProvince } from "@/shared/validators/provinceValidator"
import ProvinceForm from "./ProvinceForm"



export default function ProvinceModal({
  isOpen,
  mode = "create",
  initialData = {},
  onSubmit,
  onClose,
}) {
  const emptyData = {
    name: "",
    address: "",
  }

  const [formData, setFormData] = useState(emptyData)
  const [errors, setErrors] = useState({})

  // Reset form when modal opens or data changes
  useEffect(() => {
    if (isOpen) {
      setFormData(mode === "edit" ? initialData : emptyData)
      setErrors({})
    }
  }, [isOpen, mode, initialData])

  // Validate and submit
  const handleSubmit = async () => {
    const validationErrors = validateProvince(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      await onSubmit(formData, mode)
      onClose()
    }
  }

  // Dynamic title + footer
  const title =
    mode === "edit"
      ? `Edit Province: ${initialData.name || ""}`
      : "Create New Province"

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
      <ProvinceForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
      />
    </BaseModal>
  )
}
