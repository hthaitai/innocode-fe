import { api } from "./api"

export const teamApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTeams: builder.query({
      query: ({
        pageNumber = 1,
        pageSize = 10,
        contestId,
        schoolId,
        mentorId,
        search = "",
        sortBy = "createdAt",
        desc = true,
      }) => ({
        url: `contests/${contestId}/teams`,
        params: {
          pageNumber,
          pageSize,
          contestId,
          schoolId,
          mentorId,
          search,
          sortBy,
          desc,
        },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((team) => ({
                type: "Teams",
                id: team.teamId,
              })),
              { type: "Teams", id: "LIST" },
            ]
          : [{ type: "Teams", id: "LIST" }],
    }),

    getTeamById: builder.query({
      query: (teamId) => `teams/${teamId}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, teamId) => [{ type: "Teams", id: teamId }],
    }),

    getMyTeam: builder.query({
      query: () => "teams/me",
      transformResponse: (response) => {
        // Handle different response structures
        let teamsArray = []
        if (response.data) {
          if (Array.isArray(response.data)) {
            teamsArray = response.data
          } else if (response.data.data && Array.isArray(response.data.data)) {
            teamsArray = response.data.data
          } else if (
            typeof response.data === "object" &&
            !response.data.message
          ) {
            teamsArray = [response.data]
          }
        }
        return teamsArray
      },
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map((team) => ({
                type: "Teams",
                id: team.teamId || team.team_id || team.id,
              })),
              { type: "Teams", id: "MY_TEAM" },
            ]
          : [{ type: "Teams", id: "MY_TEAM" }],
    }),

    createTeam: builder.mutation({
      query: (data) => ({
        url: "teams",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "Teams", id: "LIST" },
        { type: "Teams", id: "MY_TEAM" },
      ],
    }),
  }),
})

export const {
  useGetTeamsQuery,
  useGetTeamByIdQuery,
  useGetMyTeamQuery,
  useCreateTeamMutation,
} = teamApi
