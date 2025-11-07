import mcqApi from "../../../api/mcqApi"

export const mcqService = {
  // GET /api/quizzes/banks
  async getBanks({ pageNumber = 1, pageSize = 10 } = {}) {
    const res = await mcqApi.getBanks({ pageNumber, pageSize })
    return res.data
  },

  // POST /api/mcq-tests/{testId}?bankId={bankId}
  async createTest(testId, bankId, data) {
    const res = await mcqApi.createTest(testId, bankId, data)
    return res.data.data
  },

  // GET /api/quizzes/{roundId}
  async getQuestions(roundId, { pageNumber = 1, pageSize = 10 } = {}) {
    const res = await mcqApi.getQuestions(roundId, { pageNumber, pageSize })
    return res.data
  },

  // PUT /api/mcq-tests/{testId}/questions/weights
  async updateQuestionWeights(testId, data) {
    const res = await mcqApi.updateQuestionWeights(testId, data)
    return res.data
  },

  // GET /api/quizzes/{roundId}/attempts
  async getAttempts(roundId, { pageNumber = 1, pageSize = 10 } = {}) {
    const res = await mcqApi.getAttempts(roundId, { pageNumber, pageSize })
    return res.data
  },

  // GET /api/quizzes/attempts/{attemptId}
  async getAttemptById(attemptId) {
    const res = await mcqApi.getAttemptById(attemptId)
    return res.data
  },
}
