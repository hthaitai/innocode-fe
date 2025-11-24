import axiosClient from "./axiosClient"

const testCaseApi = {
  // POST /api/rounds/{roundId}/test-cases
  createTestCase: async (roundId, data) => {
    const response = await axiosClient.post(
      `/rounds/${roundId}/test-cases`,
      data
    )
    return response.data
  },

  // GET /api/rounds/{roundId}/test-cases
  getTestCases: async (roundId, { pageNumber = 1, pageSize = 10 } = {}) => {
    const response = await axiosClient.get(`/rounds/${roundId}/test-cases`, {
      params: { pageNumber, pageSize },
    })
    return response.data
  },

  // PUT /api/rounds/{roundId}/test-cases (bulk update)
  updateTestCases: async (roundId, testCases) => {
    const response = await axiosClient.put(
      `/rounds/${roundId}/test-cases`,
      testCases
    )
    return response.data
  },

  // DELETE /api/rounds/{roundId}/test-cases/{id}
  deleteTestCase: async (roundId, testCaseId) => {
    const response = await axiosClient.delete(
      `/rounds/${roundId}/test-cases/${testCaseId}`
    )
    return response.data
  },

  // ---------- Auto-evaluation: Results ----------
  // GET /api/rounds/{roundId}/auto-test/results
  getAutoTestResults: async (
    roundId,
    {
      pageNumber = 1,
      pageSize = 10,
      studentIdSearch,
      teamIdSearch,
      studentNameSearch,
      teamNameSearch,
    } = {}
  ) => {
    const response = await axiosClient.get(
      `/rounds/${roundId}/auto-test/results`,
      {
        params: {
          pageNumber,
          pageSize,
          studentIdSearch,
          teamIdSearch,
          studentNameSearch,
          teamNameSearch,
        },
      }
    )
    return response.data
  },
}

export default testCaseApi
