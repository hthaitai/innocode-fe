import Modal from "@/shared/components/BaseModal"
import { useAppDispatch } from "@/store/hooks"
import toast from "react-hot-toast"

const ConfirmDeleteModal = ({
  isOpen,
  item,
  message,
  type,
  onConfirm,
  onClose,
}) => {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(onClose)
    } else {
      onClose()
    }
  }

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
      <p>
        {message ||
          `Are you sure you want to delete ${
            item?.name ||
            item?.title ||
            item?.username ||
            item?.email ||
            item?.id ||
            "this item"
          }?`}
      </p>
    </Modal>
  )
}

export default ConfirmDeleteModal
