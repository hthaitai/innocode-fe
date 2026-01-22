import { useCallback, useEffect, useState } from "react"
import { contests as fakeData } from "@/data/contests/contests"
import { contestService } from "../services/contestService"
export const useContests = () => {
  const [contests, setContests] = useState([]) // Initialize with empty array instead of undefined
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("") // Actual search term sent to API
  const [pageNumber, setPageNumber] = useState(1)
  const [pagination, setPagination] = useState(null)
  const pageSize = 10

  // ----- FETCH -----
  useEffect(() => {
    const fetchContest = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await contestService.getAllContests({
          pageNumber,
          pageSize,
          nameSearch: searchTerm || undefined,
        })

        // Extract the actual contests array from the response
        const contestsArray = response?.data || response || []

        // Extract pagination info from additionalData
        const paginationData = response?.additionalData || null

        if (paginationData) {
          setPagination(paginationData)
        }


        setContests(Array.isArray(contestsArray) ? contestsArray : [])
      } catch (error) {
        setError(error.message || "Failed to load contests")
        setContests([])
        setPagination(null)
      } finally {
        setLoading(false)
      }
    }

    fetchContest()
  }, [searchTerm, pageNumber])

  // ----- SEARCH -----
  const searchContests = useCallback((term) => {
    setSearchTerm(term || "")
    setPageNumber(1) // Reset to first page when searching
  }, [])

  // ----- PAGINATION -----
  const handlePageChange = useCallback((newPage) => {
    setPageNumber(newPage)
  }, [])
  const getMyContests = useCallback(async (nameSearch) => {
    try {
      setLoading(true)
      setError(null)
      const response = await contestService.getMyContests({
        nameSearch: nameSearch || undefined,
      })
      const contestsArray = response?.data || response || []
      return Array.isArray(contestsArray) ? contestsArray : []
    } catch (error) {
      console.error(error)
      setError(error.message || "Failed to load my contests")
      return []
    } finally {
      setLoading(false)
    }
  }, [])
  // ----- CREATE -----
  const addContest = useCallback(async (data) => {
    setLoading(true)
    setError(null)
    try {
      // const newContest = await contestService.createContest(data)
      const newContest = {
        contest_id: Date.now(),
        created_at: new Date().toISOString(),
        ...data,
      }

      setContests((prev) => [...prev, newContest])
      return newContest
    } catch (err) {
      console.error(err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ----- UPDATE -----
  const updateContest = useCallback(async (id, data) => {
    setLoading(true)
    setError(null)
    try {
      // const updated = await contestService.updateContest(id, data)
      const updated = { ...data, contest_id: id }

      setContests((prev) =>
        prev.map((contest) => (contest.contest_id === id ? updated : contest)),
      )
      return updated
    } catch (err) {
      console.error(err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ----- DELETE -----
  const deleteContest = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      // await contestService.deleteContest(id)
      console.log("[FAKE DELETE] Contest ID:", id)

      setContests((prev) => prev.filter((contest) => contest.contest_id !== id))
    } catch (err) {
      console.error(err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    contests,
    loading,
    error,
    searchTerm,
    searchContests,
    pagination,
    onPageChange: handlePageChange,
    addContest,
    updateContest,
    deleteContest,
    getMyContests,
  }
}

export default useContests
