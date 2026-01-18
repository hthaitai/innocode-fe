import { Upload } from "lucide-react"
import { toast } from "react-hot-toast"
import { useModal } from "@/shared/hooks/useModal"
import {
  useCheckPublishReadyQuery,
  usePublishContestMutation,
} from "@/services/contestApi"
import DetailTable from "../../../../shared/components/DetailTable"
import { useTranslation } from "react-i18next"
import { formatPublishError } from "../../utils/publishErrorUtils"

const PublishContestSection = ({ contest }) => {
  const { openModal, closeModal } = useModal()
  const { t } = useTranslation(["pages", "contest"])

  const { data: publishCheck } = useCheckPublishReadyQuery(contest?.contestId, {
    skip: !contest?.contestId || contest?.status !== "Draft",
  })

  const [publishContest, { isLoading: actionLoading }] =
    usePublishContestMutation()

  if (!contest) return null

  const isPublished = contest?.status !== "Draft"
  const isReady = publishCheck?.data?.isReady ?? false
  const missingItems = publishCheck?.data?.missing ?? []

  const handlePublish = () => {
    if (!isReady) {
      return openModal("alert", {
        title: t("contest:publish.cannotPublishTitle"),
        description: (
          <ul className="list-disc ml-4 text-[#7A7574]">
            {missingItems.map((item, idx) => (
              <li key={idx}>{formatPublishError(item)}</li>
            ))}
          </ul>
        ),
      })
    }

    openModal("confirm", {
      title: t("contest:publish.confirmTitle"),
      description: t("contest:publish.confirmMessage", {
        name: contest.name,
      }),
      onConfirm: async () => {
        let hasShownToast = false // Prevent duplicate toasts

        try {
          const result = await publishContest(contest.contestId).unwrap()
          console.log("✅ Publish contest result:", result)

          // If we get here, the request was successful
          // Check the actual response data to determine if publish succeeded
          const responseData = result?.data || result

          // Check if publish was actually successful
          if (
            responseData?.code === "SUCCESS" ||
            responseData?.status === "Published" ||
            result?.code === "SUCCESS" ||
            !responseData?.Message
          ) {
            if (!hasShownToast) {
              toast.success(t("contest:publish.success"))
              hasShownToast = true
            }
            closeModal()
          } else {
            // Response indicates failure even though request succeeded
            const missingFromError =
              responseData?.AdditionalData?.missing ??
              responseData?.data?.missing ??
              []
            const errorMessage =
              responseData?.Message ||
              responseData?.message ||
              t("contest:publish.error")
            const formattedErrorMessage = formatPublishError(errorMessage)

            if (!hasShownToast) {
              if (missingFromError.length > 0) {
                toast.error(
                  <ul className="list-disc ml-4">
                    {missingFromError.map((item, idx) => (
                      <li key={idx}>{formatPublishError(item)}</li>
                    ))}
                  </ul>,
                )
              } else {
                toast.error(formattedErrorMessage)
              }
              hasShownToast = true
            }
          }
        } catch (err) {
          console.error("❌ Publish contest error:", err)

          // Only show error if we haven't shown a toast yet
          if (!hasShownToast) {
            const errorData = err?.data || err
            const missingFromError =
              errorData?.AdditionalData?.missing ??
              errorData?.data?.missing ??
              []
            const errorMessage =
              errorData?.Message ||
              errorData?.message ||
              errorData?.errorMessage ||
              t("contest:publish.error")
            const formattedErrorMessage = formatPublishError(errorMessage)

            // Double check: sometimes error response might actually indicate success
            if (
              errorData?.code === "SUCCESS" ||
              errorData?.status === "Published"
            ) {
              toast.success(t("contest:publish.success"))
              closeModal()
              return
            }

            // Show actual error
            if (missingFromError.length > 0) {
              toast.error(
                <ul className="list-disc ml-4">
                  {missingFromError.map((item, idx) => (
                    <li key={idx}>{formatPublishError(item)}</li>
                  ))}
                </ul>,
              )
            } else {
              toast.error(formattedErrorMessage)
            }
            hasShownToast = true
          }
        }
      },
    })
  }

  const disabled = actionLoading || isPublished || !isReady
  const buttonText = isPublished
    ? t("contest:publish.buttonPublished")
    : actionLoading
      ? t("contest:publish.buttonLoading")
      : isReady
        ? t("contest:publish.button")
        : t("contest:publish.buttonNotReady")

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white overflow-hidden">
      {/* Header: Icon + Title + Button */}
      <div className="border-[#E5E5E5] px-5 flex justify-between items-center min-h-[70px]">
        <div className="flex gap-5 items-center">
          <Upload size={20} />
          <div>
            <p className="text-[14px] leading-[20px]">
              {t("contest:publish.title")}
            </p>
            <p className="text-[12px] leading-[16px] text-[#7A7574]">
              {isPublished
                ? t("contest:publish.subtitlePublished")
                : !isReady
                  ? t("contest:publish.subtitleNotReady")
                  : t("contest:publish.subtitleReady")}
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

      {/* Missing requirements */}
      {!isReady && missingItems.length > 0 && (
        <ul>
          {missingItems.map((item, idx) => (
            <li
              key={idx}
              className="border-t border-[#E5E5E5] px-5 py-3 text-sm leading-5 flex justify-between"
            >
              <div className="text-red-500">{formatPublishError(item)}</div>
              {/* <div className="text-[#7A7574]">
                {t("organizerContestDetail.publish.required")}
              </div> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PublishContestSection
