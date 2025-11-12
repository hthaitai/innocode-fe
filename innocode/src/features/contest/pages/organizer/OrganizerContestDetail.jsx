import React, { useCallback, useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import ContestInfo from "../../components/organizer/ContestInfo"
import PublishContestSection from "../../components/organizer/PublishContestSection"
import ContestRelatedSettings from "../../components/organizer/ContestRelatedSettings"
import RoundsList from "../../components/organizer/RoundList"
import { AlertTriangle, Trash } from "lucide-react"
import { useOrganizerContestDetail } from "../../hooks/useOrganizerContestDetail"
import { useModal } from "@/shared/hooks/useModal"

const OrganizerContestDetail = () => {
  const { contestId } = useParams()
  const navigate = useNavigate()

  const {
    contest,
    loading,
    error,
    fetchContestDetail,
    handleEdit,
    handleDelete,
  } = useOrganizerContestDetail()

  // Fetch contest detail on mount / param change
  useEffect(() => {
    fetchContestDetail(contestId)
  }, [contestId, fetchContestDetail])

  const breadcrumbItems = useMemo(
    () =>
      BREADCRUMBS.ORGANIZER_CONTEST_DETAIL(contest?.name ?? "Contest Detail"),
    [contest?.name]
  )

  const breadcrumbPaths = useMemo(
    () => BREADCRUMB_PATHS.ORGANIZER_CONTEST_DETAIL(contestId),
    [contestId]
  )

  // Delete handler with redirect
  const handleDeleteContest = useCallback(() => {
    handleDelete({
      ...contest,
      onSuccess: () => navigate("/organizer/contests"),
    })
  }, [contest, handleDelete, navigate])

  if (!contest && !loading) {
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
      loading={loading}
      error={error}
    >
      <div className="space-y-5">
        {/* Contest Info + Publish */}
        <div className="space-y-1">
          <ContestInfo contest={contest} onEdit={() => handleEdit(contest)} />
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
        <div>
          <div className="text-sm leading-5 font-semibold pt-3 pb-2">
            Other settings
          </div>
          <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
            <div className="flex items-center gap-3">
              <Trash size={20} />
              <span className="text-sm leading-5">Delete contest</span>
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
