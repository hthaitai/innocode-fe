import React from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { useGetRoundByIdQuery } from "@/services/roundApi"
import { useGetManualTestResultBySubmissionIdQuery } from "@/services/manualProblemApi"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"
import ManualResultInfo from "../components/ManualResultInfo"
import ManualResultRubricScores from "../components/ManualResultRubricScores"
import { useTranslation } from "react-i18next"

const ManualResultDetailPage = () => {
  const { t } = useTranslation(["common", "breadcrumbs"])
  const { contestId, roundId, submissionId } = useParams()

  const {
    data: round,
    isLoading: roundLoading,
    isError: roundError,
  } = useGetRoundByIdQuery(roundId)

  const {
    data: submission,
    isLoading: resultsLoading,
    isError: resultsError,
  } = useGetManualTestResultBySubmissionIdQuery({
    roundId,
    submissionId,
  })

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_MANUAL_RESULT_DETAIL(
    round?.contestName ?? t("common.contest"),
    round?.roundName ?? t("common.round"),
    submission?.studentName ?? t("common.studentName")
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_MANUAL_RESULT_DETAIL(
    contestId,
    roundId,
    submissionId
  )

  if (roundLoading || resultsLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (roundError || resultsError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("common.manualResults")} />
      </PageContainer>
    )
  }

  if (!round || !submission) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <MissingState itemName={t("common.manualResults")} />
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
          <ManualResultInfo submission={submission} />

          <div>
            <div className="text-sm leading-5 font-semibold pt-3 pb-2">
              {t("common.submissionCriteria")}
            </div>
            <ManualResultRubricScores
              criteriaScores={submission.criterionResults}
            />
          </div>
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default ManualResultDetailPage
