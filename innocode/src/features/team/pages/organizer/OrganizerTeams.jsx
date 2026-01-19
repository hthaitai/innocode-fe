import React, { useState } from "react"
import { useParams } from "react-router-dom"

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
  const { t } = useTranslation("common")
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [searchName, setSearchName] = useState("")

  const {
    data: contest,
    isLoading: contestLoading,
    isError: contestError,
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
  console.log(teams)
  const pagination = teamsResponse?.additionalData ?? {}

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_TEAMS(
    contest?.name ?? t("common.contest"),
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_TEAMS(contestId)

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
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName="teams" />
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
