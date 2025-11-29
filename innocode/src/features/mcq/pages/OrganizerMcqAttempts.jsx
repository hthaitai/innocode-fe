import React, { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { useGetAttemptsQuery } from "@/services/mcqApi"
import { useGetRoundByIdQuery } from "@/services/roundApi"
import { getMcqAttemptsColumns } from "../columns/getMcqAttemptsColumns"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { Users } from "lucide-react"

const OrganizerMcqAttempts = () => {
  const navigate = useNavigate()
  const { contestId, roundId } = useParams()

  const [page, setPage] = useState(1)
  const pageSize = 10

  // Fetch attempts for the round
  const {
    data: attemptsData,
    isLoading,
    isError,
  } = useGetAttemptsQuery({
    roundId,
    pageNumber: page,
    pageSize,
  })

  const attempts = attemptsData?.data || []
  const pagination = attemptsData?.additionalData || {}

  // Fetch round info (includes contestName and roundName)
  const { data: round, isLoading: loadingRound } = useGetRoundByIdQuery(roundId)

  // Columns for the table
  const columns = useMemo(() => getMcqAttemptsColumns(), [])

  // Breadcrumbs
  const items = BREADCRUMBS.ORGANIZER_MCQ_ATTEMPTS(
    round?.contestName || "Contest",
    round?.roundName || "Round"
  )
  const paths = BREADCRUMB_PATHS.ORGANIZER_MCQ_ATTEMPTS(contestId, roundId)

  return (
    <PageContainer breadcrumb={items} breadcrumbPaths={paths}>
      <div className="space-y-1">
        <div className="px-5 py-4 flex justify-between items-center border border-[#E5E5E5] rounded-[5px] bg-white">
          <div className="flex items-center gap-5">
            <Users size={20} />
            <div>
              <p className="text-[14px] leading-[20px]">
                Student attempts
              </p>
              <p className="text-[12px] leading-[16px] text-[#7A7574]">
                Review all student attempts for this round including total
                questions, score, and completion status.
              </p>
            </div>
          </div>
        </div>

        <TableFluent
          data={attempts}
          columns={columns}
          loading={isLoading || loadingRound}
          error={isError ? "Failed to load attempts" : undefined}
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
