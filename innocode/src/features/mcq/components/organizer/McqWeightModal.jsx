import React, { useState, useEffect } from "react"
import BaseModal from "@/shared/components/BaseModal"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import { validateWeight } from "../../validators/weightValidator"
import { useUpdateQuestionWeightMutation } from "@/services/mcqApi"
import { toast } from "react-hot-toast"

export default function McqWeightModal({ isOpen, question, testId, onClose }) {
  const [weight, setWeight] = useState("")
  const [error, setError] = useState("")

  const [updateQuestionWeight, { isLoading }] =
    useUpdateQuestionWeightMutation()

  // Reset form when modal opens or question changes
  useEffect(() => {
    if (isOpen && question) {
      setWeight(question.weight?.toString() || "")
      setError("")
    }
  }, [isOpen, question])

  const handleWeightChange = (e) => {
    const value = e.target.value
    setWeight(value)
    if (error) {
      const validationError = validateWeight(value)
      setError(validationError)
    }
  }

  const handleSubmit = async () => {
    const validationError = validateWeight(weight)
    if (validationError) {
      setError(validationError)
      return
    }

    setError("")

    const numericWeight = Number(weight)

    try {
      await updateQuestionWeight({
        testId,
        questions: [{ questionId: question.questionId, weight: numericWeight }],
      }).unwrap()

      toast.success("Question weight updated successfully!")
      onClose()
    } catch (err) {
      const errorMessage =
        err?.data?.message ||
        err?.data?.Message ||
        err?.error ||
        "Failed to update weight"
      toast.error(errorMessage)
    }
  }

  if (!question) return null

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
        {isLoading ? "Updating..." : "Update Weight"}
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
