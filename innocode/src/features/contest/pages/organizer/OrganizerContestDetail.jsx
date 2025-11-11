import React, { useMemo } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import ContestInfo from "../../components/organizer/ContestInfo"
import PublishContestSection from "../../components/organizer/PublishContestSection"
import ContestRelatedSettings from "../../components/organizer/ContestRelatedSettings"
import RoundsList from "../../../round/components/organizer/RoundList"
import { AlertTriangle, Trash } from "lucide-react"
import { useContestDetail } from "../../hooks/useContestDetail"

const OrganizerContestDetail = () => {
  const { contestId } = useParams()
  const { contest, loading, error, handleEdit, handleDelete } =
    useContestDetail(contestId)

  const breadcrumbItems = useMemo(
    () =>
      BREADCRUMBS.ORGANIZER_CONTEST_DETAIL(contest?.name ?? "Contest Detail"),
    [contest?.name]
  )

  const breadcrumbPaths = useMemo(
    () => BREADCRUMB_PATHS.ORGANIZER_CONTEST_DETAIL(contestId),
    [contestId]
  )

  if (!contest && !loading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <div className="flex items-center gap-3 text-sm border rounded px-4 py-3 bg-white">
          <AlertTriangle size={18} />
          This contest does not exist or was deleted.
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
        <div className="space-y-1">
          <ContestInfo contest={contest} onEdit={handleEdit} />
          <PublishContestSection contest={contest} />
        </div>

        <div>
          <div className="text-sm leading-5 font-semibold pt-3 pb-2">
            Rounds management
          </div>
          <RoundsList contestId={contestId} />
        </div>

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
            <button className="button-white" onClick={handleDelete}>
              Delete Contest
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default OrganizerContestDetail
