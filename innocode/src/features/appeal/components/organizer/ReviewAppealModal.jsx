import React, { useState, useEffect } from "react"
import BaseModal from "@/shared/components/BaseModal"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import { useReviewAppealMutation } from "../../../../services/appealApi"
import DropdownFluent from "@/shared/components/DropdownFluent"
import { Check, X } from "lucide-react"
import Label from "../../../../shared/components/form/Label"

export default function ReviewAppealModal({ isOpen, appeal, onClose }) {
  const [decision, setDecision] = useState("Approved")
  const [decisionReason, setDecisionReason] = useState("")
  const [error, setError] = useState("")

  const [reviewAppeal, { isLoading }] = useReviewAppealMutation()

  useEffect(() => {
    if (isOpen && appeal) {
      setDecision("Approved")
      setDecisionReason("")
      setError("")
    }
  }, [isOpen, appeal])

  if (!appeal) return null

  const handleSubmit = async () => {
    if (!decisionReason.trim()) {
      setError("Please provide a reason for your decision.")
      return
    }

    try {
      await reviewAppeal({
        appealId: appeal.appealId,
        decision,
        decisionReason,
      }).unwrap()

      onClose()
    } catch (err) {
      const errorMessage =
        err?.data?.message ||
        err?.data?.Message ||
        err?.error ||
        "Failed to review appeal"
      setError(errorMessage)
    }
  }

  const footer = (
    <div className="flex justify-end gap-2">
      <button type="button" className="button-white" onClick={onClose}>
        Cancel
      </button>
      <button
        type="button"
        className="button-orange"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  )

  const decisionOptions = [
    { label: "Approved", value: "Approved" },
    { label: "Rejected", value: "Rejected" },
  ]

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Review Appeal: ${appeal.teamName}`}
      size="md"
      footer={footer}
    >
      <div className="flex flex-col gap-5 text-sm leading-5">
        {/* Decision dropdown */}
        <div className="flex flex-col gap-2">
          <Label>Decision</Label>
          <DropdownFluent
            options={decisionOptions}
            value={decision}
            onChange={setDecision}
            placeholder="Select decision"
          />
        </div>

        {/* Decision reason input */}
        <div className="flex flex-col gap-2">
          <Label required>Decision reason</Label>
          <TextFieldFluent
            name="decisionReason"
            value={decisionReason}
            onChange={(e) => {
              setDecisionReason(e.target.value)
              if (error) setError("")
            }}
            error={!!error}
            helperText={error}
            placeholder="Provide reason for your decision"
            multiline
          />
        </div>
      </div>
    </BaseModal>
  )
}
