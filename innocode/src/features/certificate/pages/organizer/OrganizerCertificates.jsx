import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import ExistingTemplates from "../../components/organizer/ExistingTemplates"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { useAwardCertificatesMutation } from "@/services/certificateApi"
import { useModal } from "@/shared/hooks/useModal"

export default function OrganizerCertificates() {
  const { contestId } = useParams()
  const navigate = useNavigate()
  const { openModal } = useModal()

  const { data: contest, isLoading: contestLoading, error: contestError } =
    useGetContestByIdQuery(contestId)

  const [awardCertificate, { isLoading: awarding }] = useAwardCertificatesMutation()

  const contestName = contest?.name || "Contest"
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_CERTIFICATES(contestName)
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_CERTIFICATES(contestId)

  if (contestLoading)
    return (
      <PageContainer breadcrumb={breadcrumbItems} breadcrumbPaths={breadcrumbPaths}>
        Loading contest...
      </PageContainer>
    )

  if (contestError)
    return (
      <PageContainer breadcrumb={breadcrumbItems} breadcrumbPaths={breadcrumbPaths}>
        Error loading contest.
      </PageContainer>
    )

  // Function to handle awarding certificates
  const handleAwardCertificate = async (templateId, recipients) => {
    if (!templateId || !recipients?.length) return

    const payload = {
      templateId,
      recipients, // array of { teamId, studentId, displayName }
      output: "png",
      reissue: true,
    }

    try {
      await awardCertificate(payload).unwrap()
      alert("Certificate awarded successfully!")
    } catch (err) {
      console.error(err)
      alert("Failed to award certificate.")
    }
  }

  // Function to open the template selection modal
  const openTemplateModal = (recipients) => {
    openModal("template", {
      contestId,
      onSelectTemplate: (templateId) => handleAwardCertificate(templateId, recipients),
    })
  }

  return (
    <PageContainer breadcrumb={breadcrumbItems} breadcrumbPaths={breadcrumbPaths}>
      {/* Templates Header */}
      <div className="flex justify-between items-center mb-3 border border-[#E5E5E5] bg-white min-h-[70px] px-5 rounded-[5px]">
        <h2 className="text-sm leading-5 font-semibold">Templates</h2>
        <button
          className="button-orange"
          onClick={() =>
            navigate(`/organizer/contests/${contestId}/certificates/templates/new`)
          }
        >
          New template
        </button>
      </div>

      {/* Existing Templates List */}
      <ExistingTemplates
        contestId={contestId}
        onAwardCertificate={openTemplateModal} // pass function to award a template
        awarding={awarding} // can disable buttons if needed
      />
    </PageContainer>
  )
}
