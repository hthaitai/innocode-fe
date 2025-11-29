import React from "react"
import { useParams } from "react-router-dom"

import PageContainer from "@/shared/components/PageContainer"
import { useGetRoundByIdQuery } from "../../../../services/roundApi"
import TestCaseTable from "../components/TestCaseTable"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"

const AutoEvaluationPage = () => {
  const { contestId, roundId } = useParams()
  const { data: round, isLoading: roundLoading } = useGetRoundByIdQuery(roundId)

  const contestName = round?.contestName ?? "Contest"
  const roundName = round?.roundName ?? "Round"

  // Use breadcrumbs directly, no need for useMemo
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_TEST_CASES(
    contestName,
    roundName
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_TEST_CASES(
    contestId,
    roundId
  )

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <TestCaseTable
        contestId={contestId}
        roundId={roundId}
        roundLoading={roundLoading}
      />
    </PageContainer>
  )
}

export default AutoEvaluationPage
