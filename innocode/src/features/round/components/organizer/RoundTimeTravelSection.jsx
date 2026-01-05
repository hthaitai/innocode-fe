import React from "react"
import { useTranslation } from "react-i18next"
import { toast } from "react-hot-toast"
import { FastForward, CheckCircle, Gavel, Flag } from "lucide-react"
import {
  useAppealSubmitEndMutation,
  useAppealReviewEndMutation,
  useJudgeDeadlineEndMutation,
  useFinalizeRoundMutation,
} from "@/services/roundApi"

const RoundTimeTravelSection = ({ roundId, isRetakeRound, problemType }) => {
  const { t } = useTranslation("round")
  const [appealSubmitEnd, { isLoading: isAppealSubmitEnding }] =
    useAppealSubmitEndMutation()
  const [appealReviewEnd, { isLoading: isAppealReviewEnding }] =
    useAppealReviewEndMutation()
  const [judgeDeadlineEnd, { isLoading: isJudgeDeadlineEnding }] =
    useJudgeDeadlineEndMutation()
  const [finalizeRound, { isLoading: isFinalizing }] =
    useFinalizeRoundMutation()

  const handleAction = async (mutation, successMessage, errorMessage) => {
    try {
      await mutation(roundId).unwrap()
      toast.success(successMessage)
    } catch (error) {
      const msg =
        error?.data?.message || error?.data?.errorMessage || errorMessage
      toast.error(msg)
    }
  }

  const actions = [
    !isRetakeRound && {
      title: t("timeTravel.appealSubmitEnd"),
      subtitle: t("timeTravel.appealSubmitEndDesc"),
      buttonText: t("timeTravel.endSubmit"),
      icon: FastForward,
      isLoading: isAppealSubmitEnding,
      onClick: () =>
        handleAction(
          appealSubmitEnd,
          t("timeTravel.appealSubmitSuccess"),
          t("timeTravel.appealSubmitError")
        ),
    },
    !isRetakeRound && {
      title: t("timeTravel.appealReviewEnd"),
      subtitle: t("timeTravel.appealReviewEndDesc"),
      buttonText: t("timeTravel.endReview"),
      icon: CheckCircle,
      isLoading: isAppealReviewEnding,
      onClick: () =>
        handleAction(
          appealReviewEnd,
          t("timeTravel.appealReviewSuccess"),
          t("timeTravel.appealReviewError")
        ),
    },
    problemType === "Manual" && {
      title: t("timeTravel.judgeDeadlineEnd"),
      subtitle: t("timeTravel.judgeDeadlineEndDesc"),
      buttonText: t("timeTravel.endDeadline"),
      icon: Gavel,
      isLoading: isJudgeDeadlineEnding,
      onClick: () =>
        handleAction(
          judgeDeadlineEnd,
          t("timeTravel.judgeDeadlineSuccess"),
          t("timeTravel.judgeDeadlineError")
        ),
    },
    {
      title: t("timeTravel.finalize"),
      subtitle: t("timeTravel.finalizeDesc"),
      buttonText: t("timeTravel.finalizeBtn"),
      icon: Flag,
      isLoading: isFinalizing,
      onClick: () =>
        handleAction(
          finalizeRound,
          t("timeTravel.finalizeSuccess"),
          t("timeTravel.finalizeError")
        ),
    },
  ].filter(Boolean)

  return (
    <div className="flex flex-col gap-1">
      {actions.map((action, index) => {
        const Icon = action.icon
        return (
          <div
            key={index}
            className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]"
          >
            <div className="flex gap-5 items-center">
              <Icon size={20} />
              <div>
                <p className="text-[14px] leading-[20px]">{action.title}</p>
                <p className="text-[12px] leading-[16px] text-[#7A7574]">
                  {action.subtitle}
                </p>
              </div>
            </div>
            <button
              onClick={action.onClick}
              disabled={action.isLoading}
              className={`
                flex items-center justify-center gap-2 px-3
                ${action.isLoading ? "button-gray" : "button-white"}
                disabled:cursor-not-allowed
              `}
            >
              {action.isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-t-white border-gray-300 rounded-full animate-spin"></span>
                  <span>{t("timeTravel.processing")}</span>
                </>
              ) : (
                <span>{action.buttonText}</span>
              )}
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default RoundTimeTravelSection
