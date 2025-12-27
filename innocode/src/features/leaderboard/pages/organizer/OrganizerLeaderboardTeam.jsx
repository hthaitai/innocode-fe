import React from "react"
import { useParams, Link } from "react-router-dom"
import { User, ChevronRight } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import { useGetLeaderboardByContestQuery } from "@/services/leaderboardApi"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import LeaderboardTeamInfo from "../../components/LeaderboardTeamInfo"
import { useState } from "react"
import { Award } from "lucide-react"
import { useAwardCertificatesMutation } from "@/services/certificateApi"
import { useModal } from "@/shared/hooks/useModal"
import toast from "react-hot-toast"

const OrganizerLeaderboardTeam = () => {
  const { contestId, teamId } = useParams()
  const { openModal, closeModal } = useModal()
  const [awarding, setAwarding] = useState(false)

  const [awardCertificates] = useAwardCertificatesMutation()

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

  // Team not found (similar style as contest-not-found block)
  if (!team && !isLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
          This team has been deleted or is no longer available.
        </div>
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
      onAward: async (template) => {
        const payload = {
          templateId: template.templateId,
          recipients,
          output: "pdf",
          reissue: true,
        }

        setAwarding(true)
        try {
          await awardCertificates(payload).unwrap()
          toast.success("Team certificate issued successfully.")
          closeModal()
        } catch (err) {
          console.error(err)
          toast.error(
            err?.data?.errorMessage || "Unable to issue team certificate"
          )
        } finally {
          setAwarding(false)
        }
      },
      awarding,
    })
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={isLoading}
      error={error}
    >
      <div className="space-y-5">
        {/* Team Info Card */}
        {/* <LeaderboardTeamInfo team={team} /> */}

        <div>
          {/* <div className="text-sm leading-5 font-semibold pt-3 pb-2">
            Members
          </div> */}
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
                  disabled={awarding}
                >
                  {awarding ? "Awarding..." : "Award"}
                </button>
              </div>
            </div>
          )}

          {/* Members List */}
          <div className="space-y-1">
            {(team?.members ?? []).map((member) => (
              <div>
                <Link
                  key={member.memberId}
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
                        {member.totalScore} points
                      </p>
                      <ChevronRight size={20} className="text-[#7A7574]" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default OrganizerLeaderboardTeam
