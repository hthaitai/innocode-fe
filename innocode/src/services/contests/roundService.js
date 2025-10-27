import apiClient from "../lib/apiClient"

export const roundService = {
  create: async (contestId, data) => {
    const res = await apiClient.post(`/contests/${contestId}/rounds`, data)
    return res.data
  },
  update: async (contestId, roundId, data) => {
    const res = await apiClient.put(`/contests/${contestId}/rounds/${roundId}`, data)
    return res.data
  },
  delete: async (contestId, roundId) => {
    const res = await apiClient.delete(`/contests/${contestId}/rounds/${roundId}`)
    return res.data
  },
}