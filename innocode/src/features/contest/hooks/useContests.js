import { useCallback, useState } from "react"
import { contests as fakeData } from '@/data/contests/contests'
import { contestService } from "@/features/contest/services/contestService"

export const useContests = () => {
  const [contests, setContests] = useState(fakeData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ----- FETCH -----
  // useEffect(() => {
  //   const fetchContests = async () => {
  //     try {
  //       setLoading(true)
  //       setError(null)

  //       const data = await contestService.getAllContests()
  //       setContests(Array.isArray(data) ? data : [])
  //     } catch (err) {
  //       console.error(err)
  //       setError(err.message || "Failed to load contests")
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchContests()
  // }, [])

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
    addContest,
    updateContest,
    deleteContest,
  }
}

export default useContests
