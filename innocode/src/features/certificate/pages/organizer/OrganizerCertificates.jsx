import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import ExistingTemplates from "../../components/organizer/ExistingTemplates"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetContestByIdQuery } from "@/services/contestApi"

export default function OrganizerCertificates() {
  const { contestId } = useParams()
  const navigate = useNavigate()

  const {
    data: contest,
    isLoading: contestLoading,
    error: contestError,
  } = useGetContestByIdQuery(contestId)

  const contestName = contest?.name || "Contest"
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_CERTIFICATES(contestName)
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_CERTIFICATES(contestId)

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
      {/* Templates Header */}
      <div className="flex justify-between items-center mb-3 border border-[#E5E5E5] bg-white min-h-[70px] px-5 rounded-[5px]">
        <h2 className="text-sm leading-5 font-semibold">Templates</h2>
        <button
          className="button-orange"
          onClick={() =>
            navigate(
              `/organizer/contests/${contestId}/certificates/templates/new`
            )
          }
        >
          New template
        </button>
      </div>

      {/* Existing Templates List (no award logic passed anymore) */}
      <ExistingTemplates contestId={contestId} />
    </PageContainer>
  )
}
