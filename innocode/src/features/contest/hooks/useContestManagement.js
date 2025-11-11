import { useState, useEffect, useCallback } from "react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import {
  fetchContests,
  deleteContest,
} from "@/features/contest/store/contestThunks"
import { useConfirmDelete } from "../../../shared/hooks/useConfirmDelete"

export const useContestManagement = (pageSize = 10) => {
  const dispatch = useAppDispatch()
  const { confirmDeleteEntity } = useConfirmDelete()
  const { contests, pagination, loading, error } = useAppSelector(
    (s) => s.contests
  )
  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(fetchContests({ pageNumber: page, pageSize }))
  }, [dispatch, page, pageSize])

  const refetchContests = useCallback(() => {
    const safePage = Math.min(page, pagination?.totalPages || 1)
    dispatch(fetchContests({ pageNumber: safePage, pageSize }))
  }, [dispatch, page, pageSize, pagination?.totalPages])

  const handleDelete = useCallback(
    (item) => {
      confirmDeleteEntity({
        entityName: "contest",
        item,
        deleteAction: deleteContest,
        idKey: "contestId",
        onSuccess: refetchContests,
      })
    },
    [confirmDeleteEntity, refetchContests] 
  )

  return {
    contests: contests || [],
    loading,
    error,
    pagination,
    page,
    setPage,
    handleDelete,
    refetchContests,
  }
}
