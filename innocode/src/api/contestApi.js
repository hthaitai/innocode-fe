import axiosClient from "./axiosClient"

const contestApi = {
  // GET /api/contests
  getAll: ({ pageNumber, pageSize }) =>
    axiosClient.get("/contests", {
      params: { pageNumber, pageSize },
    }),

  // POST /api/contests
  create: (data) => axiosClient.post("/contests/advanced", data),

  // PUT /api/contests/{id}
  update: (id, data) => axiosClient.put(`/contests/${id}`, data),

  // DELETE /api/contests/{id}
  delete: (id) => axiosClient.delete(`/contests/${id}`),

  // PUT /api/contests/{id}/publish
  publish: (id) => axiosClient.put(`/contests/${id}/publish`),

  // POST /api/contests/advanced
  advancedSearch: (data) => axiosClient.post(`/contests/advanced`, data),

  // GET /api/contests/{id}/publish/check
  checkPublishReady: (id) => axiosClient.get(`/contests/${id}/publish/check`),

  // POST /api/contests/{id}/publish-if-ready
  publishIfReady: (id) => axiosClient.post(`/contests/${id}/publish-if-ready`),
}

export default contestApi
