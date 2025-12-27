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
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"

const OrganizerRoundDetail = () => {
  const { contestId, roundId } = useParams()

  const { data: round, isLoading, isError } = useGetRoundByIdQuery(roundId)

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_ROUND_DETAIL(
    round?.contestName,
    round?.roundName
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
        <LoadingState />
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName="round" />
      </PageContainer>
    )
  }

  if (!round) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <MissingState itemName="round" />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
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
