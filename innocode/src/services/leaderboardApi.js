import { api } from "./api"

export const leaderboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTeamsByContestId: builder.query({
      query: (id) => `leaderboard-entries/contests/${id}/teams`,
      transformResponse: (response) => {
        return {
          teams: response.data,
        }
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
