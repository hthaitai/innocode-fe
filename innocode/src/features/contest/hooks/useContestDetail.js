// src/features/contest/hooks/useContestDetail.js
import { useEffect, useMemo, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchContests, deleteContest } from "../store/contestThunks"
import { useConfirmDelete } from "@/shared/hooks/useConfirmDelete"
import { useModal } from "@/shared/hooks/useModal"

export const useContestDetail = (contestId) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { confirmDeleteEntity } = useConfirmDelete()
  const { openModal } = useModal()

  const { contests, pagination, loading, error } = useAppSelector(
    (state) => state.contests
  )

  const hasFetchedRef = useRef(false)

  const contest = useMemo(
    () => contests.find((c) => String(c.contestId) === String(contestId)),
    [contests, contestId]
  )

  useEffect(() => {
    if (!contest && !loading && !hasFetchedRef.current) {
      hasFetchedRef.current = true
      dispatch(fetchContests({ pageNumber: 1, pageSize: 50 }))
    }
  }, [contest, loading, dispatch])

  useEffect(() => {
    hasFetchedRef.current = false
  }, [contestId])

  const refetch = useCallback(() => {
    const currentPage = pagination?.pageNumber || 1
    const safePage = Math.min(currentPage, pagination?.totalPages || 1)
    dispatch(fetchContests({ pageNumber: safePage, pageSize: 50 }))
  }, [dispatch, pagination?.pageNumber, pagination?.totalPages])

  const handleEdit = useCallback(() => {
    if (!contest) return
    openModal("contest", {
      initialData: contest,
      onUpdated: refetch,
    })
  }, [openModal, contest, refetch])

  const handleDelete = useCallback(() => {
    if (!contest) return
    confirmDeleteEntity({
      entityName: "contest",
      item: contest,
      deleteAction: deleteContest,
      idKey: "contestId",
      onSuccess: refetch,
      onNavigate: () => navigate("/organizer/contests"),
    })
  }, [contest, confirmDeleteEntity, navigate, refetch])

  return { contest, loading, error, handleEdit, handleDelete }
}
