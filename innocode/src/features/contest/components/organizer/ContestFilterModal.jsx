import React from "react"
import BaseModal from "@/shared/components/BaseModal"

const ContestFilterModal = ({ isOpen, onClose }) => {
  const footer = (
    <div className="flex justify-end gap-2">
      <button type="button" className="button-white" onClick={onClose}>
        Cancel
      </button>
      <button type="button" className="button-orange" onClick={onClose}>
        Apply Filters
      </button>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Contests"
      size="md"
      footer={footer}
    >
      <div className="py-4">
        <p className="text-gray-600">Filter options will be added here.</p>
      </div>
    </BaseModal>
  )
}

export default ContestFilterModal

