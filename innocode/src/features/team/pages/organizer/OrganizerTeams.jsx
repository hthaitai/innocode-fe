import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Users } from "lucide-react"

import PageContainer from '@/shared/components/PageContainer'
import TableFluent from '@/shared/components/TableFluent'

import { useOrganizerBreadcrumb } from "@/features/organizer/hooks/useOrganizerBreadcrumb"
import useMentors from "@/features/organizer/hooks/useMentors"
import useTeams from "@/features/team/hooks/useTeams"
import useSchools from "../../../school/hooks/useSchools"

const OrganizerTeams = () => {
  const navigate = useNavigate()
  const { contestId } = useParams()
  const { breadcrumbData } = useOrganizerBreadcrumb("ORGANIZER_TEAMS")
  const { teams, loading, error } = useTeams()
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
      cell: ({ row }) =>
        schools.find((s) => s.school_id === row.original.school_id)?.name ||
        "—",
    },
    {
      accessorKey: "mentor_id",
      header: "Mentor",
      cell: ({ row }) =>
        mentors.find((m) => m.mentor_id === row.original.mentor_id)?.user
          ?.name || "—",
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) =>
        new Date(row.original.created_at).toLocaleDateString() || "—",
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
              <p className="text-[14px] leading-[20px]">
                Teams Overview
              </p>
              <p className="text-[12px] leading-[16px] text-[#7A7574]">
                View teams participating in the contest
              </p>
            </div>
          </div>
        </div>

        {/* Teams Table */}
        <TableFluent
          data={teams}
          columns={teamsColumns}
          title="Teams"
          onRowClick={(team) =>
            navigate(`/organizer/contests/${contestId}/teams/${team.team_id}`)
          }
        />
      </div>
    </PageContainer>
  )
}

export default OrganizerTeams

