import apiClient from "../lib/apiClient"

export const testCaseService = {
  create: async (contestId, roundId, problemId, data) => {
    const res = await apiClient.post(
      `/contests/${contestId}/rounds/${roundId}/problems/${problemId}/testcases`,
      data
    )
    return res.data
  },
  update: async (contestId, roundId, problemId, testCaseId, data) => {
    const res = await apiClient.put(
      `/contests/${contestId}/rounds/${roundId}/problems/${problemId}/testcases/${testCaseId}`,
      data
    )
    return res.data
  },
  delete: async (contestId, roundId, problemId, testCaseId) => {
    const res = await apiClient.delete(
      `/contests/${contestId}/rounds/${roundId}/problems/${problemId}/testcases/${testCaseId}`
    )
    return res.data
  },
}