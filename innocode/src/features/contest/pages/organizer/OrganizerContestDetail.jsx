import React, { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AlertTriangle, Trash } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import ContestRelatedSettings from "../../components/organizer/ContestRelatedSettings"
import ContestInfo from "../../components/organizer/ContestInfo"
import RoundsTable from "../../components/organizer/RoundsTable"
import { createBreadcrumbWithPaths } from "@/config/breadcrumbs"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  fetchContests,
  addContest,
  updateContest,
  deleteContest,
} from "@/features/contest/store/contestThunks"
import PublishContestSection from "../../components/organizer/PublishContestSection"
import { useCrud } from "@/shared/hooks/useCrud"
import { Spinner } from "../../../../shared/components/SpinnerFluent"

const OrganizerContestDetail = () => {
  const { contestId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { contests, pagination, loading, error } = useAppSelector(
    (state) => state.contests
  )

  // --- Fetch contests for breadcrumb and validation ---
  useEffect(() => {
    dispatch(fetchContests({ pageNumber: 1, pageSize: 50 })) // optional pagination fetch
  }, [dispatch])

  const contest = contests.find((c) => String(c.contestId) === String(contestId))

  // --- Refetch logic consistent with OrganizerContests.jsx ---
  const refetchContests = () => {
    const safePage = Math.min(1, pagination.totalPages || 1)
    dispatch(fetchContests({ pageNumber: safePage, pageSize: 50 }))
  }

  // --- useCrud setup ---
  const { confirmDeleteEntity } = useCrud({
    entityName: "contest",
    createAction: addContest,
    updateAction: updateContest,
    deleteAction: deleteContest,
    idKey: "contestId",
    onSuccess: refetchContests,
  })

  // --- Breadcrumb setup ---
  const { items, paths } = createBreadcrumbWithPaths(
    "ORGANIZER_CONTEST_DETAIL",
    contest?.name ?? "Contest Detail",
    contestId
  )

  // --- Loading state ---
  if (loading) {
    return (
      <PageContainer breadcrumb={items} breadcrumbPaths={paths} bg={false}>
        <Spinner />
      </PageContainer>
    )
  }

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

  // --- Delete handler using useCrud ---
  const handleDeleteContest = () => {
    confirmDeleteEntity(contest, () => navigate("/organizer/contests"))
  }

  return (
    <PageContainer breadcrumb={items} breadcrumbPaths={paths} bg={false}>
      <div className="space-y-5">
        {/* Contest section */}
        <div className="space-y-1">
          <ContestInfo contest={contest} />
          <PublishContestSection contest={contest} />
        </div>

        {/* Rounds Table */}
        <div>
          <div className="text-sm font-semibold pt-3 pb-2">Rounds</div>
          <RoundsTable contestId={contestId} />
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
