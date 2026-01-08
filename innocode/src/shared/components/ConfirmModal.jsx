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

  const handleConfirm = async () => {
    try {
      // Call the onConfirm callback
      await onConfirm()
      // Automatically close modal after successful confirmation
      onClose()
    } catch (error) {
      // If onConfirm throws an error, don't close the modal
      // This allows users to see error messages and try again
      console.error("Confirm action failed:", error)
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
            disabled={isLoading}
          >
            {t("buttons.cancel")}
          </button>
          <button
            className="button-orange min-w-[100px] flex items-center justify-center gap-2"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {t("buttons.confirm")}
          </button>
        </>
      }
    >
      {typeof description === "string" ? <p>{description}</p> : description}
    </Modal>
  )
}

export default ConfirmModal
