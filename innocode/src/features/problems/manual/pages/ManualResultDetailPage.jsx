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

const ManualResultDetailPage = () => {
  const { contestId, roundId, submissionId } = useParams()

  const {
    data: round,
    isLoading: roundLoading,
    isError: roundError,
  } = useGetRoundByIdQuery(roundId)

  const {
    // data: submission,
    isLoading: resultsLoading,
    isError: resultsError,
  } = useGetManualTestResultBySubmissionIdQuery({
    roundId,
    submissionId,
  })

  const submission = {
    submissionId: "c3bea894-484b-42c6-b8fd-a7b8a2695378",
    studentName: "John Doe",
    teamName: "Team Alpha",
    submittedAt: "2025-12-02T03:02:26Z",
    judgedBy: "Jane Smith",
    totalScore: 28,
    maxPossibleScore: 32,
    criteriaScores: [
      {
        rubricId: "r1",
        description: "Correctness of algorithm",
        score: 10,
        maxScore: 10,
      },
      {
        rubricId: "r2",
        description: "Code readability",
        score: 8,
        maxScore: 10,
      },
      {
        rubricId: "r3",
        description: "Performance",
        score: 5,
        maxScore: 6,
      },
      {
        rubricId: "r4",
        description: "Edge case handling",
        score: 5,
        maxScore: 6,
      },
    ],
  }

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_MANUAL_RESULT_DETAIL(
    round?.contestName ?? "Contest",
    round?.roundName ?? "Round",
    submission?.studentName ?? "Student name"
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
        <ErrorState itemName="manual result detail" />
      </PageContainer>
    )
  }

  if (!round || !submission) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <MissingState itemName="manual result" />
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
              Submission criteria
            </div>
            <ManualResultRubricScores
              criteriaScores={submission.criteriaScores}
            />
          </div>
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default ManualResultDetailPage
