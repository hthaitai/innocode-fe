import React, { useCallback } from "react"
import { Trash } from "lucide-react"
import { useModal } from "@/shared/hooks/useModal"
import toast from "react-hot-toast"
import { useDeleteContestMutation } from "@/services/contestApi"
import { useNavigate } from "react-router-dom"

const DeleteContestSection = ({ contest }) => {
  const { openModal } = useModal()
  const navigate = useNavigate()
  const [deleteContest, { isLoading }] = useDeleteContestMutation()

  const handleDelete = useCallback(() => {
    if (!contest) return

    openModal("confirmDelete", {
      message: `Are you sure you want to delete "${contest.name}"?`,
      onConfirm: async (onClose) => {
        try {
          await deleteContest({ id: contest.contestId }).unwrap()
          toast.success("Contest deleted successfully!")
          navigate("/organizer/contests")
        } catch (err) {
          toast.error("Failed to delete contest.")
        } finally {
          onClose()
        }
      },
    })
  }, [contest, deleteContest, openModal, navigate])

  return (
    <div>
      <div className="text-sm leading-5 font-semibold pt-3 pb-2">
        Other settings
      </div>
      <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
        <div className="flex items-center gap-3">
          <Trash size={20} />
          <span className="text-sm leading-5">Delete contest</span>
        </div>
        <button className="button-white" onClick={handleDelete} disabled={isLoading}>
          {isLoading ? "Deleting..." : "Delete Contest"}
        </button>
      </div>
    </div>
  )
}

export default DeleteContestSection
