import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchAttemptDetail } from "@/features/mcq/store/mcqThunk"
import { clearAttemptDetail } from "../store/mcqSlice"

export const useAttemptDetail = (attemptId) => {
  const dispatch = useAppDispatch()
  const { attemptDetail, loading, error } = useAppSelector((s) => s.mcq)

  useEffect(() => {
    if (attemptId) dispatch(fetchAttemptDetail(attemptId))
    return () => dispatch(clearAttemptDetail())
  }, [dispatch, attemptId])

  return { attemptDetail, loading, error }
}
