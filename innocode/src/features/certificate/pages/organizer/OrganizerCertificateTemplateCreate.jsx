import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-hot-toast"
import { Loader } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import CertificateTemplateForm from "../../components/organizer/CertificateTemplateForm"

import { useUploadCertificateTemplateMutation } from "../../../../services/certificateApi"
import { useGetContestByIdQuery } from "../../../../services/contestApi"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
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
  const [submitting, setSubmitting] = useState(false) // covers Cloudinary + mutation

  const contestName = contest?.name || "Contest"
  const breadcrumbItems =
    BREADCRUMBS.ORGANIZER_CERTIFICATE_TEMPLATE_CREATE(contestName)
  const breadcrumbPaths =
    BREADCRUMB_PATHS.ORGANIZER_CERTIFICATE_TEMPLATE_CREATE(contestId)

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

      // Upload file to Cloudinary if it's local
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

      // Prepare payload
      const payload = {
        contestId,
        name: formData.name.trim(),
        fileUrl: uploadedFileUrl,
        text: { ...formData.text },
      }

      // Log payload
      console.log("Sending payload to backend:", payload)

      // RTK Query mutation
      const response = await uploadTemplate(payload).unwrap()
      console.log("Backend response:", response)

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
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        Loading contest...
      </PageContainer>
    )

  if (contestError)
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        Error loading contest.
      </PageContainer>
    )

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5 mb-5">
        <CertificateTemplateForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
        />

        <div className="flex justify-end pt-8">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className={`flex items-center justify-center gap-2 ${
              submitting ? "button-gray" : "button-orange"
            }`}
          >
            {/* Spinner */}
            {submitting && (
              <span className="w-4 h-4 border-2 border-t-white border-gray-300 rounded-full animate-spin"></span>
            )}

            {/* Button text */}
            {submitting ? "Creating..." : "Create"}
          </button>
        </div>
      </div>

      <div className="text-sm leading-5 font-semibold pt-3 pb-2">
        Existing templates
      </div>
      <ExistingTemplates contestId={contestId} />
    </PageContainer>
  )
}
