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

  // Breadcrumbs
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_MCQ_ATTEMPTS(
    round?.contestName || "Contest",
    round?.roundName || "Round"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_MCQ_ATTEMPTS(
    contestId,
    roundId
  )

  // Columns for the table
  const columns = useMemo(() => getMcqAttemptsColumns(), [])

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={isLoading}
      error={isError}
    >
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
        renderActions={() => (
          <div className="min-h-[70px] px-5 flex items-center">
            <p className="text-[14px] leading-[20px] font-medium">
              Student attempts
            </p>
          </div>
        )}
      />
    </PageContainer>
  )
}

export default OrganizerMcqAttempts
