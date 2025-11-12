import { useState, useCallback } from "react"
import { useAppDispatch } from "@/store/hooks"
import {
  fetchAllContests,
  fetchOrganizerContests,
} from "@/features/contest/store/contestThunks"

export function useFetchContests() {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [contests, setContests] = useState([])
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  })

  const fetchPublic = useCallback(
    async ({ pageNumber = 1, pageSize = 10 } = {}) => {
      setLoading(true)
      setError(null)
      try {
        const result = await dispatch(
          fetchAllContests({ pageNumber, pageSize })
        ).unwrap()
        setContests(result?.data || [])
        setPagination(result?.additionalData || pagination)
      } catch (err) {
        console.error(err)
        setError(err)
      } finally {
        setLoading(false)
      }
    },
    [dispatch]
  )

  const fetchOrganizer = useCallback(
    async ({ pageNumber = 1, pageSize = 10 } = {}) => {
      setLoading(true)
      setError(null)
      try {
        const result = await dispatch(
          fetchOrganizerContests({ pageNumber, pageSize })
        ).unwrap()
        setContests(result?.data || [])
        setPagination(result?.additionalData || pagination)
      } catch (err) {
        console.error(err)
        setError(err)
      } finally {
        setLoading(false)
      }
    },
    [dispatch]
  )

  return {
    contests,
    pagination,
    loading,
    error,
    fetchPublic,
    fetchOrganizer,
  }
}
