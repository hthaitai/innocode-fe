import React, { useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { useAwardCertificatesMutation } from "@/services/certificateApi"
import { useGetLeaderboardByContestQuery } from "@/services/leaderboardApi"

import toast from "react-hot-toast"

import { useModal } from "@/shared/hooks/useModal"

const OrganizerCertificateIssue = () => {
  const { contestId } = useParams()
  const navigate = useNavigate()
  const { openModal, closeModal } = useModal()
  const [awardingTeamId, setAwardingTeamId] = useState(null)

  const {
    data: contest,
    isLoading: contestLoading,
    error: contestError,
  } = useGetContestByIdQuery(contestId, { skip: !contestId })

  const {
    data: leaderboardRes,
    isLoading: leaderboardLoading,
    error: leaderboardError,
  } = useGetLeaderboardByContestQuery(
    { contestId, pageNumber: 1, pageSize: 100 },
    { skip: !contestId }
  )

  const [awardCertificates, { isLoading: awarding }] =
    useAwardCertificatesMutation()

  const teams = useMemo(
    () => leaderboardRes?.data?.teamIdList || [],
    [leaderboardRes]
  )

  console.log(teams)

  const loading = contestLoading || leaderboardLoading
  const error = contestError || leaderboardError

  const contestName = contest?.name || "Contest"
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_CERTIFICATE_ISSUE(contestName)
  const breadcrumbPaths =
    BREADCRUMB_PATHS.ORGANIZER_CERTIFICATE_ISSUE(contestId)

  const handleAwardTeam = (teamId) => {
    setAwardingTeamId(teamId)

    // Find the team object from leaderboard
    const team = teams.find((t) => t.teamId === teamId)
    if (!team) return

    // Team-level recipients payload
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

        // ✅ Log the payload
        console.log(
          "AwardCertificates payload (team-level):",
          JSON.stringify(payload, null, 2)
        )

        try {
          await awardCertificates(payload).unwrap()
          toast.success("Certificate issued successfully.")
          closeModal()
          setAwardingTeamId(null)
        } catch (err) {
          toast.error(
            err?.data?.message ||
              err?.data?.error ||
              "Unable to issue certificate right now."
          )
        }
      },
      awarding: awarding && awardingTeamId === teamId,
    })
  }

  const handleTeamClick = (teamId) => {
    navigate(
      `/organizer/contests/${contestId}/certificates/issue/teams/${teamId}`
    )
  }

  // Early return for loading
  if (loading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
        loading={true}
        error={error}
      />
    )
  }

  // Early return if no teams
  if (teams.length === 0) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
        loading={false}
        error={error}
      >
        <div className="text-xs text-[#7A7574] border border-[#E5E5E5] rounded-[5px] bg-white px-5 py-3">
          No teams found.
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={false}
      error={error}
    >
      <div className="flex flex-col gap-2">
        {teams.map((team) => {
          const memberCount = team.members?.length || 0

          return (
            <div
              key={team.teamId}
              className="flex justify-between items-center border border-[#E5E5E5] rounded-[5px] bg-white px-5 min-h-[70px] hover:bg-[#F6F6F6] transition-colors cursor-pointer"
              onClick={() => handleTeamClick(team.teamId)}
            >
              <div className="flex items-center gap-5">
                {/* Rank */}
                <div
                  className={`w-6 h-6 flex items-center justify-center rounded-full text-sm leading-5 font-medium ${
                    team.rank === 1
                      ? "bg-yellow-400 text-white"
                      : team.rank === 2
                      ? "bg-gray-400 text-white"
                      : team.rank === 3
                      ? "bg-orange-400 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {team.rank || "-"}
                </div>

                {/* Team info */}
                <div>
                  <div className="text-sm leading-5">{team.teamName}</div>
                  <div className="text-xs leading-4 text-[#7A7574] flex items-center gap-[10px]">
                    <span>{team.score} points</span>
                    <span>|</span>
                    <span>{memberCount} members</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <button
                  type="button"
                  className="button-orange"
                  onClick={(e) => {
                    e.stopPropagation()
                    // handleAwardTeam(team.teamId)
                    alert("WIP: Award functionality coming soon")
                  }}
                  disabled={awarding && awardingTeamId === team.teamId}
                >
                  Award
                </button>

                <ChevronRight size={20} className="text-[#7A7574] ml-4" />
              </div>
            </div>
          )
        })}
      </div>
    </PageContainer>
  )
}

export default OrganizerCertificateIssue
