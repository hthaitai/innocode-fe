import { createSlice } from "@reduxjs/toolkit"
import {
  fetchRoundMcqs,
  fetchBanks,
  createTest,
  fetchAttempts,
  fetchAttemptDetail,
  fetchMcqTemplate,
  importMcqCsv,
} from "./mcqThunk"

const initialState = {
  roundId: null,
  testId: null,
  mcqs: [],
  attemptDetail: null,
  banks: [],
  attempts: [],
  template: null,
  importResult: null,
  pagination: {
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  },
  attemptsPagination: {
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
    clearAttempts: (state) => {
      state.attempts = []
      state.loading = false
      state.error = null
      state.attemptsPagination = {
        pageNumber: 1,
        pageSize: 10,
        totalPages: 1,
        totalCount: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      }
    },
    clearAttemptDetail: (state) => {
      state.attemptDetail = null
      state.loading = false
      state.error = null
    },
    clearTemplate: (state) => {
      state.template = null
      state.loading = false
      state.error = null
    },
    clearImportResult: (state) => {
      state.importResult = null
      state.loading = false
      state.error = null
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

        if (data?.data) {
          const round = data.data
          state.roundId = round.roundId
          state.testId = round.mcqTest?.testId || null
          state.mcqs = round.mcqTest?.questions || []

          // Pagination
          const testPagination = round.mcqTest
          state.pagination = {
            pageNumber: testPagination.currentPage || 1,
            pageSize: testPagination.pageSize || 10,
            totalPages: testPagination.totalPages || 1,
            totalCount: testPagination.totalQuestions || state.mcqs.length,
            hasPreviousPage: (testPagination.currentPage || 1) > 1,
            hasNextPage:
              (testPagination.currentPage || 1) <
              (testPagination.totalPages || 1),
          }
        } else {
          state.mcqs = []
          state.roundId = null
          state.testId = null
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
      .addCase(fetchAttempts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAttempts.fulfilled, (state, action) => {
        const data = action.payload
        state.loading = false
        state.error = null
        state.attempts = data?.data || []
        state.attemptsPagination = data?.additionalData || {
          pageNumber: 1,
          pageSize: 10,
          totalPages: 1,
          totalCount: 0,
          hasPreviousPage: false,
          hasNextPage: false,
        }
      })
      .addCase(fetchAttempts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.Message || "Failed to load attempts"
      })
      .addCase(fetchAttemptDetail.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAttemptDetail.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.attemptDetail = action.payload?.data || null
      })
      .addCase(fetchAttemptDetail.rejected, (state, action) => {
        state.loading = false
        state.error =
          action.payload?.Message || "Failed to load attempt details"
      })

      // Fetch CSV Template
      .addCase(fetchMcqTemplate.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMcqTemplate.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.template = action.payload?.data || action.payload || null
      })
      .addCase(fetchMcqTemplate.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.Message || "Failed to fetch MCQ template"
      })

      // Import CSV
      .addCase(importMcqCsv.pending, (state) => {
        state.loading = true
        state.error = null
        state.importResult = null
      })
      .addCase(importMcqCsv.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.importResult = action.payload?.data || action.payload || null
      })
      .addCase(importMcqCsv.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.Message || "Failed to import CSV"
      })
  },
})

export const {
  clearMcqs,
  clearBanks,
  clearAttempts,
  clearAttemptDetail,
  clearTemplate,
  clearImportResult,
} = mcqSlice.actions
export default mcqSlice.reducer
