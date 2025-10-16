import React, { useState } from "react"
import PageContainer from "../../components/PageContainer"
import { BREADCRUMBS } from "../../config/breadcrumbs"
import OrganizerContestTable from "../../components/organizer/contests/OrganizerContestTable"
import { contestsDataOrganizer } from "../../data/contestsDataOrganizer"
import { Trophy } from "lucide-react"
import Modal from "../../components/Modal"
import ContestForm from "../../components/organizer/forms/ContestForm"

const OrganizerContests = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [contestData, setContestData] = useState({})

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleSave = () => {
    // TODO: connect to backend API
    console.log("Saving contest:", contestData)
    closeModal()
  }

  return (
    <PageContainer breadcrumb={BREADCRUMBS.CONTESTS}>
      <div className="flex flex-col gap-1">
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
          <div className="flex gap-5 items-center">
            <Trophy size={20} />
            <div>
              <p className="text-[14px] leading-[20px]">Contest Management</p>
              <p className="text-[12px] leading-[16px] text-[#7A7574]">
                Create and manage contests
              </p>
            </div>
          </div>
          <button className="button-orange" onClick={openModal}>
            New Contest
          </button>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Create New Contest"
          size="lg"
          footer={
            <>
              <button className="button-white" onClick={closeModal}>
                Cancel
              </button>
              <button className="button-orange" onClick={handleSave}>
                Save
              </button>
            </>
          }
        >
          <ContestForm onChange={setContestData} />
        </Modal>

        <OrganizerContestTable data={contestsDataOrganizer} />
      </div>
    </PageContainer>
  )
}

export default OrganizerContests
