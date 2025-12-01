import axiosClient from "./axiosClient"

const manualProblemApi = {
  // POST /api/rounds/{roundId}/rubric
  createRubric: async (roundId, data) => {
    const response = await axiosClient.post(`/rounds/${roundId}/rubric`, data)
    return response.data
  },

  // GET /api/rounds/{roundId}/rubric
  getRubric: async (roundId) => {
    const response = await axiosClient.get(`/rounds/${roundId}/rubric`)
    return response.data
  },

  // PUT /api/rounds/{roundId}/rubric
  updateRubric: async (roundId, data) => {
    const response = await axiosClient.put(`/rounds/${roundId}/rubric`, data)
    return response.data
  },

  // DELETE /api/rounds/{roundId}/rubric/{id}
  deleteRubricCriterion: async (roundId, rubricId) => {
    const response = await axiosClient.delete(
      `/rounds/${roundId}/rubric/${rubricId}`
    )
    return response.data
  },

  // GET /api/rounds/{roundId}/manual-test/results
  getManualTestResults: async (
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
      `/rounds/${roundId}/manual-test/my-result`,
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

export default manualProblemApi

