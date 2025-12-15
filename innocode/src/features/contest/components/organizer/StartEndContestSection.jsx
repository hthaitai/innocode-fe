import React from "react"
import { toast } from "react-hot-toast"
import { Icon } from "@iconify/react"
import {
  useStartContestNowMutation,
  useEndContestNowMutation,
} from "../../../../services/contestApi"

const StartEndContestSection = ({ contestId }) => {
  const [startContestNow, { isLoading: isStarting }] =
    useStartContestNowMutation()
  const [endContestNow, { isLoading: isEnding }] = useEndContestNowMutation()

  const handleStartNow = async () => {
    try {
      await startContestNow(contestId).unwrap()
      toast.success("Contest started successfully")
    } catch (error) {
      const errorMessage =
        error?.data?.message ||
        error?.data?.errorMessage ||
        "Failed to start contest"
      toast.error(errorMessage)
    }
  }

  const handleEndNow = async () => {
    try {
      await endContestNow(contestId).unwrap()
      toast.success("Contest ended successfully")
    } catch (error) {
      const errorMessage =
        error?.data?.message ||
        error?.data?.errorMessage ||
        "Failed to end contest"
      toast.error(errorMessage)
    }
  }

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
      <div className="flex gap-5 items-center">
        <Icon icon="mdi:play-pause" className="w-5 h-5 text-[#7A7574]" />
        <div>
          <p className="text-[14px] leading-[20px]">Contest Control</p>
          <p className="text-[12px] leading-[16px] text-[#7A7574]">
            Start or end the contest immediately
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleStartNow}
          disabled={isStarting || isEnding}
          className="button-orange flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isStarting ? (
            <>
              <span className="w-4 h-4 border-2 border-t-white border-orange-300 rounded-full animate-spin"></span>
              <span>Starting...</span>
            </>
          ) : (
            <>
              <Icon icon="mdi:play" className="w-4 h-4" />
              <span>Start Now</span>
            </>
          )}
        </button>
        <button
          onClick={handleEndNow}
          disabled={isStarting || isEnding}
          className="button-gray flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEnding ? (
            <>
              <span className="w-4 h-4 border-2 border-t-white border-gray-300 rounded-full animate-spin"></span>
              <span>Ending...</span>
            </>
          ) : (
            <>
              <Icon icon="mdi:stop" className="w-4 h-4" />
              <span>End Now</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default StartEndContestSection

