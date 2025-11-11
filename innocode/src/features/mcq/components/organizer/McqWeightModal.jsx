import React, { useState, useEffect } from "react"
import BaseModal from "@/shared/components/BaseModal"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import { validateWeight } from "../../validators/weightValidator"

export default function McqWeightModal({
  isOpen,
  question,
  testId,
  onSubmit,
  onClose,
}) {
  const [weight, setWeight] = useState("")
  const [error, setError] = useState("")

  // Reset form when modal opens or question changes
  useEffect(() => {
    if (isOpen && question) {
      setWeight(question.weight?.toString() || "")
      setError("")
    }
  }, [isOpen, question])

  // Handle weight change
  const handleWeightChange = (e) => {
    const value = e.target.value
    setWeight(value)
    // Clear error when user starts typing
    if (error) {
      const validationError = validateWeight(value)
      setError(validationError)
    }
  }

  // Handle submit
  const handleSubmit = async () => {
    const validationError = validateWeight(weight)
    if (validationError) {
      setError(validationError)
      return
    }

    setError("") // Clear previous errors
    try {
      await onSubmit({
        testId,
        questionId: question.questionId,
        weight: Number(weight),
      })
      // onClose is called in handleUpdateWeight on success
      // But we also call it here as a fallback
      onClose()
    } catch (err) {
      // Handle both error formats: { Message: "..." } or { message: "..." } or Error object
      const errorMessage =
        err?.Message ||
        err?.message ||
        err?.toString() ||
        "Failed to update weight"
      setError(errorMessage)
    }
  }

  if (!question) return null

  const footer = (
    <div className="flex justify-end gap-2">
      <button type="button" className="button-white" onClick={onClose}>
        Cancel
      </button>
      <button type="button" className="button-orange" onClick={handleSubmit}>
        Update Weight
      </button>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Weight: Question #${
        question.displayId || question.questionId
      }`}
      size="md"
      footer={footer}
    >
      <div className="flex flex-col gap-4">
        {/* Question text display */}
        <div>
          <label className="text-xs leading-4 mb-2 capitalize text-[#7A7574]">
            Question
          </label>
          <p className="text-sm leading-5 px-4 py-2 bg-[#F3F3F3] rounded-[5px] border border-[#ECECEC]">
            {question.text || "Untitled Question"}
          </p>
        </div>

        {/* Weight input */}
        <TextFieldFluent
          label="Weight"
          name="weight"
          type="number"
          value={weight}
          onChange={handleWeightChange}
          error={!!error}
          helperText={error}
          placeholder="Enter weight"
        />
      </div>
    </BaseModal>
  )
}
