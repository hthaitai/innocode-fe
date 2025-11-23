import React, { useCallback } from "react"
import { Trash } from "lucide-react"
import { useModal } from "@/shared/hooks/useModal"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useDeleteRoundMutation } from "@/services/roundApi"

const DeleteRoundSection = ({ round, contestId }) => {
  const navigate = useNavigate()
  const { openModal } = useModal()
  const [deleteRound, { isLoading }] = useDeleteRoundMutation()

  const handleDelete = useCallback(() => {
    if (!round) return

    openModal("confirmDelete", {
      message: `Are you sure you want to delete "${round.name}"?`,
      onConfirm: async (onClose) => {
        try {
          await deleteRound(round.roundId).unwrap()
          toast.success("Round deleted successfully!")
          navigate(`/organizer/contests/${contestId}`)
        } catch (err) {
          console.error("❌ Failed to delete round:", err)
          toast.error("Failed to delete round.")
        } finally {
          onClose()
        }
      },
    })
  }, [round, contestId, navigate, deleteRound, openModal])

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
      <div className="flex gap-5 items-center">
        <Trash size={20} />
        <span className="text-sm">Delete round</span>
      </div>
      <button
        className="button-white"
        onClick={handleDelete}
        disabled={isLoading}
      >
        {isLoading ? "Deleting..." : "Delete Round"}
      </button>
    </div>
  )
}

export default DeleteRoundSection
