import React, { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, ChevronRight, ListPlus } from "lucide-react"
import { formatDateTime } from "@/shared/utils/dateTime"
import { Spinner } from "@/shared/components/SpinnerFluent"
// no modal here; navigation to dedicated pages
import { useGetRoundsByContestIdQuery } from "@/services/roundApi"

const RoundsList = ({ contestId }) => {
  const navigate = useNavigate()

  const { data: roundsData, isLoading, error } = useGetRoundsByContestIdQuery(
    contestId
  )

  const rounds = roundsData?.data || []

  const handleAddRound = useCallback(() => {
    // Navigate to dedicated add round page instead of opening modal
    navigate(`/organizer/contests/${contestId}/rounds/new`)
  }, [contestId, navigate])

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
              className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px] hover:bg-[#F6F6F6] transition-colors cursor-pointer"
              onClick={() =>
                navigate(
                  `/organizer/contests/${contestId}/rounds/${round.roundId}`
                )
              }
            >
              <div className="flex gap-5 items-center flex-1">
                <Calendar size={20} />
                <div>
                  <p className="text-[14px] leading-[20px]">
                    {round.name ?? "Untitled Round"}
                  </p>
                  <p className="text-[12px] leading-[16px] text-[#7A7574]">
                    {formatDateTime(round.start)} - {formatDateTime(round.end)}{" "}
                    | {round.problemType || "—"}
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#7A7574]" />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RoundsList
