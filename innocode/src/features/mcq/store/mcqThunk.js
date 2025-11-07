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
      const response = await mcqApi.getQuestions(roundId, {
        pageNumber,
        pageSize,
      })
      return response.data
    } catch (error) {
      // Pass a useful error message to the slice
      return rejectWithValue(handleThunkError)
    }
  }
)
