import React from "react"
import { useParams } from "react-router-dom"
import { Paperclip } from "lucide-react"
import PageContainer from '@/shared/components/PageContainer'
import TableFluent from '@/shared/components/TableFluent'
import { formatDateTime } from '@/shared/utils/dateTime'
import useAppeals from "@/features/appeal/hooks/useAppeals"
import useTeams from "@/features/team/hooks/useTeams"
import useUsers from "@/shared/hooks/useUsers"
import InfoSection from "../../../../shared/components/InfoSection"
import DetailTable from "../../../../shared/components/DetailTable"
import DetailTableSection from "../../../../shared/components/DetailTableSection"
import { useModal } from "../../../../shared/hooks/useModal"
import { useOrganizerBreadcrumb } from "../../../../shared/hooks/useOrganizerBreadcrumb"

const OrganizerAppealDetail = () => {
  const { contestId: contestIdParam, appealId: appealIdParam } = useParams()
  const contestId = Number(contestIdParam)
  const appealId = Number(appealIdParam)

  const { appeals, loading, error, updateAppeal } = useAppeals()
  const { teams } = useTeams()
  const { users } = useUsers()
  const { openModal } = useModal()

  const { breadcrumbData } = useOrganizerBreadcrumb("ORGANIZER_APPEAL_DETAIL", {
    contest: contests.find((c) => c.contest_id === contestId),
  })

  const appeal = appeals.find((a) => a.appeal_id === appealId)
  const team = teams.find((t) => t.team_id === appeal?.team_id)
  const owner = users.find((u) => u.user_id === appeal?.owner_id)

  if (!appeal)
    return (
      <PageContainer
        breadcrumb={breadcrumbData.items}
        breadcrumbPaths={breadcrumbData.paths}
        loading={loading}
        error={error}
      >
        <div className="flex items-center justify-center h-[200px] text-gray-500">
          Appeal not found
        </div>
      </PageContainer>
    )

  const handleAppealModal = (field) => {
    if (field === "state") {
      openModal("appealState", {
        initialState: appeal.state,
        onSubmit: (data) => updateAppeal(appeal.appeal_id, data),
      })
    } else {
      openModal("appealDecision", {
        initialDecision: appeal.decision,
        onSubmit: (data) => updateAppeal(appeal.appeal_id, data),
      })
    }
  }

  const evidenceColumns = [
    {
      accessorKey: "url",
      header: "Evidence Link",
      cell: ({ row }) => (
        <a
          href={row.original.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View Evidence
        </a>
      ),
    },
    { accessorKey: "note", header: "Note" },
    {
      accessorKey: "created_at",
      header: "Uploaded At",
      cell: ({ row }) => formatDateTime(row.original.created_at),
    },
  ]

  // Dummy evidence list (replace with API later)
  const evidenceList = [
    {
      evidence_id: 1,
      url: "https://example.com/evidence1.png",
      note: "Screenshot of incorrect output",
      created_at: "2025-10-25T11:00:00Z",
    },
  ]

  return (
    <PageContainer
      breadcrumb={breadcrumbData.items}
      breadcrumbPaths={breadcrumbData.paths}
      loading={loading}
      error={error}
    >
      <div className="space-y-5">
        {/* Appeal info */}
        <div className="info-group">
          <InfoSection title="Appeal Information">
            <DetailTable
              data={[
                { label: "Appeal ID", value: appeal.appeal_id },
                { label: "Team", value: team?.name || "—" },
                { label: "Owner", value: owner?.fullname || "—" },
                { label: "Target Type", value: appeal.target_type },
                { label: "Target ID", value: appeal.target_id },
                { label: "Reason", value: appeal.reason },
                {
                  label: "Created At",
                  value: formatDateTime(appeal.created_at),
                },
              ]}
            />
          </InfoSection>

          {/* Manage state/decision */}
          <DetailTableSection
            rows={[
              {
                label: "State",
                value: appeal.state || "—",
                onAction: () => handleAppealModal("state"),
                align: "center", // center vertically for short content (like badge)
              },
              {
                label: "Decision",
                value: appeal.decision || "—",
                onAction: () => handleAppealModal("decision"),
                align: "top", // top-align if text can be multiline
              },
            ]}
          />
        </div>

        {/* Evidence */}
        <div>
          <div className="text-sm font-semibold pt-3 pb-2">Evidence</div>
          <div className="space-y-1">
            <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
              <div className="flex gap-5 items-center">
                <Paperclip size={20} />
                <div>
                  <p className="text-[14px] leading-[20px]">Appeal Evidence</p>
                  <p className="text-[12px] text-[#7A7574]">
                    Uploaded evidence supporting this appeal
                  </p>
                </div>
              </div>
            </div>

            <TableFluent data={evidenceList} columns={evidenceColumns} />
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default OrganizerAppealDetail
