import React, { useCallback, useState } from "react"
// 🔹 Temporary fake data import — replace with your actual data later
import { certificates as fakeData } from "@/data/contests/certificates/certificates"

export const useCertificates = () => {
  const [certificates, setCertificates] = useState(fakeData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ----- FETCH ALL -----
  // (Uncomment when you have a real API)
  // useEffect(() => {
  //   const fetchCertificates = async () => {
  //     try {
  //       setLoading(true)
  //       const data = await certificateService.getAll()
  //       setCertificates(data)
  //     } catch (err) {
  //       setError(err.message)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //   fetchCertificates()
  // }, [])

  // ----- REVOKE CERTIFICATE -----
  const revokeCertificate = useCallback(async (certificate_id) => {
    setLoading(true)
    setError(null)
    try {
      console.log(`[REVOKE] Certificate ID ${certificate_id}`)
      // await certificateService.revoke(certificate_id)

      setCertificates((prev) =>
        prev.filter((c) => c.certificate_id !== certificate_id)
      )
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const addCertificates = useCallback((newCertificates) => {
    setCertificates((prev) => [...prev, ...newCertificates])
  }, [])

  return {
    certificates,
    loading,
    error,
    revokeCertificate,
    addCertificates,
  }
}

export default useCertificates
