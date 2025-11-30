import React, { useState } from "react"
import {
  useFetchManualSubmissionsQuery,
  useLazyDownloadSubmissionQuery,
} from "../../../../services/submissionApi"
import PageContainer from "../../../../shared/components/PageContainer"
import TableFluent from "../../../../shared/components/TableFluent"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { getJudgeSubmissionsColumns } from "../../../submission/columns/getJudgeSubmissionsColumns"
import JudgeSubmissionsActions from "../../../problems/manual/components/JudgeSubmissionsActions"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

const JudgeManualSubmissionsPage = ({ roundId }) => {
  // Dropdown state
  const [statusFilter, setStatusFilter] = useState("Pending")

  // Fetch submissions with filter
  const { data, isLoading, isError } = useFetchManualSubmissionsQuery({
    statusFilter,
    pageNumber: 1,
    pageSize: 10,
  })

  const submissions = data?.submissions || []

  // Breadcrumbs
  const breadcrumbItems = BREADCRUMBS.JUDGE_SUBMISSIONS
  const breadcrumbPaths = BREADCRUMB_PATHS.JUDGE_SUBMISSIONS

  const navigate = useNavigate()

  // Rubric evaluation navigation (unchanged)
  const handleRubricEvaluation = (submissionId) => {
    if (!submissionId) return
    navigate(`/judge/manual-submissions/${submissionId}/rubric-evaluation`)
  }

  // Table columns
  const columns = getJudgeSubmissionsColumns(
    handleRubricEvaluation
  )

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={isLoading}
      error={isError}
    >
      <TableFluent
        data={submissions}
        columns={columns}
        loading={isLoading}
        error={isError}
        pagination={data?.pagination}
        renderActions={() => (
          <JudgeSubmissionsActions
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        )}
      />
    </PageContainer>
  )
}

export default JudgeManualSubmissionsPage
