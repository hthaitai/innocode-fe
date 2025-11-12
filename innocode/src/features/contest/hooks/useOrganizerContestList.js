import { useState, useCallback, useEffect } from "react"
import { deleteContest } from "@/features/contest/store/contestThunks"
import { useConfirmDelete } from "@/shared/hooks/useConfirmDelete"
import { useFetchContests } from "@/shared/hooks/useFetchContests"
import { useModal } from "@/shared/hooks/useModal"

export const useOrganizerContestList = (pageSize = 10) => {
  const { confirmDeleteEntity } = useConfirmDelete()
  const { contests, pagination, loading, error, fetchOrganizer } =
    useFetchContests()
  const [page, setPage] = useState(1)
  const { openModal } = useModal()

  useEffect(() => {
    fetchOrganizer({ pageNumber: page, pageSize })
  }, [fetchOrganizer, page, pageSize])

  const refetchContests = useCallback(() => {
    const safePage = Math.min(page, pagination?.totalPages || 1)
    fetchOrganizer({ pageNumber: safePage, pageSize })
  }, [fetchOrganizer, page, pageSize, pagination?.totalPages])

  const handleEdit = useCallback(
    (contest) => {
      openModal("contest", {
        initialData: contest,
        onUpdated: refetchContests,
      })
    },
    [openModal, refetchContests]
  )

  const handleDelete = useCallback(
    (item) => {
      confirmDeleteEntity({
        entityName: "contest",
        item,
        deleteAction: deleteContest,
        idKey: "contestId",
        onSuccess: item?.onSuccess || refetchContests,
      })
    },
    [confirmDeleteEntity, refetchContests]
  )

  return {
    contests,
    pagination,
    loading,
    error,
    page,
    setPage,
    handleEdit,
    handleDelete,
    refetchContests,
  }
}
