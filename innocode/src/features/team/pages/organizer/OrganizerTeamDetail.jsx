import React from "react"
import { User } from "lucide-react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { formatDateTime } from "@/shared/utils/dateTime"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { useGetTeamByIdQuery } from "@/services/teamApi"
import TeamInfo from "../../components/organizer/TeamInfo"

const OrganizerTeamDetail = () => {
  const { teamId, contestId } = useParams()

  const {
    data: team,
    isLoading: teamLoading,
    error: teamError,
  } = useGetTeamByIdQuery(teamId)

  const { data: contest, isLoading: contestLoading } =
    useGetContestByIdQuery(contestId)

  const loading = teamLoading || contestLoading
  const error = teamError

  const contestName = contest?.name || "Contest"
  const teamName = team?.name || "Team"

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_TEAM_DETAIL(
    contestName,
    teamName
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_TEAM_DETAIL(
    contestId,
    teamId
  )

  if (!team && !teamLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
        loading={loading}
        error={error}
      >
        <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
          This team has been deleted or is no longer available.
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={loading}
      error={error}
    >
      <div className="space-y-5">
        {/* --- Team Info --- */}
        <TeamInfo team={team} />

        {/* --- Students as List --- */}
        <div>
          <div className="text-sm font-semibold pt-3 pb-2">Members</div>
          <div className="flex flex-col gap-1">
            {team?.members?.length > 0 ? (
              team.members.map((member) => (
                <div
                  key={member.studentId}
                  className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 py-3 flex justify-between items-center min-h-[70px]"
                >
                  <div className="flex gap-5 items-center">
                    <User size={20} />

                    <div>
                      <p className="text-[14px] leading-[20px]">
                        {member.studentFullname}
                      </p>

                      <div className="flex items-center gap-[10px] text-[12px] leading-[16px] text-[#7A7574]">
                        <p>{member.studentEmail}</p>
                        <span>|</span>
                        <p>{formatDateTime(member.joinedAt)}</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`text-sm leading-5 font-semibold ${
                      member.memberRole === "Leader"
                        ? "animated-rainbow"
                        : "text-[#7A7574]"
                    }`}
                  >
                    {member.memberRole || "Member"}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
                No members in this team.
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default OrganizerTeamDetail
