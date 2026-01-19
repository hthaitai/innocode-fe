import { api } from "./api" // base RTK Query API slice
import toast from "react-hot-toast"

export const submissionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchManualSubmissions: builder.query({
      query: ({
        statusFilter = "Pending",
        pageNumber = 1,
        pageSize = 10,
        roundIdSearch,
      }) => ({
        url: `/submissions`,
        params: { statusFilter, pageNumber, pageSize, roundIdSearch },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((item) => ({
                type: "ManualSubmissions",
                id: item.submissionId,
              })),
              { type: "ManualSubmissions", id: "LIST" },
            ]
          : [{ type: "ManualSubmissions", id: "LIST" }],
    }),

    fetchSubmissionById: builder.query({
      query: (submissionId) => `/submissions/${submissionId}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, submissionId) => [
        { type: "ManualSubmissions", id: submissionId },
      ],
    }),

    downloadSubmission: builder.query({
      query: (submissionId) => `/submissions/${submissionId}/download`,
      transformResponse: (response) => response.data,
    }),

    evaluateSubmission: builder.mutation({
      query: ({ submissionId, criterionScores }) => ({
        url: `/submissions/${submissionId}/rubric-evaluation`,
        method: "POST",
        body: { criterionScores },
      }),
      invalidatesTags: (result, error, { submissionId }) => [
        { type: "ManualSubmissions", id: submissionId },
      ],
    }),

    transferSubmissions: builder.mutation({
      query: ({ roundId, judgeId }) => ({
        url: `/rounds/${roundId}/transfer-submissions/${judgeId}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "ManualSubmissions", id: "LIST" }],
    }),
  }),
})

export const {
  useFetchManualSubmissionsQuery,
  useFetchSubmissionByIdQuery,
  useDownloadSubmissionQuery,
  useLazyDownloadSubmissionQuery,
  useEvaluateSubmissionMutation,
  useTransferSubmissionsMutation,
} = submissionApi
