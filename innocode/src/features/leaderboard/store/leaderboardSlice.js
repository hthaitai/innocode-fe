import { createSlice } from "@reduxjs/toolkit"
import { fetchLeaderboardByContest } from "./leaderboardThunk"

const initialState = {
  entries: [],
  contestInfo: {
    contestName: null,
    contestId: null,
    totalTeamCount: 0,
    snapshotAt: null,
  },
  pagination: {
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  },
  loading: false,
  error: null,
}

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {
    updateLeaderboard: (state, action) => {
      state.entries = action.payload || []
    },
    updateTeamScore: (state, action) => {
      const { teamId, score, rank } = action.payload
      const entry = state.entries.find((e) => e.teamId === teamId)
      if (entry) {
        entry.score = score
        entry.rank = rank
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboardByContest.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLeaderboardByContest.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload || {}
        const data = payload.data || payload
        
        // Update contest info
        if (data) {
          state.contestInfo = {
            contestName: data.contestName || null,
            contestId: data.contestId || null,
            totalTeamCount: data.totalTeamCount || 0,
            snapshotAt: data.snapshotAt || null,
          }
        }
        
        // Map teams with members and round scores
        const teams = Array.isArray(data?.teamIdList) ? data.teamIdList : []
        state.entries = teams.map((t) => ({
          entryId: data?.entryId || null,
          contestId: data?.contestId || null,
          contestName: data?.contestName || null,
          teamId: t.teamId,
          teamName: t.teamName,
          rank: t.rank,
          score: t.score,
          members: Array.isArray(t.members) ? t.members.map((m) => ({
            memberId: m.memberId,
            memberName: m.memberName,
            memberRole: m.memberRole,
            totalScore: m.totalScore || 0,
            roundScores: Array.isArray(m.roundScores) ? m.roundScores : [],
          })) : [],
          snapshotAt: data?.snapshotAt || null,
        }))
        state.pagination = payload.additionalData || state.pagination
      })
      .addCase(fetchLeaderboardByContest.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { updateLeaderboard, updateTeamScore } = leaderboardSlice.actions
export default leaderboardSlice.reducer


