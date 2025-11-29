import React from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import AutoResultsTable from "../components/AutoResultsTable"
import { useGetRoundByIdQuery } from "../../../../services/roundApi"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"

const AutoTestResultsPage = () => {
  const { roundId } = useParams()

  // Fetch round info
  const { data: round, isLoading: roundLoading } = useGetRoundByIdQuery(
    roundId,
    { skip: !roundId }
  )

  // Breadcrumbs
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_AUTO_RESULTS(
    round?.contestName ?? "Contest",
    round?.name ?? "Round"
  )

  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_AUTO_RESULTS(
    round?.contestId,
    roundId
  )

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={roundLoading}
    >
      <AutoResultsTable />
    </PageContainer>
  )
}

export default AutoTestResultsPage
