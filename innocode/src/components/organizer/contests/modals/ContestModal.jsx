import Modal from "../../../Modal"
import ContestForm from "../../forms/ContestForm"

const ContestModal = ({ isOpen, mode, formData, onChange, onSave, onClose, showErrors }) => {
  const errors = showErrors
    ? {
        name: !formData.name ? "Required" : "",
        year: !formData.year ? "Required" : "",
        description: !formData.description ? "Required" : "",
        status: !formData.status ? "Required" : "",
      }
    : {}

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Create New Contest" : `Edit Contest: ${formData.name}`}
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
      <ContestForm formData={formData} onChange={onChange} errors={errors} />
    </Modal>
  )
}

export default ContestModal
