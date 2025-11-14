import React, { useMemo, useCallback, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// Shared components
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import AddSection from "../../../../shared/components/AddSection"
import { Trophy } from "lucide-react"

// Contest features
import { useOrganizerContestList } from "../../hooks/useOrganizerContestList"
import { getContestColumns } from "../../columns/getContestColumns"

// Breadcrumbs
import { BREADCRUMBS } from "@/config/breadcrumbs"

const OrganizerContests = () => {
  const navigate = useNavigate()

  const {
    contests,
    pagination,
    loading,
    error,
    page,
    setPage,
    fetchContests,
    handleAdd,
    handleEdit,
    handleDelete,
  } = useOrganizerContestList()

  // Fetch contests when page changes
  useEffect(() => {
    fetchContests()
  }, [fetchContests])

  // Handle row click - memoized
  const handleRowClick = useCallback(
    (contest) => {
      navigate(`/organizer/contests/${contest?.contestId}`)
    },
    [navigate]
  )

  // Columns including delete action - memoized
  const columns = useMemo(
    () => getContestColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  )

  return (
    <PageContainer breadcrumb={BREADCRUMBS.CONTESTS}>
      <div className="space-y-1">
        {/* Header section with Add button */}
        <AddSection
          icon={Trophy}
          title="Contest Management"
          subtitle="Create and manage contests"
          addLabel="Add contest"
          onAdd={handleAdd}
        />

        {/* Contest table with data, columns, pagination, row click navigation */}
        <TableFluent
          data={contests}
          columns={columns}
          loading={loading}
          error={error}
          pagination={pagination}
          onPageChange={setPage}
          onRowClick={handleRowClick}
        />
      </div>
    </PageContainer>
  )
}

export default OrganizerContests
