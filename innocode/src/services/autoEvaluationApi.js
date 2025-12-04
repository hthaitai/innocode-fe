import { api } from "./api"

export const autoEvaluationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTestCaseTemplate: builder.query({
      query: () => `/test-cases/template`,
    }),

    importTestCasesCsv: builder.mutation({
      query: ({ roundId, csvFile }) => {
        const formData = new FormData()
        formData.append("csvFile", csvFile)

        return {
          url: `/rounds/${roundId}/test-cases/import-csv`,
          method: "POST",
          body: formData,
        }
      },
      invalidatesTags: ["TestCases"],
    }),

    createRoundTestCase: builder.mutation({
      query: ({ roundId, payload }) => ({
        url: `/rounds/${roundId}/test-cases`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["TestCases"],
    }),

    getRoundTestCases: builder.query({
      query: ({ roundId, pageNumber = 1, pageSize = 10 }) => ({
        url: `/rounds/${roundId}/test-cases`,
        params: { pageNumber, pageSize },
      }),
      providesTags: ["TestCases"],
    }),

    getTestCaseById: builder.query({
      query: (testCaseId) => ({
        url: `/test-cases/${testCaseId}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, testCaseId) => [
        { type: "TestCases", id: testCaseId },
      ],
    }),

    updateRoundTestCases: builder.mutation({
      query: ({ roundId, testCases }) => ({
        url: `/rounds/${roundId}/test-cases`,
        method: "PUT",
        body: testCases,
      }),
      invalidatesTags: ["TestCases"],
    }),

    deleteRoundTestCase: builder.mutation({
      query: ({ roundId, testCaseId }) => ({
        url: `/rounds/${roundId}/test-cases/${testCaseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TestCases"],
    }),

    getAutoTestResults: builder.query({
      query: ({
        roundId,
        pageNumber = 1,
        pageSize = 10,
        studentIdSearch,
        teamIdSearch,
        studentNameSearch,
        teamNameSearch,
      }) => ({
        url: `/rounds/${roundId}/auto-test/results`,
        params: {
          pageNumber,
          pageSize,
          studentIdSearch,
          teamIdSearch,
          studentNameSearch,
          teamNameSearch,
        },
      }),
      providesTags: ["TestResults"],
    }),

    submitAutoTest: builder.mutation({
      query: ({ roundId, code, file }) => {
        const formData = new FormData();
        
        // Append Code if provided
        if (code) {
          formData.append("Code", code);
          formData.append("type", "Code"); // Specify submission type
        }
        
        // Append File if provided
        if (file) {
          formData.append("File", file);
          formData.append("type", "File"); // Specify submission type
        }

        return {
          url: `/rounds/${roundId}/auto-test/submissions`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["TestResults"],
      // Note: transformResponse extracts data, so result will be { submissionId, summary, cases }
      // But if transformResponse doesn't work, we handle both cases in component
      transformResponse: (response) => {
        // If response has data property, return it, otherwise return response
        return response?.data || response;
      },
    }),

    getAutoTestResult: builder.query({
      query: (roundId) => ({
        url: `/rounds/${roundId}/auto-test/my-result`,
      }),
      providesTags: ["TestResults"],
      // Response structure: { data: {...}, message, statusCode, code }
      // Return data directly
      transformResponse: (response) => {
        return response?.data || response;
      },
    }),

    submitFinalAutoTest: builder.mutation({
      query: (submissionId) => ({
        url: `/submissions/${submissionId}/acceptance`,
        method: "PUT",
      }),
      invalidatesTags: ["TestResults"],
      transformResponse: (response) => response.data,
    }),
  }),
})

export const {
  useGetTestCaseTemplateQuery,
  useImportTestCasesCsvMutation,
  useCreateRoundTestCaseMutation,
  useGetRoundTestCasesQuery,
  useUpdateRoundTestCasesMutation,
  useDeleteRoundTestCaseMutation,
  useGetAutoTestResultsQuery,
  useGetTestCaseByIdQuery,
  useSubmitAutoTestMutation,
  useGetAutoTestResultQuery,
  useSubmitFinalAutoTestMutation,
} = autoEvaluationApi
