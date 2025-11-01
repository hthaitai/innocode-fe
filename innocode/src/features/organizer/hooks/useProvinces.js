import React, { useCallback, useEffect, useState } from "react"
import { provinces as fakeData } from '@/data/provinces'

export const useProvinces = () => {
  const [provinces, setProvinces] = useState(fakeData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // useEffect(() => {
  //   const fetchProvinces = async () => {
  //     try {
  //       setLoading(true)
  //       setError(null)

  //       const data = await provinceService.getAllProvinces()
  //       setProvinces(data)
  //     } catch (err) {
  //       console.error(err)
  //       setError(err)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchProvinces()
  // }, [])

  // ----- CREATE -----
  const addProvince = useCallback(async (data) => {
    setLoading(true)
    setError(null)
    try {
      // 🔹 Skip API call, just simulate
      // const newProvince = await provinceService.createProvince(data)
      const newProvince = { province_id: Date.now(), ...data }

      setProvinces((prev) => [...prev, newProvince])
      return newProvince
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ----- UPDATE -----
  const updateProvince = useCallback(async (id, data) => {
    setLoading(true)
    setError(null)
    try {
      // const updated = await provinceService.updateProvince(id, data)
      const updated = { ...data, province_id: id }

      setProvinces((prev) =>
        prev.map((p) => (p.province_id === id ? updated : p))
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
  const deleteProvince = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      // await provinceService.deleteProvince(id)
      console.log("[FAKE DELETE] Province ID:", id)

      setProvinces((prev) => prev.filter((p) => p.province_id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    provinces,
    loading,
    error,
    addProvince,
    updateProvince,
    deleteProvince,
  }
}

export default useProvinces
