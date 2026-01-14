import React, { useCallback } from "react"
import { useModal } from "@/shared/hooks/useModal"
import toast from "react-hot-toast"
import { useCancelContestMutation } from "@/services/contestApi"
import { useTranslation } from "react-i18next"
import { Ban } from "lucide-react"

const CancelContestSection = ({ contest }) => {
  const { openModal } = useModal()
  const [cancelContest, { isLoading }] = useCancelContestMutation()
  const { t } = useTranslation("pages")

  const handleCancel = useCallback(() => {
    openModal("confirm", {
      title: t("organizerContestDetail.cancelControl.title"),
      description: t("organizerContestDetail.cancelControl.confirmMessage", {
        name: contest?.name,
      }),
      onConfirm: async () => {
        try {
          await cancelContest(contest.contestId).unwrap()
          toast.success(t("organizerContestDetail.cancelControl.success"))
        } catch (err) {
          console.error(err)
          toast.error(t("organizerContestDetail.cancelControl.error"))
        }
      },
    })
  }, [contest, cancelContest, openModal, t])

  // Don't show if already cancelled/completed?
  // For now show always or based on logic. Usually only active/upcoming contests can be cancelled.
  // Assuming the user wants it visible generally or handled by backend error if not allowed.

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
      <div className="flex items-center gap-5">
        <Ban size={20} />
        <div>
          <p className="text-[14px] leading-[20px]">
            {t("organizerContestDetail.cancelControl.title")}
          </p>
          <p className="text-[12px] leading-[16px] text-[#7A7574]">
            {t("organizerContestDetail.cancelControl.subtitle")}
          </p>
        </div>
      </div>
      <button
        className="button-red"
        onClick={handleCancel}
        disabled={isLoading}
      >
        {isLoading
          ? t("organizerContestDetail.cancelControl.buttonLoading")
          : t("organizerContestDetail.cancelControl.button")}
      </button>
    </div>
  )
}

export default CancelContestSection
