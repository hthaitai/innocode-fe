import React from "react"
import { toast } from "react-hot-toast"
import { Icon } from "@iconify/react"
import {
  useStartRegistrationNowMutation,
  useEndRegistrationNowMutation,
} from "../../../../services/contestApi"
import { useTranslation } from "react-i18next"

const StartEndRegistrationSection = ({ contestId }) => {
  const [startRegistrationNow, { isLoading: isStarting }] =
    useStartRegistrationNowMutation()
  const [endRegistrationNow, { isLoading: isEnding }] =
    useEndRegistrationNowMutation()
  const { t } = useTranslation(["pages", "contest"])

  const handleStartNow = async () => {
    try {
      await startRegistrationNow(contestId).unwrap()
      toast.success(
        t("organizerContestDetail.registrationControl.startSuccess")
      )
    } catch (error) {
      let errorMessage = error?.data?.message || error?.data?.errorMessage

      if (
        errorMessage ===
        "Registration end time is earlier than or equal to requested start."
      ) {
        errorMessage = t("contest:validation.registrationEndEarlierThanStart")
      } else if (!errorMessage) {
        errorMessage = t(
          "organizerContestDetail.registrationControl.startError"
        )
      }
      toast.error(errorMessage)
    }
  }

  const handleEndNow = async () => {
    try {
      await endRegistrationNow(contestId).unwrap()
      toast.success(t("organizerContestDetail.registrationControl.endSuccess"))
    } catch (error) {
      let errorMessage = error?.data?.message || error?.data?.errorMessage

      if (errorMessage === "Registration end cannot be after contest start.") {
        errorMessage = t("contest:validation.registrationEndAfterContestStart")
      } else if (
        errorMessage === "Registration end cannot be before registration start."
      ) {
        errorMessage = t("contest:validation.registrationEndBeforeStart")
      } else if (!errorMessage) {
        errorMessage = t("organizerContestDetail.registrationControl.endError")
      }
      toast.error(errorMessage)
    }
  }

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 gap-5 flex justify-between items-center min-h-[70px]">
      <div className="flex gap-5 items-center">
        <Icon icon="mdi:calendar-clock" fontSize={20} />
        <div>
          <p className="text-[14px] leading-[20px]">
            {t("organizerContestDetail.registrationControl.title")}
          </p>
          <p className="text-[12px] leading-[16px] text-[#7A7574]">
            {t("organizerContestDetail.registrationControl.subtitle")}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleStartNow}
          disabled={isStarting || isEnding}
          className={`
            flex items-center justify-center gap-2
            ${isStarting ? "button-gray" : "button-white"}
            disabled:cursor-not-allowed
          `}
        >
          {isStarting ? (
            <>
              <span className="w-4 h-4 border-2 border-t-white border-gray-300 rounded-full animate-spin"></span>
              <span>
                {t("organizerContestDetail.registrationControl.starting")}
              </span>
            </>
          ) : (
            <>
              <span>
                {t("organizerContestDetail.registrationControl.start")}
              </span>
            </>
          )}
        </button>
        <button
          onClick={handleEndNow}
          disabled={isStarting || isEnding}
          className={`
            flex items-center justify-center gap-2
            ${isEnding ? "button-gray" : "button-white"}
            disabled:cursor-not-allowed
          `}
        >
          {isEnding ? (
            <>
              <span className="w-4 h-4 border-2 border-t-white border-gray-300 rounded-full animate-spin"></span>
              <span>
                {t("organizerContestDetail.registrationControl.ending")}
              </span>
            </>
          ) : (
            <>
              <span>{t("organizerContestDetail.registrationControl.end")}</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default StartEndRegistrationSection
