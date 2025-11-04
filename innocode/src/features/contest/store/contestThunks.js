import { createAsyncThunk } from "@reduxjs/toolkit"
import { contestService } from "@/features/contest/services/contestService"
import { handleThunkError } from "../../../shared/utils/handleThunkError"

export const fetchContests = createAsyncThunk(
  "contests/fetchAll",
  async ({ pageNumber = 1, pageSize = 10 } = {}, { rejectWithValue }) => {
    try {
      const data = await contestService.getAllContests({ pageNumber, pageSize })
      return data
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const addContest = createAsyncThunk(
  "contests/add",
  async (data, { rejectWithValue }) => {
    try {
      return await contestService.createContest(data)
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const updateContest = createAsyncThunk(
  "contests/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await contestService.updateContest(id, data)
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const deleteContest = createAsyncThunk(
  "contests/delete",
  async (id, { rejectWithValue }) => {
    try {
      await contestService.deleteContest(id)
      return id
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const publishContest = createAsyncThunk(
  "contests/publish",
  async (id, { rejectWithValue }) => {
    try {
      return await contestService.publishContest(id)
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const checkPublishReady = createAsyncThunk(
  "contests/checkPublishReady",
  async (id, { rejectWithValue }) => {
    try {
      const res = await contestService.checkPublishReady(id)
      return { id, ...res }
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const publishIfReady = createAsyncThunk(
  "contests/publishIfReady",
  async (id, { rejectWithValue }) => {
    try {
      return await contestService.publishIfReady(id)
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)
