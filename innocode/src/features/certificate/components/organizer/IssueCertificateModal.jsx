import React, { useState, useEffect } from "react"
import BaseModal from "@/shared/components/BaseModal"
import IssueCertificateForm from "./IssueCertificateForm"
import { useTeams } from "@/features/team/hooks/useTeams"

export default function IssueCertificateModal({ isOpen, template, onSubmit, onClose }) {
  const { teams } = useTeams()
  const [formData, setFormData] = useState({ team_id: null })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      setFormData({ team_id: null })
      setFormErrors({})
    }
  }, [isOpen])

  const handleSubmit = async () => {
    const errors = {}
    if (!formData.team_id) {
      errors.team = "Please select a team to issue the certificate."
    }

    setFormErrors(errors)

    if (Object.keys(errors).length === 0) {
      await onSubmit({ template_id: template.template_id, ...formData })
      onClose()
    }
  }

  const footer = (
    <div className="flex justify-end gap-2">
      <button type="button" className="button-white" onClick={onClose}>
        Cancel
      </button>
      <button type="button" className="button-orange" onClick={handleSubmit}>
        Issue Certificate
      </button>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Issue Certificate: ${template.name}`}
      size="md"
      footer={footer}
    >
      <IssueCertificateForm
        formData={formData}
        setFormData={setFormData}
        errors={formErrors}
        teams={teams}
      />
    </BaseModal>
  )
}
