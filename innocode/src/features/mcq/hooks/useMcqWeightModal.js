// hooks/useMcqWeightModal.js
import { useCallback } from "react"
import { toast } from "react-hot-toast"

export const useMcqWeightModal = (testId, openModal, handleUpdateWeight) => {
  return useCallback(
    (question) => {
      if (!testId) return toast.error("Test ID not available")
      openModal("mcqWeight", { question, testId, onSubmit: handleUpdateWeight })
    },
    [testId, openModal, handleUpdateWeight]
  )
}
