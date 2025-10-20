import { useModalContext } from "../../context/ModalContext"

export const useModal = () => {
  const { openModal, closeModal } = useModalContext()
  return { openModal, closeModal }
}
