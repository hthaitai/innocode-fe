import { createAsyncThunk } from "@reduxjs/toolkit"
import { contestService } from "@/features/contest/services/contestService"

// GET all contests
export const fetchContests = createAsyncThunk(
  "contests/fetchAll",
  async ({ pageNumber = 1, pageSize = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await contestService.getAllContests({ pageNumber, pageSize })
      console.log('✅ Fetch contests response:', response) // Debug log
      
      // ✅ Return the full response with data and additionalData
      return response
    } catch (err) {
      console.error('❌ Fetch contests error:', err)
      return rejectWithValue(err.message || "Failed to load contests")
    }
  }
)

// CREATE contest
export const addContest = createAsyncThunk(
  "contests/add",
  async (data, { rejectWithValue }) => {
    try {
      return await contestService.createContest(data)
    } catch (err) {
      return rejectWithValue(err) 
    }
  }
)

// UPDATE contest
export const updateContest = createAsyncThunk(
  "contests/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await contestService.updateContest(id, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// DELETE contest
export const deleteContest = createAsyncThunk(
  "contests/delete",
  async (id, { rejectWithValue }) => {
    try {
      await contestService.deleteContest(id)
      return id
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// PUBLISH contest
export const publishContest = createAsyncThunk(
  "contests/publish",
  async (id, { rejectWithValue }) => {
    try {
      return await contestService.publishContest(id)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// CHECK if ready to publish
export const checkPublishReady = createAsyncThunk(
  "contests/checkPublishReady",
  async (id, { rejectWithValue }) => {
    try {
      const res = await contestService.checkPublishReady(id)
      return { id, ...res }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// PUBLISH if ready
export const publishIfReady = createAsyncThunk(
  "contests/publishIfReady",
  async (id, { rejectWithValue }) => {
    try {
      return await contestService.publishIfReady(id)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)
