import axiosClient from "./axiosClient";

export const provinceApi = {
  getAll: () => axiosClient.get("/provinces"),
  getById: id => axiosClient.get(`/provinces/${id}`),
  create: data => axiosClient.post("/provinces", data),
  update: (id, data) => axiosClient.put(`/provinces/${id}`, data),
  delete: id => axiosClient.delete(`/provinces/${id}`),
};
