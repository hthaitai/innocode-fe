import React from "react"
import { toast } from "react-hot-toast"
import { Icon } from "@iconify/react"
import {
  useStartContestNowMutation,
  useEndContestNowMutation,
} from "../../../../services/contestApi"
import { useTranslation } from "react-i18next"

const StartEndContestSection = ({ contestId }) => {
  const [startContestNow, { isLoading: isStarting }] =
    useStartContestNowMutation()
  const [endContestNow, { isLoading: isEnding }] = useEndContestNowMutation()
  const { t } = useTranslation("pages")

  const handleStartNow = async () => {
    try {
      await startContestNow(contestId).unwrap()
      toast.success(t("organizerContestDetail.control.startSuccess"))
    } catch (error) {
      const errorMessage =
        error?.data?.message ||
        error?.data?.errorMessage ||
        t("organizerContestDetail.control.startError")
      toast.error(errorMessage)
    }
  }

  const handleEndNow = async () => {
    try {
      await endContestNow(contestId).unwrap()
      toast.success(t("organizerContestDetail.control.endSuccess"))
    } catch (error) {
      const errorMessage =
        error?.data?.message ||
        error?.data?.errorMessage ||
        t("organizerContestDetail.control.endError")
      toast.error(errorMessage)
    }
  }

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
      <div className="flex gap-5 items-center">
        <Icon icon="mdi:play-pause" fontSize={20} />
        <div>
          <p className="text-[14px] leading-[20px]">
            {t("organizerContestDetail.control.title")}
          </p>
          <p className="text-[12px] leading-[16px] text-[#7A7574]">
            {t("organizerContestDetail.control.subtitle")}
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
              <span>{t("organizerContestDetail.control.starting")}</span>
            </>
          ) : (
            <>
              <span>{t("organizerContestDetail.control.start")}</span>
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
              <span>{t("organizerContestDetail.control.ending")}</span>
            </>
          ) : (
            <>
              <span>{t("organizerContestDetail.control.end")}</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default StartEndContestSection
