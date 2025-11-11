import React, { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { useAppSelector } from "@/store/hooks"
import { useMcqAttempts } from "../hooks/useMcqAttempts" // Custom hook for attempts
import { getMcqAttemptsColumns } from "../columns/getMcqAttemptsColumns" // Columns definition
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"

const OrganizerMcqAttempts = () => {
  const navigate = useNavigate()
  const { contestId, roundId } = useParams()

  // Get contests and rounds from Redux
  const { contests } = useAppSelector((s) => s.contests)
  const { rounds } = useAppSelector((s) => s.rounds)

  // Custom hook to manage MCQ attempts for a specific round
  const {
    attempts,
    loading,
    error,
    pagination,
    page,
    setPage,
  } = useMcqAttempts(roundId)

  // Columns for attempts table
  const columns = useMemo(() => getMcqAttemptsColumns(), [])

  // Find the selected contest and round
  const contest = contests.find(
    (c) => String(c.contestId) === String(contestId)
  )
  const round = rounds.find((r) => String(r.roundId) === String(roundId))

  // Breadcrumbs
  const items = BREADCRUMBS.ORGANIZER_MCQ_ATTEMPTS(
    contest?.name ?? "Contest",
    round?.name ?? "Round"
  )
  const paths = BREADCRUMB_PATHS.ORGANIZER_MCQ_ATTEMPTS(contestId, roundId)

  return (
    <PageContainer breadcrumb={items} breadcrumbPaths={paths}>
      <div className="space-y-1">
        <TableFluent
          data={attempts}
          columns={columns}
          loading={loading}
          error={error}
          pagination={pagination}
          onPageChange={setPage}
          onRowClick={(attempt) =>
            navigate(
              `/organizer/contests/${contestId}/rounds/${roundId}/attempts/${attempt.attemptId}`
            )
          }
        />
      </div>
    </PageContainer>
  )
}

export default OrganizerMcqAttempts
