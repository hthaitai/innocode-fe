import React, { useState, useEffect } from "react"
import BaseModal from "@/shared/components/BaseModal"
import TestCaseForm from "./TestCaseForm"
import { validateTestCase } from "@/shared/validators/testCaseValidator"

export default function TestCaseModal({
  isOpen,
  mode = "create", // "create" or "edit"
  initialData = {},
  onSubmit,
  onClose,
}) {
  const emptyData = {
    description: "",
    type: "public",
    weight: 1,
    time_limit_ms: 1000,
    memory_kb: 65536,
  }

  const [formData, setFormData] = useState(emptyData)
  const [errors, setErrors] = useState({})

  // --- Reset form whenever modal opens ---
  useEffect(() => {
    if (isOpen) {
      const data = mode === "edit" ? initialData : emptyData
      setFormData({ ...emptyData, ...data }) // merge defaults + incoming data
      setErrors({})
    }
  }, [isOpen, mode, initialData])

  // --- Submit handler ---
  const handleSubmit = async () => {
    const validationErrors = validateTestCase(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      await onSubmit(formData, mode)
      onClose()
    }
  }

  // --- Modal UI ---
  const title =
    mode === "edit"
      ? `Edit Test Case: ${initialData.description || ""}`
      : "Create New Test Case"

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
      <TestCaseForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
      />
    </BaseModal>
  )
}
