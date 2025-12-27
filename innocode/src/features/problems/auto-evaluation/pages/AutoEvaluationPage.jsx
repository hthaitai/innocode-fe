import React, { useState } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { useGetRoundByIdQuery } from "../../../../services/roundApi"
import ManageTestCases from "../components/ManageTestCases"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import { useGetRoundTestCasesQuery } from "../../../../services/autoEvaluationApi"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"

const AutoEvaluationPage = () => {
  const { contestId, roundId } = useParams()

  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 10

  const {
    data: round,
    isLoading: roundLoading,
    isError: roundError,
  } = useGetRoundByIdQuery(roundId)
  const {
    data: testCaseData,
    isLoading: testCaseLoading,
    isError: testCaseError,
  } = useGetRoundTestCasesQuery({ roundId, pageNumber, pageSize })

  const testCases = testCaseData?.data ?? []
  const pagination = testCaseData?.additionalData ?? {}

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_TEST_CASES(
    round?.contestName ?? "Contest",
    round?.roundName ?? "Round"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_TEST_CASES(
    contestId,
    roundId
  )

  if (roundLoading || testCaseLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (roundError || testCaseError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName="test cases" />
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
        <ManageTestCases
          contestId={contestId}
          roundId={roundId}
          testCases={testCases}
          pagination={pagination}
          setPage={setPageNumber}
        />
      </AnimatedSection>
    </PageContainer>
  )
}

export default AutoEvaluationPage
