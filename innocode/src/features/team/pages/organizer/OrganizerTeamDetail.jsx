import React from "react"
import { useParams } from "react-router-dom"
import { validate as uuidValidate } from "uuid"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { useGetTeamByIdQuery } from "@/services/teamApi"
import TeamInfo from "../../components/organizer/TeamInfo"
import TeamMemberList from "../../components/organizer/TeamMemberList"
import { useTranslation } from "react-i18next"
import { AnimatedSection } from "@/shared/components/ui/AnimatedSection"
import { LoadingState } from "@/shared/components/ui/LoadingState"
import { ErrorState } from "@/shared/components/ui/ErrorState"
import { MissingState } from "@/shared/components/ui/MissingState"

const OrganizerTeamDetail = () => {
  const { teamId, contestId } = useParams()
  const { t } = useTranslation(["common", "errors"])

  const isValidTeamId = uuidValidate(teamId)
  const isValidContestId = uuidValidate(contestId)

  const {
    data: team,
    isLoading: teamLoading,
    isError: teamError,
    error: teamErrorObj,
  } = useGetTeamByIdQuery(teamId, { skip: !isValidTeamId })

  console.log(team)

  const {
    data: contest,
    isLoading: contestLoading,
    isError: contestError,
    error: contestErrorObj,
  } = useGetContestByIdQuery(contestId, { skip: !isValidContestId })

  const hasContestError = !isValidContestId || contestError
  const hasTeamError = !isValidTeamId || teamError
  const hasError = hasContestError || hasTeamError

  // Breadcrumbs - Update to show "Not found" for error states
  const breadcrumbItems = hasError
    ? [
        "Contests",
        hasContestError ? t("errors:common.notFound") : contest?.name,
        ...(hasTeamError && !hasContestError
          ? ["Teams", t("errors:common.notFound")]
          : []),
      ]
    : BREADCRUMBS.ORGANIZER_TEAM_DETAIL(
        contest?.name ?? t("common.contest"),
        team?.name ?? t("common.team"),
      )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_TEAM_DETAIL(
    contestId,
    teamId,
  )

  if (teamLoading || contestLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (contestError || !contest || !isValidContestId) {
    let errorMessage = null

    if (!isValidContestId) {
      errorMessage = t("errors:common.invalidId")
    } else if (contestErrorObj?.status === 404) {
      errorMessage = t("errors:common.notFound")
    } else if (contestErrorObj?.status === 403) {
      errorMessage = t("errors:common.forbidden")
    }

    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("common.contest")} message={errorMessage} />
      </PageContainer>
    )
  }

  if (teamError || !team || !isValidTeamId) {
    let errorMessage = null

    if (!isValidTeamId) {
      errorMessage = t("errors:common.invalidId")
    } else if (teamErrorObj?.status === 404) {
      errorMessage = t("errors:common.notFound")
    } else if (teamErrorObj?.status === 403) {
      errorMessage = t("errors:common.forbidden")
    }

    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("common.team")} message={errorMessage} />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        <div className="space-y-5">
          {/* --- Team Info --- */}
          <TeamInfo team={team} />

          {/* --- Students as List --- */}
          <TeamMemberList members={team.members} />
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerTeamDetail
