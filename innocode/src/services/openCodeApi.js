import { api } from "./api";
export const openCodeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOpenCode: builder.query({
      query: (roundId) => ({
        url: `rounds/${roundId}/open-code`,
      }),
    }),
    generateOpenCode: builder.mutation({
      query: (roundId) => ({
        url: `rounds/${roundId}/open-code/generate`,
        method: "POST",
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetOpenCodeQuery, useGenerateOpenCodeMutation } = openCodeApi;
