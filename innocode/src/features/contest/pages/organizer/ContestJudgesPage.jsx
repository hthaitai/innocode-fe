import React from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetContestByIdQuery } from "../../../../services/contestApi"

const ContestJudgesPage = () => {
  const { contestId } = useParams()

  const { data: contest, isLoading, isError } =
    useGetContestByIdQuery(contestId)

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_CONTEST_JUDGES(
    contest?.name ?? "Contest Judges"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_CONTEST_JUDGES(contestId)

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={isLoading}
      error={isError}
    >
      <div className="text-sm font-medium">Contest Judges</div>
    </PageContainer>
  )
}

export default ContestJudgesPage