import React from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { useGetRoundByIdQuery } from "@/services/roundApi"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import ManageManualResults from "../components/ManageManualResults"

const ManualResultsPage = () => {
  const { contestId, roundId } = useParams()

  // Fetch round details
  const { data: round, isLoading } = useGetRoundByIdQuery(roundId)

  // Breadcrumbs
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_MANUAL_RESULTS(
    round?.contestName ?? "Contest",
    round?.roundName ?? "Round"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_MANUAL_RESULTS(
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

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <ManageManualResults roundId={roundId} />
    </PageContainer>
  )
}

export default ManualResultsPage
