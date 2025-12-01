import React, { useMemo } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import RubricTable from "../components/RubricTable"
import { useFetchRubricQuery } from "../../../../services/manualProblemApi"
import { useGetRoundByIdQuery } from "../../../../services/roundApi"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"

const ManualRubricPage = () => {
  const { roundId } = useParams()

  const { data: round, isLoading: loadingRound } = useGetRoundByIdQuery(roundId)
  const { data: criteria, isLoading: loadingRubric } =
    useFetchRubricQuery(roundId)

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_RUBRIC_EDITOR(
    round?.contestName ?? "Contest",
    round?.name ?? "Round"
  )

  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_RUBRIC_EDITOR(
    round?.contestId,
    roundId
  )

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={loadingRubric || loadingRound}
    >
      <RubricTable
        roundId={roundId}
        criteria={criteria}
        loadingRubric={loadingRubric || loadingRound}
      />
    </PageContainer>
  )
}

export default ManualRubricPage
