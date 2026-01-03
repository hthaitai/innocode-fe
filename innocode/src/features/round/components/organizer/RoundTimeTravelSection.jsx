import React from "react"
import { toast } from "react-hot-toast"
import { FastForward, CheckCircle, Gavel, Flag } from "lucide-react"
import {
  useAppealSubmitEndMutation,
  useAppealReviewEndMutation,
  useJudgeDeadlineEndMutation,
  useFinalizeRoundMutation,
} from "@/services/roundApi"

const RoundTimeTravelSection = ({ roundId }) => {
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
    {
      title: "End appeal submission",
      subtitle: "End the appeal submission phase immediately",
      buttonText: "End submit",
      icon: FastForward,
      isLoading: isAppealSubmitEnding,
      onClick: () =>
        handleAction(
          appealSubmitEnd,
          "Appeal submission ended successfully",
          "Failed to end appeal submission"
        ),
    },
    {
      title: "End appeal review",
      subtitle: "End the appeal review phase immediately",
      buttonText: "End review",
      icon: CheckCircle,
      isLoading: isAppealReviewEnding,
      onClick: () =>
        handleAction(
          appealReviewEnd,
          "Appeal review ended successfully",
          "Failed to end appeal review"
        ),
    },
    {
      title: "End judge deadline",
      subtitle: "End the judge grading deadline immediately",
      buttonText: "End deadline",
      icon: Gavel,
      isLoading: isJudgeDeadlineEnding,
      onClick: () =>
        handleAction(
          judgeDeadlineEnd,
          "Judge deadline ended successfully",
          "Failed to end judge deadline"
        ),
    },
    {
      title: "Finalize round",
      subtitle: "Finalize the round and publish results immediately",
      buttonText: "Finalize",
      icon: Flag,
      isLoading: isFinalizing,
      onClick: () =>
        handleAction(
          finalizeRound,
          "Round finalized successfully",
          "Failed to finalize round"
        ),
    },
  ]

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
                  <span>Processing...</span>
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
