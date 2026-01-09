import React, { useState } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import ManageMcqs from "../components/organizer/ManageMcqs"
import { useGetRoundByIdQuery } from "../../../services/roundApi"
import { LoadingState } from "../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../shared/components/ui/ErrorState"
import { useGetRoundMcqsQuery } from "../../../services/mcqApi"
import { AnimatedSection } from "../../../shared/components/ui/AnimatedSection"
import { useTranslation } from "react-i18next"
import { useGetContestByIdQuery } from "../../../services/contestApi"

const OrganizerMcq = () => {
  const { t } = useTranslation(["common", "breadcrumbs", "contest", "round"])
  const { contestId, roundId } = useParams()
  const [page, setPage] = useState(1)
  const pageSize = 10

  const {
    data: contest,
    isLoading: contestLoading,
    isError: isContestError,
  } = useGetContestByIdQuery(contestId)

  const {
    data: round,
    isLoading: roundLoading,
    isError: isRoundError,
  } = useGetRoundByIdQuery(roundId)

  const {
    data: mcqData,
    isLoading: mcqLoading,
    isError: mcqError,
  } = useGetRoundMcqsQuery({ roundId, pageNumber: page, pageSize })

  const testId = mcqData?.data?.mcqTest?.testId
  const mcqs = mcqData?.data?.mcqTest?.questions ?? []
  const pagination = mcqData?.additionalData ?? {}

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_MCQ(
    contest?.name ?? t("common.contest"),
    round?.roundName ?? t("common.round")
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_MCQ(contestId, roundId)

  if (contestLoading || roundLoading || mcqLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (isContestError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("common.contest")} />
      </PageContainer>
    )
  }

  if (isRoundError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("common.round")} />
      </PageContainer>
    )
  }

  if (mcqError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("questions", { ns: "breadcrumbs" })} />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        <ManageMcqs
          mcqs={mcqs}
          pagination={pagination}
          setPage={setPage}
          testId={testId}
        />
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerMcq
