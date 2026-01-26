import React from "react"
import { useParams, Link } from "react-router-dom"
import { validate as uuidValidate } from "uuid"
import { useTranslation } from "react-i18next"
import { User, ChevronRight } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import { useGetLeaderboardByContestQuery } from "@/services/leaderboardApi"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import LeaderboardTeamInfo from "../../components/LeaderboardTeamInfo"
import { useState } from "react"
import { Award } from "lucide-react"
import { useModal } from "@/shared/hooks/useModal"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { MissingState } from "@/shared/components/ui/MissingState"
import { LoadingState } from "@/shared/components/ui/LoadingState"
import { ErrorState } from "@/shared/components/ui/ErrorState"
import { formatScore } from "@/shared/utils/formatNumber"

const OrganizerLeaderboardTeam = () => {
  const { t } = useTranslation(["leaderboard", "pages", "common", "errors"])
  const { contestId, teamId } = useParams()
  const { openModal } = useModal()

  const isValidContestId = uuidValidate(contestId)
  const isValidTeamId = uuidValidate(teamId)

  const {
    data: contest,
    isLoading: isContestLoading,
    isError: isContestError,
    error: contestError,
  } = useGetContestByIdQuery(contestId, { skip: !isValidContestId })

  const {
    data: leaderboardData,
    isLoading: isLeaderboardLoading,
    error: leaderboardError,
  } = useGetLeaderboardByContestQuery(
    { contestId, pageNumber: 1, pageSize: 10 },
    { skip: !isValidContestId },
  )

  const team = leaderboardData?.data?.teamIdList?.find(
    (t) => t.teamId === teamId,
  )
  const contestName = contest?.name ?? t("leaderboard:contest")
  const teamName = team?.teamName ?? t("leaderboard:team")

  const hasContestError = !isValidContestId || isContestError
  const hasTeamError = !isValidTeamId || !team

  // Breadcrumbs - Update to show "Not found" for error states
  const breadcrumbItems = hasContestError
    ? ["Contests", t("errors:common.notFound")]
    : hasTeamError
      ? ["Contests", contestName, "Leaderboard", t("errors:common.notFound")]
      : BREADCRUMBS.ORGANIZER_LEADERBOARD_DETAIL(
          contestName ?? "Contest",
          teamName,
        )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_LEADERBOARD_DETAIL(
    contestId,
    teamId,
  )

  if (isContestLoading || isLeaderboardLoading) {
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

  if (leaderboardError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("leaderboard:leaderboard")} />
      </PageContainer>
    )
  }

  // Team not found
  if (!team || !isValidTeamId) {
    let errorMessage = null

    if (!isValidTeamId) {
      errorMessage = t("errors:common.invalidId")
    }

    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("leaderboard:team")} message={errorMessage} />
      </PageContainer>
    )
  }

  const handleAwardTeam = () => {
    if (!team) return

    const recipients = [
      {
        teamId: team.teamId,
        displayName: team.teamName,
      },
    ]

    openModal("certificateTemplate", {
      contestId,
      recipients,
    })
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        <div className="space-y-5">
          {/* <LeaderboardTeamInfo team={team} /> */}
          {team && (
            <div className="mb-1">
              <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
                {/* Left: Icon + Text */}
                <div className="flex items-center gap-5">
                  <Award size={20} />
                  <div>
                    <p className="text-[14px] leading-5">
                      {t("leaderboard:awardTeamCertificate")}
                    </p>
                    <p className="text-[12px] leading-4 text-[#7A7574]">
                      {t("leaderboard:issueTeamCertificate")}
                    </p>
                  </div>
                </div>

                {/* Right: Action Button */}
                <button
                  type="button"
                  className="button-orange px-3"
                  onClick={handleAwardTeam}
                >
                  {t("leaderboard:award")}
                </button>
              </div>
            </div>
          )}

          {/* Members List */}
          <div className="space-y-1">
            {(team?.members ?? []).map((member) => (
              <div key={member.memberId}>
                <Link
                  to={`/organizer/contests/${contestId}/leaderboard/teams/${teamId}/members/${member.memberId}`}
                >
                  <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 py-3 flex justify-between items-center min-h-[70px] hover:bg-[#F6F6F6] transition-colors cursor-pointer">
                    <div className="flex gap-5 items-center flex-1">
                      <User size={20} />
                      <div>
                        <p className="text-[14px] leading-5">
                          {member.memberName} (
                          {t(
                            `leaderboard:roles.${member.memberRole?.toLowerCase()}`,
                          )}
                          )
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <p className="text-[14px] leading-5 text-[#7A7574]">
                        {formatScore(member.totalScore)}{" "}
                        {t("leaderboard:points")}
                      </p>
                      <ChevronRight size={20} className="text-[#7A7574]" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerLeaderboardTeam
