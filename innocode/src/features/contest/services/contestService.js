import contestApi from "../../../api/contestApi"

export const contestService = {
  async getAllContests({ pageNumber = 1, pageSize = 10, nameSearch } = {}) {
    const res = await contestApi.getAll({ pageNumber, pageSize, nameSearch })
    // ✅ Return full response with data and additionalData for organizer
    // Student will handle in their hook
    return res.data // Return { data: [...], additionalData: {...} }
  },

  async getContestById(id) {
    const res = await contestApi.getById(id)
    // API returns array with single item when using idSearch
    const data = res.data.data || res.data
    return Array.isArray(data) ? data[0] : data
  },

  async createContest(data) {
    try {
      const res = await contestApi.create(data)
      return res.data.data || res.data
    } catch (err) {
      throw err.response?.data || { Message: err.message || "Unknown error" }
    }
  },

  async updateContest(id, data) {
    const res = await contestApi.update(id, data)
    return res.data
  },
  async getMyContests({ nameSearch } = {}) {
    const res = await contestApi.getMyContests({ nameSearch })
    return res.data || res.data.data
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
