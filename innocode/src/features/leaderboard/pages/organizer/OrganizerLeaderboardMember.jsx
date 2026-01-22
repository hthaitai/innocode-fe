import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { validate as uuidValidate } from "uuid"
import { useTranslation } from "react-i18next"
import { Calendar, Award } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import { useGetLeaderboardByContestQuery } from "@/services/leaderboardApi"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useModal } from "@/shared/hooks/useModal"
import { AnimatedSection } from "@/shared/components/ui/AnimatedSection"
import { MissingState } from "@/shared/components/ui/MissingState"
import { LoadingState } from "@/shared/components/ui/LoadingState"
import { ErrorState } from "@/shared/components/ui/ErrorState"
import { formatScore } from "@/shared/utils/formatNumber"
import { formatDateTime } from "@/shared/utils/dateTime"

const OrganizerLeaderboardMember = () => {
  const { t } = useTranslation([
    "leaderboard",
    "pages",
    "round",
    "common",
    "errors",
  ])
  const { contestId, teamId, memberId } = useParams()
  const { openModal } = useModal()

  const isValidContestId = uuidValidate(contestId)
  const isValidTeamId = uuidValidate(teamId)
  const isValidMemberId = uuidValidate(memberId)

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
  const member = team?.members?.find((m) => m.memberId === memberId)

  const contestName = contest?.name ?? t("leaderboard:contest")
  const teamName = team?.teamName ?? t("leaderboard:team")
  const memberName = member?.memberName ?? t("leaderboard:member")

  const hasContestError = !isValidContestId || isContestError
  const hasTeamError = !isValidTeamId || !team
  const hasMemberError = !isValidMemberId || !member

  // Breadcrumbs - Update to show "Not found" for error states
  const breadcrumbItems = hasContestError
    ? ["Contests", t("errors:common.notFound")]
    : hasTeamError
      ? ["Contests", contestName, "Leaderboard", t("errors:common.notFound")]
      : hasMemberError
        ? [
            "Contests",
            contestName,
            "Leaderboard",
            teamName,
            t("errors:common.notFound"),
          ]
        : BREADCRUMBS.ORGANIZER_LEADERBOARD_MEMBER(
            contestName,
            teamName,
            memberName,
          )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_LEADERBOARD_MEMBER(
    contestId,
    teamId,
    memberId,
  )

  const handleAward = () => {
    if (!member) return

    const recipients = [
      {
        studentId: member.memberId,
        displayName: member.memberName,
      },
    ]

    openModal("certificateTemplate", {
      contestId,
      recipients,
    })
  }

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

  if (!member || !isValidMemberId) {
    let errorMessage = null

    if (!isValidMemberId) {
      errorMessage = t("errors:common.invalidId")
    }

    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("leaderboard:member")} message={errorMessage} />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        {/* Award Member Certificate */}
        {member && (
          <div className="mb-1">
            <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
              {/* Left: Icon + Text */}
              <div className="flex items-center gap-5">
                <Award size={20} />
                <div>
                  <p className="text-[14px] leading-5">
                    {t("leaderboard:awardMemberCertificate")}
                  </p>
                  <p className="text-[12px] leading-4 text-[#7A7574]">
                    {t("leaderboard:issueMemberCertificate")}
                  </p>
                </div>
              </div>

              {/* Right: Action Button */}
              <button
                type="button"
                className="button-orange px-3"
                onClick={handleAward}
              >
                {t("leaderboard:award")}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-1">
          {(member?.roundScores ?? []).map((round) => (
            <div
              key={round.roundId}
              className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]"
            >
              <div className="flex items-center gap-5">
                <Calendar size={20} />
                <div>
                  <p className="text-[14px] leading-5">{round.roundName}</p>
                  <div className="text-[12px] leading-4 text-[#7A7574] flex gap-[10px]">
                    <span>
                      {t(`round:info.problemTypes.${round.roundType}`) ||
                        round.roundType ||
                        "N/A"}
                    </span>
                    <span>|</span>
                    <span>
                      {round.completedAt
                        ? formatDateTime(round.completedAt)
                        : t("leaderboard:notCompleted")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[14px] leading-5 text-[#7A7574]">
                {formatScore(round.score)} {t("leaderboard:points")}
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerLeaderboardMember
