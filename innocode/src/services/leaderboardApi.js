import { api } from "./api"

export const leaderboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTeamsByContestId: builder.query({
      query: (id) => `leaderboard-entries/contests/${id}/teams`,
      transformResponse: (response) => {
        // Handle different response structures
        // If response.data is an array, wrap it in { teams: [...] }
        if (Array.isArray(response.data)) {
          return {
            teams: response.data,
          };
        }
        // If response.data is already an object with teams/entries/teamIdList, return it as is
        if (response.data && typeof response.data === "object") {
          return response.data;
        }
        // If response itself is an array (fallback)
        if (Array.isArray(response)) {
          return {
            teams: response,
          };
        }
        // Default: return response.data or empty object
        return response.data || { teams: [] };
      },
      providesTags: (result, error, id) => [{ type: "Leaderboard", id }],
    }),

    getLeaderboardByContest: builder.query({
      query: ({ contestId, pageNumber = 1, pageSize = 10 }) => ({
        url: `leaderboard-entries/${contestId}`,
        params: { pageNumber, pageSize },
      }),
      providesTags: (result, error, { contestId }) => [
        { type: "Leaderboard", id: contestId },
      ],
    }),
  }),
})

export const { useGetTeamsByContestIdQuery, useGetLeaderboardByContestQuery } =
  leaderboardApi
