import { api } from "./api"

export const contestJudgeApi = api.injectEndpoints({
  endpoints: (builder) => ({
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
  useGetJudgesByContestQuery,
  useAssignJudgeMutation,
  useRemoveJudgeMutation,
  useGetMyJudgingContestsQuery,
  useGetContestsByJudgeQuery,
} = contestJudgeApi
