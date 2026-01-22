import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { validate as uuidValidate } from "uuid"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { useGetIssuedCertificatesQuery } from "@/services/certificateApi"
import { getStudentIssuedCertificatesColumns } from "../../columns/issuedStudentColumns"
import { LoadingState } from "@/shared/components/ui/LoadingState"
import { ErrorState } from "@/shared/components/ui/ErrorState"
import { MissingState } from "@/shared/components/ui/MissingState"
import { AnimatedSection } from "@/shared/components/ui/AnimatedSection"
import TablePagination from "@/shared/components/TablePagination"

import { useTranslation } from "react-i18next"

const OrganizerIssuedStudentCertificates = () => {
  const { t } = useTranslation(["certificate", "common", "errors"])
  const { contestId } = useParams()
  const [page, setPage] = useState(1)
  const pageSize = 10

  const isValidContestId = uuidValidate(contestId)

  const {
    data: contest,
    isLoading: contestLoading,
    error: contestError,
  } = useGetContestByIdQuery(contestId, { skip: !isValidContestId })

  const {
    data: issuedData,
    isLoading: issuedLoading,
    error: issuedError,
  } = useGetIssuedCertificatesQuery(
    {
      contestId,
      page,
      pageSize,
      types: "Student",
    },
    { skip: !isValidContestId },
  )

  const certificates = issuedData?.data ?? []
  const pagination = issuedData?.additionalData ?? {}

  const hasContestError = !isValidContestId || contestError

  // Breadcrumbs - Update to show "Not found" for error states
  const breadcrumbItems = hasContestError
    ? ["Contests", t("errors:common.notFound")]
    : BREADCRUMBS.ORGANIZER_CERTIFICATE_ISSUED_STUDENT(
        contest?.name ?? "Contest",
      )
  const breadcrumbPaths =
    BREADCRUMB_PATHS.ORGANIZER_CERTIFICATE_ISSUED_STUDENT(contestId)

  const columns = getStudentIssuedCertificatesColumns(t)

  if (contestLoading || issuedLoading) {
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
    } else if (contestError?.status === 404) {
      errorMessage = t("errors:common.notFound")
    } else if (contestError?.status === 403) {
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

  if (issuedError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName="certificates" />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        <TableFluent data={certificates} columns={columns} />

        {certificates.length > 0 && (
          <TablePagination pagination={pagination} onPageChange={setPage} />
        )}
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerIssuedStudentCertificates
