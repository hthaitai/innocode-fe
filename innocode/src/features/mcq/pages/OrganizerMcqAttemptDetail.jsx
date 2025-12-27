import React from "react"
import { useParams } from "react-router-dom"
import { AlertTriangle, Clipboard, Database } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import AttemptInfo from "../components/organizer/AttemptInfo"
import AttemptStatsRow from "../components/organizer/AttemptStatsRow"
import TableFluent from "../../../shared/components/TableFluent"
import { getMcqAttemptDetailColumns } from "../columns/getMcqAttemptDetailColumns"
import { Spinner } from "../../../shared/components/SpinnerFluent"
import { useGetAttemptDetailQuery } from "@/services/mcqApi"
import { useGetRoundByIdQuery } from "@/services/roundApi"
import TableFluentScrollable from "../../../shared/components/table/TableFluentScrollable"
import { AnimatedSection } from "../../../shared/components/ui/AnimatedSection"
import { LoadingState } from "../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../shared/components/ui/MissingState"

const OrganizerMcqAttemptDetail = () => {
  const { contestId, roundId, attemptId } = useParams()

  const {
    data: round,
    isLoading: roundLoading,
    isError: roundError,
  } = useGetRoundByIdQuery(roundId)
  const {
    data: attempt,
    isLoading: attemptLoading,
    isError: attemptError,
  } = useGetAttemptDetailQuery(attemptId)

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_MCQ_ATTEMPT_DETAIL(
    round?.contestName ?? "Contest",
    round?.roundName ?? "Round",
    attempt?.studentName ?? "Student name"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_MCQ_ATTEMPT_DETAIL(
    contestId,
    roundId,
    attemptId
  )

  if (attemptLoading || roundLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (attemptError || roundError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName="attempt" />
      </PageContainer>
    )
  }

  if (!round || !attempt) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <MissingState itemName="attempt" />
      </PageContainer>
    )
  }

  const { totalQuestions, correctAnswers, score, answerResults } = attempt

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        <div className="space-y-5">
          <AttemptStatsRow
            totalQuestions={totalQuestions}
            correctAnswers={correctAnswers}
            score={score}
          />

          <div>
            <div className="text-sm font-semibold pt-3 pb-2">Information</div>
            <AttemptInfo attemptDetail={attempt} />
          </div>

          <div>
            <div className="text-sm font-semibold pt-3 pb-2">
              Attempt review
            </div>
            <TableFluentScrollable
              data={
                answerResults?.map((q, idx) => ({ ...q, index: idx })) || []
              }
              columns={getMcqAttemptDetailColumns()}
              maxHeight={400}
            />
          </div>
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerMcqAttemptDetail
