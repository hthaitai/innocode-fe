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
      .addCase(fetchContests.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchContests.fulfilled, (state, action) => {
        state.loading = false
        state.contests = action.payload.data
        state.pagination = action.payload.additionalData
      })
      .addCase(fetchContests.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(addContest.pending, (state) => {
        state.loading = true
      })
      .addCase(addContest.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(addContest.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(updateContest.pending, (state) => {
        state.loading = true
      })
      .addCase(updateContest.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateContest.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(deleteContest.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteContest.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(deleteContest.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(publishContest.fulfilled, () => {})
      .addCase(publishContest.rejected, (state, action) => {
        state.error = action.payload
      })

      .addCase(publishIfReady.fulfilled, () => {})
      .addCase(publishIfReady.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export default contestSlice.reducer
