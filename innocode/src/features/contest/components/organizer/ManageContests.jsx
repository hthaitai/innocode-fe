import React, { useState, useMemo, useCallback } from "react"
import TableFluent from "@/shared/components/TableFluent"
import { useNavigate } from "react-router-dom"
import { Trophy } from "lucide-react"
import { getContestColumns } from "../../columns/getContestColumns"
import {
  useGetOrganizerContestsQuery,
  useDeleteContestMutation,
} from "../../../../services/contestApi"
import { useModal } from "../../../../shared/hooks/useModal"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import ContestsToolbar from "./ContestsToolbar"
import TablePagination from "../../../../shared/components/TablePagination"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { useTranslation } from "react-i18next"
import { toast } from "react-hot-toast"

const ManageContests = ({ contests, pagination, setPage, setSearchName }) => {
  const navigate = useNavigate()
  const { openModal } = useModal()
  const [deleteContest] = useDeleteContestMutation()
  const { t } = useTranslation("pages")

  // Handlers
  const handleSearch = (value) => {
    setPage(1)
    setSearchName(value)
  }

  const handleRowClick = (contest) => {
    navigate(`/organizer/contests/${contest.contestId}`)
  }

  const handleEditContest = (contest) => {
    navigate(`/organizer/contests/${contest.contestId}/edit`)
  }

  const handleDeleteContest = useCallback(
    (contest) => {
      openModal("confirm", {
        title: t("contest.delete.title", "Delete Contest"),
        description: t(
          "contest.delete.confirmMessage",
          `Are you sure you want to delete "${contest.name}"? This action cannot be undone.`,
          { name: contest.name },
        ),
        onConfirm: async () => {
          try {
            await deleteContest({ id: contest.contestId }).unwrap()
            toast.success(
              t("contest.delete.success", "Contest deleted successfully!"),
            )

            // Handle pagination after delete
            const count = contests.length
            if (count === 1 && pagination.currentPage > 1) {
              setPage(pagination.currentPage - 1)
            }
          } catch (err) {
            console.error("❌ Failed to delete contest:", err)
            toast.error(t("contest.delete.error", "Failed to delete contest."))
          }
        },
      })
    },
    [contests, pagination, deleteContest, openModal, setPage, t],
  )

  /** Table columns */
  const columns = getContestColumns(handleEditContest, handleDeleteContest, t)

  return (
    <div>
      <ContestsToolbar onSearch={handleSearch} />

      <TableFluent
        data={contests}
        columns={columns}
        onRowClick={handleRowClick}
      />

      <TablePagination pagination={pagination} onPageChange={setPage} />
    </div>
  )
}

export default ManageContests
