import { createSlice } from "@reduxjs/toolkit"
import { fetchRoundMcqs, fetchBanks, createTest } from "./mcqThunk"

const initialState = {
  roundId: null, // current round being viewed
  testId: null, // current test ID from mcqTests
  mcqs: [], // questions + options
  banks: [], // question banks
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
      state.testId = null
      state.mcqs = []
      state.loading = false
      state.error = null
      state.pagination = {
        pageNumber: 1,
        pageSize: 10,
        totalPages: 1,
        totalCount: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      }
    },
    clearBanks: (state) => {
      state.banks = []
      state.loading = false
      state.error = null
      state.pagination = {
        pageNumber: 1,
        pageSize: 10,
        totalPages: 1,
        totalCount: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      }
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
          // Extract testId from the first mcqTest if available
          const firstTest = data.data[0].mcqTests?.[0]
          state.testId = firstTest?.testId || null
          // Flatten mcqTests -> questions for easier display
          state.mcqs = data.data[0].mcqTests.flatMap((test) => test.questions)
        } else {
          state.mcqs = []
          state.roundId = null
          state.testId = null
        }
        state.pagination = data?.additionalData || {
          pageNumber: 1,
          pageSize: 10,
          totalPages: 1,
          totalCount: 0,
          hasPreviousPage: false,
          hasNextPage: false,
        }
      })
      .addCase(fetchRoundMcqs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.Message || "Failed to load MCQs"
      })
      .addCase(fetchBanks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBanks.fulfilled, (state, action) => {
        const data = action.payload
        state.loading = false
        state.error = null
        state.banks = data?.data || []
        state.pagination = data?.additionalData || {
          pageNumber: 1,
          pageSize: 10,
          totalPages: 1,
          totalCount: 0,
          hasPreviousPage: false,
          hasNextPage: false,
        }
      })
      .addCase(fetchBanks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.Message || "Failed to load banks"
      })
      .addCase(createTest.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createTest.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(createTest.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.Message || "Failed to create test"
      })
  },
})

export const { clearMcqs, clearBanks } = mcqSlice.actions
export default mcqSlice.reducer
