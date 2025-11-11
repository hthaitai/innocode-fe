import { createSlice } from "@reduxjs/toolkit"
import {
  fetchRoundTestCases,
  createRoundTestCase,
  updateRoundTestCases,
  deleteRoundTestCase,
  fetchAutoTestResults,
} from "./autoEvaluationThunks"

const initialPagination = {
  pageNumber: 1,
  pageSize: 10,
  totalPages: 1,
  totalCount: 0,
  hasPreviousPage: false,
  hasNextPage: false,
}

const initialState = {
  loading: false,
  error: null,
  testCases: [],
  testCasePagination: { ...initialPagination },
  results: [],
  resultsPagination: { ...initialPagination },
}

const autoEvaluationSlice = createSlice({
  name: "autoEvaluation",
  initialState,
  reducers: {
    clearAutoEvaluation(state) {
      state.testCases = []
      state.results = []
      state.testCasePagination = { ...initialPagination }
      state.resultsPagination = { ...initialPagination }
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch test cases
      .addCase(fetchRoundTestCases.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRoundTestCases.fulfilled, (state, action) => {
        state.loading = false
        state.testCases = action.payload?.items ?? action.payload?.data ?? []
        state.testCasePagination = action.payload?.pagination ??
          action.payload?.additionalData ?? { ...initialPagination }
      })
      .addCase(fetchRoundTestCases.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Create one test case
      .addCase(createRoundTestCase.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createRoundTestCase.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(createRoundTestCase.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Bulk update test cases
      .addCase(updateRoundTestCases.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateRoundTestCases.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateRoundTestCases.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Delete one test case
      .addCase(deleteRoundTestCase.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteRoundTestCase.fulfilled, (state, action) => {
        state.loading = false
        const removedId = action.payload?.testCaseId
        if (removedId) {
          state.testCases = state.testCases.filter(
            (t) => t.testCaseId !== removedId
          )
        }
      })
      .addCase(deleteRoundTestCase.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch auto test results
      .addCase(fetchAutoTestResults.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAutoTestResults.fulfilled, (state, action) => {
        state.loading = false
        state.results = action.payload?.data ?? []
        state.resultsPagination = action.payload?.additionalData ?? {
          ...initialPagination,
        }
      })
      .addCase(fetchAutoTestResults.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearAutoEvaluation } = autoEvaluationSlice.actions
export default autoEvaluationSlice.reducer
