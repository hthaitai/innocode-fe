import React from "react"
import { Pencil, Trash2 } from "lucide-react"
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
import { formatDateTime } from "../../../../components/organizer/utils/TableUtils"

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
        <InfoSection title="Team Information" onEdit={handleEdit}>
          <DetailTable
            data={[
              { label: "Team Name", value: team.name },
              { label: "School", value: school?.name || "—" },
              { label: "Mentor", value: mentor?.user?.name || "—" },
              { label: "Created At", value: formatDateTime(team.created_at) },
            ]}
          />
        </InfoSection>

        <div>
          <div className="text-sm font-semibold pt-3 pb-2">More Actions</div>
          <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
            <div className="flex gap-5 items-center">
              <Trash2 size={20} />
              <p className="text-[14px] leading-[20px]">Delete Team</p>
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
