import React, { useState, useEffect } from "react"
import BaseModal from "@/shared/components/BaseModal"
import DropdownFluent from "@/shared/components/DropdownFluent"

export default function AppealStateModal({ isOpen, initialState = "", onSubmit, onClose }) {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    if (isOpen) setState(initialState)
  }, [isOpen, initialState])

  const handleSave = async () => {
    if (!state) return
    await onSubmit({ state })
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
      title="Edit Appeal State"
      size="sm"
      footer={footer}
    >
      <DropdownFluent
        label="Appeal State"
        placeholder="Select status"
        value={state}
        options={[
          { value: "open", label: "Open" },
          { value: "under_review", label: "Under Review" },
          { value: "accepted", label: "Accepted" },
          { value: "rejected", label: "Rejected" },
          { value: "escalated", label: "Escalated" },
        ]}
        onChange={(value) => setState(value)}
      />
    </BaseModal>
  )
}
