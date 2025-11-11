import BaseModal from "@/shared/components/BaseModal"
import RoundForm from "./RoundForm"
import RoundDateInfo from "./RoundDateInfo"
import { useRoundForm } from "../../hooks/useRoundForm"

export default function RoundModal(props) {
  const { isOpen, onClose, onCreated, onUpdated, initialData, contestId } =
    props

  const {
    formData,
    setFormData,
    errors,
    setErrors,
    handleSubmit,
    isSubmitting,
    contest,
  } = useRoundForm({ contestId, initialData, onCreated, onUpdated, onClose })

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
          ? "Update Round"
          : "Create Round"}
      </button>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Round" : "Create New Round"}
      size="lg"
      footer={footer}
    >
      <div className="space-y-5">
        {contest && <RoundDateInfo contest={contest} />}
        <RoundForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          showTypeSelector={!initialData}
        />
      </div>
    </BaseModal>
  )
}
