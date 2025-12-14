import { api } from "./api"

export const contestApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllContests: builder.query({
      query: ({ pageNumber = 1, pageSize = 10 } = {}) => ({
        url: "contests",
        params: { pageNumber, pageSize },
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
      query: ({ pageNumber = 1, pageSize = 10 }) => ({
        url: "contests/my-contests",
        params: { pageNumber, pageSize },
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
  }),
})

export const {
  useGetAllContestsQuery,
  useGetOrganizerContestsQuery,
  useGetContestByIdQuery,
  useAddContestMutation,
  useUpdateContestMutation,
  useDeleteContestMutation,
  useCheckPublishReadyQuery,
  usePublishContestMutation,
  useStartContestNowMutation,
  useEndContestNowMutation,
} = contestApi
