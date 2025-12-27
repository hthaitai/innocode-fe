import React, { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { useGetAttemptsQuery } from "@/services/mcqApi"
import { useGetRoundByIdQuery } from "@/services/roundApi"
import { getMcqAttemptsColumns } from "../columns/getMcqAttemptsColumns"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { Users } from "lucide-react"
import { AnimatedSection } from "../../../shared/components/ui/AnimatedSection"
import { Spinner } from "../../../shared/components/SpinnerFluent"

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

  const attempts = attemptsData?.data ?? []
  const pagination = attemptsData?.additionalData

  // Fetch round info (includes contestName and roundName)
  const { data: round, isLoading: roundLoading } = useGetRoundByIdQuery(roundId)

  // Breadcrumbs
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_MCQ_ATTEMPTS(
    round?.contestName ?? "Contest",
    round?.roundName ?? "Round"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_MCQ_ATTEMPTS(
    contestId,
    roundId
  )

  // Columns for the table
  const columns = getMcqAttemptsColumns()

  const handleRowClick = (attemptId) => {
    navigate(
      `/organizer/contests/${contestId}/rounds/${roundId}/attempts/${attemptId}`
    )
  }
  if (isLoading || roundLoading) {
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

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      error={isError}
    >
      <AnimatedSection>
        <TableFluent
          data={attempts}
          columns={columns}
          pagination={pagination}
          onPageChange={setPage}
          onRowClick={(attempt) => handleRowClick(attempt.attemptId)}
        />
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerMcqAttempts
