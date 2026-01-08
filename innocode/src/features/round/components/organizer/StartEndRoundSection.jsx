import React from "react"
import { useTranslation } from "react-i18next"
import { toast } from "react-hot-toast"
import { Icon } from "@iconify/react"
import {
  useStartRoundNowMutation,
  useEndRoundNowMutation,
} from "../../../../services/roundApi"

const StartEndRoundSection = ({ roundId }) => {
  const { t } = useTranslation("round")
  const [startRoundNow, { isLoading: isStarting }] = useStartRoundNowMutation()
  const [endRoundNow, { isLoading: isEnding }] = useEndRoundNowMutation()

  const handleStartNow = async () => {
    try {
      await startRoundNow(roundId).unwrap()
      toast.success(t("actions.startSuccess"))
    } catch (error) {
      if (
        error?.data?.errorMessage === "Round already ended. Cannot start now."
      ) {
        toast.error(t("errors.roundAlreadyEnded"))
        return
      }

      const errorMessage =
        error?.data?.message ||
        error?.data?.errorMessage ||
        t("actions.startError")

      const previousRoundRegex =
        /Cannot start round '(.*?)' because previous round '(.*?)' is not finalized\./
      const match = errorMessage.match(previousRoundRegex)

      if (match) {
        toast.error(
          t("errors.previousRoundNotFinalized", {
            currentRound: match[1],
            previousRound: match[2],
          })
        )
        return
      }

      toast.error(errorMessage)
    }
  }

  const handleEndNow = async () => {
    try {
      await endRoundNow(roundId).unwrap()
      toast.success(t("actions.endSuccess"))
    } catch (error) {
      const errorMessage =
        error?.data?.message ||
        error?.data?.errorMessage ||
        t("actions.endError")
      toast.error(errorMessage)
    }
  }

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
      <div className="flex gap-5 items-center">
        <Icon icon="mdi:play-pause" fontSize={20} />
        <div>
          <p className="text-[14px] leading-[20px]">
            {t("actions.roundControl")}
          </p>
          <p className="text-[12px] leading-[16px] text-[#7A7574]">
            {t("actions.roundControlDesc")}
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
              <span>{t("actions.starting")}</span>
            </>
          ) : (
            <>
              <span>{t("actions.startNow")}</span>
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
              <span>{t("actions.ending")}</span>
            </>
          ) : (
            <>
              <span>{t("actions.endNow")}</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default StartEndRoundSection
