import axiosClient from "./axiosClient"

const mcqApi = {
  // GET /api/quizzes/banks
  getBanks: async ({ pageNumber = 1, pageSize = 10 } = {}) => {
    const response = await axiosClient.get("/quizzes/banks", {
      params: { pageNumber, pageSize },
    })
    return response.data
  },

  // POST /api/mcq-tests/{testId}?bankId={bankId}
  createTest: async (testId, bankId, data) => {
    const response = await axiosClient.post(`/mcq-tests/${testId}`, data, {
      params: { bankId },
    })
    return response.data
  },

  // GET /api/quizzes/{roundId}
  getQuestions: async (roundId, { pageNumber = 1, pageSize = 10 }) => {
    const response = await axiosClient.get(`/quizzes/${roundId}`, {
      params: { pageNumber, pageSize },
    })
    return response.data
  },

  // PUT /api/mcq-tests/{testId}/questions/weights
  updateQuestionWeights: async (testId, weights) => {
    // API expects: { questions: [{ questionId, weight }, ...] }
    const response = await axiosClient.put(
      `/mcq-tests/${testId}/questions/weights`,
      { questions: weights }
    )
    return response.data
  },

  // GET /api/quizzes/{roundId}/attempts
  getAttempts: async (roundId, { pageNumber = 1, pageSize = 10 }) => {
    const response = await axiosClient.get(`/quizzes/${roundId}/attempts`, {
      params: { pageNumber, pageSize },
    })
    return response.data
  },

  // GET /api/quizzes/attempts/{attemptId}
  getAttemptById: async (attemptId) => {
    const response = await axiosClient.get(`/quizzes/attempts/${attemptId}`)
    return response.data
  },
}

export default mcqApi
