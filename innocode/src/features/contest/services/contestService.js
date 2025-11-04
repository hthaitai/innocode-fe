import contestApi from "../../../api/contestApi"

export const contestService = {
  async getAllContests({ pageNumber = 1, pageSize = 10 } = {}) {
    const res = await contestApi.getAll({ pageNumber, pageSize })
    return res.data
  },

  async createContest(data) {
    const res = await contestApi.create(data)
    return res.data.data
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
