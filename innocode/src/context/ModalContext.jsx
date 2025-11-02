import { createContext, useContext, useState, useCallback } from "react"
import ConfirmDeleteModal from "../shared/components/ConfirmDeleteModal"
import ContestModal from "../features/contest/components/organizer/ContestModal"
import RoundModal from "../features/round/components/organizer/RoundModal"
import ProblemModal from "../features/problem/components/organizer/ProblemModal"
import TestCaseModal from "../features/problem/components/organizer/TestCaseModal"
import ProvinceModal from "../features/province/components/organizer/ProvinceModal"
import SchoolModal from "../features/school/components/organizer/SchoolModal"
import TeamModal from "../features/team/components/organizer/TeamModal"
import AppealStateModal from "../features/appeal/components/organizer/AppealStateModal"
import AppealDecisionModal from "../features/appeal/components/organizer/AppealDecisionModal"
import CertificateTemplateModal from "../features/certificate/components/organizer/CertificateTemplateModal"
import IssueCertificateModal from "../features/certificate/components/organizer/IssueCertificateModal"

const ModalContext = createContext(null)

export function ModalProvider({ children }) {
  const [modal, setModal] = useState({ type: null, props: {} })

  // ---- Open a modal ----
  const openModal = useCallback((type, props = {}) => {
    setModal({ type, props: { ...props, isOpen: true } })
  }, [])

  // ---- Close modal ----
  const closeModal = useCallback(() => {
    setModal((prev) => ({
      ...prev,
      props: { ...prev.props, isOpen: false },
    }))
    // clear modal after animation ends
    setTimeout(() => setModal({ type: null, props: {} }), 200)
  }, [])

  // ---- Modal registry ----
  const modalComponents = {
    confirmDelete: ConfirmDeleteModal,
    contest: ContestModal,
    round: RoundModal,
    problem: ProblemModal, 
    testCase: TestCaseModal, 
    province: ProvinceModal,
    school: SchoolModal,
    team: TeamModal,
    appealState: AppealStateModal,
    appealDecision: AppealDecisionModal,
    certificateTemplate: CertificateTemplateModal,
    issueCertificate: IssueCertificateModal,
  }

  const ActiveModal = modal.type ? modalComponents[modal.type] : null

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {ActiveModal && <ActiveModal {...modal.props} onClose={closeModal} />}
    </ModalContext.Provider>
  )
}

export const useModalContext = () => useContext(ModalContext)
