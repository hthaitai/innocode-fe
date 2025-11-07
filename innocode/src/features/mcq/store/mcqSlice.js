import { createSlice } from "@reduxjs/toolkit"
import { fetchRoundMcqs } from "./mcqThunk"

const initialState = {
  roundId: null, // current round being viewed
  mcqs: [], // questions + options
  pagination: {
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  }, // pageNumber, pageSize, totalPages, etc.
  loading: false,
  error: null,
}

const mcqSlice = createSlice({
  name: "mcq",
  initialState,
  reducers: {
    clearMcqs: (state) => {
      state.roundId = null
      state.mcqs = []
      state.loading = false
      state.error = null
      state.pagination = {}
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoundMcqs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRoundMcqs.fulfilled, (state, action) => {
        const data = action.payload
        state.loading = false
        state.error = null
        if (data?.data?.length) {
          state.roundId = data.data[0].roundId
          // Flatten mcqTests -> questions for easier display
          state.mcqs = data.data[0].mcqTests.flatMap((test) => test.questions)
        } else {
          state.mcqs = []
          state.roundId = null
        }
        state.pagination = data?.additionalData || {}
      })
      .addCase(fetchRoundMcqs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to load MCQs"
      })
  },
})

export const { clearMcqs } = mcqSlice.actions
export default mcqSlice.reducer
