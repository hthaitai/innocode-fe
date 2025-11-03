import contestApi from "../../../api/contestApi"

export const contestService = {
  async getAllContests(params) {
    const res = await contestApi.getAll(params)
    return res.data?.data || []
  },

  async createContest(data) {
    const res = await contestApi.create(data)
    return res.data.data || res.data
  },

  async updateContest(id, data) {
    const res = await contestApi.update(id, data)
    return res.data
  },

  async deleteContest(id) {
    await contestApi.delete(id)
    return id
  },

  async publishContest(id) {
    const res = await contestApi.publish(id)
    return res.data
  },

  async checkPublishReady(id) {
    const res = await contestApi.checkPublishReady(id)
    return res.data
  },

  async publishIfReady(id) {
    const res = await contestApi.publishIfReady(id)
    return res.data
  },

  async advancedSearch(data) {
    const res = await contestApi.advancedSearch(data)
    return res.data
  },
}
