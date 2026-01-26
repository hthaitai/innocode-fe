import React from "react"
import Modal from "@/shared/components/BaseModal"
import { useTranslation } from "react-i18next"

const ConfirmModal = ({
  isOpen,
  title,
  description,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const { t } = useTranslation("common")

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleConfirm = async () => {
    // Prevent double submission
    if (isSubmitting || isLoading) return

    try {
      setIsSubmitting(true)
      // Call the onConfirm callback
      await onConfirm()
      // Automatically close modal after successful confirmation
      onClose()
    } catch (error) {
      // If onConfirm throws an error, don't close the modal
      // This allows users to see error messages and try again
      console.error("Confirm action failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || t("buttons.confirm")}
      size="sm"
      footer={
        <>
          <button
            className="button-white"
            onClick={onClose}
            disabled={isLoading || isSubmitting}
          >
            {t("buttons.cancel")}
          </button>
          <button
            className={` ${isLoading || isSubmitting ? "button-gray" : "button-orange"}`}
            onClick={handleConfirm}
            disabled={isLoading || isSubmitting}
          >
            {isSubmitting
              ? t("buttons.loading", "Processing...")
              : t("buttons.confirm")}
          </button>
        </>
      }
    >
      {typeof description === "string" ? <p>{description}</p> : description}
    </Modal>
  )
}

export default ConfirmModal
