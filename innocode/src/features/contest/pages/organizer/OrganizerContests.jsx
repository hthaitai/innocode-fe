import React, { useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"

// Shared components
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"

// Contest features
import ContestTableAdd from "../../components/organizer/ContestTableAdd"
import { useOrganizerContestList } from "../../hooks/useOrganizerContestList"
import { useModal } from "@/shared/hooks/useModal"
import { getContestColumns } from "../../columns/getContestColumns"

// Breadcrumbs
import { BREADCRUMBS } from "@/config/breadcrumbs"

const OrganizerContests = () => {
  const navigate = useNavigate()
  const { openModal } = useModal()

  // Unified hook
  const {
    contests,
    loading,
    error,
    pagination,
    page,
    setPage,
    handleEdit,
    handleDelete,
    refetchContests,
  } = useOrganizerContestList()

  // Add contest handler
  const handleAddContest = useCallback(() => {
    openModal("contest", {
      onCreated: () => refetchContests(),
    })
  }, [openModal, refetchContests])

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
