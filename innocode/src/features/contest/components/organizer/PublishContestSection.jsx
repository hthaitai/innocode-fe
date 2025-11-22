import { Upload } from "lucide-react"
import { toast } from "react-hot-toast"
import { useModal } from "@/shared/hooks/useModal"
import {
  useCheckPublishReadyQuery,
  usePublishContestMutation,
} from "@/services/contestApi"

const PublishContestSection = ({ contest }) => {
  const { openModal } = useModal()

  const { data: publishCheck } = useCheckPublishReadyQuery(contest?.contestId, {
    skip: !contest?.contestId || contest?.status === "Published",
  })

  const [publishContest, { isLoading: actionLoading }] =
    usePublishContestMutation()

  if (!contest) return null

  const isPublished = contest?.status === "Published"
  const isReady = publishCheck?.data?.isReady ?? false
  const missingItems = publishCheck?.data?.missing ?? []

  const handlePublish = () => {
    if (!isReady) {
      return openModal("alert", {
        title: "Cannot Publish Contest",
        description: `Contest is not ready. Missing: ${
          missingItems.join(", ") || "required items"
        }`,
      })
    }

    openModal("confirm", {
      title: "Publish Contest",
      description: `Are you sure you want to publish "${contest.name}"?`,
      onConfirm: async (onClose) => {
        try {
          await publishContest(contest.contestId).unwrap()
          toast.success("Contest published successfully!")
          onClose()
          // No need to manually refetch — RTK Query invalidates tags automatically
        } catch (err) {
          const missingFromError = err?.data?.AdditionalData?.missing ?? []
          toast.error(
            missingFromError.length
              ? `Cannot publish: ${missingFromError.join(", ")}`
              : err?.data?.Message || "Failed to publish contest"
          )
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
          disabled ? "button-gray" : "button-orange"
        } ${actionLoading ? "opacity-70" : ""}`}
      >
        {buttonText}
      </button>
    </div>
  )
}

export default PublishContestSection
