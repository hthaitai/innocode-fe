import React, { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, ChevronRight, ListPlus } from "lucide-react"
import { Icon } from "@iconify/react"
import { toast } from "react-hot-toast"
import { formatDateTime } from "@/shared/utils/dateTime"
import { Spinner } from "@/shared/components/SpinnerFluent"
// no modal here; navigation to dedicated pages
import {
  useGetRoundsByContestIdQuery,
  useStartRoundNowMutation,
  useEndRoundNowMutation,
} from "@/services/roundApi"
import { toDatetimeLocal } from "../../../../shared/utils/dateTime"

const RoundsList = ({ contestId }) => {
  const navigate = useNavigate()

  const {
    data: roundsData,
    isLoading,
    error,
  } = useGetRoundsByContestIdQuery(contestId)

  const [startRoundNow] = useStartRoundNowMutation()
  const [endRoundNow] = useEndRoundNowMutation()

  const rounds = roundsData?.data || []

  const handleAddRound = useCallback(() => {
    // Navigate to dedicated add round page instead of opening modal
    navigate(`/organizer/contests/${contestId}/rounds/new`)
  }, [contestId, navigate])

  const handleStartRound = async (e, roundId) => {
    e.stopPropagation()
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

  const handleEndRound = async (e, roundId) => {
    e.stopPropagation()
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
    <div className="space-y-1">
      {/* Add Round Section */}
      <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
        <div className="flex gap-5 items-center">
          <ListPlus size={20} />
          <div>
            <p className="text-[14px] leading-[20px]">Round Management</p>
            <p className="text-[12px] leading-[16px] text-[#7A7574]">
              Create and manage rounds for this contest
            </p>
          </div>
        </div>
        <button className="button-orange" onClick={handleAddRound}>
          Add round
        </button>
      </div>

      {/* Round List */}
      <div className="flex flex-col gap-1">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[70px]">
            <Spinner />
          </div>
        ) : error ? (
          <p className="text-red-500 text-sm">Error loading rounds</p>
        ) : rounds.length === 0 ? (
          <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
            No rounds created yet.
          </div>
        ) : (
          rounds.map((round) => (
            <div
              key={round.roundId}
              className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px] hover:bg-[#F6F6F6] transition-colors"
            >
              <div
                className="flex gap-5 items-center flex-1 cursor-pointer"
                onClick={() =>
                  navigate(
                    `/organizer/contests/${contestId}/rounds/${round.roundId}`
                  )
                }
              >
                <Calendar size={20} />
                <div>
                  <p className="text-[14px] leading-[20px]">
                    {round.name ?? "Untitled Round"}
                  </p>
                  <p className="text-[12px] leading-[16px] text-[#7A7574]">
                    {formatDateTime(round.start)} -{" "}
                    {formatDateTime(round.end)} |{" "}
                    {round.problemType || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleStartRound(e, round.roundId)}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors flex items-center gap-1.5"
                  title="Start round now"
                >
                  <Icon icon="mdi:play" className="w-3.5 h-3.5" />
                  <span>Start</span>
                </button>
                <button
                  onClick={(e) => handleEndRound(e, round.roundId)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center gap-1.5"
                  title="End round now"
                >
                  <Icon icon="mdi:stop" className="w-3.5 h-3.5" />
                  <span>End</span>
                </button>
                <ChevronRight
                  size={20}
                  className="text-[#7A7574] cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/organizer/contests/${contestId}/rounds/${round.roundId}`
                    )
                  }
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RoundsList
