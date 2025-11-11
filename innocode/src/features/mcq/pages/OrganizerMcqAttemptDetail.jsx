import React from "react"
import { useParams } from "react-router-dom"
import { AlertTriangle } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useAppSelector } from "@/store/hooks"
import { useAttemptDetail } from "../hooks/useAttemptDetail"
import AttemptSummaryCard from "../components/organizer/AttemptInfo"
import AttemptStatsRow from "../components/organizer/AttemptStatsRow"
import TableFluent from "../../../shared/components/TableFluent"
import { getAttemptQuestionColumns } from "../columns/getAttemptQuestionColumns"
import AttemptInfo from "../components/organizer/AttemptInfo"
import { Spinner } from "../../../shared/components/SpinnerFluent"

const OrganizerMcqAttemptDetail = () => {
  const { contestId, roundId, attemptId } = useParams()
  const { contests } = useAppSelector((s) => s.contests)
  const { rounds } = useAppSelector((s) => s.rounds)

  // Custom hook encapsulating logic
  const { attemptDetail, loading, error } = useAttemptDetail(attemptId)

  // --- Breadcrumb setup ---
  const contest = contests.find(
    (c) => String(c.contestId) === String(contestId)
  )
  const round = rounds.find((r) => String(r.roundId) === String(roundId))
  const items = BREADCRUMBS.ORGANIZER_MCQ_ATTEMPT_DETAIL(
    contest?.name ?? "Contest",
    round?.name ?? "Round",
    attemptDetail?.studentName ?? "Student name"
  )
  const paths = BREADCRUMB_PATHS.ORGANIZER_MCQ_ATTEMPT_DETAIL(
    contestId,
    roundId,
    attemptId
  )

  // --- Handle missing or failed states ---
  if (loading) {
    return (
      <PageContainer breadcrumb={items} breadcrumbPaths={paths}>
        <Spinner />
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer breadcrumb={items} breadcrumbPaths={paths}>
        <div className="text-sm border border-red-300 rounded-[5px] bg-red-50 px-5 min-h-[70px] flex items-center gap-3 text-red-600">
          <AlertTriangle size={20} />
          <p>Failed to load attempt details: {error}</p>
        </div>
      </PageContainer>
    )
  }

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

  const {
    testName,
    studentName,
    submittedAt,
    totalQuestions,
    correctAnswers,
    score,
    answerResults,
  } = attemptDetail

  return (
    <PageContainer
      breadcrumb={items}
      breadcrumbPaths={paths}
      bg={false}
      loading={loading}
      error={error}
    >
      <div className="space-y-5">
        <AttemptInfo attemptDetail={attemptDetail} />

        <AttemptStatsRow
          totalQuestions={totalQuestions}
          correctAnswers={correctAnswers}
          score={score}
        />

        <TableFluent
          data={answerResults.map((q, idx) => ({ ...q, index: idx }))}
          columns={getAttemptQuestionColumns()}
          loading={false}
          error={null}
        />
      </div>
    </PageContainer>
  )
}

export default OrganizerMcqAttemptDetail
