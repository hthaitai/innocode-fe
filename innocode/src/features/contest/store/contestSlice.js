import { createSlice } from "@reduxjs/toolkit"
import {
  fetchAllContests,
  fetchOrganizerContests,
  addContest,
  updateContest,
  deleteContest,
  checkPublishReady,
  publishContest,
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
  reducers: {
    clearContests: (state) => {
      state.contests = []
      state.pagination = initialState.pagination
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // --- Shared handler for both fetch types ---
    const handleFetch = (builder, thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading = false
          state.contests = action.payload?.data || action.payload || []
          state.pagination = action.payload?.additionalData || state.pagination
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false
          state.error = action.payload
        })
    }

    // --- Fetches ---
    handleFetch(builder, fetchAllContests)
    handleFetch(builder, fetchOrganizerContests)

    // --- Add ---
    builder
      .addCase(addContest.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addContest.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(addContest.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // --- Update ---
    builder
      .addCase(updateContest.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateContest.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateContest.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // --- Delete ---
    builder
      .addCase(deleteContest.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteContest.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(deleteContest.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // --- Check Publish Readiness ---
    builder
      .addCase(checkPublishReady.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(checkPublishReady.fulfilled, (state, action) => {
        state.loading = false
        state.publishCheck = action.payload?.data || null
      })
      .addCase(checkPublishReady.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // --- Publish Contest ---
    builder
      .addCase(publishContest.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(publishContest.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(publishContest.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearContests } = contestSlice.actions
export default contestSlice.reducer
