import { api } from "./api"

export const contestJudgeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getJudgesToInvite: builder.query({
      query: ({ contestId, page, pageSize }) => ({
        url: `/judges`,
        method: "GET",
        params: { contestId, page, pageSize },
      }),

      providesTags: (result, error, { contestId }) =>
        result?.data
          ? [
              ...result.data.map((judge) => ({
                type: "JudgesToInvite",
                id: `${contestId}-${judge.judgeId}`,
              })),
              { type: "JudgesToInvite", id: `CONTEST-${contestId}` },
            ]
          : [{ type: "JudgesToInvite", id: `CONTEST-${contestId}` }],
    }),

    inviteJudgeToContest: builder.mutation({
      query: ({ contestId, judgeUserId, ttlDays }) => ({
        url: `/contests/${contestId}/judge-invites`,
        method: "POST",
        body: { judgeUserId, ttlDays },
      }),

      invalidatesTags: (result, error, { contestId }) => [
        { type: "JudgesToInvite", id: `CONTEST-${contestId}` },
        { type: "JudgeInvites", id: `CONTEST-${contestId}` },
      ],
    }),

    getJudgeInvitesByContest: builder.query({
      query: ({ contestId, ...params }) => ({
        url: `/contests/${contestId}/judge-invites`,
        method: "GET",
        params,
      }),
      providesTags: (result, error, { contestId }) =>
        result?.data && Array.isArray(result.data)
          ? [
              ...result.data.map((invite) => ({
                type: "JudgeInvites",
                id: `${contestId}-${invite.inviteId}`,
              })),
              { type: "JudgeInvites", id: `CONTEST-${contestId}` },
            ]
          : [{ type: "JudgeInvites", id: `CONTEST-${contestId}` }],
    }),

    acceptJudgeInvite: builder.mutation({
      query: (inviteCode) => ({
        url: "judge-invites/accept",
        method: "POST",
        body: { inviteCode },
      }),
      invalidatesTags: [{ type: "JudgeInvites" }],
    }),

    declineJudgeInvite: builder.mutation({
      query: (inviteCode) => ({
        url: "judge-invites/decline",
        method: "POST",
        body: { inviteCode },
      }),
      invalidatesTags: [{ type: "JudgeInvites" }],
    }),

    resendJudgeInvite: builder.mutation({
      query: ({ contestId, inviteId }) => ({
        url: `/contests/${contestId}/judge-invites/${inviteId}/resend`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { contestId }) => [
        { type: "JudgeInvites", id: `CONTEST-${contestId}` },
      ],
    }),
  }),
})

export const {
  useGetJudgesToInviteQuery,
  useInviteJudgeToContestMutation,
  useGetJudgeInvitesByContestQuery,
  useAcceptJudgeInviteMutation,  
  useDeclineJudgeInviteMutation, 
  useResendJudgeInviteMutation,
} = contestJudgeApi
