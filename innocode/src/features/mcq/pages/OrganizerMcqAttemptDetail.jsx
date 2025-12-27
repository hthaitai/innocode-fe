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

const OrganizerMcqAttemptDetail = () => {
  const { contestId, roundId, attemptId } = useParams()

  // Fetch round info for contestName and roundName
  const { data: round, isLoading: loadingRound } = useGetRoundByIdQuery(roundId)

  // Fetch attempt detail
  const {
    data: attemptDetail,
    isLoading,
    isError,
  } = useGetAttemptDetailQuery(attemptId)

  // Breadcrumb setup
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_MCQ_ATTEMPT_DETAIL(
    round?.contestName ?? "Contest",
    round?.roundName ?? "Round",
    attemptDetail?.studentName ?? "Student name"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_MCQ_ATTEMPT_DETAIL(
    contestId,
    roundId,
    attemptId
  )

  if (isLoading || loadingRound) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <div className="min-h-[70px] flex items-center justify-center">
          <Spinner />
        </div>
      </PageContainer>
    )
  }
  if (!attemptDetail) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
          This attempt detail page has been deleted or is no longer available.
        </div>
      </PageContainer>
    )
  }

  const { totalQuestions, correctAnswers, score, answerResults } = attemptDetail

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
            <AttemptInfo attemptDetail={attemptDetail} />
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
              loading={isLoading}
              error={isError}
              maxHeight={400}
            />
          </div>
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerMcqAttemptDetail
