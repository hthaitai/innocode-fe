import { createAsyncThunk } from "@reduxjs/toolkit"
import contestApi from "@/api/contestApi"
import { handleThunkError } from "../../../shared/utils/handleThunkError"

export const fetchAllContests = createAsyncThunk(
  "contests/fetchAll",
  async ({ pageNumber = 1, pageSize = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await contestApi.getAll({ pageNumber, pageSize })
      return res.data
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const fetchOrganizerContests = createAsyncThunk(
  "contests/fetchOrganizer",
  async ({ pageNumber = 1, pageSize = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await contestApi.getOrganizerContests({ pageNumber, pageSize })
      return res.data
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const addContest = createAsyncThunk(
  "contests/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await contestApi.create(data)
      return res.data.data
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const updateContest = createAsyncThunk(
  "contests/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await contestApi.update(id, data)
      return res.data
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const deleteContest = createAsyncThunk(
  "contests/delete",
  async ({ contestId }, { rejectWithValue }) => {
    try {
      await contestApi.delete(contestId)
      return contestId
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const checkPublishReady = createAsyncThunk(
  "contests/checkPublishReady",
  async (id, { rejectWithValue }) => {
    try {
      const res = await contestApi.checkPublishReady(id)
      return res.data
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const publishContest = createAsyncThunk(
  "contests/publish",
  async (id, { rejectWithValue }) => {
    try {
      const res = await contestApi.publishContest(id)
      return res.data
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)
