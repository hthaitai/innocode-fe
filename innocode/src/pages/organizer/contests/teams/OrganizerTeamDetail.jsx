import React from "react"
import { Award, BookOpen, FileText, Trash2, Users } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import PageContainer from "../../../../components/PageContainer"
import InfoSection from "../../../../components/organizer/contests/InfoSection"
import DetailTable from "../../../../components/organizer/contests/DetailTable"
import { useOrganizerBreadcrumb } from "../../../../hooks/organizer/useOrganizerBreadcrumb"
import { useModal } from "../../../../hooks/organizer/useModal"
import useTeams from "../../../../hooks/organizer/contests/teams/useTeams"
import useSchools from "../../../../hooks/organizer/useSchools"
import useMentors from "../../../../hooks/organizer/useMentors"
import { useContests } from "../../../../hooks/organizer/contests/useContests"
import {
  formatDateTime,
  StatusBadge,
} from "../../../../components/organizer/utils/TableUtils"
import TableFluent from "../../../../components/TableFluent"
import { teamMembers } from "../../../../data/contests/teams/teamMembers"
import { teamSubmissions } from "../../../../data/contests/teams/teamSubmissions"
import { teamAppeals } from "../../../../data/contests/teams/teamAppeals"
import { teamCertificates } from "../../../../data/contests/teams/teamCertificates"

const OrganizerTeamDetail = () => {
  const { teamId: teamIdParam } = useParams()
  const teamId = Number(teamIdParam)

  const navigate = useNavigate()
  const { openModal } = useModal()

  const { contests } = useContests()
  const { teams, updateTeam, deleteTeam, loading, error } = useTeams()
  const { schools } = useSchools()
  const { mentors } = useMentors()

  const team = teams.find((t) => t.team_id === teamId)
  const contest = team && contests.find((c) => c.contest_id === team.contest_id)
  const school = team && schools.find((s) => s.school_id === team.school_id)
  const mentor = team && mentors.find((m) => m.mentor_id === team.mentor_id)
  const members = teamMembers.filter((m) => m.team_id === teamId)
  const submissions = teamSubmissions.filter((s) => s.team_id === teamId)
  const appeals = teamAppeals.filter((a) => a.team_id === teamId)
  const certificates = teamCertificates.filter((c) => c.team_id === teamId)

  const { breadcrumbData } = useOrganizerBreadcrumb("ORGANIZER_TEAM_DETAIL", {
    contest,
    teams: team ? [team] : [],
  })

  const handleEdit = () => {
    if (!team) return
    openModal("team", {
      mode: "edit",
      initialData: team,
      onSubmit: (data) => updateTeam(team.team_id, data),
    })
  }

  const handleDelete = () => {
    if (!team) return
    openModal("confirmDelete", {
      type: "team",
      item: team,
      onConfirm: async (onClose) => {
        await deleteTeam(team.team_id)
        onClose()
        navigate(`/organizer/contests/${team.contest_id}/teams`)
      },
    })
  }

  // Table configs
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
    { accessorKey: "issue", header: "Issue" },
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
        <InfoSection title="Team Information" onEdit={handleEdit}>
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
              data={appeals}
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

        {/* --- Delete Action --- */}
        <div>
          <div className="text-sm font-semibold pt-3 pb-2">More Actions</div>
          <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
            <div className="flex gap-5 items-center">
              <Trash2 size={20} />
              <div>
                <p className="text-[14px] leading-[20px]">Delete Team</p>
                <p className="text-[12px] leading-[16px] text-[#7A7574]">
                  Permanently remove this team from the contest
                </p>
              </div>
            </div>
            <button className="button-white" onClick={handleDelete}>
              Delete Team
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default OrganizerTeamDetail
