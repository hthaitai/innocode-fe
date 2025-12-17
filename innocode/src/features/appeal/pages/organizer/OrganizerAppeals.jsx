import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetAppealsQuery } from "../../../../services/appealApi"
import { useGetRoundByIdQuery } from "@/services/roundApi"
import { getAppealsColumns } from "../../columns/getAppealsColumns"
import OrganizerAppealsActions from "../../components/organizer/OrganizerAppealsActions"
import ReviewAppealModal from "../../components/organizer/ReviewAppealModal"
import { useModal } from "@/shared/hooks/useModal"

export default function OrganizerAppeals() {
  const navigate = useNavigate()
  const { contestId, roundId } = useParams()
  const { openModal, modalData, closeModal } = useModal()

  const [stateFilter, setStateFilter] = useState("Opened")
  const [decisionFilter, setDecisionFilter] = useState("Pending")

  // Fetch round info
  const {
    data: round,
    isLoading: roundLoading,
    isError: roundError,
  } = useGetRoundByIdQuery(roundId)

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_APPEALS(
    round?.contestName ?? "Contest",
    round?.roundName ?? "Round"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_APPEALS(contestId, roundId)

  // Fetch appeals
  const {
    data: appealsData,
    isLoading: appealsLoading,
    isError: appealsError,
  } = useGetAppealsQuery({
    contestId,
    roundId,
    state: stateFilter,
    decision: decisionFilter,
    pageNumber: 1,
    pageSize: 10,
  })

  const appeals = appealsData?.data || []
  const pagination = appealsData?.additionalData || {}

  // Only real handler: open modal
  const handleReview = (appeal) => {
    openModal("reviewAppeal", { appeal })
  }

  // Columns: all fake/no-op handlers except review opens modal
  const appealsColumns = getAppealsColumns(handleReview)

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={appealsLoading || roundLoading}
      error={appealsError || roundError}
    >
      <TableFluent
        data={appeals}
        columns={appealsColumns}
        title="Appeals"
        pagination={pagination}
        renderActions={() => (
          <OrganizerAppealsActions
            stateFilter={stateFilter}
            setStateFilter={setStateFilter}
            decisionFilter={decisionFilter}
            setDecisionFilter={setDecisionFilter}
          />
        )}
      />

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
