import React, { useState } from "react"
import TableFluent from "@/shared/components/TableFluent"
import { useNavigate, useParams } from "react-router-dom"
import { getTeamColumns } from "../../columns/teamColumns"
import TeamsToolbar from "./TeamsToolbar"
import TablePagination from "../../../../shared/components/TablePagination"
import { useTranslation } from "react-i18next"

const ManageTeams = ({ teams, pagination, setPage, setSearchName }) => {
  const navigate = useNavigate()
  const { contestId } = useParams()
  const { t } = useTranslation("common")

  // Handlers
  const handleSearch = (value) => {
    setPage(1)
    setSearchName(value)
  }

  const handleRowClick = (team) => {
    navigate(`/organizer/contests/${contestId}/teams/${team.teamId}`)
  }

  /** Table columns */
  const columns = getTeamColumns(t)

  return (
    <div>
      {/* <TeamsToolbar onSearch={handleSearch} /> */}

      <TableFluent data={teams} columns={columns} onRowClick={handleRowClick} />

      {teams.length > 0 && (
        <TablePagination pagination={pagination} onPageChange={setPage} />
      )}
    </div>
  )
}

export default ManageTeams
