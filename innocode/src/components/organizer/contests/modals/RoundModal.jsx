import Modal from "../../../Modal"
import RoundForm from "../../forms/RoundForm"

const RoundModal = ({ isOpen, mode, formData, onChange, onSave, onClose, showErrors }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={mode === "create" ? "Create New Round" : `Edit Round: ${formData.name}`}
    size="lg"
    footer={
      <>
        <button className="button-white" onClick={onClose}>Cancel</button>
        <button className="button-orange" onClick={onSave}>
          {mode === "create" ? "Create" : "Save Changes"}
        </button>
      </>
    }
  >
    <RoundForm initialData={formData} onChange={onChange} showErrors={showErrors} />
  </Modal>
)

export default RoundModal
