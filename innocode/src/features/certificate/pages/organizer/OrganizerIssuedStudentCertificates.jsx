import React, { useState } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { useGetIssuedCertificatesQuery } from "@/services/certificateApi"
import { getStudentIssuedCertificatesColumns } from "../../columns/issuedStudentColumns"

const OrganizerIssuedStudentCertificates = () => {
  const { contestId } = useParams()
  const [page, setPage] = useState(1)
  const pageSize = 10

  const {
    data: contest,
    isLoading: contestLoading,
    error: contestError,
  } = useGetContestByIdQuery(contestId)

  const {
    data: issuedData,
    isLoading: issuedLoading,
    error: issuedError,
  } = useGetIssuedCertificatesQuery({
    // contestId,
    page,
    pageSize,
    types: "Student",
  })

  const certificates = issuedData?.data ?? []
  const pagination = issuedData?.additionalData

  const contestName = contest?.name || "Contest"
  const breadcrumbItems =
    BREADCRUMBS.ORGANIZER_CERTIFICATE_ISSUED_STUDENT(contestName)
  const breadcrumbPaths =
    BREADCRUMB_PATHS.ORGANIZER_CERTIFICATE_ISSUED_STUDENT(contestId)

  const columns = getStudentIssuedCertificatesColumns()

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={contestLoading}
      error={contestError}
    >
      <TableFluent
        data={certificates}
        columns={columns}
        loading={issuedLoading}
        error={issuedError}
        pagination={pagination}
        onPageChange={setPage}
      />
    </PageContainer>
  )
}

export default OrganizerIssuedStudentCertificates
