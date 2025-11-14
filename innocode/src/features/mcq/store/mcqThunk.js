import { createAsyncThunk } from "@reduxjs/toolkit"
import mcqApi from "../../../api/mcqApi"
import { handleThunkError } from "../../../shared/utils/handleThunkError"

// Thunk to fetch MCQs of a specific round
export const fetchRoundMcqs = createAsyncThunk(
  "mcq/fetchRoundMcqs",
  async (
    { roundId, pageNumber = 1, pageSize = 10 } = {},
    { rejectWithValue }
  ) => {
    try {
      const data = await mcqApi.getQuestions(roundId, {
        pageNumber,
        pageSize,
      })
      return data
    } catch (error) {
      // Pass a useful error message to the slice
      return rejectWithValue(handleThunkError(error))
    }
  }
)

// Thunk to fetch banks
export const fetchBanks = createAsyncThunk(
  "mcq/fetchBanks",
  async ({ pageNumber = 1, pageSize = 10 } = {}, { rejectWithValue }) => {
    try {
      const data = await mcqApi.getBanks({ pageNumber, pageSize })
      return data
    } catch (error) {
      // Pass a useful error message to the slice
      return rejectWithValue(handleThunkError(error))
    }
  }
)

// Thunk to create test (add bank to round)
export const createTest = createAsyncThunk(
  "mcq/createTest",
  async ({ testId, bankId, data = {} } = {}, { rejectWithValue }) => {
    try {
      const response = await mcqApi.createTest(testId, bankId, data)
      return response
    } catch (error) {
      // Pass a useful error message to the slice
      return rejectWithValue(handleThunkError(error))
    }
  }
)

// Thunk to update question weights
export const updateQuestionWeights = createAsyncThunk(
  "mcq/updateQuestionWeights",
  async ({ testId, weights } = {}, { rejectWithValue }) => {
    try {
      // weights should be an array of { questionId, weight }
      const response = await mcqApi.updateQuestionWeights(testId, weights)
      return response
    } catch (error) {
      // Pass a useful error message to the slice
      return rejectWithValue(handleThunkError(error))
    }
  }
)

// Thunk to fetch attempts for a specific round
export const fetchAttempts = createAsyncThunk(
  "mcq/fetchAttempts",
  async (
    { roundId, pageNumber = 1, pageSize = 10 } = {},
    { rejectWithValue }
  ) => {
    try {
      const data = await mcqApi.getAttempts(roundId, {
        pageNumber,
        pageSize,
      })
      return data
    } catch (error) {
      // Pass a useful error message to the slice
      return rejectWithValue(handleThunkError(error))
    }
  }
)

// Thunk to fetch a specific attempt’s details
export const fetchAttemptDetail = createAsyncThunk(
  "mcq/fetchAttemptDetail",
  async (attemptId, { rejectWithValue }) => {
    try {
      const data = await mcqApi.getAttemptById(attemptId)
      return data
    } catch (error) {
      return rejectWithValue(handleThunkError(error))
    }
  }
)

// Thunk to fetch MCQ template (for CSV import)
export const fetchMcqTemplate = createAsyncThunk(
  "mcq/fetchMcqTemplate",
  async (_, { rejectWithValue }) => {
    try {
      const data = await mcqApi.getTemplate()
      return data
    } catch (error) {
      return rejectWithValue(handleThunkError(error))
    }
  }
)

// Thunk to import MCQs from CSV into a test
export const importMcqCsv = createAsyncThunk(
  "mcq/importMcqCsv",
  async ({ testId, formData }, { rejectWithValue }) => {
    try {
      const data = await mcqApi.importCsv(testId, formData)
      return data
    } catch (error) {
      return rejectWithValue(handleThunkError(error))
    }
  }
)