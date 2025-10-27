import { teamApi } from "../../api/teamApi"

export const teamService = {
  // ----- READ ALL -----
  async getAllTeams() {
    const { data } = await teamApi.getAll()
    // Optional: sort or transform
    return data.sort((a, b) => a.name.localeCompare(b.name))
  },

  // ----- READ BY ID -----
  async getTeam(id) {
    const { data } = await teamApi.getById(id)
    return data
  },

  // ----- READ BY CONTEST -----
  async getTeamsByContest(contestId) {
    const { data } = await teamApi.getByContest(contestId)
    return data
  },

  // ----- CREATE -----
  async createTeam(newTeam) {
    const { data } = await teamApi.create(newTeam)
    return data
  },

  // ----- UPDATE -----
  async updateTeam(id, updatedTeam) {
    const { data } = await teamApi.update(id, updatedTeam)
    return data
  },

  // ----- DELETE -----
  async deleteTeam(id) {
    const { data } = await teamApi.delete(id)
    return data
  },
}
