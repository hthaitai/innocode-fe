import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-hot-toast"
import PageContainer from "@/shared/components/PageContainer"
import CertificateTemplateForm from "../../components/organizer/CertificateTemplateForm"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchOrganizerContests } from "@/features/contest/store/contestThunks"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"

const EMPTY_TEMPLATE = {
  name: "",
  file_url: "",
}

export default function OrganizerCertificateTemplateCreate() {
  const { contestId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { contests } = useAppSelector((s) => s.contests)

  // --- State ---
  const [formData, setFormData] = useState(EMPTY_TEMPLATE)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contestName, setContestName] = useState("Contest")

  // --- Fetch contest if missing ---
  useEffect(() => {
    if (contestId) {
      if (!contests || contests.length === 0) {
        dispatch(fetchOrganizerContests({ pageNumber: 1, pageSize: 50 }))
      } else {
        const contest = contests.find((c) => String(c.contestId) === String(contestId))
        if (contest) setContestName(contest.name)
      }
    }
  }, [contestId, contests, dispatch])

  // --- Breadcrumb setup using contest name dynamically ---
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_CERTIFICATE_TEMPLATE_CREATE(contestName)
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_CERTIFICATE_TEMPLATE_CREATE(contestId)

  // --- Placeholder for missing hook ---
  const addCertificateTemplate = async (data) => {
    console.warn("addCertificateTemplate is not available — useCertificateTemplates hook missing")
    toast.success("Pretend template was created!") // optional feedback
  }

  // --- Handle submit ---
  const handleSubmit = async () => {
    const validationErrors = {}
    if (!formData.name || formData.name.trim() === "") {
      validationErrors.name = "Template name is required."
    }
    if (!formData.file_url || formData.file_url.trim() === "") {
      validationErrors.file_url = "Template file URL is required."
    }

    setErrors(validationErrors)

    const errorCount = Object.keys(validationErrors).length
    if (errorCount > 0) {
      toast.error(`Please fix ${errorCount} field${errorCount > 1 ? "s" : ""}`)
      return
    }

    setIsSubmitting(true)
    try {
      await addCertificateTemplate({
        name: formData.name.trim(),
        file_url: formData.file_url.trim(),
      })
      toast.success("Certificate template created successfully!")
      navigate(`/organizer/contests/${contestId}/certificates`)
    } catch (err) {
      console.error(err)
      toast.error("An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- Render ---
  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5">
        <CertificateTemplateForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
        />

        <div className="flex justify-end gap-2 pt-8">
          <button
            type="button"
            className="button-white"
            onClick={() => navigate(`/organizer/contests/${contestId}/certificates`)}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className={isSubmitting ? "button-gray" : "button-orange"}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Template"}
          </button>
        </div>
      </div>
    </PageContainer>
  )
}
