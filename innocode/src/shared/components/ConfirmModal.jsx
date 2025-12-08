import Modal from "@/shared/components/BaseModal"

const ConfirmModal = ({ isOpen, title, description, onClose, onConfirm }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title || "Confirm"}
    size="sm"
    footer={
      <>
        <button className="button-white" onClick={onClose}>
          Cancel
        </button>
        <button
          className="button-orange"
          onClick={() => {
            if (onConfirm) {
              onConfirm();
            }
            onClose();
          }}
        >
          Confirm
        </button>
      </>
    }
  >
    {typeof description === 'string' ? <p>{description}</p> : description}
  </Modal>
)

export default ConfirmModal

