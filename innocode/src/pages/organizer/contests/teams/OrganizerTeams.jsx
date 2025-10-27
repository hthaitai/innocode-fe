import React from "react"
import { useNavigate } from "react-router-dom"
import PageContainer from "../../../../components/PageContainer"
import TableFluent from "../../../../components/TableFluent"
import { Users, Pencil, Trash2 } from "lucide-react"
import Actions from "../../../../components/organizer/contests/Actions"
import { useOrganizerBreadcrumb } from "../../../../hooks/organizer/useOrganizerBreadcrumb"
import useTeams from "../../../../hooks/organizer/useTeams"
import { useModal } from "../../../../hooks/organizer/useModal"
import useSchools from "../../../../hooks/organizer/useSchools"
import useMentors from "../../../../hooks/organizer/useMentors"

const OrganizerTeams = () => {
  const navigate = useNavigate()
  const { teams, loading, error, addTeam, updateTeam, deleteTeam } = useTeams()
  const { openModal } = useModal()
  const { breadcrumbData } = useOrganizerBreadcrumb("ORGANIZER_TEAMS")
  const { schools } = useSchools()
  const { mentors } = useMentors()

  // ----- CRUD Modals -----
  const handleTeamModal = (mode, team = {}) => {
    openModal("team", {
      mode,
      initialData: team,
      onSubmit: async (data) => {
        if (mode === "create") return await addTeam(data)
        if (mode === "edit") return await updateTeam(team.team_id, data)
      },
    })
  }

  const handleDeleteTeam = (team) => {
    openModal("confirmDelete", {
      type: "team",
      item: team,
      onConfirm: async (onClose) => {
        await deleteTeam(team.team_id)
        onClose()
      },
    })
  }

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
    {
      id: "actions",
      header: "",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <Actions
          row={row.original}
          items={[
            {
              label: "Edit",
              icon: Pencil,
              onClick: (e) => {
                e.stopPropagation() // prevent row click
                handleTeamModal("edit", row.original)
              },
            },
            {
              label: "Delete",
              icon: Trash2,
              className: "text-red-500",
              onClick: (e) => {
                e.stopPropagation() // prevent row click
                handleDeleteTeam(row.original)
              },
            },
          ]}
        />
      ),
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
              <p className="text-[14px] leading-[20px]">Teams Management</p>
              <p className="text-[12px] leading-[16px] text-[#7A7574]">
                Create and manage teams for contests
              </p>
            </div>
          </div>
          <button
            className="button-orange"
            onClick={() => handleTeamModal("create")}
          >
            New Team
          </button>
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
