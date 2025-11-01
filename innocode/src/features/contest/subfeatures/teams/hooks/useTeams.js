import React, { useCallback, useEffect, useState } from "react"
import { teams as fakeData } from "@/data/contests/teams/teams"

export const useTeams = () => {
  const [teams, setTeams] = useState(fakeData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ----- FETCH ALL -----
  // useEffect(() => {
  //   const fetchTeams = async () => {
  //     try {
  //       setLoading(true)
  //       setError(null)
  //       const data = await teamService.getAllTeams()
  //       setTeams(data)
  //     } catch (err) {
  //       console.error(err)
  //       setError(err)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //   fetchTeams()
  // }, [])

  // ----- CREATE -----
  const addTeam = useCallback(async (data) => {
    setLoading(true)
    setError(null)
    try {
      // const newTeam = await teamService.createTeam(data)
      const newTeam = {
        team_id: Date.now(),
        created_at: new Date().toISOString(),
        ...data,
      }
      setTeams((prev) => [...prev, newTeam])
      return newTeam
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ----- UPDATE -----
  const updateTeam = useCallback(async (id, data) => {
    setLoading(true)
    setError(null)
    try {
      // const updated = await teamService.updateTeam(id, data)
      const updated = { ...data, team_id: id }

      setTeams((prev) =>
        prev.map((t) => (t.team_id === id ? updated : t))
      )
      return updated
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ----- DELETE -----
  const deleteTeam = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      // await teamService.deleteTeam(id)
      console.log("[FAKE DELETE] Team ID:", id)
      setTeams((prev) => prev.filter((t) => t.team_id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    teams,
    loading,
    error,
    addTeam,
    updateTeam,
    deleteTeam,
  }
}

export default useTeams
