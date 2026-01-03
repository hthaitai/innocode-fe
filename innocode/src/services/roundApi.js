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
      query: (arg) => {
        // Support both old format (roundId string) and new format (object)
        const roundId = typeof arg === "string" ? arg : arg.roundId
        const openCode = typeof arg === "object" ? arg.openCode : undefined
        return {
          url: `rounds/${roundId}`,
          params: openCode ? { openCode } : {},
        }
      },
      transformResponse: (response) => response.data,
      providesTags: (result, error, arg) => {
        const roundId = typeof arg === "string" ? arg : arg.roundId
        return [{ type: "Rounds", id: roundId }]
      },
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
    startRoundNow: builder.mutation({
      query: (id) => ({
        url: `rounds/${id}/start-now`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Rounds", id }],
    }),
    endRoundNow: builder.mutation({
      query: (id) => ({
        url: `rounds/${id}/end-now`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Rounds", id }],
    }),
    uploadMockTest: builder.mutation({
      query: ({ roundId, file }) => {
        const formData = new FormData()
        formData.append("mockTestFile", file)
        return {
          url: `rounds/${roundId}/mock-test/upload`,
          method: "POST",
          body: formData,
        }
      },
      invalidatesTags: (result, error, { roundId }) => [
        { type: "Rounds", id: roundId },
      ],
    }),
    getRoundMockTestUrl: builder.query({
      query: (roundId) => `rounds/${roundId}/mock-test/download`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, roundId) => [
        { type: "Rounds", id: roundId },
      ],
    }),
    appealSubmitEnd: builder.mutation({
      query: (roundId) => ({
        url: `rounds/${roundId}/time-travel/appeal-submit-end`,
        method: "POST",
      }),
      invalidatesTags: (result, error, roundId) => [
        { type: "Rounds", id: roundId },
      ],
    }),
    appealReviewEnd: builder.mutation({
      query: (roundId) => ({
        url: `rounds/${roundId}/time-travel/appeal-review-end`,
        method: "POST",
      }),
      invalidatesTags: (result, error, roundId) => [
        { type: "Rounds", id: roundId },
      ],
    }),
    judgeDeadlineEnd: builder.mutation({
      query: (roundId) => ({
        url: `rounds/${roundId}/time-travel/judge-deadline-end`,
        method: "POST",
      }),
      invalidatesTags: (result, error, roundId) => [
        { type: "Rounds", id: roundId },
      ],
    }),
    finalizeRound: builder.mutation({
      query: (roundId) => ({
        url: `rounds/${roundId}/time-travel/finalize`,
        method: "POST",
      }),
      invalidatesTags: (result, error, roundId) => [
        { type: "Rounds", id: roundId },
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
  useStartRoundNowMutation,
  useEndRoundNowMutation,
  useUploadMockTestMutation,
  useGetRoundMockTestUrlQuery,
  useAppealSubmitEndMutation,
  useAppealReviewEndMutation,
  useJudgeDeadlineEndMutation,
  useFinalizeRoundMutation,
} = roundApi
