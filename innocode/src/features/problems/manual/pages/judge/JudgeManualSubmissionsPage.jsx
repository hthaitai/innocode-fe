import React, { useState } from "react"
import { useFetchManualSubmissionsQuery } from "@/services/manualProblemApi"
import PageContainer from "../../../../../shared/components/PageContainer"
import DropdownFluent from "../../../../../shared/components/DropdownFluent"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import TableFluent from "../../../../../shared/components/TableFluent"
import { getJudgeSubmissionsColumns } from "../../columns/getJudgeSubmissionsColumns"
import JudgeSubmissionsActions from "../../components/JudgeSubmissionsActions"

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

  // Table columns
  const columns = getJudgeSubmissionsColumns()

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
        pagination={data?.additionalData}
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
