import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetAppealsQuery } from "../../../../services/appealApi"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { getAppealsColumns } from "../../columns/getAppealsColumns"
import OrganizerAppealsActions from "../../components/organizer/OrganizerAppealsActions"
import ReviewAppealModal from "../../components/organizer/ReviewAppealModal"
import { useModal } from "@/shared/hooks/useModal"
import TablePagination from "../../../../shared/components/TablePagination"

export default function OrganizerAppeals() {
  const navigate = useNavigate()
  const { contestId } = useParams()
  const { openModal, modalData, closeModal } = useModal()

  const [decisionFilter, setDecisionFilter] = useState("Pending")
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 10

  // Reset page when filter changes
  useEffect(() => {
    setPageNumber(1)
  }, [decisionFilter])

  // Fetch contest info
  const {
    data: contest,
    isLoading: contestLoading,
    isError: contestError,
  } = useGetContestByIdQuery(contestId)

  const contestName = contest?.name || "Contest"
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_APPEALS(contestName)
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_APPEALS(contestId)

  // Fetch appeals
  const {
    data: appealsData,
    isLoading: appealsLoading,
    isError: appealsError,
  } = useGetAppealsQuery({
    contestId,
    decision: decisionFilter,
    pageNumber,
    pageSize,
  })

  const appeals = appealsData?.data ?? []
  const pagination = appealsData?.additionalData ?? {}

  const handleRowClick = (appeal) => {
    navigate(`/organizer/contests/${contestId}/appeals/${appeal.appealId}`)
  }

  // Only real handler: open modal
  const handleReview = (appeal) => {
    openModal("reviewAppeal", { appeal })
  }

  const appealsColumns = getAppealsColumns(handleReview)

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={appealsLoading || contestLoading}
      error={appealsError || contestError}
    >
      <OrganizerAppealsActions
        decisionFilter={decisionFilter}
        setDecisionFilter={setDecisionFilter}
      />

      <TableFluent
        data={appeals}
        columns={appealsColumns}
        onRowClick={handleRowClick}
      />

      <TablePagination pagination={pagination} onPageChange={setPageNumber} />

      {/* Review Appeal Modal: controlled by useModal */}
      {modalData?.type === "reviewAppeal" && (
        <ReviewAppealModal
          isOpen={true}
          appeal={modalData.appeal}
          onClose={closeModal}
        />
      )}
    </PageContainer>
  )
}
