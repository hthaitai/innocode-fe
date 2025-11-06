import { createSlice } from "@reduxjs/toolkit"
import {
  fetchContests,
  addContest,
  updateContest,
  deleteContest,
  publishContest,
  publishIfReady,
} from "./contestThunks"

const initialState = {
  contests: [],
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

const contestSlice = createSlice({
  name: "contests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH CONTESTS
      .addCase(fetchContests.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchContests.fulfilled, (state, action) => {
        state.loading = false
        // ✅ Handle different response structures safely
        state.contests = action.payload?.data || action.payload || []
        state.pagination = action.payload?.additionalData || state.pagination
      })
      .addCase(fetchContests.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ADD CONTEST
      .addCase(addContest.pending, (state) => {
        state.loading = true
      })
      .addCase(addContest.fulfilled, (state, action) => {
        state.loading = false
        state.contests.push(action.payload)
      })
      .addCase(addContest.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // UPDATE CONTEST
      .addCase(updateContest.pending, (state) => {
        state.loading = true
      })
      .addCase(updateContest.fulfilled, (state, action) => {
        state.loading = false
        state.contests = state.contests.map((c) =>
          c.contestId === action.payload.contestId ? action.payload : c
        )
      })
      .addCase(updateContest.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // DELETE CONTEST
      .addCase(deleteContest.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteContest.fulfilled, (state, action) => {
        state.loading = false
        state.contests = state.contests.filter(
          (c) => c.contestId !== action.payload
        )
      })
      .addCase(deleteContest.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // PUBLISH CONTEST
      .addCase(publishContest.fulfilled, (state, action) => {
        const updated = action.payload
        state.contests = state.contests.map((c) =>
          c.contestId === updated.contestId ? updated : c
        )
      })
      .addCase(publishContest.rejected, (state, action) => {
        state.error = action.payload
      })

      // PUBLISH CONTEST IF READY
      .addCase(publishIfReady.fulfilled, (state, action) => {
        const updated = action.payload
        state.contests = state.contests.map((c) =>
          c.contestId === updated.contestId ? updated : c
        )
      })
      .addCase(publishIfReady.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export default contestSlice.reducer
