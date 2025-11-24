import BaseModal from "@/shared/components/BaseModal"
import RubricForm from "./RubricForm"
import { useRubricForm } from "../hooks/useRubricForm"
import { useAppDispatch } from "@/store/hooks"
import { saveRubric } from "../store/manualProblemThunks"
import { setCriteria } from "../store/manualProblemSlice"

export default function RubricModal({
  isOpen,
  onClose,
  roundId,
  criteria = [], // ✅ ensure iterable
  initialData = null,
}) {
  const dispatch = useAppDispatch()
  const isEditMode = !!initialData

  const {
    formData,
    setFormData,
    errors,
    setErrors,
    handleSubmit,
    isSubmitting,
  } = useRubricForm({
    initialData,
    onUpdated: async (data) => {
      // Merge (edit) or append (create)
      const updated = isEditMode
        ? criteria.map((c) =>
            c.rubricId === initialData.rubricId ? { ...c, ...data } : c
          )
        : [...criteria, { ...data, rubricId: undefined }]

      dispatch(setCriteria(updated))
      await dispatch(saveRubric({ roundId, criteria: updated }))
      onClose()
    },
    onClose,
  })

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
      <div className="space-y-5">
        <RubricForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
        />
      </div>
    </BaseModal>
  )
}
