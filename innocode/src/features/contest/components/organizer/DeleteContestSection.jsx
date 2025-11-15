import React, { useCallback } from "react"
import { Trash } from "lucide-react"
import { useAppDispatch } from "@/store/hooks"
import { useModal } from "@/shared/hooks/useModal"
import toast from "react-hot-toast"
import { deleteContest } from "@/features/contest/store/contestThunks"
import { useNavigate } from "react-router-dom"

const DeleteContestSection = ({ contest }) => {
  const dispatch = useAppDispatch()
  const { openModal } = useModal()
  const navigate = useNavigate()

  const handleDelete = useCallback(() => {
    if (!contest) return

    openModal("confirmDelete", {
      message: `Are you sure you want to delete "${contest.name}"?`,
      onConfirm: async (onClose) => {
        try {
          await dispatch(deleteContest({ contestId: contest.contestId })).unwrap()
          toast.success("Contest deleted successfully!")
          navigate("/organizer/contests")
        } catch (err) {
          toast.error("Failed to delete contest.")
        } finally {
          onClose()
        }
      },
    })
  }, [contest, dispatch, openModal, navigate])

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
        <button className="button-white" onClick={handleDelete}>
          Delete Contest
        </button>
      </div>
    </div>
  )
}

export default DeleteContestSection
