import React from "react"
import { useNavigate } from "react-router-dom"
import PageContainer from "../../../../components/PageContainer"
import TableFluent from "../../../../components/TableFluent"
import { Users } from "lucide-react"
import { useOrganizerBreadcrumb } from "../../../../hooks/organizer/useOrganizerBreadcrumb"
import useSchools from "../../../../hooks/organizer/useSchools"
import useMentors from "../../../../hooks/organizer/useMentors"
import useTeams from "../../../../hooks/organizer/contests/teams/useTeams"

const OrganizerTeams = () => {
  const navigate = useNavigate()
  const { teams, loading, error } = useTeams()
  const { breadcrumbData } = useOrganizerBreadcrumb("ORGANIZER_TEAMS")
  const { schools } = useSchools()
  const { mentors } = useMentors()

  // ----- Table Columns -----
  const teamsColumns = [
    {
      accessorKey: "name",
      header: "Team Name",
      cell: ({ row }) => row.original.name || "—",
    },
    {
      accessorKey: "school_id",
      header: "School",
      cell: ({ row }) => {
        const school = schools.find(
          (s) => s.school_id === row.original.school_id
        )
        return school ? school.name : "—"
      },
    },
    {
      accessorKey: "mentor_id",
      header: "Mentor",
      cell: ({ row }) => {
        const mentor = mentors.find(
          (m) => m.mentor_id === row.original.mentor_id
        )
        return mentor ? mentor.user?.name || "—" : "—"
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.original.created_at)
        return date.toLocaleDateString()
      },
    },
  ]

  return (
    <PageContainer
      breadcrumb={breadcrumbData.items}
      breadcrumbPaths={breadcrumbData.paths}
      loading={loading}
      error={error}
    >
      <div className="space-y-1">
        {/* Header */}
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
          <div className="flex gap-5 items-center">
            <Users size={20} />
            <div>
              <p className="text-[14px] leading-[20px]">Teams Overview</p>
              <p className="text-[12px] leading-[16px] text-[#7A7574]">
                View teams participating in contests
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <TableFluent
          data={teams}
          columns={teamsColumns}
          title="Teams"
          onRowClick={(team) => {
            if (!team) return
            navigate(
              `/organizer/contests/${team.contest_id}/teams/${team.team_id}`
            )
          }}
        />
      </div>
    </PageContainer>
  )
}

export default OrganizerTeams
