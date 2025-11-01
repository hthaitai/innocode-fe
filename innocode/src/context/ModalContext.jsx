import { createContext, useContext, useState, useCallback } from "react"
import ContestModal from "@/features/contest/components/ContestModal"
import RoundModal from "@/features/contest/subfeatures/rounds/components/RoundModal"
import ProblemModal from "@/features/contest/subfeatures/problems/components/ProblemModal"
import ConfirmDeleteModal from "@/features/contest/components/ConfirmDeleteModal"
import TestCaseModal from "@/features/contest/subfeatures/problems/components/TestCaseModal"
import ProvinceModal from "@/features/organizer/components/ProvinceModal"
import SchoolModal from "@/features/organizer/components/SchoolModal"
import TeamModal from "@/features/contest/subfeatures/teams/components/TeamModal"
import AppealStateModal from "@/features/contest/subfeatures/appeals/components/AppealStateModal"
import AppealDecisionModal from "@/features/contest/subfeatures/appeals/components/AppealDecisionModal"
import CertificateTemplateModal from "@/features/contest/subfeatures/certificates/components/CertificateTemplateModal"
import IssueCertificateModal from "@/features/contest/subfeatures/certificates/components/IssueCertificateModal"

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
