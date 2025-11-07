import { createSlice } from "@reduxjs/toolkit"
import { fetchLeaderboardByContest } from "./leaderboardThunk"

const initialState = {
  entries: [],
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
        const raw = Array.isArray(payload.data) ? payload.data : []
        state.entries = raw.flatMap((entry) => {
          const teams = Array.isArray(entry.teamIdList) ? entry.teamIdList : []
          return teams.map((t) => ({
            entryId: entry.entryId,
            contestId: entry.contestId,
            contestName: entry.contestName,
            teamId: t.teamId,
            teamName: t.teamName,
            rank: t.rank,
            score: t.score,
            snapshotAt: entry.snapshotAt,
          }))
        })
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


