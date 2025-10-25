import React, { useState, useEffect } from "react"
import BaseModal from "../../../BaseModal"
import { validateProblem } from "../../../../utils/validationSchemas"
import ProblemForm from "../forms/ProblemForm"

export default function ProblemModal({
  isOpen,
  mode = "create", // "create" or "edit"
  initialData = {},
  onSubmit,
  onClose,
}) {
  const emptyData = {
    title: "",
    language: "python3",
    type: "manual",
    penalty_rate: "",
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

  // --- Submit handler ---
  const handleSubmit = async () => {
    const validationErrors = validateProblem(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      await onSubmit(formData, mode)
      onClose()
    }
  }

  // --- Modal UI ---
  const title =
    mode === "edit"
      ? `Edit Problem: ${initialData.title || `#${initialData.problem_id}`}`
      : "Create New Problem"

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
      size="lg"
      footer={footer}
    >
      <ProblemForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
      />
    </BaseModal>
  )
}
