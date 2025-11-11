import React, { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"

// Shared components
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"

// Store hooks
import { useAppSelector } from "@/store/hooks"

// Contexts
import { useModalContext } from "@/context/ModalContext"

// MCQ features
import McqTableAdd from "../components/organizer/McqTableAdd"
import { useMcqManagement } from "../hooks/useMcqManagement"
import { useMcqWeightModal } from "../hooks/useMcqWeightModal"
import { getMcqColumns } from "../columns/getMcqColumns"

// Breadcrumbs
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useRoundDetail } from "../../round/hooks/useRoundDetail"
import McqTableExpanded from "../components/organizer/McqTableExpanded"

const OrganizerMcq = () => {
  const navigate = useNavigate()
  const { contestId, roundId } = useParams()
  const { openModal } = useModalContext()

  // Select contests and rounds from the Redux store
  const { contests } = useAppSelector((s) => s.contests)
  const { rounds } = useAppSelector((s) => s.rounds)
  const { round } = useRoundDetail(contestId, roundId)

  // Custom hook to manage MCQs for a specific round
  const {
    mcqsWithIndex, // MCQs with index for table
    loading, // Loading state for table
    error, // Error state for table
    pagination, // Pagination data
    page, // Current page
    setPage, // Function to change page
    handleUpdateWeight, // Function to update question weights
    testId, // Current test ID
  } = useMcqManagement(roundId)

  // Hook for opening weight editing modal
  const handleEditWeight = useMcqWeightModal(
    testId,
    openModal,
    handleUpdateWeight
  )

  // Define columns for MCQ table including actions
  const columns = useMemo(
    () => getMcqColumns(handleEditWeight),
    [handleEditWeight]
  )

  // Find the selected contest and round
  const contest = contests.find(
    (c) => String(c.contestId) === String(contestId)
  )

  // Generate breadcrumbs for the page
  const items = BREADCRUMBS.ORGANIZER_MCQ(
    contest?.name ?? "Contest",
    round?.name ?? "Round"
  )
  const paths = BREADCRUMB_PATHS.ORGANIZER_MCQ(contestId, roundId)

  return (
    <PageContainer breadcrumb={items} breadcrumbPaths={paths}>
      <div className="space-y-1">
        {/* Button to add a new MCQ */}
        <McqTableAdd
          onAdd={() =>
            navigate(
              `/organizer/contests/${contestId}/rounds/${roundId}/mcqs/new`
            )
          }
        />

        {/* MCQ table with data, columns, pagination, and row click navigation */}
        <TableFluent
          data={mcqsWithIndex}
          columns={columns}
          loading={loading}
          error={error}
          pagination={pagination}
          onPageChange={setPage}
          renderSubComponent={(mcq) => <McqTableExpanded mcq={mcq} />}
          expandAt="text"  
        />
      </div>
    </PageContainer>
  )
}

export default OrganizerMcq
