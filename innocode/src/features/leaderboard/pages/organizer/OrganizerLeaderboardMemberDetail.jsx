import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { Calendar } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import { useGetLeaderboardByContestQuery } from "@/services/leaderboardApi"
import { useAwardCertificatesMutation } from "@/services/certificateApi"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import TemplateModal from "../../components/TemplateModal"

const OrganizerLeaderboardMemberDetail = () => {
  const { contestId, teamId, memberId } = useParams()
  const [isTemplateModalOpen, setTemplateModalOpen] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState(null)

  const {
    data: leaderboardData,
    isLoading,
    error,
  } = useGetLeaderboardByContestQuery(
    { contestId, pageNumber: 1, pageSize: 10 },
    { skip: !contestId }
  )

  const [awardCertificate, { isLoading: awarding }] =
    useAwardCertificatesMutation()

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

  const handleAwardCertificate = async (templateId) => {
    if (!member || !templateId) return

    const payload = {
      templateId,
      recipients: [
        {
          studentId: member.memberId,
          displayName: member.memberName,
        },
      ],
      output: "png",
      reissue: true,
    }

    try {
      await awardCertificate(payload).unwrap()
      alert("Certificate awarded successfully!")
    } catch (err) {
      console.error(err)
      alert("Failed to award certificate.")
    }
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={isLoading}
      error={error}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Rounds for {memberName}</h2>
        <button
          className="button-orange"
          onClick={() => setTemplateModalOpen(true)}
          disabled={awarding}
        >
          {awarding ? "Awarding..." : "Award Certificate"}
        </button>
      </div>

      <div className="flex flex-col gap-2">
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
              {round.score ?? 0} points
            </div>
          </div>
        ))}
      </div>

      {/* Template Selection Modal */}
      {isTemplateModalOpen && (
        <TemplateModal
          isOpen={isTemplateModalOpen}
          onClose={() => setTemplateModalOpen(false)}
          contestId={contestId}
          onSelectTemplate={(templateId) => handleAwardCertificate(templateId)}
        />
      )}
    </PageContainer>
  )
}

export default OrganizerLeaderboardMemberDetail
