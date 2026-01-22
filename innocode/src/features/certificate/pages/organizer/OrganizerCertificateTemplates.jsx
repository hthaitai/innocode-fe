import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { validate as uuidValidate } from "uuid"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { useGetCertificateTemplatesQuery } from "@/services/certificateApi"
import ManageCertificateTemplates from "../../components/organizer/ManageCertificateTemplates"
import { LoadingState } from "@/shared/components/ui/LoadingState"
import { ErrorState } from "@/shared/components/ui/ErrorState"
import { MissingState } from "@/shared/components/ui/MissingState"
import { AnimatedSection } from "@/shared/components/ui/AnimatedSection"

import { useTranslation } from "react-i18next"

const OrganizerCertificateTemplates = () => {
  const { t } = useTranslation(["certificate", "pages", "common", "errors"])
  const { contestId } = useParams()
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 6

  const isValidContestId = uuidValidate(contestId)

  const {
    data: contest,
    isLoading: contestLoading,
    isError: contestError,
    error: contestErrorObj,
  } = useGetContestByIdQuery(contestId, { skip: !isValidContestId })

  const {
    data: templatesData,
    isLoading: templatesLoading,
    isError: templatesError,
  } = useGetCertificateTemplatesQuery({ page: pageNumber, pageSize, contestId })

  const templates = templatesData?.data ?? []
  const pagination = templatesData?.additionalData ?? {}

  const hasContestError = !isValidContestId || contestError

  // Breadcrumbs - Update to show "Not found" for error states
  const breadcrumbItems = hasContestError
    ? ["Contests", t("errors:common.notFound")]
    : BREADCRUMBS.ORGANIZER_CERTIFICATE_TEMPLATES(
        contest?.name ?? t("pages:contest.contest"),
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

  if (contestError || !contest || !isValidContestId) {
    let errorMessage = null

    if (!isValidContestId) {
      errorMessage = t("errors:common.invalidId")
    } else if (contestErrorObj?.status === 404) {
      errorMessage = t("errors:common.notFound")
    } else if (contestErrorObj?.status === 403) {
      errorMessage = t("errors:common.forbidden")
    }

    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState
          itemName={t("common:common.contest")}
          message={errorMessage}
        />
      </PageContainer>
    )
  }

  if (templatesError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName="certificate templates" />
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
