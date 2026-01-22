import { api } from "./api"

export const contestApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllContests: builder.query({
      query: ({ pageNumber = 1, pageSize = 10, nameSearch }) => ({
        url: "contests",
        params: { pageNumber, pageSize, nameSearch },
      }),
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map((contest) => ({
                type: "Contests",
                id: contest.contestId,
              })),
              { type: "Contests", id: "LIST" },
            ]
          : [{ type: "Contests", id: "LIST" }],
    }),

    getOrganizerContests: builder.query({
      query: ({ pageNumber = 1, pageSize = 10, nameSearch = "" }) => ({
        url: "contests/my-contests",
        params: { pageNumber, pageSize, nameSearch },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((contest) => ({
                type: "Contests",
                id: contest.contestId,
              })),
              { type: "Contests", id: "LIST" },
            ]
          : [{ type: "Contests", id: "LIST" }],
    }),
    getMyContests: builder.query({
      query: ({ pageNumber = 1, pageSize = 10, nameSearch = "" }) => ({
        url: "contests/participation",
        params: { pageNumber, pageSize, nameSearch },
      }),
      transformResponse: (response) => response.data,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((contest) => ({
                type: "Contests",
                id: contest.contestId,
              })),
              { type: "Contests", id: "LIST" },
            ]
          : [{ type: "Contests", id: "LIST" }],
    }),
    getJudgeContests: builder.query({
      query: ({ pageNumber = 1, pageSize = 10, nameSearch = "" }) => ({
        url: "contests/participation",
        params: { pageNumber, pageSize, nameSearch },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((contest) => ({
                type: "Contests",
                id: contest.contestId,
              })),
              { type: "JudgeContests", id: "LIST" },
            ]
          : [{ type: "JudgeContests", id: "LIST" }],
      refetchOnMountOrArgChange: true,
    }),

    getContestById: builder.query({
      query: (id) => `contests/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: "Contests", id }],
    }),
    addContest: builder.mutation({
      query: (data) => ({
        url: "contests/advanced",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Contests", id: "LIST" }],
    }),
    updateContest: builder.mutation({
      query: ({ id, data }) => ({
        url: `contests/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Contests", id },
        { type: "Contests", id: "LIST" },
        { type: "PublishCheck", id },
      ],
    }),
    deleteContest: builder.mutation({
      query: ({ id }) => ({ url: `contests/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Contests", id: "LIST" }],
    }),
    checkPublishReady: builder.query({
      query: (id) => `contests/${id}/check`,
      providesTags: (result, error, id) => [{ type: "PublishCheck", id }],
    }),
    publishContest: builder.mutation({
      query: (id) => ({ url: `contests/${id}/publish`, method: "PUT" }),
      invalidatesTags: (result, error, id) => [
        { type: "Contests", id },
        { type: "Contests", id: "LIST" },
      ],
    }),
    startContestNow: builder.mutation({
      query: (id) => ({
        url: `contests/${id}/start-now`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Contests", id },
        { type: "Contests", id: "LIST" },
      ],
    }),
    endContestNow: builder.mutation({
      query: (id) => ({
        url: `contests/${id}/end-now`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Contests", id },
        { type: "Contests", id: "LIST" },
      ],
    }),
    startRegistrationNow: builder.mutation({
      query: (id) => ({
        url: `contests/${id}/start-registration-now`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Contests", id },
        { type: "Contests", id: "LIST" },
      ],
    }),
    endRegistrationNow: builder.mutation({
      query: (id) => ({
        url: `contests/${id}/end-registration-now`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Contests", id },
        { type: "Contests", id: "LIST" },
      ],
    }),
    cancelContest: builder.mutation({
      query: (id) => ({
        url: `contests/${id}/cancel`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Contests", id },
        { type: "Contests", id: "LIST" },
      ],
    }),
    getContestReport: builder.query({
      query: (id) => `contests/${id}/report`,
      transformResponse: (response) => response.data,
    }),
    getContestTimeline: builder.query({
      query: (id) => `contests/${id}/timeline`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: "Contests", id }],
    }),
    getMentorReport: builder.query({
      query: (id) => `contests/${id}/mentor-report`,
      transformResponse: (response) => response.data,
    }),
  }),
})

export const {
  useGetAllContestsQuery,
  useGetOrganizerContestsQuery,
  useGetJudgeContestsQuery,
  useGetContestByIdQuery,
  useAddContestMutation,
  useUpdateContestMutation,
  useDeleteContestMutation,
  useCheckPublishReadyQuery,
  usePublishContestMutation,
  useStartContestNowMutation,
  useEndContestNowMutation,
  useStartRegistrationNowMutation,
  useEndRegistrationNowMutation,
  useCancelContestMutation,
  useLazyGetContestReportQuery,
  useGetMyContestsQuery,
  useGetContestTimelineQuery,
  useLazyGetMentorReportQuery,
} = contestApi
