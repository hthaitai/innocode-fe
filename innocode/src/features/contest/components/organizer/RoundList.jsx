import React, { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, ChevronRight, ListPlus } from "lucide-react"
import { formatDateTime } from "@/shared/utils/dateTime"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import { useModal } from "@/shared/hooks/useModal"
import { useOrganizerContestRounds } from "../../hooks/useOrganizerContestRounds"
import AddSection from "../../../../shared/components/AddSection"

const RoundsList = ({ contestId }) => {
  const navigate = useNavigate()

  const { openModal } = useModal()

  const { contest, rounds, loading, error, refetch } =
    useOrganizerContestRounds(contestId)

  // Handle add round - memoized
  const handleAddRound = useCallback(() => {
    openModal("round", {
      contestId,
      onCreated: refetch,
      onUpdated: refetch,
    })
  }, [openModal, contestId, refetch])

  if (loading) return <Spinner />
  if (error) return <p className="text-red-500 text-sm">Error loading rounds</p>

  return (
    <div className="space-y-1">
      <AddSection
        icon={ListPlus}
        title="Round Management"
        subtitle="Create and manage rounds for this contest"
        addLabel="Add round"
        onAdd={handleAddRound}
      />

      {/* Empty or loading states */}
      {rounds.length === 0 ? (
        <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
          No rounds created yet.
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {rounds.map((round) => (
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
                    {round?.name ?? "Untitled Round"}
                  </p>
                  <p className="text-[12px] leading-[16px] text-[#7A7574]">
                    {formatDateTime(round.start)} - {formatDateTime(round.end)}{" "}
                    | {round.problemType || "—"}
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#7A7574]" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RoundsList
