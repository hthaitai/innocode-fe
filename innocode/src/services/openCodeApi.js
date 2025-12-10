import { api } from "./api";
export const openCodeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOpenCode: builder.query({
      query: (roundId) => ({
        url: `rounds/${roundId}/open-code`,
      }),
    }),
  }),
});

export const { useGetOpenCodeQuery } = openCodeApi;
