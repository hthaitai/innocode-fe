import { api } from "./api"

export const teamInviteApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTeamInvites: builder.query({
      query: (teamId) => `teams/${teamId}/invites`,
      transformResponse: (response) => {
        // Handle different response structures
        if (Array.isArray(response.data)) {
          return response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        return response.data || [];
      },
      providesTags: (result, error, teamId) => [
        { type: "TeamInvites", id: `TEAM_${teamId}` },
      ],
    }),
    inviteStudent: builder.mutation({
      query: ({ teamId, data }) => ({
        url: `teams/${teamId}/invites`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: "TeamInvites", id: `TEAM_${teamId}` },
        { type: "Teams", id: "MY_TEAM" },
      ],
    }),
    acceptInvite: builder.mutation({
      query: ({ token, email }) => ({
        url: "team-invites/accept",
        method: "POST",
        params: { token, email },
      }),
      invalidatesTags: [{ type: "Teams", id: "MY_TEAM" }],
    }),
    declineInvite: builder.mutation({
      query: ({ token, email }) => ({
        url: "team-invites/decline",
        method: "POST",
        params: { token, email },
      }),
      invalidatesTags: [{ type: "Teams", id: "MY_TEAM" }],
    }),
  }),
})

export const {
  useGetTeamInvitesQuery,
  useInviteStudentMutation,
  useAcceptInviteMutation,
  useDeclineInviteMutation,
} = teamInviteApi

