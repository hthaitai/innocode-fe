import axiosClient from "./axiosClient"

export const teamApi = {
  getAll: () => axiosClient.get("/teams"),
  getById: (id) => axiosClient.get(`/teams/${id}`),
  getByContest: (contestId) => axiosClient.get(`/contests/${contestId}/teams`),
  create: (data) => axiosClient.post("/teams", data),
  update: (id, data) => axiosClient.put(`/teams/${id}`, data),
  delete: (id) => axiosClient.delete(`/teams/${id}`),
}
