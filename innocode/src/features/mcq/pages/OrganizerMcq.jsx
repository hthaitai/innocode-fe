import React, { useMemo } from "react"
import { useParams } from "react-router-dom"

import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"

import McqTable from "../components/organizer/McqTable"

import { useGetRoundByIdQuery } from "../../../services/roundApi"

const OrganizerMcq = () => {
  const { roundId } = useParams()

  const { data: round, isLoading, isError } = useGetRoundByIdQuery(roundId)

  // Breadcrumbs use contestName + roundName directly from round API
  const breadcrumbItems = useMemo(
    () =>
      BREADCRUMBS.ORGANIZER_MCQ(
        round?.contestName ?? "Contest",
        round?.roundName ?? "Round"
      ),
    [round?.contestName, round?.roundName]
  )

  const breadcrumbPaths = useMemo(
    () => BREADCRUMB_PATHS.ORGANIZER_MCQ(round?.contestId, roundId),
    [round?.contestId, roundId]
  )

  if (!round && !isLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
          This round has been deleted or is no longer available.
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={isLoading}
      error={isError}
    >
      <McqTable />
    </PageContainer>
  )
}

export default OrganizerMcq
