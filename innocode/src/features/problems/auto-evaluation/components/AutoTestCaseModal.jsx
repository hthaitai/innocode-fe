import React, { useState, useEffect } from "react"
import BaseModal from "@/shared/components/BaseModal"
import AutoTestCaseForm from "./AutoTestCaseForm"

export default function AutoTestCaseModal({
  isOpen,
  mode = "create",
  initialData = {},
  onSubmit,
  onClose,
}) {
  const emptyData = {
    description: "",
    input: "",
    expectedOutput: "",
    weight: 1,
    timeLimitMs: null,
    memoryKb: null,
  }

  const [formData, setFormData] = useState(emptyData)
  const [errors, setErrors] = useState({})

  // Reset form when modal opens or mode/data changes
  useEffect(() => {
    if (isOpen) {
      const data = mode === "edit" ? initialData : emptyData
      setFormData({
        description: data.description ?? "",
        input: data.input ?? "",
        expectedOutput: data.expectedOutput ?? "",
        weight: data.weight ?? 1,
        timeLimitMs: data.timeLimitMs ?? null,
        memoryKb: data.memoryKb ?? null,
      })
      setErrors({})
    }
  }, [isOpen, mode, initialData])

  // Validate and submit
  const handleSubmit = async () => {
    const newErrors = {}
    if (!formData.description?.trim()) {
      newErrors.description = "Description is required"
    }
    if (!formData.input?.trim()) {
      newErrors.input = "Input is required"
    }
    if (!formData.expectedOutput?.trim()) {
      newErrors.expectedOutput = "Expected output is required"
    }
    if (formData.weight < 0) {
      newErrors.weight = "Weight must be non-negative"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      await onSubmit(formData, mode)
      onClose()
    }
  }

  // Dynamic title + footer
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
      <AutoTestCaseForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
      />
    </BaseModal>
  )
}

