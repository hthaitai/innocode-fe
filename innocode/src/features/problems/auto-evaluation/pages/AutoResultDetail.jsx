import React from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { useGetRoundByIdQuery } from "@/services/roundApi"
import { useGetAutoTestResultBySubmissionIdQuery } from "@/services/autoEvaluationApi"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"
import AutoResultInfo from "../components/AutoResultInfo"
import AutoResultTestCases from "../components/AutoResultTestCases"
import AutoResultArtifacts from "../components/AutoResultArtifacts"
import { useTranslation } from "react-i18next"

const AutoResultDetail = () => {
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
  } = useGetAutoTestResultBySubmissionIdQuery({
    roundId,
    submissionId,
  })

  const details = submission?.details ?? []
  const artifacts = submission?.artifacts ?? []

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_AUTO_RESULT_DETAIL(
    round?.contestName ?? t("common.contest"),
    round?.roundName ?? t("common.round"),
    submission?.submittedByStudentName ?? t("common.studentName")
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_AUTO_RESULT_DETAIL(
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
        <ErrorState itemName={t("common.autoResultDetail")} />
      </PageContainer>
    )
  }

  if (!round || !submission) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <MissingState itemName={t("common.autoResult")} />
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
          <AutoResultInfo submission={submission} />

          <div>
            <div className="text-sm leading-5 font-semibold pt-3 pb-2">
              {t("common.testCases")}
            </div>
            <AutoResultTestCases details={details} />
          </div>

          <div>
            <div className="text-sm leading-5 font-semibold pt-3 pb-2">
              {t("common.submittedFiles")}
            </div>
            <AutoResultArtifacts artifacts={artifacts} />
          </div>
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default AutoResultDetail
