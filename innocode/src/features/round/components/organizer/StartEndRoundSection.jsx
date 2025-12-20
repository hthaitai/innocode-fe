import React from "react"
import { toast } from "react-hot-toast"
import { Icon } from "@iconify/react"
import {
  useStartRoundNowMutation,
  useEndRoundNowMutation,
} from "../../../../services/roundApi"

const StartEndRoundSection = ({ roundId }) => {
  const [startRoundNow, { isLoading: isStarting }] = useStartRoundNowMutation()
  const [endRoundNow, { isLoading: isEnding }] = useEndRoundNowMutation()

  const handleStartNow = async () => {
    try {
      await startRoundNow(roundId).unwrap()
      toast.success("Round started successfully")
    } catch (error) {
      const errorMessage =
        error?.data?.message ||
        error?.data?.errorMessage ||
        "Failed to start round"
      toast.error(errorMessage)
    }
  }

  const handleEndNow = async () => {
    try {
      await endRoundNow(roundId).unwrap()
      toast.success("Round ended successfully")
    } catch (error) {
      const errorMessage =
        error?.data?.message ||
        error?.data?.errorMessage ||
        "Failed to end round"
      toast.error(errorMessage)
    }
  }

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
      <div className="flex gap-5 items-center">
        <Icon icon="mdi:play-pause" fontSize={20} />
        <div>
          <p className="text-[14px] leading-[20px]">Round control</p>
          <p className="text-[12px] leading-[16px] text-[#7A7574]">
            Start or end the round immediately
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
              <span>Starting...</span>
            </>
          ) : (
            <>
              <span>Start now</span>
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
              <span>Ending...</span>
            </>
          ) : (
            <>
              <span>End now</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default StartEndRoundSection
