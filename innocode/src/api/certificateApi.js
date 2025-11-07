const certificateApi = {
    // GET /api/certificate-templates
  getAll: ({ contestIdSearch, idSearch, pageNumber = 1, pageSize = 10 } = {}) =>
    axiosClient.get("/rounds", {
      params: { contestIdSearch, idSearch, pageNumber, pageSize },
    }),
}

export default certificateApi