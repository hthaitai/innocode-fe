import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Scale } from "lucide-react"

import PageContainer from '@/shared/components/PageContainer'
import TableFluent from '@/shared/components/TableFluent'

import { useOrganizerBreadcrumb } from "@/features/organizer/hooks/useOrganizerBreadcrumb"
import useAppeals from "@/features/appeal/hooks/useAppeals"
import useTeams from "@/features/team/hooks/useTeams"
import useUsers from "@/shared/hooks/useUsers"
import { formatDateTime } from '@/shared/utils/formatDateTime'
import { StatusBadge } from "@/shared/utils/StatusBadge"


const OrganizerAppeals = () => {
  const navigate = useNavigate()
  const { contestId } = useParams()

  const { breadcrumbData } = useOrganizerBreadcrumb("ORGANIZER_APPEALS")
  const { appeals, loading, error } = useAppeals()
  const { teams } = useTeams()
  const { users } = useUsers()

  // ----- Table Columns -----
  const appealsColumns = [
    {
      accessorKey: "appeal_id",
      header: "ID",
      cell: ({ row }) => `#${row.original.appeal_id}`,
    },
    {
      accessorKey: "team_id",
      header: "Team",
      cell: ({ row }) =>
        teams.find((t) => t.team_id === row.original.team_id)?.name || "—",
    },
    {
      accessorKey: "target_type",
      header: "Target Type",
      cell: ({ row }) => row.original.target_type || "—",
    },
    {
      accessorKey: "owner_id",
      header: "Owner",
      cell: ({ row }) => {
        const user = users.find((u) => u.user_id === row.original.owner_id)
        return user?.fullname || user?.email || "—"
      },
    },
    {
      accessorKey: "state",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.state} />,
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => formatDateTime(row.original.created_at),
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
            <Scale size={20} />
            <div>
              <p className="text-[14px] leading-[20px]">Appeals Overview</p>
              <p className="text-[12px] leading-[16px] text-[#7A7574]">
                Manage and review contest appeals
              </p>
            </div>
          </div>
        </div>

        {/* Appeals Table */}
        <TableFluent
          data={appeals}
          columns={appealsColumns}
          title="Appeals"
          onRowClick={(appeal) =>
            navigate(
              `/organizer/contests/${contestId}/appeals/${appeal.appeal_id}`
            )
          }
        />
      </div>
    </PageContainer>
  )
}

export default OrganizerAppeals
