import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { validate as uuidValidate } from "uuid"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetPlagiarismQueueQuery } from "@/services/plagiarismApi"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { getPlagiarismColumns } from "../../columns/getPlagiarismColumns"
import TablePagination from "../../../../shared/components/TablePagination"
import ManagePlagiarism from "../../components/organizer/ManagePlagiarism"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"

import { useTranslation } from "react-i18next"

export default function OrganizerPlagiarismQueue() {
  const { t } = useTranslation(["plagiarism", "common", "errors"])
  const { contestId } = useParams()

  const [page, setPage] = useState(1)
  const pageSize = 10

  const [studentNameSearch, setStudentNameSearch] = useState("")
  const [teamNameSearch, setTeamNameSearch] = useState("")

  const {
    data: contest,
    isLoading: contestLoading,
    isError: contestError,
    error: contestErrorData,
  } = useGetContestByIdQuery(contestId)

  const {
    data: plagiarismData,
    isLoading: plagiarismLoading,
    isError: plagiarismError,
  } = useGetPlagiarismQueueQuery({
    contestId,
    pageNumber: page,
    pageSize,
    teamName: teamNameSearch,
    studentName: studentNameSearch,
  })

  const plagiarismItems = plagiarismData?.data ?? []
  const pagination = plagiarismData?.additionalData ?? {}

  // Validate UUID format first
  const isValidUuid = uuidValidate(contestId)
  const hasError = !isValidUuid || contestError

  // Update breadcrumb to show "Not found" for error states
  // For errors: ["Contests", "Not found"] instead of ["Contests", "Not found", "Plagiarism"]
  const breadcrumbItems = hasError
    ? ["Contests", t("errors:common.notFound")]
    : BREADCRUMBS.ORGANIZER_PLAGIARISM(
        contest?.name ?? t("common:common.contest"),
      )

  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_PLAGIARISM(contestId)

  if (!isValidUuid) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState
          itemName={t("common:common.contest")}
          message={t("errors:common.invalidId")}
        />
      </PageContainer>
    )
  }

  if (plagiarismLoading || contestLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (plagiarismError || contestError) {
    let errorMessage = null

    // Handle specific error status codes for contest errors
    if (contestError && contestErrorData) {
      if (contestErrorData?.status === 404) {
        errorMessage = t("errors:common.notFound")
      } else if (contestErrorData?.status === 403) {
        errorMessage = t("errors:common.forbidden")
      }
    }

    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState
          itemName={
            contestError
              ? t("common:common.contest")
              : t("plagiarism:submissions")
          }
          message={errorMessage}
        />
      </PageContainer>
    )
  }

  if (!contest) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState
          itemName={t("common:common.contest")}
          message={t("errors:common.notFound")}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        <ManagePlagiarism
          contestId={contestId}
          plagiarismItems={plagiarismItems}
          pagination={pagination}
          setPage={setPage}
          setTeamNameSearch={setTeamNameSearch}
          setStudentNameSearch={setStudentNameSearch}
        />
      </AnimatedSection>
    </PageContainer>
  )
}
