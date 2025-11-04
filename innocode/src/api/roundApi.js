import axiosClient from "./axiosClient"

const roundApi = {
  // GET /api/rounds
  getAll: (params) => axiosClient.get("/rounds", { params }),

  // POST /api/rounds
  create: (data) => axiosClient.post("/rounds", data),

  // PUT /api/rounds/{id}
  update: (id, data) => axiosClient.put(`/rounds/${id}`, data),

  // DELETE /api/rounds/{id}
  delete: (id) => axiosClient.delete(`/rounds/${id}`),
}

export default roundApi
