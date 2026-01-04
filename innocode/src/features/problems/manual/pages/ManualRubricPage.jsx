import React, { useMemo } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { useGetRoundByIdQuery } from "../../../../services/roundApi"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import ManageRubric from "../components/ManageRubric"
import { useFetchRubricQuery } from "../../../../services/manualProblemApi"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"
import { useTranslation } from "react-i18next"

const ManualRubricPage = () => {
  const { t } = useTranslation(["common", "breadcrumbs"])
  const { roundId, contestId } = useParams()

  const {
    data: round,
    isLoading: roundLoading,
    isError: roundError,
  } = useGetRoundByIdQuery(roundId)
  const {
    data: rubricData,
    isLoading: rubricLoading,
    isError: rubricError,
  } = useFetchRubricQuery(roundId)

  const criteria = rubricData?.data?.criteria ?? []

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_RUBRIC_EDITOR(
    round?.contestName ?? t("common.contest"),
    round?.roundName ?? t("common.round")
  )

  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_RUBRIC_EDITOR(
    contestId,
    roundId
  )

  if (roundLoading || rubricLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (roundError || rubricError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("common.contest")} />
      </PageContainer>
    )
  }

  if (!round) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <MissingState itemName={t("common.round")} />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        <ManageRubric
          roundId={roundId}
          contestId={contestId}
          criteria={criteria}
        />
      </AnimatedSection>
    </PageContainer>
  )
}

export default ManualRubricPage
