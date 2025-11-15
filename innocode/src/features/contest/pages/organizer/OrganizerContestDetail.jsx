import React, { useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import ContestInfo from "../../components/organizer/ContestInfo"
import PublishContestSection from "../../components/organizer/PublishContestSection"
import ContestRelatedSettings from "../../components/organizer/ContestRelatedSettings"
import RoundsList from "../../components/organizer/RoundList"
import DeleteContestSection from "../../components/organizer/DeleteContestSection"
import { useAppDispatch, useAppSelector } from "../../../../store/hooks"
import { fetchContestById } from "../../store/contestThunks"

const OrganizerContestDetail = () => {
  const { contestId } = useParams()
  const dispatch = useAppDispatch()

  const { contest, detailLoading, detailError } = useAppSelector(
    (state) => state.contests
  )

  // Fetch contest on mount / id change
  useEffect(() => {
    if (!contestId) return
    if (!contest || contest.contestId !== contestId) {
      dispatch(fetchContestById(contestId))
    }
  }, [dispatch, contestId, contest?.contestId])

  // Breadcrumbs
  const breadcrumbItems = useMemo(
    () =>
      BREADCRUMBS.ORGANIZER_CONTEST_DETAIL(contest?.name ?? "Contest Detail"),
    [contest?.name]
  )

  const breadcrumbPaths = useMemo(
    () => BREADCRUMB_PATHS.ORGANIZER_CONTEST_DETAIL(contestId),
    [contestId]
  )

  // If not found
  if (!contest && !detailLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
          This contest has been deleted or is no longer available.
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={detailLoading}
      error={detailError}
    >
      <div className="space-y-5">
        {/* Contest Info + Publish */}
        <div className="space-y-1">
          <ContestInfo contest={contest} />
          <PublishContestSection contest={contest} />
        </div>

        {/* Rounds */}
        <div>
          <div className="text-sm leading-5 font-semibold pt-3 pb-2">
            Rounds management
          </div>
          <RoundsList contestId={contestId} />
        </div>

        {/* Related Settings */}
        <div>
          <div className="text-sm leading-5 font-semibold pt-3 pb-2">
            Related settings
          </div>
          <ContestRelatedSettings contestId={contestId} />
        </div>

        {/* Delete */}
        <DeleteContestSection contest={contest} />
      </div>
    </PageContainer>
  )
}

export default OrganizerContestDetail
