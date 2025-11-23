import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const roundApi = createApi({
  reducerPath: "roundApi",
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
  tagTypes: ["Rounds"],
  endpoints: (builder) => ({
    getRoundsByContestId: builder.query({
      query: (contestId) => ({
        url: "rounds",
        params: { contestIdSearch: contestId },
      }),
      providesTags: (result, error, contestId) =>
        result?.data
          ? [
              ...result.data.map((round) => ({
                type: "Rounds",
                id: round.roundId,
              })),
              { type: "Rounds", id: `LIST_${contestId}` },
            ]
          : [{ type: "Rounds", id: `LIST_${contestId}` }],
    }),
    getRoundById: builder.query({
      query: (roundId) => `rounds/${roundId}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, roundId) => [
        { type: "Rounds", id: roundId },
      ],
    }),
    createRound: builder.mutation({
      query: ({ contestId, data }) => ({
        url: `rounds/${contestId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { contestId }) => [
        { type: "Rounds", id: `LIST_${contestId}` },
      ],
    }),
    updateRound: builder.mutation({
      query: ({ id, data }) => ({
        url: `rounds/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Rounds", id }],
    }),
    deleteRound: builder.mutation({
      query: (id) => ({
        url: `rounds/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Rounds", id }],
    }),
  }),
})

export const {
  useGetRoundsByContestIdQuery,
  useGetRoundByIdQuery,
  useCreateRoundMutation,
  useUpdateRoundMutation,
  useDeleteRoundMutation,
} = roundApi
