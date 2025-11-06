import roundApi from "../../../api/roundApi"

export const roundService = {
  async getAllRounds(params) {
    const res = await roundApi.getAll(params)
    return res.data?.data || []
  },

  async createRound(data) {
    const res = await roundApi.create(data)
    return res.data
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
