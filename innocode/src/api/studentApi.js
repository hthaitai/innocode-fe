import axiosClient from "./axiosClient";

export const studentApi = {
  // GET /api/students?SchoolId={schoolId}
  getBySchoolId: (schoolId) =>
    axiosClient.get("/students", {
      params: { SchoolId: schoolId },
    }),
  getAll: () => axiosClient.get("/students"),
  getById: (id) => axiosClient.get(`/students/${id}`),
};

