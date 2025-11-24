import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const contestApi = createApi({
  reducerPath: "contestApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://innocode-challenge-api.onrender.com/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token")
      if (token && token !== "null") {
        headers.set("Authorization", `Bearer ${token}`)
      }
      headers.set("Content-Type", "application/json")
      return headers
    },
  }),
  tagTypes: ["Contests"],
  endpoints: (builder) => ({
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
      ],
    }),
    deleteContest: builder.mutation({
      query: ({ id }) => ({ url: `contests/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Contests", id: "LIST" }],
    }),
    checkPublishReady: builder.query({
      query: (id) => `contests/${id}/check`,
      providesTags: (result, error, id) => [{ type: "Contests", id }],
    }),
    publishContest: builder.mutation({
      query: (id) => ({ url: `contests/${id}/publish`, method: "PUT" }),
      invalidatesTags: (result, error, id) => [
        { type: "Contests", id },
        { type: "Contests", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetOrganizerContestsQuery,
  useGetContestByIdQuery,
  useAddContestMutation,
  useUpdateContestMutation,
  useDeleteContestMutation,
  useCheckPublishReadyQuery,
  usePublishContestMutation,
} = contestApi
