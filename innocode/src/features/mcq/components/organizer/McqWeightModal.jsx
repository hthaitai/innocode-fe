import React, { useState, useEffect } from "react"
import BaseModal from "@/shared/components/BaseModal"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import { validateWeight } from "../../validators/weightValidator"
import { useUpdateQuestionWeightMutation } from "@/services/mcqApi"
import { toast } from "react-hot-toast"
import { useTranslation } from "react-i18next"

export default function McqWeightModal({ isOpen, question, testId, onClose }) {
  const { t } = useTranslation("common")
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

      toast.success(t("common.weightUpdatedSuccess"))
      onClose()
    } catch (err) {
      const errorMessage =
        err?.data?.message ||
        err?.data?.Message ||
        err?.error ||
        t("common.failedToUpdateWeight")
      toast.error(errorMessage)
    }
  }

  if (!question) return null

  const footer = (
    <div className="flex justify-end gap-2">
      <button type="button" className="button-white" onClick={onClose}>
        {t("buttons.cancel")}
      </button>
      <button
        type="button"
        className="button-orange"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? t("common.updating") : t("common.updateWeight")}
      </button>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("common.updateWeightTitle", {
        id: question.orderIndex || question.displayId,
      })}
      size="md"
      footer={footer}
    >
      <div className="flex flex-col gap-4">
        {/* Question text display */}
        <TextFieldFluent
          label={t("common.question")}
          value={question.text || t("common.untitledQuestion")}
          disabled={true}
          multiline={true}
        />

        {/* Weight input */}
        <TextFieldFluent
          label={t("common.weight")}
          name="weight"
          type="number"
          value={weight}
          onChange={handleWeightChange}
          error={!!error}
          helperText={error}
          placeholder={t("common.enterWeight")}
        />
      </div>
    </BaseModal>
  )
}
