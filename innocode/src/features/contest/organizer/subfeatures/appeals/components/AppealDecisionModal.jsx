import React, { useState, useEffect } from "react"
import BaseModal from "@/shared/components/BaseModal"
import { TextField } from "@mui/material"

export default function AppealDecisionModal({ isOpen, initialDecision = "", onSubmit, onClose }) {
  const [decision, setDecision] = useState(initialDecision)

  useEffect(() => {
    if (isOpen) setDecision(initialDecision)
  }, [isOpen, initialDecision])

  const handleSave = async () => {
    if (!decision.trim()) return
    await onSubmit({ decision })
    onClose()
  }

  const footer = (
    <div className="flex justify-end gap-2">
      <button className="button-white" onClick={onClose}>Cancel</button>
      <button className="button-orange" onClick={handleSave}>Save</button>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Decision"
      size="md"
      footer={footer}
    >
      <TextField
        label="Decision"
        value={decision}
        onChange={(e) => setDecision(e.target.value)}
        fullWidth
        multiline
        rows={4}
      />
    </BaseModal>
  )
}
