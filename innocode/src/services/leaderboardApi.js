import { api } from "./api";

export const leaderboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTeamsByContestId: builder.query({
      query: (id) => `leaderboard-entries/contests/${id}/teams`,
      transformResponse: (response) => {
        return {
          teams: response.data,
        };
      },
      providesTags: (result, error, id) => [{ type: "Leaderboard", id }],
    }),
  }),
});
export const { useGetTeamsByContestIdQuery } = leaderboardApi;
