import { useCallback, useState } from "react"
import { rounds as fakeData } from '@/data/contests/rounds'

export const useRounds = (contestId) => {
  // ✅ Load rounds filtered by contestId, or all if none
  const [rounds, setRounds] = useState(() =>
    contestId ? fakeData.filter((r) => r.contest_id === Number(contestId)) : fakeData
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // // ----- FETCH -----
  // useEffect(() => {
  //   const fetchRounds = async () => {
  //     if (!contestId) return
  //     try {
  //       setLoading(true)
  //       setError(null)
  //       const data = await roundService.getAllRounds(contestId)
  //       setRounds(Array.isArray(data) ? data : [])
  //     } catch (err) {
  //       console.error(err)
  //       setError(err.message || "Failed to load rounds")
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //
  //   fetchRounds()
  // }, [contestId])

  // ----- CREATE -----
  const addRound = useCallback(
    async (data) => {
      setLoading(true)
      setError(null)
      try {
        // const newRound = await roundService.createRound(contestId, data)
        const newRound = {
          round_id: Date.now(),
          created_at: new Date().toISOString(),
          contest_id: contestId ? Number(contestId) : data.contest_id,
          ...data,
        }

        setRounds((prev) => [...prev, newRound])
        return newRound
      } catch (err) {
        console.error(err)
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [contestId]
  )

  // ----- UPDATE -----
  const updateRound = useCallback(
    async (id, data) => {
      setLoading(true)
      setError(null)
      try {
        // const updated = await roundService.updateRound(contestId, id, data)
        const updated = { ...data, round_id: id }

        setRounds((prev) =>
          prev.map((r) => (r.round_id === id ? updated : r))
        )
        return updated
      } catch (err) {
        console.error(err)
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [contestId]
  )

  // ----- DELETE -----
  const deleteRound = useCallback(
    async (id) => {
      setLoading(true)
      setError(null)
      try {
        // await roundService.deleteRound(contestId, id)
        console.log("[FAKE DELETE] Round ID:", id)

        setRounds((prev) => prev.filter((r) => r.round_id !== id))
      } catch (err) {
        console.error(err)
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [contestId]
  )

  return {
    rounds,
    loading,
    error,
    addRound,
    updateRound,
    deleteRound,
  }
}

export default useRounds
