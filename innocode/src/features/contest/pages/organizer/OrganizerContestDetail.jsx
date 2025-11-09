import React, { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AlertTriangle, Trash } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import ContestRelatedSettings from "../../components/organizer/ContestRelatedSettings"
import ContestInfo from "../../components/organizer/ContestInfo"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  fetchContests,
  deleteContest,
} from "@/features/contest/store/contestThunks"
import PublishContestSection from "../../components/organizer/PublishContestSection"
import { useConfirmDelete } from "../../../../shared/hooks/useConfirmDelete"

const OrganizerContestDetail = () => {
  const { contestId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { confirmDeleteEntity } = useConfirmDelete()

  const { contests, pagination, loading, error } = useAppSelector(
    (state) => state.contests
  )

  // --- Fetch contests for breadcrumb and validation ---
  useEffect(() => {
    dispatch(fetchContests({ pageNumber: 1, pageSize: 50 })) // optional pagination fetch
  }, [dispatch])

  const contest = contests.find(
    (c) => String(c.contestId) === String(contestId)
  )

  // --- Refetch logic consistent with OrganizerContests.jsx ---
  const refetchContests = () => {
    const safePage = Math.min(1, pagination.totalPages || 1)
    dispatch(fetchContests({ pageNumber: safePage, pageSize: 50 }))
  }

  // --- Breadcrumb setup ---
  const items = BREADCRUMBS.ORGANIZER_CONTEST_DETAIL(
    contest?.name ?? "Contest Detail"
  )
  const paths = BREADCRUMB_PATHS.ORGANIZER_CONTEST_DETAIL(contestId)

  // --- Missing contest state ---
  if (!contest) {
    return (
      <PageContainer breadcrumb={items} breadcrumbPaths={paths} bg={false}>
        <div className="text-sm leading-5 border border-[#E5E5E5] rounded-[5px] bg-white px-5 min-h-[70px] flex items-center gap-5 text-[#7A7574]">
          <AlertTriangle size={20} />
          <p>This contest has been deleted or is no longer available.</p>
        </div>
      </PageContainer>
    )
  }

  // --- Delete handler using useConfirmDelete ---
  const handleDeleteContest = () => {
    confirmDeleteEntity({
      entityName: "contest",
      item: contest,
      deleteAction: deleteContest,
      idKey: "contestId",
      onSuccess: refetchContests,
      onNavigate: () => navigate("/organizer/contests"),
    })
  }

  return (
    <PageContainer
      breadcrumb={items}
      breadcrumbPaths={paths}
      bg={false}
      loading={loading}
      error={error}
    >
      <div className="space-y-5">
        {/* Contest section */}
        <div className="space-y-1">
          <ContestInfo contest={contest} />
          <PublishContestSection contest={contest} />
        </div>

        {/* Related Settings */}
        <div>
          <div className="text-sm leading-5 font-semibold pt-3 pb-2">
            Related settings
          </div>
          <ContestRelatedSettings contestId={contestId} />
        </div>

        {/* Delete Contest */}
        <div>
          <div className="text-sm font-semibold pt-3 pb-2">More actions</div>
          <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
            <div className="flex gap-5 items-center">
              <Trash size={20} />
              <div>
                <p className="text-[14px] leading-[20px]">Delete contest</p>
              </div>
            </div>
            <button className="button-white" onClick={handleDeleteContest}>
              Delete Contest
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default OrganizerContestDetail
