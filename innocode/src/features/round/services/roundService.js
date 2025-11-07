import roundApi from "../../../api/roundApi"

export const roundService = {
  async getAllRounds({ contestId, roundId, pageNumber = 1, pageSize = 10 } = {}) {
    const res = await roundApi.getAll({
      contestIdSearch: contestId,
      idSearch: roundId,
      pageNumber,
      pageSize,
    })
    return res.data
  },

  async createRound(contestId, data) {
    const res = await roundApi.create(contestId, data)
    return res.data.data
  },

  async updateRound(id, data) {
    const res = await roundApi.update(id, data)
    return res.data
  },

  async deleteRound(id) {
    await roundApi.delete(id)
    return id
  },
}
