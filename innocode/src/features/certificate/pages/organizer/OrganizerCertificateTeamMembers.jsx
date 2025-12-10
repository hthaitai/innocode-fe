import React, { useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { useAwardCertificatesMutation } from "@/services/certificateApi"
import { useGetLeaderboardByContestQuery } from "@/services/leaderboardApi"
import { formatDateTime } from "@/shared/utils/dateTime"
import toast from "react-hot-toast"
import { useModal } from "@/shared/hooks/useModal"
import { User } from "lucide-react"

const OrganizerCertificateTeamMembers = () => {
  const { contestId, teamId } = useParams()
  const navigate = useNavigate()
  const { openModal, closeModal } = useModal()
  const [awardingMemberId, setAwardingMemberId] = useState(null)

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

  const teams = leaderboardRes?.data?.teamIdList || []
  const team = teams.find((t) => t.teamId === teamId)
  const members = useMemo(() => team?.members || [], [team])

  const contestName = contest?.name || "Contest"
  const teamName = team?.teamName || "Team"
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_CERTIFICATE_TEAM_MEMBERS(
    contestName,
    teamName
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_CERTIFICATE_TEAM_MEMBERS(
    contestId,
    teamId
  )

  const handleAwardMember = (memberId) => {
    setAwardingMemberId(memberId)

    const member = members.find((m) => m.memberId === memberId)
    if (!member) return

    const recipients = [
      {
        studentId: member.memberId,
        displayName: member.memberName,
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

        console.log("Member-level payload:", JSON.stringify(payload, null, 2))

        try {
          await awardCertificates(payload).unwrap()
          toast.success("Certificate issued successfully.")
          closeModal()
          setAwardingMemberId(null)
        } catch (err) {
          toast.error(
            err?.data?.message ||
              err?.data?.error ||
              "Unable to issue certificate"
          )
        }
      },
      awarding: awarding && awardingMemberId === memberId,
    })
  }

  const loading = contestLoading || leaderboardLoading
  const error = contestError || leaderboardError

  // Early return if loading
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

  // Early return if team not found
  if (!team) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
        loading={false}
        error={error}
      >
        <div className="flex items-center justify-center h-[200px] text-gray-500">
          Team not found
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
      {members.length === 0 ? (
        <div className="text-xs text-[#7A7574] border border-[#E5E5E5] rounded-[5px] bg-white px-5 py-3">
          No members found in this team.
        </div>
      ) : (
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.memberId}
              className="flex justify-between items-center border border-[#E5E5E5] rounded-[5px] bg-white px-5 py-3"
            >
              {/* Member info */}
              <div className="flex items-center gap-5">
                <User size={20} />

                <div className="flex flex-col">
                  <span className="text-sm leading-5">
                    {member.memberName} ({member.memberRole})
                  </span>

                  <div className="text-xs leading-4 text-[#7A7574] flex gap-2">
                    <span>{member.totalScore} pts</span>
                    {member.updatedAt && (
                      <span>• Updated {formatDateTime(member.updatedAt)}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Award button */}
              <button
                type="button"
                className="button-orange"
                // onClick={() => handleAwardMember(member.memberId)}
                onClick={() => alert("WIP: Award functionality coming soon")}
                disabled={awarding && awardingMemberId === member.memberId}
              >
                Award
              </button>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  )
}

export default OrganizerCertificateTeamMembers
