import React, { useMemo, useState } from "react"
import { useParams } from "react-router-dom"

import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"

import ManageMcqs from "../components/organizer/ManageMcqs"

import { useGetRoundByIdQuery } from "../../../services/roundApi"
import { Spinner } from "../../../shared/components/SpinnerFluent"
import { LoadingState } from "../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../shared/components/ui/ErrorState"
import { useGetRoundMcqsQuery } from "../../../services/mcqApi"
import { AnimatedSection } from "../../../shared/components/ui/AnimatedSection"
import { MissingState } from "../../../shared/components/ui/MissingState"

const OrganizerMcq = () => {
  const { contestId, roundId } = useParams()
  const [page, setPage] = useState(1)
  const pageSize = 10

  const {
    data: round,
    isLoading: roundLoading,
    isError: roundError,
  } = useGetRoundByIdQuery(roundId)
  const {
    data: mcqData,
    isLoading: mcqLoading,
    isError: mcqError,
  } = useGetRoundMcqsQuery({ roundId, pageNumber: page, pageSize })

  const mcqs = mcqData?.data?.mcqTest?.questions ?? []
  const pagination = mcqData?.additionalData
    ? {
        ...mcqData.additionalData,
        pageNumber: mcqData.additionalData.currentPage,
      }
    : {}
  const testId = mcqData?.data?.mcqTest?.testId

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_MCQ(
    round?.contestName ?? "Contest",
    round?.roundName ?? "Round"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_MCQ(contestId, roundId)

  if (roundLoading || mcqLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (roundError || mcqError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName="questions" />
      </PageContainer>
    )
  }

  if (!round) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <MissingState itemName="round" />
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
