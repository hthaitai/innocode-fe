import React, { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Users } from "lucide-react"

import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import TablePagination from "@/shared/components/TablePagination"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { useGetTeamsQuery } from "@/services/teamApi"
import { getTeamColumns } from "../../columns/teamColumns"

const OrganizerTeams = () => {
  const { contestId } = useParams()
  const [page, setPage] = useState(1)
  const pageSize = 10
  const navigate = useNavigate()

  const {
    data: contest,
    isLoading: contestLoading,
    error: contestError,
  } = useGetContestByIdQuery(contestId)

  const {
    data: teamsResponse,
    isLoading: teamsLoading,
    error: teamsError,
  } = useGetTeamsQuery({
    contestId,
    pageNumber: page,
    pageSize,
  })

  const columns = getTeamColumns()

  const teams = teamsResponse?.data || []
  const pagination = teamsResponse?.additionalData

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_TEAMS(
    contest?.name || "Contest"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_TEAMS(contestId)

  const handleRowClick = (team) => {
    navigate(`/organizer/contests/${contestId}/teams/${team.teamId}`)
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={contestLoading}
      error={contestError}
    >
      <TableFluent
        data={teams}
        columns={columns}
        loading={teamsLoading}
        error={teamsError}
        onRowClick={handleRowClick}
      />

      {pagination && (
        <TablePagination pagination={pagination} onPageChange={setPage} />
      )}
    </PageContainer>
  )
}

export default OrganizerTeams
