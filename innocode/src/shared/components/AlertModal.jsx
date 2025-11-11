import Modal from "@/shared/components/BaseModal"

const AlertModal = ({ isOpen, title, description, onClose }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title || "Alert"}
    size="sm"
    footer={
      <button className="button-orange" onClick={onClose}>
        OK
      </button>
    }
  >
    <p>{description}</p>
  </Modal>
)

export default AlertModal

