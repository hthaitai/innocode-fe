import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { Calendar, Award } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import { useGetLeaderboardByContestQuery } from "@/services/leaderboardApi"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useAwardCertificatesMutation } from "@/services/certificateApi"
import { useModal } from "@/shared/hooks/useModal"
import toast from "react-hot-toast"
import { formatScore } from "@/shared/utils/formatNumber"

const OrganizerLeaderboardMember = () => {
  const { contestId, teamId, memberId } = useParams()
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
  const member = team?.members?.find((m) => m.memberId === memberId)

  const contestName = leaderboardData?.data?.contestName ?? "Contest"
  const teamName = team?.teamName ?? "Team"
  const memberName = member?.memberName ?? "Member"

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_LEADERBOARD_MEMBER(
    contestName,
    teamName,
    memberName
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_LEADERBOARD_MEMBER(
    contestId,
    teamId,
    memberId
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
          toast.success("Certificate issued successfully.")
          closeModal()
        } catch (err) {
          console.error(err)
          toast.error(
            err?.data?.message ||
              err?.data?.error ||
              "Unable to issue certificate"
          )
        } finally {
          setAwarding(false)
        }
      },
      awarding: awarding,
    })
  }

  if (!member && !isLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
          This member has been deleted or is no longer available.
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={isLoading}
      error={error}
    >
      {/* Award Member Certificate */}
      {member && (
        <div className="mb-1">
          <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
            {/* Left: Icon + Text */}
            <div className="flex items-center gap-5">
              <Award size={20} />
              <div>
                <p className="text-[14px] leading-5">
                  Award member certificate
                </p>
                <p className="text-[12px] leading-4 text-[#7A7574]">
                  Issue a certificate for this member
                </p>
              </div>
            </div>

            {/* Right: Action Button */}
            <button
              type="button"
              className="button-orange px-3"
              onClick={handleAward}
              disabled={awarding}
            >
              {awarding ? "Awarding..." : "Award"}
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
                  <span>{round.roundType || "N/A"}</span>
                  <span>|</span>
                  <span>
                    {round.completedAt
                      ? new Date(round.completedAt).toLocaleString()
                      : "Not completed"}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[14px] leading-5 text-[#7A7574]">
              {formatScore(round.score)} points
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  )
}

export default OrganizerLeaderboardMember
