import { useState } from "react"
import BaseModal from "@/shared/components/BaseModal"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import {
  useUpdateRubricMutation,
  useCreateRubricMutation,
  useFetchRubricQuery,
} from "../../../../services/manualProblemApi"
import { validateRubric } from "../validators/rubricValidator"
import toast from "react-hot-toast"

export default function RubricModal({
  isOpen,
  onClose,
  roundId,
  contestId,
  initialData = null,
}) {
  const isEditMode = !!initialData
  const { data: rubricData } = useFetchRubricQuery(roundId)
  const criteria = rubricData?.data?.criteria ?? []

  const [updateRubric, { isLoading: updating }] = useUpdateRubricMutation()
  const [createRubric, { isLoading: creating }] = useCreateRubricMutation()

  const [formData, setFormData] = useState({
    description: initialData?.description || "",
    maxScore: initialData?.maxScore || 1,
  })
  const [errors, setErrors] = useState({})

  const isSubmitting = updating || creating

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear field-specific error
    if (errors?.[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const hasChanges = !initialData
    ? formData.description.trim() !== "" || formData.maxScore !== 1
    : formData.description !== initialData.description ||
      formData.maxScore !== initialData.maxScore

  const handleSubmit = async () => {
    const validationErrors = validateRubric(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    try {
      if (isEditMode) {
        const updated = criteria.map((c) =>
          c.rubricId === initialData.rubricId ? { ...c, ...formData } : c
        )
        await updateRubric({ roundId, criteria: updated, contestId }).unwrap()
        toast.success("Criterion updated successfully")
      } else {
        await createRubric({
          roundId,
          criteria: [formData],
          contestId,
        }).unwrap()
        toast.success("Criterion created successfully")
      }
      onClose()
    } catch (err) {
      console.error("Failed to save rubric", err)
    }
  }

  const footer = (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        className="button-white"
        onClick={onClose}
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        type="button"
        className={
          isSubmitting || !hasChanges ? "button-gray" : "button-orange"
        }
        onClick={handleSubmit}
        disabled={isSubmitting || !hasChanges}
      >
        {isSubmitting
          ? isEditMode
            ? "Updating..."
            : "Creating..."
          : isEditMode
          ? "Update criterion"
          : "Create criterion"}
      </button>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit criterion" : "Add new criterion"}
      size="md"
      footer={footer}
    >
      <div className="flex flex-col gap-3">
        <TextFieldFluent
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
          maxLength={500}
          error={!!errors.description}
          helperText={errors.description}
        />

        <TextFieldFluent
          label="Max score"
          name="maxScore"
          type="number"
          value={formData.maxScore}
          onChange={handleChange}
          error={!!errors.maxScore}
          helperText={errors.maxScore}
        />
      </div>
    </BaseModal>
  )
}
