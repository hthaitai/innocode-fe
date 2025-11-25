import { Upload } from "lucide-react"
import { toast } from "react-hot-toast"
import { useModal } from "@/shared/hooks/useModal"
import {
  useCheckPublishReadyQuery,
  usePublishContestMutation,
} from "@/services/contestApi"
import DetailTable from "../../../../shared/components/DetailTable"

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
        description: (
          <ul className="list-disc ml-4 text-[#7A7574]">
            {missingItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ),
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
        } catch (err) {
          const missingFromError = err?.data?.AdditionalData?.missing ?? []
          toast.error(
            missingFromError.length ? (
              <ul className="list-disc ml-4">
                {missingFromError.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : (
              err?.data?.Message || "Failed to publish contest"
            )
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

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white overflow-hidden">
      {/* Header: Icon + Title + Button */}
      <div className="border-b border-[#E5E5E5] px-5 flex justify-between items-center min-h-[70px]">
        <div className="flex gap-5 items-center">
          <Upload size={20} />
          <div>
            <p className="text-[14px] leading-[20px]">Publish contest</p>
            <p className="text-[12px] leading-[16px] text-[#7A7574]">
              {!isReady
                ? "Contest is not ready to publish."
                : isPublished
                ? "This contest has already been published."
                : "Make this contest visible and active for participants."}
            </p>
          </div>
        </div>

        <button
          onClick={handlePublish}
          disabled={disabled}
          className={`${disabled ? "button-gray" : "button-orange"} ${
            actionLoading ? "opacity-70" : ""
          }`}
        >
          {buttonText}
        </button>
      </div>

      {/* Detailed Missing Items */}
      {!isReady && missingItems.length > 0 && (
        <div className="text-sm leading-5 bg-white rounded-[5px] border-b border-[#E5E5E5]">
          <div className="pl-[60px] px-5 py-4 min-h-[70px]">
            <DetailTable
              data={missingItems.map((item, idx) => ({
                label: `Requirement ${idx + 1}`,
                value: item,
              }))}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default PublishContestSection
