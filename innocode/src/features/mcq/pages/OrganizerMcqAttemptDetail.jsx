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

const OrganizerMcqAttemptDetail = () => {
  const { contestId, roundId, attemptId } = useParams()

  // Fetch round info for contestName and roundName
  const { data: round, isLoading: loadingRound } = useGetRoundByIdQuery(roundId)

  // Fetch attempt detail
  const {
    data: attemptResponse,
    isLoading,
    isError,
    error,
  } = useGetAttemptDetailQuery(attemptId)

  // Unwrap the actual attempt data
  const attemptDetail = attemptResponse?.data

  // Breadcrumb setup
  const items = BREADCRUMBS.ORGANIZER_MCQ_ATTEMPT_DETAIL(
    round?.contestName || "Contest",
    round?.roundName || "Round",
    attemptDetail?.studentName || "Student name"
  )
  const paths = BREADCRUMB_PATHS.ORGANIZER_MCQ_ATTEMPT_DETAIL(
    contestId,
    roundId,
    attemptId
  )

  // Loading state
  if (isLoading || loadingRound) {
    return (
      <PageContainer breadcrumb={items} breadcrumbPaths={paths}>
        <Spinner />
      </PageContainer>
    )
  }

  // Error state
  if (isError) {
    return (
      <PageContainer breadcrumb={items} breadcrumbPaths={paths}>
        <div className="text-sm border border-red-300 rounded-[5px] bg-red-50 px-5 min-h-[70px] flex items-center gap-3 text-red-600">
          <AlertTriangle size={20} />
          <p>
            Failed to load attempt details:{" "}
            {error?.data?.message || error?.error || "Unknown error"}
          </p>
        </div>
      </PageContainer>
    )
  }

  // No data
  if (!attemptDetail) {
    return (
      <PageContainer breadcrumb={items} breadcrumbPaths={paths}>
        <div className="text-sm border border-[#E5E5E5] rounded-[5px] bg-white px-5 min-h-[70px] flex items-center gap-3 text-[#7A7574]">
          <AlertTriangle size={20} />
          <p>No attempt data available.</p>
        </div>
      </PageContainer>
    )
  }

  const { totalQuestions, correctAnswers, score, answerResults } = attemptDetail

  return (
    <PageContainer breadcrumb={items} breadcrumbPaths={paths} bg={false}>
      <div className="space-y-5">
        <AttemptStatsRow
          totalQuestions={totalQuestions}
          correctAnswers={correctAnswers}
          score={score}
        />

        <AttemptInfo attemptDetail={attemptDetail} />

        <div>
          <div className="text-sm font-semibold pt-3 pb-2">Attempt review</div>
          <div className="space-y-1">
            <div className="px-5 py-4 flex justify-between items-center border border-[#E5E5E5] rounded-[5px] bg-white">
              <div className="flex items-center gap-5">
                <Clipboard size={20} />
                <div>
                  <p className="text-[14px] leading-[20px]">
                    Student's submitted answers
                  </p>
                  <p className="text-[12px] leading-[16px] text-[#7A7574]">
                    Review each question the student attempted along with their
                    selected answers and correctness.
                  </p>
                </div>
              </div>
            </div>
            
            <TableFluent
              data={
                answerResults?.map((q, idx) => ({ ...q, index: idx })) || []
              }
              columns={getMcqAttemptDetailColumns()}
              loading={false}
              error={null}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default OrganizerMcqAttemptDetail
