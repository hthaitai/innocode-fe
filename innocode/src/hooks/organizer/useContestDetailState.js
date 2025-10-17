import { useState } from "react"

export const useContestDetailState = (contest) => {
  const [contestModal, setContestModal] = useState({
    isOpen: false,
    mode: "create",
    formData: contest || {},
    showErrors: false,
  })

  const [roundModal, setRoundModal] = useState({
    isOpen: false,
    mode: "create",
    formData: {},
    showErrors: false,
  })

  const [confirmDeleteModal, setConfirmDeleteModal] = useState({
    isOpen: false,
    type: null,
    item: null,
  })

  const [rounds, setRounds] = useState(
    contest?.rounds || [
      {
        round_id: 1,
        contest_id: contest?.contest_id,
        name: "Qualification",
        start: "2025-01-01T09:00",
        end: "2025-01-01T12:00",
      },
      {
        round_id: 2,
        contest_id: contest?.contest_id,
        name: "Semi-Final",
        start: "2025-02-01T09:00",
        end: "2025-02-01T12:00",
      },
    ]
  )

  // --- Modal control functions ---
  const openContestModal = (mode, data = {}) =>
    setContestModal({ isOpen: true, mode, formData: data, showErrors: false })
  const closeContestModal = () =>
    setContestModal((prev) => ({ ...prev, isOpen: false }))

  const openRoundModal = (mode, data = {}) =>
    setRoundModal({ isOpen: true, mode, formData: data, showErrors: false })
  const closeRoundModal = () =>
    setRoundModal((prev) => ({ ...prev, isOpen: false }))

  const openDeleteModal = (type, item) =>
    setConfirmDeleteModal({ isOpen: true, type, item })
  const closeDeleteModal = () =>
    setConfirmDeleteModal((prev) => ({ ...prev, isOpen: false }))

  return {
    contestModal,
    roundModal,
    confirmDeleteModal,
    openContestModal,
    openRoundModal,
    openDeleteModal, // 👈 must return this
    closeContestModal,
    closeRoundModal,
    closeDeleteModal,
    rounds,
    setRounds,
    setContestModal,
    setRoundModal,
  }
}
