import React, { useState, useEffect } from "react"
import BaseModal from "@/shared/components/BaseModal"
import RoundForm from "./RoundForm"
import { validateRound } from "@/shared/validators/roundValidator"
import { formatForInput } from '@/shared/utils/formatForInput'

export default function RoundModal({
  isOpen,
  mode = "create", // "create" or "edit"
  initialData = {},
  onSubmit,
  onClose,
}) {
  const emptyData = {
    name: "",
    start: "",
    end: "",
  }

  const [formData, setFormData] = useState(emptyData)
  const [errors, setErrors] = useState({})

  // --- Helper functions ---
  const toISO = (val) => (val ? new Date(val).toISOString() : null)

  // --- Reset form when modal opens ---
  useEffect(() => {
    if (isOpen) {
      const data = mode === "edit" ? initialData : emptyData
      setFormData({
        ...data,
        start: formatForInput(data.start),
        end: formatForInput(data.end),
      })
      setErrors({})
    }
  }, [isOpen, mode, initialData])

  // --- Submit handler ---
  const handleSubmit = async () => {
    const validationErrors = validateRound(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      const submitData = {
        ...formData,
        start: toISO(formData.start),
        end: toISO(formData.end),
      }
      await onSubmit(submitData, mode)
      onClose()
    }
  }

  // --- Modal UI ---
  const title =
    mode === "edit"
      ? `Edit Round: ${initialData.name || ""}`
      : "Create New Round"

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
      <RoundForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
      />
    </BaseModal>
  )
}
