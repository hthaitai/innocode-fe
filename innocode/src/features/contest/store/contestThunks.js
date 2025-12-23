import { createAsyncThunk } from "@reduxjs/toolkit"
import { api } from "@/services/api"
import { handleThunkError } from "../../../shared/utils/handleThunkError"

export const fetchAllContests = createAsyncThunk(
  "contests/fetchAll",
  async ({ pageNumber = 1, pageSize = 10 } = {}, { rejectWithValue }) => {
    try {
      const result = await api.endpoints.getAllContests.initiate({
        pageNumber,
        pageSize,
      })
      const data = await result.unwrap()
      return data
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const fetchOrganizerContests = createAsyncThunk(
  "contests/fetchOrganizer",
  async ({ pageNumber = 1, pageSize = 10 } = {}, { rejectWithValue }) => {
    try {
      const result = await api.endpoints.getOrganizerContests.initiate({
        pageNumber,
        pageSize,
      })
      const data = await result.unwrap()
      return data
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const fetchContestById = createAsyncThunk(
  "contests/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const result = await api.endpoints.getContestById.initiate(id)
      const data = await result.unwrap()
      // Handle array response
      const contestData = Array.isArray(data) ? data[0] : (data?.data?.[0] ?? data ?? null)
      return contestData
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const addContest = createAsyncThunk(
  "contests/add",
  async (data, { rejectWithValue }) => {
    try {
      const result = await api.endpoints.addContest.initiate(data)
      const response = await result.unwrap()
      return response?.data || response
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const updateContest = createAsyncThunk(
  "contests/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await api.endpoints.updateContest.initiate({ id, data })
      return await result.unwrap()
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const deleteContest = createAsyncThunk(
  "contests/delete",
  async ({ contestId }, { rejectWithValue }) => {
    try {
      await api.endpoints.deleteContest.initiate({ id: contestId }).unwrap()
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
      const result = await api.endpoints.checkPublishReady.initiate(id)
      return await result.unwrap()
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)

export const publishContest = createAsyncThunk(
  "contests/publish",
  async (id, { rejectWithValue }) => {
    try {
      const result = await api.endpoints.publishContest.initiate(id)
      return await result.unwrap()
    } catch (err) {
      return rejectWithValue(handleThunkError(err))
    }
  }
)
