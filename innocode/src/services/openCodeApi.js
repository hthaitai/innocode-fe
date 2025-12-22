import { api } from "./api"
export const openCodeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOpenCode: builder.query({
      query: (roundId) => ({
        url: `rounds/${roundId}/open-code`,
      }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, roundId) => [
        { type: "OpenCode", id: roundId },
      ],
    }),

    generateOpenCode: builder.mutation({
      query: (roundId) => ({
        url: `rounds/${roundId}/open-code/generate`,
        method: "POST",
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, roundId) => [
        { type: "OpenCode", id: roundId },
      ],
    }),
  }),
})

export const { useGetOpenCodeQuery, useGenerateOpenCodeMutation } = openCodeApi
