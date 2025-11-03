import React, { useState, useEffect } from "react"
import BaseModal from "@/shared/components/BaseModal"
import ContestForm from "./ContestForm"
import { useAppSelector } from "../../../../store/hooks"
import { validateContest } from "../../validators/contestValidator"

export default function ContestModal({
  isOpen,
  mode = "create", // "create" or "edit"
  initialData = {},
  onSubmit,
  onClose,
}) {
  const emptyData = {
    year: "",
    name: "",
    description: "",
    imgUrl: "",
    status: "draft",
  }

  const [formData, setFormData] = useState(emptyData)
  const [errors, setErrors] = useState({})
  const { contests } = useAppSelector((s) => s.contests)

  // Reset form when modal opens or data changes
  useEffect(() => {
    if (isOpen) {
      setFormData(mode === "edit" ? initialData : emptyData)
      setErrors({})
    }
  }, [isOpen, mode, initialData])

  // Validate and submit
  const handleSubmit = async () => {
    const validationErrors = validateContest(formData, contests)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      await onSubmit(
        {
          ...formData,
          year: Number(formData.year),
          start: new Date(formData.start).toISOString(),
          end: new Date(formData.end).toISOString(),
        },
        mode
      )
      onClose()
    }
  }

  // Modal UI
  const title =
    mode === "edit"
      ? `Edit Contest: ${initialData.name || ""}`
      : "Create New Contest"

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
      <ContestForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
      />
    </BaseModal>
  )
}
