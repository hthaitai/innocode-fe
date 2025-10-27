import React, { useState, useEffect } from "react"


import BaseModal from "../../../BaseModal"
import TeamForm from "./TeamForm"
import { validateTeam } from "../../../../validators/teamValidator"
import useSchools from "../../../../hooks/organizer/useSchools"
import useMentors from "../../../../hooks/organizer/useMentors"

export default function TeamModal({
  isOpen,
  mode = "create",
  initialData = {},
  onSubmit,
  onClose,
}) {
  const emptyData = {
    name: "",
    school_id: null,
    mentor_id: null,
  }

  const [formData, setFormData] = useState(emptyData)
  const [errors, setErrors] = useState({})

  // Fetch schools and mentors from hooks
  const { schools } = useSchools()
  const { mentors } = useMentors()

  // Reset form when modal opens or data changes
  useEffect(() => {
    if (isOpen) {
      setFormData(mode === "edit" ? initialData : emptyData)
      setErrors({})
    }
  }, [isOpen, mode, initialData])

  // Validate and submit
  const handleSubmit = async () => {
    const validationErrors = validateTeam(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      await onSubmit(formData, mode)
      onClose()
    }
  }

  // Dynamic title + footer
  const title =
    mode === "edit"
      ? `Edit Team: ${initialData.name || ""}`
      : "Create New Team"

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
      <TeamForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        schools={schools}       // ✅ pass schools
        mentors={mentors}       // ✅ pass mentors
      />
    </BaseModal>
  )
}
