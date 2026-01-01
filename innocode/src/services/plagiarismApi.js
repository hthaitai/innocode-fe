import { api } from "./api"

export const plagiarismApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPlagiarismQueue: builder.query({
      query: ({
        contestId,
        pageNumber = 1,
        pageSize = 20,
        teamName,
        studentName,
      }) => ({
        url: "organizer/plagiarism/queue",
        method: "GET",
        params: { contestId, pageNumber, pageSize, teamName, studentName },
      }),

      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map((item) => ({
                type: "Plagiarism",
                id: item.submissionId,
              })),
              { type: "Plagiarism", id: "QUEUE" },
            ]
          : [{ type: "Plagiarism", id: "QUEUE" }],
    }),

    getPlagiarismDetail: builder.query({
      query: (submissionId) => ({
        url: `organizer/plagiarism/${submissionId}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data || response,
      providesTags: (result, error, submissionId) => [
        { type: "Plagiarism", id: submissionId },
      ],
    }),

    approvePlagiarism: builder.mutation({
      query: (submissionId) => ({
        url: `organizer/plagiarism/${submissionId}/approve`,
        method: "POST",
      }),
      invalidatesTags: (result, error, submissionId) => [
        { type: "Plagiarism", id: submissionId },
        { type: "Plagiarism", id: "QUEUE" },
      ],
    }),

    denyPlagiarism: builder.mutation({
      query: (submissionId) => ({
        url: `organizer/plagiarism/${submissionId}/deny`,
        method: "POST",
      }),
      invalidatesTags: (result, error, submissionId) => [
        { type: "Plagiarism", id: submissionId },
        { type: "Plagiarism", id: "QUEUE" },
      ],
    }),
  }),
})

export const {
  useGetPlagiarismQueueQuery,
  useGetPlagiarismDetailQuery,
  useApprovePlagiarismMutation,
  useDenyPlagiarismMutation,
} = plagiarismApi
