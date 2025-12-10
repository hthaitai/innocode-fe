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

    getJudgesByContest: builder.query({
      query: (contestId) => `contest-judges/${contestId}/judges`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, contestId) =>
        result
          ? [
              ...result.map((judge) => ({
                type: "ContestJudges",
                id: `${contestId}-${judge.judgeId}`,
              })),
              { type: "ContestJudges", id: `CONTEST-${contestId}` },
            ]
          : [{ type: "ContestJudges", id: `CONTEST-${contestId}` }],
    }),

    assignJudge: builder.mutation({
      query: (body) => ({
        url: "contest-judges/participate",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { contestId }) => [
        { type: "ContestJudges", id: `CONTEST-${contestId}` },
      ],
    }),

    removeJudge: builder.mutation({
      query: (body) => ({
        url: "contest-judges/leave",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { contestId }) => [
        { type: "ContestJudges", id: `CONTEST-${contestId}` },
      ],
    }),

    getMyJudgingContests: builder.query({
      query: () => "contest-judges/my-contests",
      transformResponse: (res) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((contest) => ({
                type: "JudgeContests",
                id: contest.contestId,
              })),
              { type: "JudgeContests", id: "LIST" },
            ]
          : [{ type: "JudgeContests", id: "LIST" }],
    }),

    getContestsByJudge: builder.query({
      query: (judgeId) => `contest-judges/judge/${judgeId}/contests`,
      transformResponse: (res) => res.data,
      providesTags: (result, error, judgeId) =>
        result
          ? [
              ...result.map((contest) => ({
                type: "JudgeContests",
                id: `${judgeId}-${contest.contestId}`,
              })),
              { type: "JudgeContests", id: `JUDGE-${judgeId}` },
            ]
          : [{ type: "JudgeContests", id: `JUDGE-${judgeId}` }],
    }),
  }),
})

export const {
  useGetJudgesToInviteQuery,
  useInviteJudgeToContestMutation,
  useGetJudgeInvitesByContestQuery,
  useGetJudgesByContestQuery,
  useAssignJudgeMutation,
  useRemoveJudgeMutation,
  useGetMyJudgingContestsQuery,
  useGetContestsByJudgeQuery,
} = contestJudgeApi
