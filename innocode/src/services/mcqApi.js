import { api } from "./api"

export const mcqApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch MCQs of a round
    getRoundMcqs: builder.query({
      query: ({ roundId, pageNumber = 1, pageSize = 10 }) => ({
        url: `rounds/${roundId}/mcq-test`,
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
        url: "banks",
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
        body: questionIds,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, { contestId }) => [
        { type: "Mcq", id: "LIST" },
        { type: "PublishCheck", id: contestId },
      ],
    }),

    // Update question weights
    updateQuestionWeight: builder.mutation({
      query: ({ testId, questions }) => ({
        url: `mcq-tests/${testId}/questions/weights`,
        method: "PUT",
        body: { questions },
      }),
      invalidatesTags: [{ type: "Mcq", id: "LIST" }],
    }),

    // Fetch attempts
    getAttempts: builder.query({
      query: ({ roundId, pageNumber = 1, pageSize = 10 }) => ({
        url: `rounds/${roundId}/attempts`,
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
      query: (attemptId) => `rounds/mcq-test/attempts/${attemptId}`,
      providesTags: (result, error, id) => [{ type: "Attempt", id }],
    }),

    // Fetch my attempt
    getMyAttempt: builder.query({
      query: (roundId) => `rounds/${roundId}/attempts/my-attempt`,
      providesTags: (result) =>
        result ? [{ type: "Attempt", id: result.attemptId }] : [],
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
  useGetMyAttemptQuery,
  useGetMcqTemplateQuery,
  useImportMcqCsvMutation,
} = mcqApi
