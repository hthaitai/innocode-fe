import { createAsyncThunk } from "@reduxjs/toolkit"
import { leaderboardService } from "@/features/leaderboard/services/leaderboardService"
import { handleThunkError } from "@/shared/utils/handleThunkError"

export const fetchLeaderboardByContest = createAsyncThunk(
  "leaderboard/fetchByContest",
  async (
    { contestId, pageNumber = 1, pageSize = 10 } = {},
    { rejectWithValue }
  ) => {
    try {
      const data = await leaderboardService.getAllByContestId(contestId, {
        pageNumber,
        pageSize,
      })
      return data
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)


