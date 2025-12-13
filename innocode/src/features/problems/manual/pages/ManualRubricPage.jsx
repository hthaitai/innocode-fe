import React, { useMemo } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import RubricTable from "../components/RubricTable"
import { useGetRoundByIdQuery } from "../../../../services/roundApi"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"

const ManualRubricPage = () => {
  const { roundId, contestId } = useParams()

  const { data: round, isLoading: loadingRound } = useGetRoundByIdQuery(roundId)

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_RUBRIC_EDITOR(
    round?.contestName ?? "Contest",
    round?.name ?? "Round"
  )

  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_RUBRIC_EDITOR(
    contestId,
    roundId
  )

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={loadingRound}
    >
      <RubricTable roundId={roundId} contestId={contestId} />
    </PageContainer>
  )
}

export default ManualRubricPage
