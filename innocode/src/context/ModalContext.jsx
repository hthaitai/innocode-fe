import { createContext, useContext, useState, useCallback } from "react"
import ConfirmDeleteModal from "../shared/components/ConfirmDeleteModal"
import ConfirmModal from "../shared/components/ConfirmModal"
import AlertModal from "../shared/components/AlertModal"
import ProblemModal from "../features/problem/components/organizer/ProblemModal"
import ProvinceModal from "../features/province/components/organizer/ProvinceModal"
import SchoolModal from "../features/school/components/organizer/SchoolModal"
import TeamModal from "../features/team/components/organizer/TeamModal"
import CreateAppealModal from "../features/appeal/components/mentor/CreateAppealModal"
import NotificationModal from "../features/notification/components/organizer/NotificationModal"
import McqWeightModal from "../features/mcq/components/organizer/McqWeightModal"
import RubricModal from "../features/problems/manual/components/RubricModal"
import RubricCsvModal from "../features/problems/manual/components/RubricCsvModal"
import TestCaseCsvModal from "../features/problems/auto-evaluation/components/TestCaseCsvModal"
import McqCsvModal from "../features/mcq/components/organizer/McqCsvModal"
import McqBankModal from "../features/mcq/components/organizer/McqBankModal"
import ReviewAppealModal from "../features/appeal/components/organizer/ReviewAppealModal"
import OpenCodeModal from "../features/round/components/student/OpenCodeModal"
import InviteJudgeModal from "../features/invite-judge/components/InviteJudgeModal"
import CertificateTemplateModal from "../features/certificate/components/organizer/CertificateTemplateModal"
import ContestFilterModal from "../features/contest/components/organizer/ContestFilterModal"
import RoleRegistrationDetailsModal from "../features/role-registration/components/RoleRegistrationDetailsModal"
import ApproveRoleRegistrationModal from "../features/role-registration/components/ApproveRoleRegistrationModal"
import DenyRoleRegistrationModal from "../features/role-registration/components/DenyRoleRegistrationModal"

const ModalContext = createContext({
  openModal: () => {}, // no-op default
  closeModal: () => {}, // no-op default
})

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
    confirm: ConfirmModal,
    alert: AlertModal,
    problem: ProblemModal,
    province: ProvinceModal,
    school: SchoolModal,
    team: TeamModal,
    createAppeal: CreateAppealModal,
    notification: NotificationModal,
    mcqWeight: McqWeightModal,
    rubric: RubricModal,
    rubricCsv: RubricCsvModal,
    testCaseCsv: TestCaseCsvModal,
    mcqCsv: McqCsvModal,
    mcqBank: McqBankModal,
    reviewAppeal: ReviewAppealModal,
    openCode: OpenCodeModal,
    inviteJudge: InviteJudgeModal,
    certificateTemplate: CertificateTemplateModal,
    contestFilter: ContestFilterModal,
    roleRegistrationDetails: RoleRegistrationDetailsModal,
    approveRoleRegistration: ApproveRoleRegistrationModal,
    denyRoleRegistration: DenyRoleRegistrationModal,
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
