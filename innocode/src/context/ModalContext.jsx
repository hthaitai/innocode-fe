import { createContext, useContext, useState, useCallback } from "react"
import ConfirmDeleteModal from "../features/contest/components/ConfirmDeleteModal"
import ContestModal from "../features/contest/organizer/components/ContestModal"
import RoundModal from "../features/contest/organizer/subfeatures/rounds/components/RoundModal"
import ProblemModal from "../features/contest/organizer/subfeatures/problems/components/ProblemModal"
import TestCaseModal from "../features/contest/organizer/subfeatures/problems/components/TestCaseModal"
import ProvinceModal from "../features/province/components/ProvinceModal"
import SchoolModal from "../features/school/components/SchoolModal"
import TeamModal from "../features/contest/organizer/subfeatures/teams/components/TeamModal"
import AppealStateModal from "../features/contest/organizer/subfeatures/appeals/components/AppealStateModal"
import AppealDecisionModal from "../features/contest/organizer/subfeatures/appeals/components/AppealDecisionModal"
import CertificateTemplateModal from "../features/contest/organizer/subfeatures/certificates/components/CertificateTemplateModal"
import IssueCertificateModal from "../features/contest/organizer/subfeatures/certificates/components/IssueCertificateModal"

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
