import React from "react"
import { useParams, Link } from "react-router-dom"
import { User, ChevronRight } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import { useGetLeaderboardByContestQuery } from "@/services/leaderboardApi"
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
  const { contestId, teamId } = useParams()
  const { openModal } = useModal()

  const {
    data: leaderboardData,
    isLoading,
    error,
  } = useGetLeaderboardByContestQuery(
    { contestId, pageNumber: 1, pageSize: 10 },
    { skip: !contestId }
  )

  const team = leaderboardData?.data?.teamIdList?.find(
    (t) => t.teamId === teamId
  )
  const contestName = leaderboardData?.data?.contestName ?? "Contest"
  const teamName = team?.teamName ?? "Team"

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_LEADERBOARD_DETAIL(
    contestName ?? "Contest",
    teamName
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_LEADERBOARD_DETAIL(
    contestId,
    teamId
  )

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

  if (error) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName="team" />
      </PageContainer>
    )
  }

  // Team not found
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
          {team && (
            <div className="mb-1">
              <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
                {/* Left: Icon + Text */}
                <div className="flex items-center gap-5">
                  <Award size={20} />
                  <div>
                    <p className="text-[14px] leading-5">
                      Award team certificate
                    </p>
                    <p className="text-[12px] leading-4 text-[#7A7574]">
                      Issue a certificate for the entire team
                    </p>
                  </div>
                </div>

                {/* Right: Action Button */}
                <button
                  type="button"
                  className="button-orange px-3"
                  onClick={handleAwardTeam}
                >
                  Award
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
                          {member.memberName} ({member.memberRole})
                        </p>
                      </div>
                    </div>

                  <div className="flex items-center gap-5">
                    <p className="text-[14px] leading-5 text-[#7A7574]">
                      {formatScore(member.totalScore)} points
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
