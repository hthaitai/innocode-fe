import axiosClient from "./axiosClient"

const roundApi = {
  // GET /api/rounds
  getAll: (params) => axiosClient.get("/rounds", { params }),
  // GET /api/rounds for contest
  getByContestId: (contestId) =>
    axiosClient.get("/rounds", { params: { contestIdSearch: contestId } }),
  // GET /api/rounds/{id}
  getById: (roundId, openCode) => {
    const params = openCode ? { openCode } : {}
    return axiosClient.get(`/rounds/${roundId}`, { params })
  },
  // POST /api/rounds
  create: (contestId, data) => axiosClient.post(`/rounds/${contestId}`, data),

  // PUT /api/rounds/{id}
  update: (id, data) => axiosClient.put(`/rounds/${id}`, data),

  // DELETE /api/rounds/{id}
  delete: (id) => axiosClient.delete(`/rounds/${id}`),

  // GET /api/rounds/{id}/timeline
  getTimeline: (roundId) => axiosClient.get(`/rounds/${roundId}/timeline`),
}

export default roundApi
