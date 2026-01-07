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
  const [isAutoSkipping, setIsAutoSkipping] = useState(false)
  const pageSize = 10

  // ----- FETCH -----
  useEffect(() => {
    const fetchContest = async () => {
      try {
        setLoading(true)
        setError(null)
        setIsAutoSkipping(false)

        let currentPage = pageNumber
        let maxSkipPages = 10 // Limit to prevent infinite loops
        let skippedPages = 0

        while (skippedPages < maxSkipPages) {
          const response = await contestService.getAllContests({
            pageNumber: currentPage,
            pageSize,
            nameSearch: searchTerm || undefined,
          })

          // Extract the actual contests array from the response
          const contestsArray = response?.data || response || []

          // Extract pagination info from additionalData
          const paginationData = response?.additionalData || null

          // Filter out draft contests
          const nonDraftContests = Array.isArray(contestsArray)
            ? contestsArray.filter((contest) => contest.status !== "Draft")
            : []

          // If we found non-draft contests or no more pages, use this page
          if (
            nonDraftContests.length > 0 ||
            !paginationData?.hasNextPage ||
            currentPage >= (paginationData?.totalPages || 1)
          ) {
            if (paginationData) {
              setPagination(paginationData)
            }

            console.log("📊 Raw API response:", response)
            console.log("📦 Contests array:", contestsArray)
            console.log("📦 Non-draft contests:", nonDraftContests)
            console.log("📄 Pagination:", paginationData)
            if (skippedPages > 0) {
              console.log(
                `⏭️ Auto-skipped ${skippedPages} page(s) with only drafts`
              )
            }

            setContests(Array.isArray(contestsArray) ? contestsArray : [])
            break
          }

          // If current page only has drafts and there's a next page, skip to next page
          if (
            paginationData?.hasNextPage &&
            currentPage < paginationData.totalPages
          ) {
            currentPage++
            skippedPages++
            setIsAutoSkipping(true)
            console.log(
              `⏭️ Skipping page ${
                currentPage - 1
              } (all drafts), fetching page ${currentPage}`
            )
          } else {
            // No more pages, use current page
            if (paginationData) {
              setPagination(paginationData)
            }
            setContests(Array.isArray(contestsArray) ? contestsArray : [])
            break
          }
        }
      } catch (error) {
        setError(error.message || "Failed to load contests")
        setContests([])
        setPagination(null)
        setIsAutoSkipping(false)
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
        prev.map((contest) => (contest.contest_id === id ? updated : contest))
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
    isAutoSkipping,
    addContest,
    updateContest,
    deleteContest,
    getMyContests,
  }
}

export default useContests
