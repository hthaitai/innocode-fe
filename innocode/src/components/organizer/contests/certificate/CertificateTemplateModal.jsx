import React, { useState, useEffect } from "react"
import CertificateTemplateForm from "./CertificateTemplateForm"
import BaseModal from "../../../BaseModal"
import { validateCertificateTemplate } from "../../../../validators/certificateTemplateValidator"

export default function CertificateTemplateModal({
  isOpen,
  mode = "create",
  initialData = {},
  onSubmit,
  onClose,
  contestId, // optional, if you want to link template to contest directly
}) {
  const emptyData = {
    name: "",
    file_url: "",
    contest_id: contestId || null,
  }

  const [formData, setFormData] = useState(emptyData)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      setFormData(mode === "edit" ? initialData : emptyData)
      setErrors({})
    }
  }, [isOpen, mode, initialData])

  const handleSubmit = async () => {
    const validationErrors = validateCertificateTemplate(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      await onSubmit(formData, mode)
      onClose()
    }
  }

  const title =
    mode === "edit"
      ? `Edit Template: ${initialData.name || ""}`
      : "Create Certificate Template"

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
      <CertificateTemplateForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
      />
    </BaseModal>
  )
}
