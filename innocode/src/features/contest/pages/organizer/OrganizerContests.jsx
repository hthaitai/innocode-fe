import React, { useMemo } from "react"
import { useNavigate } from "react-router-dom"

// Shared components
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"

// Contest features
import ContestTableAdd from "../../components/organizer/ContestTableAdd"
import { useContestManagement } from "../../hooks/useContestManagement"
import { getContestColumns } from "../../columns/contestColumns"

// Breadcrumbs
import { BREADCRUMBS } from "@/config/breadcrumbs"

const OrganizerContests = () => {
  const navigate = useNavigate()

  // Custom hook to manage contests
  const {
    contests,
    loading,
    error,
    pagination,
    page,
    setPage,
    handleDelete,
  } = useContestManagement()

  // Define columns for contest table including actions
  const columns = useMemo(
    () => getContestColumns(handleDelete),
    [handleDelete]
  )

  return (
    <PageContainer breadcrumb={BREADCRUMBS.CONTESTS}>
      <div className="space-y-1">
        {/* Header section with add button */}
        <ContestTableAdd
          onAdd={() => navigate("/organizer/contests/new")}
        />

        {/* Contest table with data, columns, pagination, and row click navigation */}
        <TableFluent
          data={contests}
          columns={columns}
          loading={loading}
          error={error}
          pagination={pagination}
          onPageChange={setPage}
          onRowClick={(contest) =>
            navigate(`/organizer/contests/${contest?.contestId}`)
          }
        />
      </div>
    </PageContainer>
  )
}

export default OrganizerContests
