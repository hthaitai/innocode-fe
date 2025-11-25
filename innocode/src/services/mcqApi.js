import { api } from "./api"

export const mcqApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch MCQs of a round
    getRoundMcqs: builder.query({
      query: ({ roundId, pageNumber = 1, pageSize = 10 }) => ({
        url: `quizzes/rounds/${roundId}/quiz`,
        params: { pageNumber, pageSize },
      }),
      providesTags: (result) => {
        const questions = result?.data?.mcqTest?.questions ?? []
        return [
          ...questions.map((q) => ({ type: "Mcq", id: q.questionId })),
          { type: "Mcq", id: "LIST" },
        ]
      },
    }),

    // Fetch banks
    getBanks: builder.query({
      query: ({ bankId, nameSearch, pageNumber = 1, pageSize = 10 } = {}) => ({
        url: "quizzes/banks",
        params: { bankId, nameSearch, pageNumber, pageSize },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((b) => ({ type: "Bank", id: b.bankId })),
              { type: "Bank", id: "LIST" },
            ]
          : [{ type: "Bank", id: "LIST" }],
    }),

    // Create test
    createTest: builder.mutation({
      query: ({ testId, questionIds }) => ({
        url: `mcq-tests/${testId}`,
        method: "POST",
        body: questionIds, // just the array of questionId strings
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [
        { type: "Mcq", id: "LIST" },
        { type: "PublishCheck", id: contestId },
      ],
    }),

    // Update question weights
    updateQuestionWeight: builder.mutation({
      query: ({ testId, weights }) => ({
        url: `mcq-tests/${testId}/questions/weights`,
        method: "PUT",
        body: { weights },
      }),
      invalidatesTags: [{ type: "Mcq", id: "LIST" }],
    }),

    // Fetch attempts
    getAttempts: builder.query({
      query: ({ roundId, pageNumber = 1, pageSize = 10 }) => ({
        url: `quizzes/${roundId}/attempts`,
        params: { pageNumber, pageSize },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((a) => ({ type: "Attempt", id: a.attemptId })),
              { type: "Attempt", id: "LIST" },
            ]
          : [{ type: "Attempt", id: "LIST" }],
    }),

    // Fetch attempt details
    getAttemptDetail: builder.query({
      query: (attemptId) => `quizzes/attempts/${attemptId}`,
      providesTags: (result, error, id) => [{ type: "Attempt", id }],
    }),

    // Fetch MCQ template (CSV)
    getMcqTemplate: builder.query({
      query: () => "mcq-tests/template",
    }),

    // Import MCQs from CSV
    importMcqCsv: builder.mutation({
      query: ({ testId, formData }) => ({
        url: `mcq-tests/${testId}/import-csv`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Mcq", id: "LIST" }],
    }),
  }),
})

export const {
  useGetRoundMcqsQuery,
  useGetBanksQuery,
  useCreateTestMutation,
  useUpdateQuestionWeightMutation,
  useGetAttemptsQuery,
  useGetAttemptDetailQuery,
  useGetMcqTemplateQuery,
  useImportMcqCsvMutation,
} = mcqApi
