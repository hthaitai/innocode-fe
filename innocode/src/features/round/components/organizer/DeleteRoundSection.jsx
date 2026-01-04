import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Trash } from "lucide-react"
import { useModal } from "@/shared/hooks/useModal"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useDeleteRoundMutation } from "@/services/roundApi"

const DeleteRoundSection = ({ round, contestId }) => {
  const navigate = useNavigate()
  const { t } = useTranslation("round")
  const { openModal } = useModal()
  const [deleteRound, { isLoading }] = useDeleteRoundMutation()

  const handleDelete = useCallback(() => {
    if (!round) return

    openModal("confirmDelete", {
      message: t("delete.confirmMessage", { name: round.name }),
      onConfirm: async (onClose) => {
        try {
          await deleteRound(round.roundId).unwrap()
          toast.success(t("delete.success"))
          navigate(`/organizer/contests/${contestId}`)
        } catch (err) {
          console.error("❌ Failed to delete round:", err)
          toast.error(t("delete.error"))
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
        <span className="text-sm">{t("delete.title")}</span>
      </div>
      <button
        className="button-red"
        onClick={handleDelete}
        disabled={isLoading}
      >
        {isLoading ? t("delete.deleting") : t("delete.deleteBtn")}
      </button>
    </div>
  )
}

export default DeleteRoundSection
