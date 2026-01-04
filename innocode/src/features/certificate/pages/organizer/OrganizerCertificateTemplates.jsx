import React, { useState } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { useGetCertificateTemplatesQuery } from "@/services/certificateApi"
import ManageCertificateTemplates from "../../components/organizer/ManageCertificateTemplates"
import { LoadingState } from "@/shared/components/ui/LoadingState"
import { ErrorState } from "@/shared/components/ui/ErrorState"
import { MissingState } from "@/shared/components/ui/MissingState"
import { AnimatedSection } from "@/shared/components/ui/AnimatedSection"

const OrganizerCertificateTemplates = () => {
  const { contestId } = useParams()
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 6

  const {
    data: contest,
    isLoading: contestLoading,
    isError: contestError,
  } = useGetContestByIdQuery(contestId)

  const {
    data: templatesData,
    isLoading: templatesLoading,
    isError: templatesError,
  } = useGetCertificateTemplatesQuery({ page: pageNumber, pageSize })

  const templates = templatesData?.data ?? []
  const pagination = templatesData?.additionalData ?? {}

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_CERTIFICATE_TEMPLATES(
    contest?.name ?? "Contest"
  )
  const breadcrumbPaths =
    BREADCRUMB_PATHS.ORGANIZER_CERTIFICATE_TEMPLATES(contestId)

  if (contestLoading || templatesLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (contestError || templatesError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName="certificate templates" />
      </PageContainer>
    )
  }

  if (!contest) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <MissingState itemName="contest" />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        <ManageCertificateTemplates
          contestId={contestId}
          templates={templates}
          pagination={pagination}
          setPageNumber={setPageNumber}
        />
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerCertificateTemplates
