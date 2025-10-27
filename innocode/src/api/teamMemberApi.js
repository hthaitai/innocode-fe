import { axiosClient } from "./axiosClient"

export const teamMemberApi = {
  getByTeam: (teamId) => axiosClient.get(`/teams/${teamId}/members`),
  add: (teamId, data) => axiosClient.post(`/teams/${teamId}/members`, data),
  update: (teamId, studentId, data) =>
    axiosClient.put(`/teams/${teamId}/members/${studentId}`, data),
  delete: (teamId, studentId) =>
    axiosClient.delete(`/teams/${teamId}/members/${studentId}`),
}
