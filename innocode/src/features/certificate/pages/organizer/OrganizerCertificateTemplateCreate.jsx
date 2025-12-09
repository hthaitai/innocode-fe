import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-hot-toast"
import { ArrowLeft, Loader } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import CertificateTemplateForm from "../../components/organizer/CertificateTemplateForm"

import { useUploadCertificateTemplateMutation } from "../../../../services/certificateApi"
import { useGetContestByIdQuery } from "../../../../services/contestApi"
import ExistingTemplates from "../../components/organizer/ExistingTemplates"

const EMPTY_TEMPLATE = {
  name: "",
  file: null,
}

export default function OrganizerCertificateTemplateCreate() {
  const { contestId } = useParams()
  const navigate = useNavigate()

  const {
    data: contest,
    isLoading: contestLoading,
    error: contestError,
  } = useGetContestByIdQuery(contestId)

  const [uploadTemplate] = useUploadCertificateTemplateMutation()
  const [formData, setFormData] = useState(EMPTY_TEMPLATE)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (submitting) return

    const validationErrors = {}
    if (!formData.name.trim())
      validationErrors.name = "Template name is required."
    if (!formData.file) validationErrors.file = "Template file is required."

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error("Please fix form errors.")
      return
    }

    setSubmitting(true)
    try {
      let uploadedFileUrl = formData.fileUrl

      if (formData.file && !formData.fileUrl) {
        const formDataUpload = new FormData()
        formDataUpload.append("file", formData.file)
        formDataUpload.append("upload_preset", "certificate-templates")
        formDataUpload.append("folder", "certificate-templates")

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dkb7cihxq/auto/upload",
          { method: "POST", body: formDataUpload }
        )
        const data = await res.json()
        uploadedFileUrl = data.url
      }

      const payload = {
        contestId,
        name: formData.name.trim(),
        fileUrl: uploadedFileUrl,
        text: { ...formData.text },
      }

      const response = await uploadTemplate(payload).unwrap()

      toast.success("Certificate template created successfully!")
      navigate(`/organizer/contests/${contestId}/certificates`)
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.message || "Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  if (contestLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading contest...
      </div>
    )

  if (contestError)
    return (
      <div className="h-screen flex items-center justify-center">
        Error loading contest.
      </div>
    )

  return (
    <div className="flex flex-col h-screen">
      <div className="px-5 py-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() =>
            navigate(`/organizer/contests/${contestId}/certificates`)
          }
          className="w-10 h-9 rounded-[5px] cursor-pointer hover:bg-[#EAEAEA] transition flex items-center justify-center"
        >
          <ArrowLeft size={16} />
        </button>

        <span className="text-sm leading-5">Back to templates</span>
      </div>

      <div className="flex-1 px-5 pb-5 overflow-hidden">
        <CertificateTemplateForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </div>
    </div>
  )
}
