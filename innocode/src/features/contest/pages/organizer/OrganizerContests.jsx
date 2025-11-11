import React, { useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"

// Shared components
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"

// Contest features
import ContestTableAdd from "../../components/organizer/ContestTableAdd"
import { useContestManagement } from "../../hooks/useContestManagement"
import { useModal } from "@/shared/hooks/useModal"
import { getContestColumns } from "../../columns/getContestColumns"

// Breadcrumbs
import { BREADCRUMBS } from "@/config/breadcrumbs"

const OrganizerContests = () => {
  const navigate = useNavigate()
  const { openModal } = useModal()

  // Custom hook to manage contests
  const { contests, loading, error, pagination, page, setPage, handleDelete } =
    useContestManagement()

  // Columns including delete action - memoized
  const columns = useMemo(
    () => getContestColumns(handleDelete, openModal),
    [handleDelete, openModal]
  )

  // Handle add contest - memoized to prevent unnecessary re-renders
  const handleAddContest = useCallback(() => {
    openModal("contest", {
      onCreated: () => setPage(1),
    })
  }, [openModal, setPage])

  // Handle row click - memoized
  const handleRowClick = useCallback(
    (contest) => {
      navigate(`/organizer/contests/${contest?.contestId}`)
    },
    [navigate]
  )

  return (
    <PageContainer breadcrumb={BREADCRUMBS.CONTESTS}>
      <div className="space-y-1">
        {/* Header section with Add button */}
        <ContestTableAdd onAdd={handleAddContest} />

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
