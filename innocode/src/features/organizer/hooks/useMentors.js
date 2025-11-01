// src/hooks/organizer/useMentors.js
import React, { useCallback, useEffect, useState } from "react"
import { mentors as fakeData } from '@/data/mentors'
// import { mentorService } from '@/features/mentorService'

export const useMentors = () => {
  const [mentors, setMentors] = useState(fakeData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ----- FETCH ALL -----
  // useEffect(() => {
  //   const fetchMentors = async () => {
  //     try {
  //       setLoading(true)
  //       setError(null)
  //       const data = await mentorService.getAllMentors()
  //       setMentors(data)
  //     } catch (err) {
  //       console.error(err)
  //       setError(err)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //   fetchMentors()
  // }, [])

  // ----- CREATE -----
  const addMentor = useCallback(async (data) => {
    setLoading(true)
    setError(null)
    try {
      // const newMentor = await mentorService.createMentor(data)
      const newMentor = {
        mentor_id: Date.now(),
        created_at: new Date().toISOString(),
        ...data,
      }
      setMentors((prev) => [...prev, newMentor])
      return newMentor
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ----- UPDATE -----
  const updateMentor = useCallback(async (id, data) => {
    setLoading(true)
    setError(null)
    try {
      // const updated = await mentorService.updateMentor(id, data)
      const updated = { ...data, mentor_id: id }
      setMentors((prev) =>
        prev.map((m) => (m.mentor_id === id ? updated : m))
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
  const deleteMentor = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      // await mentorService.deleteMentor(id)
      console.log("[FAKE DELETE] Mentor ID:", id)
      setMentors((prev) => prev.filter((m) => m.mentor_id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ----- FILTER BY SCHOOL -----
  const getMentorsBySchool = useCallback(
    (schoolId) => mentors.filter((m) => m.school_id === schoolId),
    [mentors]
  )

  return {
    mentors,
    loading,
    error,
    addMentor,
    updateMentor,
    deleteMentor,
    getMentorsBySchool,
  }
}

export default useMentors
