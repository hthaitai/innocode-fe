import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { validate as uuidValidate } from "uuid"
import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation(["judge", "common", "errors"])
  const { contestId } = useParams()
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 10

  const isValidContestId = uuidValidate(contestId)

  const {
    data: contest,
    isLoading: isContestLoading,
    isError: isContestError,
    error: contestError,
  } = useGetContestByIdQuery(contestId, { skip: !isValidContestId })

  const {
    data: judgesData,
    isLoading: isJudgesLoading,
    isError: isJudgesError,
  } = useGetJudgesToInviteQuery({ contestId, page: pageNumber, pageSize })

  const judges = judgesData?.data ?? []
  const pagination = judgesData?.additionalData ?? {}

  const hasContestError = !isValidContestId || isContestError

  // Breadcrumbs - Update to show "Not found" for error states
  const breadcrumbItems = hasContestError
    ? ["Contests", t("errors:common.notFound")]
    : BREADCRUMBS.ORGANIZER_CONTEST_INVITE_JUDGE(
        contest?.name ?? "Contest Judges",
        t("judges"),
        t("inviteJudge"),
      )
  const breadcrumbPaths =
    BREADCRUMB_PATHS.ORGANIZER_CONTEST_INVITE_JUDGE(contestId)

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

  if (isContestError || !contest || !isValidContestId) {
    let errorMessage = null

    if (!isValidContestId) {
      errorMessage = t("errors:common.invalidId")
    } else if (contestError?.status === 404) {
      errorMessage = t("errors:common.notFound")
    } else if (contestError?.status === 403) {
      errorMessage = t("errors:common.forbidden")
    }

    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState
          itemName={t("common:common.contest")}
          message={errorMessage}
        />
      </PageContainer>
    )
  }

  if (isJudgesError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName="judges" />
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
