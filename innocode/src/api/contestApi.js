import axiosClient from "./axiosClient"

const contestApi = {
  // GET /api/contests
  getAll: ({ pageNumber = 1, pageSize = 10 } = {}) =>
    axiosClient.get("/contests/my-contests", {
      params: { pageNumber, pageSize },
    }),

  // POST /api/contests
  create: (data) => axiosClient.post("/contests/advanced", data),

  // PUT /api/contests/{id}
  update: (id, data) => axiosClient.put(`/contests/${id}`, data),

  // DELETE /api/contests/{id}
  delete: (id) => axiosClient.delete(`/contests/${id}`),

  // POST /api/contests/advanced
  advancedSearch: (data) => axiosClient.post(`/contests/advanced`, data),

  // GET /api/contest/{id}/check - check if ready to publish
  checkPublishReady: (id) => axiosClient.get(`/contests/${id}/check`),

  // PUT /api/contest/{id}/publish - publish the contest
  publishContest: (id) => axiosClient.put(`/contests/${id}/publish`),
}

export default contestApi
