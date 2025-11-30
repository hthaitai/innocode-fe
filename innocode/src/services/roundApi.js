import { api } from "./api"

export const roundApi = api.injectEndpoints({
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
        headers: {}, 
      }),
      invalidatesTags: (result, error, { contestId }) => [
        { type: "Rounds", id: `LIST_${contestId}` },
        { type: "Contests", id: contestId },
        { type: "PublishCheck", id: contestId },
      ],
    }),

    updateRound: builder.mutation({
      query: ({ id, data }) => ({
        url: `rounds/${id}`,
        method: "PUT",
        body: data, 
        headers: {}, 
      }),
      invalidatesTags: (result, error, { id, contestId }) => [
        { type: "Rounds", id },
        { type: "Contests", id: contestId },
        { type: "PublishCheck", id: contestId },
      ],
    }),

    deleteRound: builder.mutation({
      query: (id) => ({
        url: `rounds/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id, contestId }) => [
        { type: "Rounds", id },
        { type: "Contests", id: contestId },
        { type: "PublishCheck", id: contestId },
      ],
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
