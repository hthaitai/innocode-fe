import { api } from "./api";

export const leaderboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTeamsByContestId: builder.query({
      query: (id) => `leaderboard-entries/contests/${id}/teams`,
      transformResponse: (response) => {
        // Response 1: data là array teams trực tiếp
        if (Array.isArray(response.data)) {
          // Normalize to object format with teams array
          return {
            teams: response.data,
            snapshotAt: null, // Response 1 doesn't have this
            contestId: null,
            contestName: null,
          };
        }

        // Response 2: data là object có teamIdList
        if (
          response.data?.teamIdList &&
          Array.isArray(response.data.teamIdList)
        ) {
          return {
            teams: response.data.teamIdList,
            snapshotAt: response.data.snapshotAt || null,
            contestId: response.data.contestId || null,
            contestName: response.data.contestName || null,
          };
        }

        // Fallback: try other structures
        const teams =
          response.data?.entries ||
          response.data?.teams ||
          response.data?.teamIdList ||
          (Array.isArray(response.data) ? response.data : []);

        return {
          teams: Array.isArray(teams) ? teams : [],
          snapshotAt: response.data?.snapshotAt || null,
          contestId: response.data?.contestId || null,
          contestName: response.data?.contestName || null,
        };
      },
      providesTags: (result, error, id) => [{ type: "Leaderboard", id }],
    }),
  }),
});
export const { useGetTeamsByContestIdQuery } = leaderboardApi;
