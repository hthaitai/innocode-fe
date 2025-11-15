import { Upload } from "lucide-react"
import { toast } from "react-hot-toast"
import { useModal } from "@/shared/hooks/useModal"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  checkPublishReady,
  publishContest,
} from "@/features/contest/store/contestThunks"
import { useEffect } from "react"

const PublishContestSection = ({ contest }) => {
  const dispatch = useAppDispatch()
  const { openModal } = useModal()

  const actionLoading = useAppSelector((state) => state.contests.actionLoading)
  const publishCheck = useAppSelector((state) => state.contests.publishCheck)

  if (!contest) return null

  const isPublished = contest?.status === "Published"
  const isReady = publishCheck?.isReady
  const missingItems = publishCheck?.missing || []

  // --- Check if contest is ready ---
  useEffect(() => {
    if (!contest?.contestId || isPublished) return
    dispatch(checkPublishReady(contest.contestId))
  }, [contest?.contestId, isPublished, dispatch])

  // --- Publish handler ---
  const handlePublish = () => {
    if (!isReady) {
      openModal("alert", {
        title: "Cannot Publish Contest",
        description: `Contest is not ready. Missing: ${
          missingItems.join(", ") || "required items"
        }`,
      })
      return
    }

    openModal("confirm", {
      title: "Publish Contest",
      description: `Are you sure you want to publish "${contest.name}"?`,
      onConfirm: async (onClose) => {
        const result = await dispatch(publishContest(contest.contestId))
        if (publishContest.fulfilled.match(result)) {
          toast.success("Contest published successfully!")
          onClose()
          dispatch(checkPublishReady(contest.contestId)) // refresh readiness
        } else {
          const err = result.payload
          toast.error(err?.Message || "Failed to publish contest")
        }
      },
    })
  }

  const disabled = actionLoading || isPublished || !isReady
  const buttonText = isPublished
    ? "Already Published"
    : actionLoading
    ? "Publishing..."
    : isReady
    ? "Publish"
    : "Not Ready"

  const helperText = isPublished
    ? "This contest has already been published."
    : isReady
    ? "Make this contest visible and active for participants."
    : `Cannot publish: ${missingItems.join(", ") || "Required items missing"}`

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
      <div className="flex gap-5 items-center">
        <Upload size={20} />
        <div>
          <p className="text-[14px] leading-[20px]">Publish contest</p>
          <p className="text-[12px] leading-[16px] text-[#7A7574]">
            {helperText}
          </p>
        </div>
      </div>
      <button
        onClick={handlePublish}
        disabled={disabled}
        className={`${
          disabled ? "button-gray cursor-not-allowed" : "button-orange"
        } ${actionLoading ? "opacity-70" : ""}`}
      >
        {buttonText}
      </button>
    </div>
  )
}

export default PublishContestSection
