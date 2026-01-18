import Modal from "@/shared/components/BaseModal"
import { useTranslation } from "react-i18next"

const ConfirmDeleteModal = ({ isOpen, item, message, onConfirm, onClose }) => {
  const { t } = useTranslation("common")

  const handleConfirm = async () => {
    try {
      if (onConfirm) {
        await onConfirm(onClose)
      }
    } catch (error) {
      // If onConfirm throws an error, don't close the modal
      console.error("Delete action failed:", error)
    }
  }

  const defaultMessage = t("common.deleteConfirmMessage", {
    name:
      item?.name ||
      item?.title ||
      item?.username ||
      item?.email ||
      item?.id ||
      t("common.thisItem"),
  })

  const resolvedMessage = message || defaultMessage

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("common.confirmDelete")}
      size="sm"
      footer={
        <>
          <button className="button-white" onClick={onClose}>
            {t("buttons.cancel")}
          </button>
          <button className="button-orange" onClick={handleConfirm}>
            {t("buttons.delete")}
          </button>
        </>
      }
    >
      <p>{resolvedMessage}</p>
    </Modal>
  )
}

export default ConfirmDeleteModal
