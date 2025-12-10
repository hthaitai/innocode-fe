import React, { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { useGetIssuedCertificatesQuery } from "@/services/certificateApi"
import { getIssuedCertificatesColumns } from "../../columns/issuedCertificatesColumns"

const OrganizerIssuedCertificates = () => {
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
    page: page,
    pageSize,
  })

  const certificates = issuedData?.data || []
  const pagination = issuedData?.additionalData || {}

  const contestName = contest?.name || "Contest"
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_CERTIFICATE_ISSUED(contestName)
  const breadcrumbPaths =
    BREADCRUMB_PATHS.ORGANIZER_CERTIFICATE_ISSUED(contestId)

  const columns = getIssuedCertificatesColumns()

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
        getRowId={(row) =>
          row.certificateId || row.id || row.templateId || `cert-${row}`
        }
        renderActions={() => (
          <div className="flex items-center justify-between px-5 min-h-[70px]">
            <div>
              <p className="text-sm leading-5 font-semibold">
                Issued certificates
              </p>
            </div>
          </div>
        )}
      />
    </PageContainer>
  )
}

export default OrganizerIssuedCertificates
