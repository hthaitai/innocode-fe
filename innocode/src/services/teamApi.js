import { api } from "./api"

export const teamApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTeams: builder.query({
      query: ({
        pageNumber = 1,
        pageSize = 20,
        contestId,
        schoolId,
        mentorId,
        search = "",
        sortBy = "createdAt",
        desc = true,
      }) => ({
        url: "teams",
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
  }),
})

export const { useGetTeamsQuery } = teamApi
