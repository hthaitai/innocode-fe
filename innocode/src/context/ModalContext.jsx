import { createContext, useContext, useState, useCallback } from "react"
import ContestModal from "../components/organizer/contests/modals/ContestModal"
import RoundModal from "../components/organizer/contests/modals/RoundModal"
import ProblemModal from "../components/organizer/contests/modals/ProblemModal"
import ConfirmDeleteModal from "../components/organizer/contests/modals/ConfirmDeleteModal"
import TestCaseModal from "../components/organizer/contests/modals/TestCaseModal"
import ProvinceModal from "../components/organizer/provinces/ProvinceModal"

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
