import { createAsyncThunk } from "@reduxjs/toolkit"
import { roundService } from "@/features/round/services/roundService"
import { handleThunkError } from "../../../shared/utils/handleThunkError"

export const fetchRounds = createAsyncThunk(
  "rounds/fetchAll",
  async (
    { contestId, roundId, pageNumber = 1, pageSize = 10 } = {},
    { rejectWithValue }
  ) => {
    try {
      const data = await roundService.getAllRounds({
        contestId,
        roundId,
        pageNumber,
        pageSize,
      })
      return data
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const addRound = createAsyncThunk(
  "rounds/add",
  async ({ contestId, data }, { rejectWithValue }) => {
    try {
      return await roundService.createRound(contestId, data)
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const updateRound = createAsyncThunk(
  "rounds/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await roundService.updateRound(id, data)
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const deleteRound = createAsyncThunk(
  "rounds/delete",
  async (id, { rejectWithValue }) => {
    try {
      await roundService.deleteRound(id)
      return id
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)
