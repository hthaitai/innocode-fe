import React, { useEffect, useMemo, useCallback, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { Trash } from "lucide-react"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import RoundInfo from "../../components/organizer/RoundInfo"
import RoundRelatedSettings from "../../components/organizer/RoundRelatedSettings"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { fetchOrganizerContests } from "@/features/contest/store/contestThunks"
import { deleteRound } from "../../store/roundThunk"
import { useModal } from "../../../../shared/hooks/useModal"
import { toast } from "react-hot-toast"
import DeleteRoundSection from "../../components/organizer/DeleteRoundSection"

const OrganizerRoundDetail = () => {
  const { contestId, roundId } = useParams()
  const dispatch = useAppDispatch()

  const { contests, listLoading, listError } = useAppSelector(
    (state) => state.contests
  )

  const [contest, setContest] = useState(null)
  const [round, setRound] = useState(null)

  /* Fetch round detail */
  const fetchRoundDetail = useCallback(() => {
    const foundContest = contests?.find(
      (c) => String(c.contestId) === String(contestId)
    )

    if (!foundContest) {
      if (!listLoading) {
        dispatch(fetchOrganizerContests({ pageNumber: 1, pageSize: 50 }))
      }
      return
    }

    const foundRound = foundContest.rounds?.find(
      (r) => String(r.roundId) === String(roundId)
    )

    setContest(foundContest || null)
    setRound(foundRound || null)
  }, [contests, contestId, roundId, dispatch, listLoading])

  useEffect(() => {
    fetchRoundDetail()
  }, [fetchRoundDetail])

  const breadcrumbItems = useMemo(
    () =>
      BREADCRUMBS.ORGANIZER_ROUND_DETAIL(
        contestId,
        contest?.name ?? "Contest",
        round?.name ?? "Round"
      ),
    [contestId, contest?.name, round?.name]
  )

  const breadcrumbPaths = useMemo(
    () => BREADCRUMB_PATHS.ORGANIZER_ROUND_DETAIL(contestId, roundId),
    [contestId, roundId]
  )

  if (!round && !listLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
          This round has been deleted or is no longer available.
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      listLoading={listLoading}
      listError={listError}
    >
      <div className="space-y-5">
        <RoundInfo round={round} />

        <div>
          <div className="text-sm font-semibold pt-3 pb-2">
            Related settings
          </div>
          <RoundRelatedSettings contestId={contestId} round={round} />
        </div>

        <div>
          <div className="text-sm font-semibold pt-3 pb-2">More Actions</div>
          <DeleteRoundSection round={round} contestId={contestId} />
        </div>
      </div>
    </PageContainer>
  )
}

export default OrganizerRoundDetail
