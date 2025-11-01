import React, { useCallback, useEffect, useState } from "react"
// 🔹 Temporary fake data import — replace with your actual data later
import { certificateTemplates as fakeData } from "@/data/contests/certificates/certificateTemplates"
import useCertificates from "./useCertificates"

export const useCertificateTemplates = () => {
  const [certificateTemplates, setCertificateTemplates] = useState(fakeData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { addCertificates } = useCertificates()

  // // ----- FETCH ALL -----
  // useEffect(() => {
  //   const fetchCertificateTemplates = async () => {
  //     try {
  //       setLoading(true)
  //       setError(null)

  //       // 🔹 Placeholder: replace with actual API call
  //       // const data = await certificateTemplateService.getAllTemplates()
  //       const data = fakeData

  //       setCertificateTemplates(data)
  //     } catch (err) {
  //       console.error(err)
  //       setError(err)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchCertificateTemplates()
  // }, [])

  // ----- CREATE (Add new template) -----
  const addCertificateTemplate = useCallback(async (data) => {
    setLoading(true)
    setError(null)
    try {
      // 🔹 Replace with:
      // const newTemplate = await certificateTemplateService.createTemplate(data)
      const newTemplate = {
        template_id: Date.now(),
        ...data,
      }

      setCertificateTemplates((prev) => [...prev, newTemplate])
      return newTemplate
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ----- UPDATE -----
  const updateCertificateTemplate = useCallback(async (id, data) => {
    setLoading(true)
    setError(null)
    try {
      // const updated = await certificateTemplateService.updateTemplate(id, data)
      const updated = { ...data, template_id: id }

      setCertificateTemplates((prev) =>
        prev.map((t) => (t.template_id === id ? updated : t))
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
  const deleteCertificateTemplate = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      // await certificateTemplateService.deleteTemplate(id)
      console.log("[FAKE DELETE] Certificate Template ID:", id)

      setCertificateTemplates((prev) =>
        prev.filter((t) => t.template_id !== id)
      )
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ----- ISSUE CERTIFICATES -----
  const issueCertificate = useCallback(
    async (template, recipients) => {
      setLoading(true)
      setError(null)
      try {
        // 🔹 recipients = array of { team_id?, student_id? }
        const issued = recipients.map((r) => ({
          certificate_id: Date.now() + Math.floor(Math.random() * 1000), // temporary unique ID
          template_id: template.template_id,
          team_id: r.team_id || null,
          student_id: r.student_id || null,
          file_url: `https://example.com/certificates/${template.name
            .toLowerCase()
            .replace(/\s+/g, "-")}-${Date.now()}.pdf`,
          issued_at: new Date().toISOString(),
        }))

        // Add to global issued certificates state
        addCertificates(issued)

        return issued
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [addCertificates]
  )

  return {
    certificateTemplates,
    loading,
    error,
    addCertificateTemplate,
    updateCertificateTemplate,
    deleteCertificateTemplate,
    issueCertificate,
  }
}

export default useCertificateTemplates
