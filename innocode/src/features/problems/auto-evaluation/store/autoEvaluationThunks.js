import { createAsyncThunk } from "@reduxjs/toolkit"
import testCaseApi from "../../../../api/testCaseApi"
import { handleThunkError } from "../../../../shared/utils/handleThunkError"

export const fetchRoundTestCases = createAsyncThunk(
  "autoEvaluation/fetchRoundTestCases",
  async ({ roundId, pageNumber = 1, pageSize = 10 } = {}, { rejectWithValue }) => {
    try {
      const data = await testCaseApi.getTestCases(roundId, { pageNumber, pageSize })
      return data
    } catch (error) {
      return rejectWithValue(handleThunkError(error))
    }
  }
)

export const createRoundTestCase = createAsyncThunk(
  "autoEvaluation/createRoundTestCase",
  async ({ roundId, payload } = {}, { rejectWithValue }) => {
    try {
      const data = await testCaseApi.createTestCase(roundId, payload)
      return data
    } catch (error) {
      return rejectWithValue(handleThunkError(error))
    }
  }
)

export const updateRoundTestCases = createAsyncThunk(
  "autoEvaluation/updateRoundTestCases",
  async ({ roundId, testCases } = {}, { rejectWithValue }) => {
    try {
      const data = await testCaseApi.updateTestCases(roundId, testCases)
      return data
    } catch (error) {
      return rejectWithValue(handleThunkError(error))
    }
  }
)

export const deleteRoundTestCase = createAsyncThunk(
  "autoEvaluation/deleteRoundTestCase",
  async ({ roundId, testCaseId } = {}, { rejectWithValue }) => {
    try {
      await testCaseApi.deleteTestCase(roundId, testCaseId)
      return { testCaseId }
    } catch (error) {
      return rejectWithValue(handleThunkError(error))
    }
  }
)

export const fetchAutoTestResults = createAsyncThunk(
  "autoEvaluation/fetchAutoTestResults",
  async (
    {
      roundId,
      pageNumber = 1,
      pageSize = 10,
      studentIdSearch,
      teamIdSearch,
      studentNameSearch,
      teamNameSearch,
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const data = await testCaseApi.getAutoTestResults(roundId, {
        pageNumber,
        pageSize,
        studentIdSearch,
        teamIdSearch,
        studentNameSearch,
        teamNameSearch,
      })
      return data
    } catch (error) {
      return rejectWithValue(handleThunkError(error))
    }
  }
)


