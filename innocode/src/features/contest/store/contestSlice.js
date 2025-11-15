import { createSlice } from "@reduxjs/toolkit"
import {
  fetchAllContests,
  fetchOrganizerContests,
  addContest,
  updateContest,
  deleteContest,
  checkPublishReady,
  publishContest,
  fetchContestById,
} from "./contestThunks"

const initialState = {
  contests: [],
  contest: null,
  pagination: {
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  },

  // Separate loading states
  listLoading: false,
  detailLoading: false,
  actionLoading: false,

  // Mirrored error states
  listError: null,
  detailError: null,
  actionError: null,
}

const contestSlice = createSlice({
  name: "contests",
  initialState,
  reducers: {
    clearContests: (state) => {
      state.contests = []
      state.pagination = initialState.pagination
      state.listLoading = false
      state.detailLoading = false
      state.actionLoading = false
      state.listError = null
      state.detailError = null
      state.actionError = null
    },
  },

  extraReducers: (builder) => {
    // --- Shared handler for fetching lists ---
    const handleListFetch = (builder, thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.listLoading = true
          state.listError = null
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.listLoading = false
          state.contests = action.payload?.data || action.payload || []
          state.pagination = action.payload?.additionalData || state.pagination
        })
        .addCase(thunk.rejected, (state, action) => {
          state.listLoading = false
          state.listError = action.payload
        })
    }

    handleListFetch(builder, fetchAllContests)
    handleListFetch(builder, fetchOrganizerContests)

    // --- Fetch single contest detail ---
    builder
      .addCase(fetchContestById.pending, (state) => {
        state.detailLoading = true
        state.detailError = null
      })
      .addCase(fetchContestById.fulfilled, (state, action) => {
        state.detailLoading = false
        state.contest = action.payload
      })
      .addCase(fetchContestById.rejected, (state, action) => {
        state.detailLoading = false
        state.detailError = action.payload
      })

    // --- Shared handler for create/update/delete/publish/check ---
    const handleAction = (thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.actionLoading = true
          state.actionError = null
        })
        .addCase(thunk.fulfilled, (state) => {
          state.actionLoading = false
        })
        .addCase(thunk.rejected, (state, action) => {
          state.actionLoading = false
          state.actionError = action.payload
        })
    }

    handleAction(addContest)
    handleAction(updateContest)
    handleAction(deleteContest)
    handleAction(publishContest)

    // Special case: check publish readiness
    builder
      .addCase(checkPublishReady.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
      })
      .addCase(checkPublishReady.fulfilled, (state, action) => {
        state.actionLoading = false
        state.publishCheck = action.payload?.data || null
      })
      .addCase(checkPublishReady.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload
      })
  },
})

export const { clearContests } = contestSlice.actions
export default contestSlice.reducer
