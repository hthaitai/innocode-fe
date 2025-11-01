import React, { useCallback, useEffect, useState } from "react"
import { teamMembers as fakeData } from '@/data/teamMembers'
import { teamMemberService } from '@/features/teamMemberService'

export const useTeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState(fakeData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ----- FETCH ALL -----
  // useEffect(() => {
  //   const fetchMembers = async () => {
  //     try {
  //       setLoading(true)
  //       setError(null)
  //       const data = await teamMemberService.getMembersByTeam(teamId)
  //       setTeamMembers(data)
  //     } catch (err) {
  //       console.error(err)
  //       setError(err)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //   fetchMembers()
  // }, [teamId])

  // ----- ADD MEMBER -----
  const addMember = useCallback(async (teamId, data) => {
    setLoading(true)
    setError(null)
    try {
      // const newMember = await teamMemberService.addMember(teamId, data)
      const newMember = {
        team_id: teamId,
        student_id: Date.now(),
        joined_at: new Date().toISOString(),
        ...data,
      }
      setTeamMembers((prev) => [...prev, newMember])
      return newMember
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ----- UPDATE MEMBER ROLE -----
  const updateMemberRole = useCallback(async (teamId, studentId, role) => {
    setLoading(true)
    setError(null)
    try {
      // const updated = await teamMemberService.updateMemberRole(teamId, studentId, { member_role: role })
      setTeamMembers((prev) =>
        prev.map((m) =>
          m.team_id === teamId && m.student_id === studentId
            ? { ...m, member_role: role }
            : m
        )
      )
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ----- REMOVE MEMBER -----
  const removeMember = useCallback(async (teamId, studentId) => {
    setLoading(true)
    setError(null)
    try {
      // await teamMemberService.removeMember(teamId, studentId)
      console.log(`[FAKE DELETE] Member ${studentId} from Team ${teamId}`)
      setTeamMembers((prev) =>
        prev.filter(
          (m) => !(m.team_id === teamId && m.student_id === studentId)
        )
      )
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    teamMembers,
    loading,
    error,
    addMember,
    updateMemberRole,
    removeMember,
  }
}

export default useTeamMembers
