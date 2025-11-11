import { useState, useEffect, useMemo, useCallback } from "react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import {
  fetchRoundMcqs,
  updateQuestionWeights,
} from "@/features/mcq/store/mcqThunk"
import { clearMcqs } from "@/features/mcq/store/mcqSlice"
import { toast } from "react-hot-toast"

export const useMcqManagement = (roundId, pageSize = 10) => {
  const dispatch = useAppDispatch()
  const { mcqs, loading, error, testId, pagination } = useAppSelector(
    (s) => s.mcq
  )
  const [page, setPage] = useState(1)

  // Reset page when roundId changes
  useEffect(() => setPage(1), [roundId])

  // Fetch MCQs and cleanup
  useEffect(() => {
    if (!roundId) return
    dispatch(fetchRoundMcqs({ roundId, pageNumber: page, pageSize }))
    return () => dispatch(clearMcqs())
  }, [dispatch, roundId, page, pageSize])

  // Add display index to MCQs
  const mcqsWithIndex = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    return mcqs?.map((q, i) => ({ ...q, displayId: startIndex + i + 1 })) || []
  }, [mcqs, page, pageSize])

  // Update weight
  const handleUpdateWeight = useCallback(
    async ({ testId, questionId, weight }) => {
      if (!testId) throw new Error("Test ID is required")
      try {
        await dispatch(
          updateQuestionWeights({ testId, weights: [{ questionId, weight }] })
        ).unwrap()
        toast.success("Question weight updated successfully!")
        if (roundId)
          dispatch(fetchRoundMcqs({ roundId, pageNumber: page, pageSize }))
      } catch (err) {
        toast.error(err?.Message || err?.message || "Failed to update weight")
        throw err
      }
    },
    [dispatch, roundId, page, pageSize]
  )

  return {
    mcqsWithIndex,
    loading,
    error,
    pagination,
    page,
    setPage,
    handleUpdateWeight,
    testId,
  }
}
