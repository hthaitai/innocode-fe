// services/contestService.js
import axios from "axios"

const API_BASE = "https://api.example.com/contests" // Replace with your backend URL

export const contestService = {
  getContests: async () => {
    const response = await axios.get(API_BASE)
    return response.data
  },

  getContestById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE}/${id}`)
      return response.data
    } catch (err) {
      throw new Error("Contest not found")
    }
  },

  addContest: async (data) => {
    const response = await axios.post(API_BASE, data)
    return response.data
  },

  updateContest: async (id, data) => {
    try {
      const response = await axios.put(`${API_BASE}/${id}`, data)
      return response.data
    } catch (err) {
      throw new Error("Contest not found")
    }
  },

  deleteContest: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE}/${id}`)
      return response.data // could be deleted item or empty
    } catch (err) {
      throw new Error("Contest not found")
    }
  },
}
