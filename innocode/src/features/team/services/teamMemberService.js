import { teamMemberApi } from '@/api/teamMemberApi'

export const teamMemberService = {
  // ----- READ ALL (by team) -----
  async getMembersByTeam(teamId) {
    const { data } = await teamMemberApi.getByTeam(teamId)
    return data
  },

  // ----- ADD MEMBER -----
  async addMember(teamId, memberData) {
    const { data } = await teamMemberApi.add(teamId, memberData)
    return data
  },

  // ----- UPDATE MEMBER ROLE -----
  async updateMemberRole(teamId, studentId, updatedRole) {
    const { data } = await teamMemberApi.update(teamId, studentId, updatedRole)
    return data
  },

  // ----- REMOVE MEMBER -----
  async removeMember(teamId, studentId) {
    const { data } = await teamMemberApi.delete(teamId, studentId)
    return data
  },
}
