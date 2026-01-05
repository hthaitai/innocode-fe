import React from "react"
import { useParams } from "react-router-dom"
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
  const { t } = useTranslation("common")

  const {
    data: team,
    isLoading: teamLoading,
    isError: teamError,
  } = useGetTeamByIdQuery(teamId)

  const {
    data: contest,
    isLoading: contestLoading,
    isError: contestError,
  } = useGetContestByIdQuery(contestId)

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_TEAM_DETAIL(
    contest?.name ?? t("common.contest"),
    team?.name ?? t("common.team")
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_TEAM_DETAIL(
    contestId,
    teamId
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

  if (teamError || contestError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName="team" />
      </PageContainer>
    )
  }

  if (!team) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <MissingState itemName="team" />
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
