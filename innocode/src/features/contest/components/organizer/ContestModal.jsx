import BaseModal from "@/shared/components/BaseModal"
import ContestForm from "./ContestForm"
import { useContestForm } from "../../hooks/useContestForm"

export default function ContestModal({
  isOpen,
  onClose,
  onCreated,
  onUpdated,
  initialData = null,
}) {
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    handleSubmit,
    isSubmitting,
  } = useContestForm({ initialData, onCreated, onUpdated, onClose })

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
          ? initialData
            ? "Updating..."
            : "Creating..."
          : initialData
          ? "Update Contest"
          : "Create Contest"}
      </button>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Contest" : "Create New Contest"}
      size="lg"
      footer={footer}
    >
      <div className="space-y-5">
        <ContestForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
        />
      </div>
    </BaseModal>
  )
}
