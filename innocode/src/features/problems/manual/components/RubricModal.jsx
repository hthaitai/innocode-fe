import { useState } from "react"
import BaseModal from "@/shared/components/BaseModal"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import {
  useUpdateRubricMutation,
  useCreateRubricMutation,
  useFetchRubricQuery,
} from "../../../../services/manualProblemApi"

export default function RubricModal({
  isOpen,
  onClose,
  roundId,
  initialData = null,
}) {
  const isEditMode = !!initialData
  const { data: criteria = [] } = useFetchRubricQuery(roundId)

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

  const handleSubmit = async () => {
    setErrors({})

    if (!formData.description.trim()) {
      setErrors({ description: "Description is required." })
      return
    }

    if (formData.description.length > 500) {
      setErrors({ description: "Description cannot exceed 500 characters." })
      return
    }

    if (formData.maxScore <= 0) {
      setErrors({ maxScore: "Max score must be positive." })
      return
    }

    try {
      if (isEditMode) {
        const updated = criteria.map((c) =>
          c.rubricId === initialData.rubricId ? { ...c, ...formData } : c
        )
        await updateRubric({ roundId, criteria: updated }).unwrap()
      } else {
        await createRubric({ roundId, criteria: [formData] }).unwrap()
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
        className={isSubmitting ? "button-gray" : "button-orange"}
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting
          ? isEditMode
            ? "Updating..."
            : "Creating..."
          : isEditMode
          ? "Update Criterion"
          : "Create Criterion"}
      </button>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Criterion" : "Add New Criterion"}
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
          error={!!errors.description}
          helperText={errors.description}
        />

        <TextFieldFluent
          label="Max Score"
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
