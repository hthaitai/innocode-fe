import React, { useCallback } from "react"
import { Trash } from "lucide-react"
import { useModal } from "@/shared/hooks/useModal"
import toast from "react-hot-toast"
import { useDeleteContestMutation } from "@/services/contestApi"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

const DeleteContestSection = ({ contest }) => {
  const { openModal } = useModal()
  const navigate = useNavigate()
  const [deleteContest, { isLoading }] = useDeleteContestMutation()
  const { t } = useTranslation("pages")

  const handleDelete = useCallback(() => {
    openModal("confirmDelete", {
      message: t("organizerContestDetail.delete.confirmMessage", {
        name: contest.name,
      }),
      onConfirm: async (onClose) => {
        try {
          await deleteContest({ id: contest.contestId }).unwrap()
          toast.success(t("organizerContestDetail.delete.success"))
          navigate("/organizer/contests")
        } catch (err) {
          toast.error(t("organizerContestDetail.delete.error"))
        } finally {
          onClose()
        }
      },
    })
  }, [contest, deleteContest, openModal, navigate, t])

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
      <div className="flex items-center gap-3">
        <Trash size={20} />
        <span className="text-sm leading-5">
          {t("organizerContestDetail.delete.title")}
        </span>
      </div>
      <button
        className="button-red"
        onClick={handleDelete}
        disabled={isLoading}
      >
        {isLoading
          ? t("organizerContestDetail.delete.buttonLoading")
          : t("organizerContestDetail.delete.button")}
      </button>
    </div>
  )
}

export default DeleteContestSection
