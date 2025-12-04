// store/manualProblemApi.js
import { api } from "./api" // base RTK Query API slice
import toast from "react-hot-toast"

export const manualProblemApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchRubric: builder.query({
      query: (roundId) => `rounds/${roundId}/rubric`,
      providesTags: (result, error, roundId) => [
        { type: "Rubric", id: roundId },
      ],
      transformResponse: (response) => response.data.criteria || [],
    }),

    // Fetch Rubric Template
    fetchRubricTemplate: builder.query({
      query: () => `rubrics/template`,
      transformResponse: (response) => response.data, // returns the URL
    }),

    // Import Rubric CSV
    importRubricCsv: builder.mutation({
      query: ({ roundId, file }) => {
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
      invalidatesTags: (result, error, { roundId }) => [
        { type: "Rubric", id: roundId },
      ],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch {
          toast.error("Failed to import rubric CSV")
        }
      },
    }),

    // Update existing criteria
    updateRubric: builder.mutation({
      query: ({ roundId, criteria }) => ({
        url: `rounds/${roundId}/rubric`,
        method: "PUT",
        body: { criteria },
      }),
      invalidatesTags: (result, error, { roundId }) => [
        { type: "Rubric", id: roundId },
      ],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled
          toast.success("Rubric updated")
        } catch {
          toast.error("Failed to update rubric")
        }
      },
    }),

    // Create new criteria
    createRubric: builder.mutation({
      query: ({ roundId, criteria }) => ({
        url: `rounds/${roundId}/rubric`,
        method: "POST",
        body: { criteria },
      }),
      invalidatesTags: (result, error, { roundId }) => [
        { type: "Rubric", id: roundId },
      ],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled
          toast.success("Rubric created")
        } catch {
          toast.error("Failed to create rubric")
        }
      },
    }),

    deleteCriterion: builder.mutation({
      query: ({ roundId, rubricId }) => ({
        url: `rounds/${roundId}/rubric/${rubricId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { roundId }) => [
        { type: "Rubric", id: roundId },
      ],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch {
          toast.error("Failed to delete criterion")
        }
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
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: `rounds/${roundId}/manual-test/submissions`,
          method: "POST",
          body: formData,
        };
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
  useSaveManualSubmissionMutation,
  useFinishRoundMutation,
} = manualProblemApi
