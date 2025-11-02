// ConfirmDeleteModal.jsx
import Modal from "@/shared/components/BaseModal"

const ConfirmDeleteModal = ({ isOpen, item, onClose, onConfirm }) => (
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
        <button
          className="button-orange"
          onClick={() => onConfirm(onClose)} // pass onClose function
        >
          Delete
        </button>
      </>
    }
  >
    <p>
      Are you sure you want to delete <strong>{item?.name}</strong>?
    </p>
  </Modal>
)

export default ConfirmDeleteModal
