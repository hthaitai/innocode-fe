import React, { useState } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetContestByIdQuery } from "../../../services/contestApi"
import { useGetJudgesToInviteQuery } from "../../../services/contestJudgeApi"
import ManageJudgeInvitations from "../components/organizer/ManageJudgeInvitations"
import { LoadingState } from "@/shared/components/ui/LoadingState"
import { ErrorState } from "@/shared/components/ui/ErrorState"
import { MissingState } from "@/shared/components/ui/MissingState"
import { AnimatedSection } from "@/shared/components/ui/AnimatedSection"

const JudgeInvitations = () => {
  const { contestId } = useParams()
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 10

  const {
    data: contest,
    isLoading: isContestLoading,
    isError: isContestError,
  } = useGetContestByIdQuery(contestId)

  const {
    data: judgesData,
    isLoading: isJudgesLoading,
    isError: isJudgesError,
  } = useGetJudgesToInviteQuery({ contestId, page: pageNumber, pageSize })

  const judges = judgesData?.data ?? []
  const pagination = judgesData?.additionalData ?? {}

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_CONTEST_JUDGES(
    contest?.name ?? "Contest Judges"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_CONTEST_JUDGES(contestId)

  if (isContestLoading || isJudgesLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (isContestError || isJudgesError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName="judges" />
      </PageContainer>
    )
  }

  if (!contest) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <MissingState itemName="contest" />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        <ManageJudgeInvitations
          contestId={contestId}
          contestName={contest?.name}
          judges={judges}
          pagination={pagination}
          setPageNumber={setPageNumber}
        />
      </AnimatedSection>
    </PageContainer>
  )
}

export default JudgeInvitations
