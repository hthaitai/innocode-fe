import { api } from "./api"

export const contestJudgeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getJudgesToInvite: builder.query({
      query: ({ contestId, page, pageSize }) => ({
        url: `/judges`,
        method: "GET",
        params: { contestId, page, pageSize },
      }),
      providesTags: ["JudgesInvite"],
    }),

    getJudgeInvitesByContest: builder.query({
      query: ({ contestId, ...params }) => ({
        url: `/contests/${contestId}/judge-invites`,
        method: "GET",
        params,
      }),
      providesTags: ["JudgesInvite"],
    }),

    inviteJudgeToContest: builder.mutation({
      query: ({ contestId, judgeUserId, ttlDays }) => ({
        url: `/contests/${contestId}/judge-invites`,
        method: "POST",
        body: { judgeUserId, ttlDays },
      }),
      invalidatesTags: ["JudgesInvite"],
    }),

    resendJudgeInvite: builder.mutation({
      query: ({ contestId, inviteId }) => ({
        url: `/contests/${contestId}/judge-invites/${inviteId}/resend`,
        method: "POST",
      }),
      invalidatesTags: ["JudgesInvite"],
    }),

    revokeJudgeInvite: builder.mutation({
      query: ({ contestId, inviteId }) => ({
        url: `/contests/${contestId}/judge-invites/${inviteId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["JudgesInvite"],
    }),

    getContestJudges: builder.query({
      query: (contestId) => ({
        url: `/contests/${contestId}/judges`,
        method: "GET",
      }),
      providesTags: ["JudgesInvite"],
    }),

    acceptJudgeInvite: builder.mutation({
      query: ({ inviteCode, email }) => ({
        url: "judge-invites/accept",
        method: "POST",
        params: { inviteCode, email },
      }),
      invalidatesTags: ["JudgesInvite", { type: "JudgeContests", id: "LIST" }],
    }),

    declineJudgeInvite: builder.mutation({
      query: ({ inviteCode, email }) => ({
        url: "judge-invites/decline",
        method: "POST",
        params: { inviteCode, email },
      }),
      invalidatesTags: ["JudgesInvite", { type: "JudgeContests", id: "LIST" }],
    }),
  }),
})

export const {
  useGetJudgesToInviteQuery,
  useGetJudgeInvitesByContestQuery,
  useGetContestJudgesQuery,
  useInviteJudgeToContestMutation,
  useResendJudgeInviteMutation,
  useRevokeJudgeInviteMutation,
  useAcceptJudgeInviteMutation,
  useDeclineJudgeInviteMutation,
} = contestJudgeApi
