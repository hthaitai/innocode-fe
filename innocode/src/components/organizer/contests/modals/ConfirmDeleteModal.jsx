import Modal from "../../../Modal"

const ConfirmDeleteModal = ({ isOpen, item, onClose, onConfirm }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Confirm Delete"
    size="sm"
    footer={
      <>
        <button className="button-white" onClick={onClose}>Cancel</button>
        <button className="button-orange" onClick={onConfirm}>Delete</button>
      </>
    }
  >
    <p>
      Are you sure you want to delete <strong>{item?.name}</strong>?
    </p>
  </Modal>
)

export default ConfirmDeleteModal
