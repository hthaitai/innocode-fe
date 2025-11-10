import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchAttempts } from "../store/mcqThunk"
import { clearAttempts } from "../store/mcqSlice"

export const useMcqAttempts = (roundId) => {
  const dispatch = useAppDispatch()
  const { attempts, attemptsPagination, loading, error } = useAppSelector(
    (s) => s.mcq
  )
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [roundId])

  useEffect(() => {
    if (roundId) {
      dispatch(fetchAttempts({ roundId, pageNumber: page, pageSize: 10 }))
    }

    return () => {
      dispatch(clearAttempts())
    }
  }, [dispatch, roundId, page])

  return { attempts, loading, error, pagination: attemptsPagination, page, setPage }
}
