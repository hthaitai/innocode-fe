import apiClient from "../lib/apiClient"

export const problemService = {
  create: async (contestId, roundId, data) => {
    const res = await apiClient.post(`/contests/${contestId}/rounds/${roundId}/problems`, data)
    return res.data
  },
  update: async (contestId, roundId, problemId, data) => {
    const res = await apiClient.put(
      `/contests/${contestId}/rounds/${roundId}/problems/${problemId}`,
      data
    )
    return res.data
  },
  delete: async (contestId, roundId, problemId) => {
    const res = await apiClient.delete(
      `/contests/${contestId}/rounds/${roundId}/problems/${problemId}`
    )
    return res.data
  },
}