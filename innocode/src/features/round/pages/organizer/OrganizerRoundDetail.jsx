import React, { useMemo } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import RoundInfo from "../../components/organizer/RoundInfo"
import RoundOpenCodeSection from "../../components/organizer/RoundOpenCodeSection"
import StartEndRoundSection from "../../components/organizer/StartEndRoundSection"
import RoundRelatedSettings from "../../components/organizer/RoundRelatedSettings"
import DeleteRoundSection from "../../components/organizer/DeleteRoundSection"
import { useGetRoundByIdQuery } from "../../../../services/roundApi"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"

const OrganizerRoundDetail = () => {
  const { contestId, roundId } = useParams()

  // RTK Query hook to fetch the round
  const { data: round, isLoading, isError } = useGetRoundByIdQuery(roundId)

  // Breadcrumbs
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_ROUND_DETAIL(
    round?.contestName ?? "Contest",
    round?.roundName ?? "Round"
  )

  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_ROUND_DETAIL(
    contestId,
    roundId
  )

  if (isLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <div className="min-h-[70px] flex items-center justify-center">
          <Spinner />
        </div>
      </PageContainer>
    )
  }

  if (!round && !isLoading) {
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
      error={isError}
    >
      <AnimatedSection>
        <div className="space-y-5">
          <div className="space-y-1">
            <RoundInfo round={round} />
            <RoundOpenCodeSection roundId={roundId} />
            <StartEndRoundSection roundId={roundId} />
          </div>

          <div>
            <div className="text-sm font-semibold pt-3 pb-2">
              Related settings
            </div>
            <RoundRelatedSettings contestId={contestId} round={round} />
          </div>

          <div>
            <div className="text-sm font-semibold pt-3 pb-2">More Actions</div>
            {round && (
              <DeleteRoundSection round={round} contestId={contestId} />
            )}
          </div>
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerRoundDetail
