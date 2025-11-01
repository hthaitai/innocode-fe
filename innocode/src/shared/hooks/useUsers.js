import React, { useCallback, useEffect, useState } from "react"
import { users as fakeData } from '@/data/users'
// import userService from "../../../services/userService" // Future API

export const useUsers = () => {
  const [users, setUsers] = useState(fakeData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ----- FETCH ALL (Future API Ready) -----
  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       setLoading(true)
  //       setError(null)
  //       const data = await userService.getAllUsers()
  //       setUsers(data)
  //     } catch (err) {
  //       console.error(err)
  //       setError(err)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //   fetchUsers()
  // }, [])

  // ----- CREATE -----
  const addUser = useCallback(async (data) => {
    setLoading(true)
    setError(null)
    try {
      // const newUser = await userService.createUser(data)
      const newUser = {
        user_id: Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "active",
        ...data,
      }
      setUsers((prev) => [...prev, newUser])
      return newUser
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ----- UPDATE -----
  const updateUser = useCallback(async (id, data) => {
    setLoading(true)
    setError(null)
    try {
      // const updated = await userService.updateUser(id, data)
      const updated = {
        ...data,
        user_id: id,
        updated_at: new Date().toISOString(),
      }

      setUsers((prev) =>
        prev.map((u) => (u.user_id === id ? { ...u, ...updated } : u))
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
  const deleteUser = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      // await userService.deleteUser(id)
      console.log("[FAKE DELETE] User ID:", id)
      setUsers((prev) => prev.filter((u) => u.user_id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    users,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
  }
}

export default useUsers
