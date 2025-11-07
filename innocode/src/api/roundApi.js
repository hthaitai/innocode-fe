import axiosClient from "./axiosClient"

const roundApi = {
  // GET /api/rounds
  getAll: ({ contestIdSearch, idSearch, pageNumber = 1, pageSize = 10 } = {}) =>
    axiosClient.get("/rounds", {
      params: { contestIdSearch, idSearch, pageNumber, pageSize },
    }),

  // POST /api/rounds/{contestId}
  create: (contestId, data) => axiosClient.post(`/rounds/${contestId}`, data),

  // PUT /api/rounds/{id}
  update: (id, data) => axiosClient.put(`/rounds/${id}`, data),

  // DELETE /api/rounds/{id}
  delete: (id) => axiosClient.delete(`/rounds/${id}`),
}

export default roundApi
