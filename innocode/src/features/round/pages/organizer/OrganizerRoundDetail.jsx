import React, { useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { Trash } from "lucide-react"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import RoundInfo from "../../components/organizer/RoundInfo"
import RoundRelatedSettings from "../../components/organizer/RoundRelatedSettings"
import { useOrganizerRoundDetail } from "../../hooks/useOrganizerRoundDetail"

const OrganizerRoundDetail = () => {
  const { contestId, roundId } = useParams()
  const {
    contest,
    round,
    loading,
    error,
    handleEdit,
    handleDelete,
  } = useOrganizerRoundDetail(contestId, roundId)

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

  if (!round && !loading) {
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
      loading={loading}
      error={error}
    >
      <div className="space-y-5">
        <RoundInfo round={round} onEdit={handleEdit} />

        <div>
          <div className="text-sm font-semibold pt-3 pb-2">
            Related settings
          </div>
          <RoundRelatedSettings contestId={contestId} round={round} />
        </div>

        <div>
          <div className="text-sm font-semibold pt-3 pb-2">More Actions</div>
          <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
            <div className="flex gap-5 items-center">
              <Trash size={20} />
              <span className="text-sm">Delete round</span>
            </div>
            <button className="button-white" onClick={handleDelete}>
              Delete Round
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default OrganizerRoundDetail
