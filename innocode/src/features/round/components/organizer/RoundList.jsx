import React, { useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, ChevronRight, ListPlus } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchContests } from "@/features/contest/store/contestThunks"
import { formatDateTime } from "@/shared/utils/dateTime"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import { useModal } from "@/shared/hooks/useModal"
import { mapRoundList } from "../../mappers/roundMapper"

const RoundsList = ({ contestId }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { openModal } = useModal()

  const { contests, pagination, loading, error } = useAppSelector(
    (state) => state.contests
  )

  // Get contest and extract rounds
  const contest = useMemo(
    () => contests.find((c) => String(c.contestId) === String(contestId)),
    [contests, contestId]
  )

  // Map rounds from contest object
  const rounds = useMemo(() => {
    if (!contest?.rounds) return []
    return mapRoundList(contest.rounds)
  }, [contest?.rounds])

  // Refetch contests to get updated rounds
  const refetchContests = useCallback(() => {
    const currentPage = pagination?.pageNumber || 1
    const safePage = Math.min(currentPage, pagination?.totalPages || 1)
    dispatch(fetchContests({ pageNumber: safePage, pageSize: 50 }))
  }, [dispatch, pagination?.pageNumber, pagination?.totalPages])

  // Handle add round - memoized
  const handleAddRound = useCallback(() => {
    openModal("round", {
      contestId,
      onCreated: refetchContests,
      onUpdated: refetchContests,
    })
  }, [openModal, contestId, refetchContests])

  return (
    <div className="space-y-1">
      {/* Header */}
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

      {error && <p className="text-red-500">Error loading rounds</p>}

      {loading ? (
        <Spinner />
      ) : !contest ? (
        <p className="text-[#7A7574] text-sm">Loading contest...</p>
      ) : rounds.length === 0 ? (
        <p className="text-[#7A7574] text-sm">No rounds created yet.</p>
      ) : null}

      <div className="flex flex-col gap-1">
        {rounds?.filter(Boolean).map((round) => (
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
                  {formatDateTime(round.start)} - {formatDateTime(round.end)} |{" "}
                  {round.problemType || "—"}
                </p>
              </div>
            </div>

            <ChevronRight size={20} className="text-[#7A7574]" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default RoundsList
