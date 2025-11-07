import axiosClient from "./axiosClient"

const mcqApi = {
  // GET /api/quizzes/banks
  getBanks: ({ pageNumber = 1, pageSize = 10 } = {}) =>
    axiosClient.get("/quizzes/banks", { params: { pageNumber, pageSize } }),

  // POST /api/mcq-tests/{testId}?bankId={bankId}
  createTest: (testId, bankId, data) =>
    axiosClient.post(`/mcq-tests/${testId}`, data, { params: { bankId } }),

  // GET /api/quizzes/{roundId}
  getQuestions: (roundId, { pageNumber = 1, pageSize = 10 }) =>
    axiosClient.get(`/quizzes/${roundId}`, {
      params: { pageNumber, pageSize },
    }),

  // PUT /api/mcq-tests/{testId}/questions/weights
  updateQuestionWeights: (testId, data) =>
    axiosClient.put(`/mcq-tests/${testId}/questions/weights`, data),

  // GET /api/quizzes/{roundId}/attempts
  getAttempts: (roundId, { pageNumber = 1, pageSize = 10 }) =>
    axiosClient.get(`/quizzes/${roundId}/attempts`, {
      params: { pageNumber, pageSize },
    }),

  // GET /api/quizzes/attempts/{attemptId}
  getAttemptById: (attemptId) =>
    axiosClient.get(`/quizzes/attempts/${attemptId}`),
}

export default mcqApi
