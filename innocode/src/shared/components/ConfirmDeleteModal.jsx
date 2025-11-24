import Modal from "@/shared/components/BaseModal"

const ConfirmDeleteModal = ({ isOpen, item, message, onConfirm, onClose }) => {
  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm(onClose)
    } else {
      onClose()
    }
  }

  const resolvedMessage =
    message ||
    `Are you sure you want to delete "${
      item?.name ||
      item?.title ||
      item?.username ||
      item?.email ||
      item?.id ||
      "this item"
    }"?`

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Delete"
      size="sm"
      footer={
        <>
          <button className="button-white" onClick={onClose}>
            Cancel
          </button>
          <button className="button-orange" onClick={handleConfirm}>
            Delete
          </button>
        </>
      }
    >
      <p>{resolvedMessage}</p>
    </Modal>
  )
}

export default ConfirmDeleteModal
