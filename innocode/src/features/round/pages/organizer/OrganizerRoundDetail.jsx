import React, { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { Trash } from "lucide-react"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "../../../../config/breadcrumbs"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import {
  fetchRounds as fetchRoundsThunk,
  deleteRound as deleteRoundThunk,
} from "@/features/round/store/roundThunk"
import { useConfirmDelete } from "../../../../shared/hooks/useConfirmDelete"
import RoundInfo from "../../components/organizer/RoundInfo"
import RoundRelatedSettings from "../../components/organizer/RoundRelatedSettings"

const OrganizerRoundDetail = () => {
  const { contestId: contestIdParam, roundId: roundIdParam } = useParams()
  const contestId = contestIdParam
  const roundId = roundIdParam
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { confirmDeleteEntity } = useConfirmDelete()

  const {
    rounds,
    loading: roundLoading,
    error: roundError,
  } = useAppSelector((s) => s.rounds)
  const { contests } = useAppSelector((s) => s.contests || { contests: [] })

  const round = rounds.find((r) => String(r.roundId) === String(roundId))
  const contest = contests?.find(
    (c) => String(c.contestId) === String(contestId)
  )

  useEffect(() => {
    if (roundId) {
      dispatch(fetchRoundsThunk({ roundId, pageNumber: 1, pageSize: 10 }))
    }
  }, [dispatch, roundId])

  const handleDeleteRound = () => {
    if (!round) return
    confirmDeleteEntity({
      entityName: "Round",
      item: round,
      deleteAction: deleteRoundThunk,
      idKey: "roundId",
      onSuccess: () => navigate(`/organizer/contests/${contestId}/rounds`),
    })
  }

  const items = BREADCRUMBS.ORGANIZER_ROUND_DETAIL(
    contestId,
    contest?.name ?? "Contest",
    round?.name ?? "Round"
  )
  const paths = BREADCRUMB_PATHS.ORGANIZER_ROUND_DETAIL(contestId, roundId)

  if (!round) {
    return (
      <PageContainer
        breadcrumb={items}
        breadcrumbPaths={paths}
        loading={roundLoading}
        error={roundError}
      >
        <div className="flex items-center justify-center h-[200px] text-gray-500">
          This round has been deleted or is no longer available.
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={items}
      breadcrumbPaths={paths}
      loading={roundLoading}
      error={roundError}
    >
      <div className="space-y-5">
        <RoundInfo round={round} />
        
        {/* Related Settings */}
        <div>
          <div className="text-sm leading-5 font-semibold pt-3 pb-2">
            Related settings
          </div>
          <RoundRelatedSettings contestId={contestId} round={round} />
        </div>

        {/* --- Delete Round --- */}
        <div>
          <div className="text-sm font-semibold pt-3 pb-2">More Actions</div>
          <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
            <div className="flex gap-5 items-center">
              <Trash size={20} />
              <div>
                <p className="text-[14px] leading-[20px]">Delete round</p>
              </div>
            </div>
            <button className="button-white" onClick={handleDeleteRound}>
              Delete Round
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default OrganizerRoundDetail
