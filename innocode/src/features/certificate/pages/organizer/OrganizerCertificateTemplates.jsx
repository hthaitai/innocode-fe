import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import ExistingTemplates from "../../components/organizer/ExistingTemplates"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetContestByIdQuery } from "@/services/contestApi"

const OrganizerCertificateTemplates = () => {
  const { contestId } = useParams()
  const navigate = useNavigate()

  const {
    data: contest,
    isLoading: contestLoading,
    error: contestError,
  } = useGetContestByIdQuery(contestId)

  const contestName = contest?.name || "Contest"
  const breadcrumbItems =
    BREADCRUMBS.ORGANIZER_CERTIFICATE_TEMPLATES(contestName)
  const breadcrumbPaths =
    BREADCRUMB_PATHS.ORGANIZER_CERTIFICATE_TEMPLATES(contestId)

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={contestLoading}
      error={contestError}
    >
      <div className="px-4 md:px-0 pb-6">
        <div className="flex justify-end items-center mb-3">
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

        <ExistingTemplates contestId={contestId} />
      </div>
    </PageContainer>
  )
}

export default OrganizerCertificateTemplates
