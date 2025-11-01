import React from "react"
import { Award, BookOpen, FileText, Users } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import PageContainer from '@/shared/components/PageContainer'
import InfoSection from '@/features/contest/components/InfoSection'
import DetailTable from '@/features/contest/components/DetailTable'
import { useOrganizerBreadcrumb } from "@/features/organizer/hooks/useOrganizerBreadcrumb"
import useTeams from "@/features/contest/subfeatures/teams/hooks/useTeams"
import useSchools from "@/features/organizer/hooks/useSchools"
import useMentors from "@/features/organizer/hooks/useMentors"
import TableFluent from '@/shared/components/TableFluent'
import { StatusBadge } from '@/shared/utils/StatusBadge'
import { formatDateTime } from "@/shared/utils/formatDateTime"
import useAppeals from "@/features/contest/subfeatures/appeals/hooks/useAppeals"
import useContests from "../../../../../contest/hooks/useContests"

const OrganizerTeamDetail = () => {
  const { teamId: teamIdParam } = useParams()
  const teamId = Number(teamIdParam)

  const navigate = useNavigate()

  // data hooks
  const { contests } = useContests()
  const { teams, loading, error } = useTeams()
  const { schools } = useSchools()
  const { mentors } = useMentors()
  const { appeals } = useAppeals()

  // data relations
  const team = teams.find((t) => t.team_id === teamId)
  const contest = team && contests.find((c) => c.contest_id === team.contest_id)
  const school = team && schools.find((s) => s.school_id === team.school_id)
  const mentor = team && mentors.find((m) => m.mentor_id === team.mentor_id)
  const appeal = team && appeals.filter((a) => a.team_id === team.team_id)

  const { breadcrumbData } = useOrganizerBreadcrumb("ORGANIZER_TEAM_DETAIL", {
    contest,
    teams: team ? [team] : [],
  })

  // Dummy data placeholders (read-only context)
  const members = [
    { id: 1, name: "Alice Nguyen", role: "Leader", email: "alice@school.edu" },
    { id: 2, name: "Bao Tran", role: "Member", email: "bao@school.edu" },
    { id: 3, name: "Minh Hoang", role: "Member", email: "minh@school.edu" },
  ]

  const submissions = [
    {
      id: 1,
      title: "Final Project",
      status: "approved",
      submitted_at: "2025-10-25T10:20:00Z",
    },
  ]

  const certificates = [
    { id: 1, type: "Participation", issued_at: "2025-10-26T14:00:00Z" },
  ]

  // table configs
  const memberColumns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "email", header: "Email" },
  ]

  const submissionColumns = [
    { accessorKey: "title", header: "Submission Title" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "submitted_at",
      header: "Submitted At",
      cell: ({ row }) => formatDateTime(row.original.submitted_at),
    },
  ]

  const appealColumns = [
    { accessorKey: "reason", header: "Reason" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => formatDateTime(row.original.created_at),
    },
  ]

  const certificateColumns = [
    { accessorKey: "type", header: "Certificate Type" },
    {
      accessorKey: "issued_at",
      header: "Issued At",
      cell: ({ row }) => formatDateTime(row.original.issued_at),
    },
  ]

  if (!team) {
    return (
      <PageContainer
        breadcrumb={breadcrumbData.items}
        breadcrumbPaths={breadcrumbData.paths}
        loading={loading}
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
      breadcrumb={breadcrumbData.items}
      breadcrumbPaths={breadcrumbData.paths}
      loading={loading}
      error={error}
    >
      <div className="space-y-5">
        {/* --- Team Info --- */}
        <InfoSection title="Team Information">
          <DetailTable
            data={[
              { label: "Team Name", value: team.name },
              { label: "School", value: school?.name || "—" },
              { label: "Mentor", value: mentor?.user?.name || "—" },
              { label: "Contest", value: contest?.name || "—" },
              { label: "Created At", value: formatDateTime(team.created_at) },
            ]}
          />
        </InfoSection>

        {/* --- Members --- */}
        <div>
          <div className="text-sm font-semibold pt-3 pb-2">Members</div>
          <div className="space-y-1">
            <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
              <div className="flex gap-5 items-center">
                <Users size={20} />
                <div>
                  <p className="text-[14px] leading-[20px]">Team Members</p>
                  <p className="text-[12px] leading-[16px] text-[#7A7574]">
                    View all team members
                  </p>
                </div>
              </div>
            </div>

            <TableFluent
              data={members}
              columns={memberColumns}
              title="Members"
            />
          </div>
        </div>

        {/* --- Submissions --- */}
        <div>
          <div className="text-sm font-semibold pt-3 pb-2">Submissions</div>
          <div className="space-y-1">
            <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
              <div className="flex gap-5 items-center">
                <FileText size={20} />
                <div>
                  <p className="text-[14px] leading-[20px]">
                    Submission Records
                  </p>
                  <p className="text-[12px] leading-[16px] text-[#7A7574]">
                    View all team submissions
                  </p>
                </div>
              </div>
            </div>

            <TableFluent
              data={submissions}
              columns={submissionColumns}
              title="Submissions"
            />
          </div>
        </div>

        {/* --- Appeals --- */}
        <div>
          <div className="text-sm font-semibold pt-3 pb-2">Appeals</div>
          <div className="space-y-1">
            <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
              <div className="flex gap-5 items-center">
                <BookOpen size={20} />
                <div>
                  <p className="text-[14px] leading-[20px]">Appeal History</p>
                  <p className="text-[12px] leading-[16px] text-[#7A7574]">
                    Track and review team appeals
                  </p>
                </div>
              </div>
            </div>

            <TableFluent
              data={appeal}
              columns={appealColumns}
              title="Appeals"
            />
          </div>
        </div>

        {/* --- Certificates --- */}
        <div>
          <div className="text-sm font-semibold pt-3 pb-2">Certificates</div>
          <div className="space-y-1">
            <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
              <div className="flex gap-5 items-center">
                <Award size={20} />
                <div>
                  <p className="text-[14px] leading-[20px]">
                    Team Certificates
                  </p>
                  <p className="text-[12px] leading-[16px] text-[#7A7574]">
                    View issued certificates for this team
                  </p>
                </div>
              </div>
            </div>

            <TableFluent
              data={certificates}
              columns={certificateColumns}
              title="Certificates"
            />
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default OrganizerTeamDetail
