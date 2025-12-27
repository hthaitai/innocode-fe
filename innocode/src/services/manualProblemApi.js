// store/manualProblemApi.js
import { api } from "./api" // base RTK Query API slice
import toast from "react-hot-toast"

export const manualProblemApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchRubric: builder.query({
      query: (roundId) => `rounds/${roundId}/rubric`,

      providesTags: (result) => {
        const criteria = result?.data?.criteria || []

        return [
          ...criteria.map((c) => ({
            type: "Rubric",
            id: c.rubricId,
          })),
          { type: "Rubric", id: "LIST" },
        ]
      },
    }),

    // Fetch Rubric Template
    fetchRubricTemplate: builder.query({
      query: () => `rubrics/template`,
      transformResponse: (response) => response.data, // returns the URL
    }),

    // Import Rubric CSV
    importRubricCsv: builder.mutation({
      query: ({ roundId, file, contestId }) => {
        const formData = new FormData()
        formData.append("roundId", roundId) // keep this if backend needs it
        formData.append("csvFile", file) // <-- use "csvFile" like MCQ

        return {
          url: `rounds/${roundId}/rubric/import-csv`,
          method: "POST",
          body: formData,
          // DO NOT set Content-Type; fetch sets it automatically for multipart/form-data
        }
      },
      invalidatesTags: (result, error, { roundId, contestId }) => [
        { type: "Rubric", id: "LIST" },
        { type: "PublishCheck", id: contestId },
      ],
    }),

    // Update existing criteria
    updateRubric: builder.mutation({
      query: ({ roundId, criteria }) => ({
        url: `rounds/${roundId}/rubric`,
        method: "PUT",
        body: { criteria },
      }),
      invalidatesTags: (result, error, { roundId }) => [
        { type: "Rubric", id: "LIST" },
      ],
    }),

    // Create new criteria
    createRubric: builder.mutation({
      query: ({ roundId, criteria, contestId }) => ({
        url: `rounds/${roundId}/rubric`,
        method: "POST",
        body: { criteria },
      }),
      invalidatesTags: (result, error, { roundId, contestId }) => [
        { type: "Rubric", id: "LIST" },
        { type: "PublishCheck", id: contestId },
      ],
    }),

    deleteCriterion: builder.mutation({
      query: ({ roundId, rubricId, contestId }) => ({
        url: `rounds/${roundId}/rubric/${rubricId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { roundId, rubricId, contestId }) => [
        // 2. Invalidate the generic list (handles 2 -> 1 items)
        { type: "Rubric", id: "LIST" },

        // 3. Invalidate the SPECIFIC item (Fixes the 1 -> 0 item bug) 👇
        { type: "Rubric", id: rubricId },

        // Existing check
        { type: "PublishCheck", id: contestId },
      ],
    }),

    fetchOrganizerManualResults: builder.query({
      query: ({
        roundId,
        studentNameSearch = "",
        teamNameSearch = "",
        pageNumber = 1,
        pageSize = 10,
      }) => ({
        url: `rounds/${roundId}/manual-test/results`,
        params: { pageNumber, pageSize, studentNameSearch, teamNameSearch },
      }),
      providesTags: (result, error, { roundId }) => [
        { type: "Results", id: roundId },
      ],
    }),

    getManualTestResultBySubmissionId: builder.query({
      query: ({ roundId, submissionId }) => ({
        url: `rounds/${roundId}/manual-test/submissions/${submissionId}`,
      }),
      providesTags: (result, error, { roundId, submissionId }) => [
        { type: "Results", id: roundId },
        { type: "Results", id: submissionId },
      ],
      transformResponse: (response) => {
        return response?.data || response;
      },
    }),

    fetchManualResults: builder.query({
      query: ({ roundId, search, pageNumber = 1, pageSize = 10 }) => ({
        url: `rounds/${roundId}/manual-test/my-result`,
        params: { pageNumber, pageSize, ...search },
      }),
      transformResponse: (response) => ({
        results: response.data,
        pagination: response.additionalData,
        message: response.message,
      }),
      providesTags: (result, error, { roundId }) => [
        { type: "Results", id: roundId },
      ],
    }),

    // Save manual submission (file upload)
    saveManualSubmission: builder.mutation({
      query: ({ roundId, file }) => {
        const formData = new FormData()
        formData.append("file", file)

        return {
          url: `rounds/${roundId}/manual-test/submissions`,
          method: "POST",
          body: formData,
        }
      },
      invalidatesTags: (result, error, { roundId }) => [
        { type: "Results", id: roundId },
        { type: "ManualSubmission", id: roundId },
      ],
      transformResponse: (response) => response.data, // Extract data from response
    }),

    // Finish round (submit final)
    finishRound: builder.mutation({
      query: (roundId) => ({
        url: `rounds/${roundId}/finish`,
        method: "POST",
      }),
      invalidatesTags: (result, error, roundId) => [
        { type: "Results", id: roundId },
        { type: "ManualSubmission", id: roundId },
      ],
      transformResponse: (response) => response.data,
    }),

    // Submit null submission for manual round
    submitNullSubmission: builder.mutation({
      query: (roundId) => ({
        url: `rounds/${roundId}/manual/null-submission`,
        method: "POST",
      }),
      invalidatesTags: (result, error, roundId) => [
        { type: "Results", id: roundId },
        { type: "ManualSubmission", id: roundId },
      ],
      transformResponse: (response) => response.data,
    }),
  }),
})

export const {
  useFetchRubricQuery,
  useFetchRubricTemplateQuery,
  useImportRubricCsvMutation,
  useUpdateRubricMutation,
  useCreateRubricMutation,
  useDeleteCriterionMutation,
  useFetchManualResultsQuery,
  useFetchOrganizerManualResultsQuery,
  useGetManualTestResultBySubmissionIdQuery,
  useSaveManualSubmissionMutation,
  useFinishRoundMutation,
  useSubmitNullSubmissionMutation,
} = manualProblemApi
