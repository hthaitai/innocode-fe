import axiosClient from "./axiosClient";

export const schoolApi = {
  getAll: () => axiosClient.get("/schools"),
  getById: (id) => axiosClient.get(`/schools/${id}`),
  create: (data) => axiosClient.post("/schools", data),
  update: (id, data) => axiosClient.put(`/schools/${id}`, data),
  delete: (id) => axiosClient.delete(`/schools/${id}`),
};
