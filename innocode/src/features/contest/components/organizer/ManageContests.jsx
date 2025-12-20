import React, { useState, useMemo, useCallback } from "react"
import TableFluent from "@/shared/components/TableFluent"
import { useNavigate } from "react-router-dom"
import { Trophy } from "lucide-react"
import { getContestColumns } from "../../columns/getContestColumns"
import {
  useGetOrganizerContestsQuery,
  useDeleteContestMutation,
} from "../../../../services/contestApi"
import { useConfirmDelete } from "../../../../shared/hooks/useConfirmDelete"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import ManageContestsActions from "./ManageContestsActions"
import TablePagination from "../../../../shared/components/TablePagination"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"

const ManageContests = () => {
  // External hooks
  const navigate = useNavigate()
  const { confirmDeleteEntity } = useConfirmDelete()

  // Local state
  const [page, setPage] = useState(1)
  const pageSize = 15
  const [searchName, setSearchName] = useState("")

  // RTK query hooks
  const {
    data: contestsData,
    isLoading,
    isError,
  } = useGetOrganizerContestsQuery({
    pageNumber: page,
    pageSize,
    nameSearch: searchName,
  })
  const [deleteContest] = useDeleteContestMutation()

  // Data extraction
  const contests = contestsData?.data || []
  const pagination = contestsData?.additionalData

  // Early returns
  if (isLoading)
    return (
      <div className="min-h-[70px] flex items-center justify-center">
        <Spinner />
      </div>
    )

  // Handlers
  const handleSearch = (value) => {
    setPage(1) // reset page
    setSearchName(value)
  }

  const handleRowClick = (contest) => {
    navigate(`/organizer/contests/${contest.contestId}`)
  }

  const handleEditContest = (contest) => {
    navigate(`/organizer/contests/${contest.contestId}/edit`)
  }

  const handleDeleteContest = (contest) => {
    confirmDeleteEntity({
      entityName: "Contest",
      item: { id: contest.contestId, name: contest.name },
      deleteAction: deleteContest,
      idKey: "id",
      onNavigate: () => {
        const count = contestsData?.data?.length ?? 0
        if (count === 1 && page > 1) {
          setPage(page - 1)
        }
      },
    })
  }

  /** Table columns */
  const columns = getContestColumns(handleEditContest, handleDeleteContest)

  return (
    <>
      {isLoading ? (
        <div className="min-h-[70px] flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <AnimatedSection>
          <div>
            <ManageContestsActions onSearch={handleSearch} />

            <TableFluent
              data={contests}
              columns={columns}
              loading={isLoading}
              error={isError}
              onRowClick={handleRowClick}
            />

            <TablePagination pagination={pagination} onPageChange={setPage} />
          </div>
        </AnimatedSection>
      )}
    </>
  )
}

export default ManageContests
