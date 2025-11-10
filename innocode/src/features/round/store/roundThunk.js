import { createAsyncThunk } from "@reduxjs/toolkit"
import roundApi from "../../../api/roundApi"
import { handleThunkError } from "../../../shared/utils/handleThunkError"
import contestApi from "../../../api/contestApi"

export const fetchRounds = createAsyncThunk(
  "rounds/fetchAll",
  async ({ contestId }, { rejectWithValue }) => {
    try {
      const res = await contestApi.getById(contestId)
      return res.data.data // contest object from backend
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const addRound = createAsyncThunk(
  "rounds/add",
  async ({ contestId, data }, { rejectWithValue }) => {
    try {
      const res = await roundApi.create(contestId, data)
      return res.data.data
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const updateRound = createAsyncThunk(
  "rounds/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await roundApi.update(id, data)
      return res.data
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const deleteRound = createAsyncThunk(
  "rounds/delete",
  async ({ roundId }, { rejectWithValue }) => {
    try {
      await roundApi.delete(roundId)
      return roundId
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)
