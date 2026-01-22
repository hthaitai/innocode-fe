import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { validate as uuidValidate } from "uuid"

import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { useGetTeamsQuery } from "@/services/teamApi"
import ManageTeams from "../../components/organizer/ManageTeams"
import { LoadingState } from "@/shared/components/ui/LoadingState"
import { ErrorState } from "@/shared/components/ui/ErrorState"
import { AnimatedSection } from "@/shared/components/ui/AnimatedSection"
import { useTranslation } from "react-i18next"

const OrganizerTeams = () => {
  const { contestId } = useParams()
  const { t } = useTranslation(["common", "errors"])
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [searchName, setSearchName] = useState("")

  const {
    data: contest,
    isLoading: contestLoading,
    isError: contestError,
    error: contestErrorData,
  } = useGetContestByIdQuery(contestId)

  const {
    data: teamsResponse,
    isLoading: teamsLoading,
    isError: teamsError,
  } = useGetTeamsQuery({
    contestId,
    pageNumber: page,
    pageSize,
    search: searchName,
  })

  // Derive loading and error states
  const isLoading = contestLoading || teamsLoading
  const isError = contestError || teamsError

  const teams = teamsResponse?.data ?? []
  const pagination = teamsResponse?.additionalData ?? {}

  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_TEAMS(contestId)

  // Validate UUID format first
  const isValidUuid = uuidValidate(contestId)
  const hasError = !isValidUuid || contestError

  // Update breadcrumb to show "Not found" for error states
  // For errors: ["Contests", "Not found"] instead of ["Contests", "Not found", "Teams"]
  const breadcrumbItems = hasError
    ? ["Contests", t("errors:common.notFound")]
    : BREADCRUMBS.ORGANIZER_TEAMS(contest?.name ?? t("common.contest"))

  if (!isValidUuid) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState
          itemName={t("common.contest")}
          message={t("errors:common.invalidId")}
        />
      </PageContainer>
    )
  }

  if (isLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (isError) {
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
          itemName={contestError ? t("common.contest") : "teams"}
          message={errorMessage}
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
        <ManageTeams
          teams={teams}
          pagination={pagination}
          setPage={setPage}
          setSearchName={setSearchName}
        />
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerTeams
