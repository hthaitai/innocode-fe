import React, { useState } from "react"
import {
  useFetchManualSubmissionsQuery,
  useLazyDownloadSubmissionQuery,
} from "../../../../services/submissionApi"
import { useGetRoundByIdQuery } from "../../../../services/roundApi"
import PageContainer from "../../../../shared/components/PageContainer"
import TableFluent from "../../../../shared/components/TableFluent"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { getJudgeSubmissionsColumns } from "../../../submission/columns/getJudgeSubmissionsColumns"
import JudgeSubmissionsActions from "../../../problems/manual/components/JudgeSubmissionsActions"
import { useParams, useNavigate } from "react-router-dom"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import TablePagination from "../../../../shared/components/TablePagination"
import { useTranslation } from "react-i18next"

const JudgeManualSubmissionsPage = () => {
  const { t } = useTranslation("judge")
  const { contestId, roundId } = useParams()
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 10
  const [statusFilter, setStatusFilter] = useState("Pending")
  const navigate = useNavigate()

  const {
    data: roundData,
    isLoading: isRoundLoading,
    isError: isRoundError,
  } = useGetRoundByIdQuery(roundId)

  const {
    data: submissionsData,
    isLoading: isSubmissionsLoading,
    isError: isSubmissionsError,
  } = useFetchManualSubmissionsQuery({
    statusFilter,
    pageNumber,
    pageSize,
    roundIdSearch: roundId,
  })

  const submissions = submissionsData?.data || []
  const pagination = submissionsData?.additionalData || {}

  const handleRubricEvaluation = (submissionId) => {
    if (!submissionId) return
    navigate(
      `/judge/contests/${contestId}/rounds/${roundId}/submissions/${submissionId}/evaluation`
    )
  }

  const columns = getJudgeSubmissionsColumns(handleRubricEvaluation, t)

  // Breadcrumbs
  const breadcrumbItems = BREADCRUMBS.JUDGE_ROUND_SUBMISSIONS(
    roundData?.contestName ?? t("manualSubmissions.fallbacks.contest"),
    roundData?.name ?? t("manualSubmissions.fallbacks.round")
  )

  const breadcrumbPaths = BREADCRUMB_PATHS.JUDGE_ROUND_SUBMISSIONS(
    contestId,
    roundId
  )

  if (isRoundLoading || isSubmissionsLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (isRoundError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("manualSubmissions.errors.round")} />
      </PageContainer>
    )
  }

  if (!roundData && roundId) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <MissingState itemName={t("manualSubmissions.errors.round")} />
      </PageContainer>
    )
  }

  if (isSubmissionsError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("manualSubmissions.errors.submissions")} />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        <JudgeSubmissionsActions
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <TableFluent data={submissions} columns={columns} />

        {submissions.length > 0 && (
          <TablePagination
            pagination={pagination}
            onPageChange={setPageNumber}
          />
        )}
      </AnimatedSection>
    </PageContainer>
  )
}

export default JudgeManualSubmissionsPage
